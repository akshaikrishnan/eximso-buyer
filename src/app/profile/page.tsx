"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCircleIcon } from "@heroicons/react/24/solid";

import countries from "@/lib/data/db/countries.json";
import { endpoints } from "@/lib/data/endpoints";
import api from "@/lib/api/axios.interceptor";
import { useToast } from "@/hooks/use-toast";
import PhoneNumberInput, { validatePhoneByCountry } from "@/components/ui/phone-number-input";

// ---- Types ----
type Country = { code: string; name: string };
type CountryOption = { value: string; label: string };

type UserRecord = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other" | "";
  country?: string; // ISO code
  address?: string;
  logo?: string;
};

type UpdatePayload = Partial<
  Pick<
    UserRecord,
    "name" | "email" | "phone" | "gender" | "country" | "address" | "logo"
  >
>;

// ---- Helpers ----
const countryOptions: CountryOption[] = (countries as Country[]).map((c) => ({
  value: c.code,
  label: c.name,
}));

function getUser(): Promise<UserRecord> {
  return api.get(endpoints.user).then((r) => r?.data?.result ?? {});
}

function updateUser(data: UpdatePayload): Promise<UserRecord> {
  return api.put(endpoints.user, data).then((r) => r?.data?.result ?? {});
}

function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  return api.post(endpoints.upload, fd).then((r) => r?.data?.fileUrl);
}

export default function UserProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- Fetch user ----
  const {
    data: user,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
  });

  // ---- Local form state (derived from query) ----
  const [formData, setFormData] = useState<UpdatePayload>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    address: "",
    logo: "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: (user.gender as any) || "",
      country: user.country || "",
      address: user.address || "",
      logo: user.logo || "",
    });
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      (formData.name ?? "") !== (user.name ?? "") ||
      (formData.email ?? "") !== (user.email ?? "") ||
      (formData.phone ?? "") !== (user.phone ?? "") ||
      (formData.gender ?? "") !== (user.gender ?? "") ||
      (formData.country ?? "") !== (user.country ?? "") ||
      (formData.address ?? "") !== (user.address ?? "") ||
      (formData.logo ?? "") !== (user.logo ?? "")
    );
  }, [formData, user]);

  // ---- Mutations ----
  // Upload avatar
  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (url) => {
      setFormData((prev) => ({ ...prev, logo: url }));
      toast({
        title: "Photo uploaded",
        description: "Click Save to apply your new profile photo.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try a different image.",
        variant: "destructive",
      });
    },
  });

  // Update profile (with optimistic update)
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const previous = queryClient.getQueryData<UserRecord>(["user"]);
      // Optimistically update cache
      if (previous) {
        queryClient.setQueryData<UserRecord>(["user"], {
          ...previous,
          ...patch,
        });
      }
      return { previous };
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["user"], updated);
      toast({ title: "Profile updated", description: "Changes saved." });
    },
    onError: (_err, _patch, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["user"], context.previous);
      }
      toast({
        title: "Update failed",
        description: "Could not save your changes.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const sanitizers: Record<string, (value: string) => string> = {
    name: (v) =>
      v
        .replace(/[^a-zA-Z\s]/g, "")
        .replace(/\s+/g, " ")
        .trimStart(),

  };


  // ---- Handlers ----
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const sanitize = sanitizers[name];

    setFormData((prev) => ({
      ...prev,
      [name]: sanitize ? sanitize(value) : value,
    }));
  };


  const handleCountryChange = (opt: CountryOption | null) => {
    setFormData((p) => ({ ...p, country: opt?.value ?? "" }));
  };

  const handleLogoButton = () => fileInputRef.current?.click();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tiny client-side guardrails
    if (!formData.name?.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.email?.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (formData.phone && !validatePhoneByCountry(formData.phone, "IN")) {
      toast({
        title: "Invalid phone",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: (user.gender as any) || "",
      country: user.country || "",
      address: user.address || "",
      logo: user.logo || "",
    });
  };

  // ---- Render ----
  if (isLoading) {
    return (
      <div className="container m-auto pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-5 w-96 bg-gray-200 rounded" />
          <div className="h-64 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container m-auto pt-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Failed to load profile.</p>
          <p className="text-sm opacity-80">
            {(error as any)?.message ?? "Please refresh to try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container m-auto pt-6">
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information may be visible on your profile.
            </p>
            {isFetching && (
              <p className="mt-3 text-xs text-gray-400">Refreshing…</p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Avatar */}
                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Photo
                  </label>
                  <div className="mt-3 flex items-center gap-x-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full ring-1 ring-gray-200">
                      {formData.logo ? (
                        // Next/Image for optimization
                        <Image
                          src={formData.logo}
                          alt="Profile photo"
                          fill
                          className="object-cover"
                          sizes="80px"
                          priority
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <UserCircleIcon className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleLogoButton}
                        className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        disabled={uploadMutation.isPending}
                      >
                        {uploadMutation.isPending ? "Uploading…" : "Change"}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name ?? ""}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email ?? ""}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Phone number
                  </label>
                  <PhoneNumberInput
                    name="phone"
                    value={formData.phone ?? ""}
                    onChange={(phone) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone,
                      }))
                    }
                    defaultCountry={formData.country || "IN"}
                    placeholder="+91 98765 43210"
                    inputClassName="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>

                {/* Gender */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Gender
                  </label>
                  <div className="mt-2 flex space-x-4">
                    {["male", "female", "other"].map((g) => (
                      <label key={g} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === (g as any)}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                        />
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {g}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Country
                  </label>
                  <Select
                    options={countryOptions}
                    classNamePrefix="select"
                    placeholder="Select a country"
                    isSearchable
                    value={countryOptions.find(
                      (o) => o.value === (formData.country ?? "")
                    )}
                    // react-select portals can help if used inside modals / overflow
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : undefined
                    }
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 50 }),
                    }}
                    onChange={handleCountryChange}
                  />
                </div>

                {/* Address */}
                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows={4}
                    value={formData.address ?? ""}
                    onChange={handleChange}
                    placeholder="Enter your address here…"
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-3 border-t px-4 py-4 sm:px-8">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-semibold text-gray-900 disabled:opacity-50"
                disabled={!hasChanges || updateMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasChanges || updateMutation.isPending}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

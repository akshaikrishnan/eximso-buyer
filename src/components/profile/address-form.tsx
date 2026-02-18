import { toast } from "@/hooks/use-toast";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectInput } from "./select-input";
import countries from "@/lib/data/db/countries.json";
import PhoneNumberInput, {
  validatePhoneByCountry,
} from "@/components/ui/phone-number-input";
import type { CountryCode } from "libphonenumber-js";

/* ===================== TYPES ===================== */

type Address = {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: "home" | "office" | "other";
  isDefault: boolean;
  altPhone?: string;
  isDelete: boolean;
};

type AddressFormProps = {
  address?: Address;
  onCancel?: () => void;
  onSave?: () => void;
};

/* ===================== COUNTRY OPTIONS ===================== */

type Country = { code: string; name: string };
type CountryOption = { value: string; label: string };

const countryOptions: CountryOption[] = (countries as Country[]).map((c) => ({
  value: c.name,
  label: c.name,
}));

const getCountryCodeByName = (countryName?: string): CountryCode => {
  const matched = (countries as Country[]).find((country) => country.name === countryName);
  return (matched?.code || "IN") as CountryCode;
};

/* ===================== INPUT COMPONENT ===================== */

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  errors,
  rules,
  gridClass = "sm:col-span-4",
}: any) => (
  <div className={gridClass}>
    <label className="block text-sm font-medium">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(id, rules)}
      className={`mt-2 w-full rounded-md px-4 py-3 ring-1 ${
        errors?.[id] ? "ring-red-500" : "ring-gray-300"
      }`}
    />
    {errors?.[id] && (
      <p className="text-sm text-red-600">{errors[id].message}</p>
    )}
  </div>
);

/* ===================== ADDRESS TYPE ===================== */

const AddressTypeRadio = ({ register }: any) => (
  <div className="col-span-full">
    <label className="block text-sm font-medium">Type of Address</label>
    <div className="mt-2 flex gap-4">
      {["home", "office", "other"].map((type) => (
        <label key={type} className="flex items-center gap-2 capitalize">
          <input
            type="radio"
            value={type}
            {...register("addressType", { required: true })}
            className="text-indigo-600"
          />
          {type}
        </label>
      ))}
    </div>
  </div>
);

/* ===================== MAIN FORM ===================== */

export default function AddressForm({
  address,
  onCancel,
  onSave,
}: AddressFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<Address>({
    defaultValues: {
      addressType: "home",
      country: "India",
    },
  });

  const selectedCountryCode = getCountryCodeByName(watch("country"));

  /* ================= MUTATION ================= */

  const mutation = useMutation({
    mutationFn: (data: Address) =>
      data._id
        ? api.put(`${endpoints.address}/${data._id}`, data)
        : api.post(endpoints.address, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: address?._id
          ? "Address updated successfully"
          : "Address added successfully",
      });
      reset();
      onSave?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Address) => {
    mutation.mutate({ ...data, _id: address?._id });
  };

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (address) {
      reset(address);
    }
  }, [address, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 p-6">

        {/* NAME (NO NUMBERS / SYMBOLS) */}
        <FormInput
          id="name"
          label="Full Name"
          register={register}
          errors={errors}
          rules={{
            required: "Name is required",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = e.target.value
                .replace(/[^A-Za-z\s]/g, "")
                .replace(/\s+/g, " ")
                .replace(/^\s+/, "");
            },
            validate: (v: string) =>
              /^[A-Za-z\s]+$/.test(v) || "Only letters and spaces allowed",
          }}
        />

        {/* PHONE */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium">Phone</label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone is required",
              validate: (value) =>
                validatePhoneByCountry(value || "", selectedCountryCode) ||
                "Enter a valid phone number",
            }}
            render={({ field }) => (
              <PhoneNumberInput
                value={field.value}
                onChange={(phone) => field.onChange(phone)}
                onBlur={field.onBlur}
                defaultCountry={selectedCountryCode}
                placeholder="Enter phone number"
                error={!!errors.phone}
                inputClassName="px-4 text-sm"
              />
            )}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <FormInput
          id="email"
          label="Email"
          type="email"
          register={register}
          errors={errors}
          rules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          }}
        />

        {/* ADDRESS */}
        <FormInput
          id="addressLine1"
          label="Address Line 1"
          gridClass="col-span-full"
          register={register}
          errors={errors}
          rules={{ required: "Address is required" }}
        />

        <FormInput
          id="addressLine2"
          label="Address Line 2"
          gridClass="col-span-full"
          register={register}
          errors={errors}
        />

        {/* COUNTRY */}
        <SelectInput
          control={control}
          name="country"
          label="Country"
          options={countryOptions}
          required
        />

        {/* CITY */}
        <FormInput
          id="city"
          label="City"
          register={register}
          errors={errors}
          rules={{
            required: "City is required",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
            },
          }}
        />

        {/* STATE */}
        <FormInput
          id="state"
          label="State"
          register={register}
          errors={errors}
          rules={{
            required: "State is required",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
            },
          }}
        />

        {/* PINCODE */}
        <FormInput
          id="pincode"
          label="Pincode"
          register={register}
          errors={errors}
          rules={{
            required: "Pincode is required",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s\-]/g, "").slice(0, 12);
            },
            validate: (v: string) =>
              /^[a-zA-Z0-9\s\-]+$/.test(v) || "Pincode must contain only letters, numbers, spaces, or hyphens",
          }}
        />

        <AddressTypeRadio register={register} />

        {/* ALT PHONE */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium">Alt Phone</label>
          <Controller
            name="altPhone"
            control={control}
            rules={{
              validate: (value) =>
                !value || validatePhoneByCountry(value, selectedCountryCode) || "Enter a valid alternate phone number",
            }}
            render={({ field }) => (
              <PhoneNumberInput
                value={field.value || ""}
                onChange={(phone) => field.onChange(phone)}
                onBlur={field.onBlur}
                defaultCountry={selectedCountryCode}
                placeholder="Enter alternate phone number"
                error={!!errors.altPhone}
                inputClassName="px-4 text-sm"
              />
            )}
          />
          {errors.altPhone && (
            <p className="text-sm text-red-600">{errors.altPhone.message}</p>
          )}
        </div>

      </div>

      <div className="flex justify-end gap-4 p-4 border-t">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

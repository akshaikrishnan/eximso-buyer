"use client";
import { useEffect, useState, useRef } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Select from "react-select";
import countries from "@/lib/data/db/countries.json";
import { endpoints } from "@/lib/data/endpoints";
import api from "@/lib/api/axios.interceptor";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Define the type for the country option
type CountryOption = {
  value: string;
  label: string;
};

// Define the expected structure of the countries array
type Country = {
  code: string;
  name: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    address: "",
    logo: "", // To store the logo
  });

  // Fix: Explicitly type the countries array
  const countryOptions: CountryOption[] = (countries as Country[]).map(
    (country) => ({
      value: country.code,
      label: country.name,
    })
  );

  // Add this ref for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch logged-in user's details
  const getUserDetails = async () => {
    try {
      const response = await api.get(endpoints.user);
      const userData = response?.data?.result || {};
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: userData.gender || "",
        country: userData.country || "",
        address: userData.address || "",
        logo: userData.logo || "", // Handle logo from user data
      });
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle country selection
  const handleCountryChange = (selectedOption: CountryOption | null) => {
    if (selectedOption) {
      setFormData({ ...formData, country: selectedOption.value });
    }
  };

  // Handle logo change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      api.post(endpoints.upload, formDataObj).then((res) => {
        const imageUrl = res.data.fileUrl; // Assuming the response contains the URL
        setFormData((prev) => ({ ...prev, logo: imageUrl }));
        toast({
          title: "Photo Updated!",
          description:
            "Your profile image has been uploaded, Please save the profile to apply changes.",
        });
      });
    }
  };

  // Trigger file input click when "Change" button is clicked
  const handleLogoChangeButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  // Handle form submission (Update user details)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await api.put(endpoints.user, formData);
      if (response.data) {
        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully.",
        });

        getUserDetails();
      } else {
        throw new Error("No data returned from the server");
      }
    } catch (error) {
      console.error("Error updating user data: ", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container m-auto pt-6">
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly, so be careful what
              you share.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <div className="mt-2 flex items-center gap-x-3">
                    <img
                      src={formData.logo || "/images/common/user.png"}
                      alt="Profile"
                      className="h-25 w-25 rounded-full text-gray-300 object-cover"
                    />
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Photo
                    </label>
                    <button
                      type="button"
                      onClick={handleLogoChangeButtonClick} // Trigger file input click
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Change
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      ref={fileInputRef} // Attach the ref
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>

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
                          checked={formData.gender === g}
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

                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Country
                  </label>
                  <Select
                    options={countryOptions}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select a country"
                    isSearchable
                    value={countryOptions.find(
                      (option) => option.value === formData.country
                    )}
                    onChange={handleCountryChange}
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows={4}
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-xs ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    placeholder="Enter your address here..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t px-4 py-4 sm:px-8">
              <button
                type="button"
                className="text-sm font-semibold text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
              >
                {updating ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

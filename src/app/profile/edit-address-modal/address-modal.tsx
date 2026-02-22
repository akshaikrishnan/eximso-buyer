// EditAddressModal.tsx
"use client";

import api from "@/lib/api/axios.interceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { XIcon, ChevronDown } from "lucide-react";
import { endpoints } from "@/lib/data/endpoints";
import countries from "@/lib/data/db/countries.json";
import PhoneNumberInput, { validatePhoneByCountry } from "@/components/ui/phone-number-input";
import type { CountryCode } from "libphonenumber-js";


// Define the Address type with additional fields
interface Address {
  _id: any;
  id: string;
  addressLine1: string;
  addressLine2?: string;
  addressType: string;
  altPhone?: string;
  city: string;
  country: string;
  email: string;
  name: string;
  phone: string;
  pincode: string;
  state: string;
  isDefault?: boolean;
}

interface EditAddressModalProps {
  address: Address;
  onClose: () => void;
}
const sanitizers: Record<string, (v: string) => string> = {
  name: (v) => v.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trimStart(),
  city: (v) => v.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trimStart(),
  state: (v) => v.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trimStart(),

  pincode: (v) => v.replace(/[^a-zA-Z0-9\s\-]/g, "").slice(0, 12),
};


const getCountryCodeByName = (countryName?: string): CountryCode => {
  const matched = countries.find((country) => country.name === countryName);
  return (matched?.code || "IN") as CountryCode;
};

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  address,
  onClose,
}) => {
  const [formData, setFormData] = useState<Address>(address);
  const [countrySearch, setCountrySearch] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    return countries.filter((country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const updateAddressMutation = useMutation({
    mutationFn: async (updatedAddress: Address) => {
      const response = await api.put(
        `${endpoints.address}/${updatedAddress._id}`,
        updatedAddress
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: "Edited successfully!",
        variant: "default",
      });
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to edit address!",
        variant: "destructive",
      });
    },  });

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = e.target;

  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.checked,
    }));
    return;
  }

  const sanitize = sanitizers[target.name];

  setFormData((prev) => ({
    ...prev,
    [target.name]: sanitize
      ? sanitize(target.value)
      : target.value.trimStart(),
  }));

  // Clear error for this field when user starts typing
  if (errors[target.name]) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[target.name];
      return newErrors;
    });
  }
};


  const handlePhoneChange = (name: "phone" | "altPhone", value: string) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
  // Clear error for this field when user starts typing
  if (errors[name]) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }
};

const handleCountrySelect = (countryName: string) => {
    setFormData((prev) => ({
      ...prev,
      country: countryName,
    }));
    setIsCountryDropdownOpen(false);
    setCountrySearch("");
    // Clear country error when user selects a country
    if (errors.country) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.country;
        return newErrors;
      });
    }
  };
const validateForm = () => {
  const selectedCountryCode = getCountryCodeByName(formData.country);
  const newErrors: Record<string, string> = {};

  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!validatePhoneByCountry(formData.phone, selectedCountryCode)) newErrors.phone = "Enter a valid phone number";
  if (formData.altPhone && !validatePhoneByCountry(formData.altPhone, selectedCountryCode))
    newErrors.altPhone = "Enter a valid alternate phone number";

 const normalizedPincode = formData.pincode
  .replace(/[\s-]/g, "") 
  .trim();

if (!normalizedPincode) {
  newErrors.pincode = "Pincode is required";
} else if (!/^[a-zA-Z0-9]+$/.test(normalizedPincode)) {
  newErrors.pincode =
    "Pincode must contain only letters and numbers";
}

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    newErrors.email = "Email is required";
  if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
  if (!formData.city.trim()) newErrors.city = "City is required";
  if (!formData.state.trim()) newErrors.state = "State is required";
  if (!formData.country) newErrors.country = "Country is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length > 0 ? newErrors : null;
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validateForm();
  if (validationErrors) {
    const firstError = Object.values(validationErrors)[0];
    toast({ title: "Validation Error", description: firstError, variant: "destructive" });
    return;
  }

  updateAddressMutation.mutate(formData);
};

  return (
    <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full border-2 max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Edit Address</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Form Fields */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.name ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Country Searchable Dropdown */}
            <div className="relative">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className={`w-full rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 sm:text-sm ${
                    errors.country ? "border-red-500 ring-1 ring-red-500" : "border border-gray-300"
                  }`}
                >
                  <span className={formData.country ? "text-gray-900" : "text-gray-400"}>
                    {formData.country || "Select a country"}
                  </span>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </button>

                {isCountryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="max-h-60 overflow-auto py-1">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <li
                            key={country.code}
                            onClick={() => handleCountrySelect(country.name)}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-indigo-50 text-gray-900"
                          >
                            {country.name}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-gray-500">
                          No countries found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="addressLine1"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 1
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.addressLine1 ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="addressLine2"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2 || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.city ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Type
              </label>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    value="home"
                    checked={formData.addressType === "home"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    required
                  />
                  <span className="ml-2 text-gray-700">Home</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    name="addressType"
                    value="office"
                    checked={formData.addressType === "office"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    required
                  />
                  <span className="ml-2 text-gray-700">Office</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    name="addressType"
                    value="other"
                    checked={formData.addressType === "other"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    required
                  />
                  <span className="ml-2 text-gray-700">Other</span>
                </label>
              </div>
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.state ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.pincode ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <PhoneNumberInput
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(value) => handlePhoneChange("phone", value)}
                  defaultCountry={getCountryCodeByName(formData.country)}
                  inputClassName="px-3 sm:text-sm"
                  error={!!errors.phone}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="altPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Alternate Phone (Optional)
              </label>
              <div className="mt-1">
                <PhoneNumberInput
                  id="altPhone"
                  name="altPhone"
                  value={formData.altPhone || ""}
                  onChange={(value) => handlePhoneChange("altPhone", value)}
                  defaultCountry={getCountryCodeByName(formData.country)}
                  inputClassName="px-3 sm:text-sm"
                  error={!!errors.altPhone}
                />
              </div>
              {errors.altPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.altPhone}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault || false}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Set as default address
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={updateAddressMutation.isPending}
            >
              {updateAddressMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;

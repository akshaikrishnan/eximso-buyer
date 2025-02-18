"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useToast } from "@/hooks/use-toast";

type Address = {
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

type ValidationErrors = {
  [key in keyof Address]?: string;
};

export default function AddAddress() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    addressType: "home",
    isDefault: false,
    altPhone: "",
    isDelete: false,
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const validateField = (name: keyof Address, value: string): string => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Name is required' :
               value.length < 2 ? 'Name must be at least 2 characters' : '';
      case 'phone':
        return value.trim() === '' ? 'Phone number is required' :
               !/^\d{10}$/.test(value) ? 'Phone number must be 10 digits' : '';
      case 'email':
        return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : '';
      case 'addressLine1':
        return value.trim() === '' ? 'Address Line 1 is required' :
               value.length < 5 ? 'Enter a valid street address' : '';
      case 'city':
        return value.trim() === '' ? 'City is required' :
               value.length < 2 ? 'Enter a valid city name' : '';
      case 'state':
        return value.trim() === '' ? 'State is required' :
               value.length < 2 ? 'Enter a valid state name' : '';
      case 'pincode':
        return value.trim() === '' ? 'Postal code is required' :
               !/^\d{5,6}$/.test(value) ? 'Enter a valid postal code (5-6 digits)' : '';
      case 'country':
        return value.trim() === '' ? 'Country is required' :
               value.length < 2 ? 'Enter a valid country name' : '';
      case 'altPhone':
        return value && !/^\d{10}$/.test(value) ? 'Alternative phone must be 10 digits' : '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate each field
    Object.entries(address).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const fieldError = validateField(key as keyof Address, value);
        if (fieldError) {
          newErrors[key as keyof Address] = fieldError;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));

    // Real-time validation
    const error = validateField(name as keyof Address, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }
    
    setUpdating(true);
    try {
      const response = await api.post(endpoints.address, address);
      console.log('address response',response);
      
      if (response.data) {
        toast({
          title: "Success",
          description: "Address added successfully!",
        });
        setAddress({
          name: "",
          phone: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          addressType: "home",
          isDefault: false,
          altPhone: "",
          isDelete: false,
        });
        setErrors({});
      } else {
        throw new Error("No data returned from the server");
      }
    } catch (error) {
      console.error("Error adding address: ", error);
      toast({
        title: "Error",
        description: "Failed to add address.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-md shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
      >
        <ArrowLeft /> Back
      </button>
      <div className="space-y-10 divide-y divide-gray-900/10 ">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-bold leading-6 text-gray-900">
              Add Address
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 ">
              Please provide accurate details to ensure timely delivery.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="full-name"
                      value={address.name}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Name of the recipient"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.name ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="mobile-number" className="block text-sm font-medium leading-6 text-gray-900">
                    Mobile Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="phone"
                      id="mobile-number"
                      value={address.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      placeholder="Contact number for delivery updates"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.phone ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email-address" className="block text-sm font-medium leading-6 text-gray-900">
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email-address"
                      value={address.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="Enter your email address"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.email ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="address-line-1" className="block text-sm font-medium leading-6 text-gray-900">
                    Address Line 1
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="addressLine1"
                      id="address-line-1"
                      value={address.addressLine1}
                      onChange={handleChange}
                      autoComplete="address-line1"
                      placeholder="Street address, P.O. box, company name"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.addressLine1 ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      required
                    />
                    {errors.addressLine1 && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="address-line-2" className="block text-sm font-medium leading-6 text-gray-900">
                    Address Line 2
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="addressLine2"
                      id="address-line-2"
                      value={address.addressLine2}
                      onChange={handleChange}
                      autoComplete="address-line2"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.addressLine2 ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                    />
                    {errors.addressLine2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressLine2}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={address.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      placeholder="City name"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.city ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      required
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={address.state}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      placeholder="State or Province"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.state ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      required
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="pincode"
                      id="postal-code"
                      value={address.pincode}
                      onChange={handleChange}
                      autoComplete="postal-code"
                      placeholder="ZIP or Postal Code"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.pincode ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      required
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                    Country
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={address.country}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.country ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      required
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="address-type" className="block text-sm font-medium leading-6 text-gray-900">
                    Type of Address
                  </label>
                  <div className="mt-2 flex space-x-4">
                    {["home", "office", "other"].map((type) => (
                      <div className="flex items-center" key={type}>
                        <input
                          type="radio"
                          name="addressType"
                          id={type}
                          value={type}
                          checked={address.addressType === type}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <label htmlFor={type} className="ml-2 block text-sm text-gray-900">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="altPhone" className="block text-sm font-medium leading-6 text-gray-900">
                    Alternative Mobile Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="altPhone"
                      id="altPhone"
                      value={address.altPhone}
                      onChange={handleChange}
                      placeholder="Optional contact number"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.altPhone ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                    />
                    {errors.altPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.altPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={updating}
              >
                {updating ? "Adding..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
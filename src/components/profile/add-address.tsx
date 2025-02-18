"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

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

export default function AddAddress() {
  const router = useRouter();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit: validateAndSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<Address>({
    defaultValues: {
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
    }
  });

  // Watch the addressType value to update it in real-time
  const addressType = watch("addressType");

 const onSubmit = async (data: Address) => {
  setUpdating(true);
  try {
    const response = await api.post(endpoints.address, data);
    console.log('address response', response);

    if (response.data) {
      toast({
        title: "Success",
        description: "Address added successfully!",
      });
      // Reset form after successful submission
      reset(); // Use reset() from useForm hook
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

  

  const handleAddressTypeChange = (type: "home" | "office" | "other") => {
    setValue("addressType", type);
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

          <form onSubmit={validateAndSubmit(onSubmit)} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="name"
                      placeholder="Name of the recipient"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.name ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("name", { 
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                    Mobile Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Contact number for delivery updates"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.phone ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("phone", { 
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number must be 10 digits"
                        }
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email address"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.email ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("email", { 
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="addressLine1" className="block text-sm font-medium leading-6 text-gray-900">
                    Address Line 1
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="addressLine1"
                      placeholder="Street address, P.O. box, company name"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.addressLine1 ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("addressLine1", { 
                        required: "Address Line 1 is required",
                        minLength: { value: 5, message: "Enter a valid street address" }
                      })}
                    />
                    {errors.addressLine1 && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="addressLine2" className="block text-sm font-medium leading-6 text-gray-900">
                    Address Line 2
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="addressLine2"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.addressLine2 ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("addressLine2")}
                    />
                    {errors.addressLine2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressLine2.message}</p>
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
                      id="city"
                      placeholder="City name"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.city ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("city", { 
                        required: "City is required",
                        minLength: { value: 2, message: "Enter a valid city name" }
                      })}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
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
                      id="state"
                      placeholder="State or Province"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.state ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("state", { 
                        required: "State is required",
                        minLength: { value: 2, message: "Enter a valid state name" }
                      })}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="pincode" className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="pincode"
                      placeholder="ZIP or Postal Code"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.pincode ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("pincode", { 
                        required: "Postal code is required",
                        pattern: {
                          value: /^\d{5,6}$/,
                          message: "Enter a valid postal code (5-6 digits)"
                        }
                      })}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
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
                      id="country"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.country ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("country", { 
                        required: "Country is required",
                        minLength: { value: 2, message: "Enter a valid country name" }
                      })}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
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
                          id={type}
                          value={type}
                          checked={addressType === type}
                          onChange={() => handleAddressTypeChange(type as "home" | "office" | "other")}
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
                      id="altPhone"
                      placeholder="Optional contact number"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.altPhone ? 'ring-red-500' : 'ring-gray-300'
                      }`}
                      {...register("altPhone", { 
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Alternative phone must be 10 digits"
                        }
                      })}
                    />
                    {errors.altPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.altPhone.message}</p>
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

function resetForm() {
  throw new Error("Function not implemented.");
}

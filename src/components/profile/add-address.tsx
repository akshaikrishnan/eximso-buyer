"use client";

import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
export default function AddAddress() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-md shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
      >
        <ArrowLeft /> Back
      </button>
      <div className="space-y-10 divide-y divide-gray-900/10 ">
        {/* Shipping Address */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-bold leading-6  text-gray-900">
              Add Address
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 ">
              Please provide accurate details to ensure timely delivery.
            </p>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      autoComplete="name"
                      placeholder="Name of the recipient"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="mobile-number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mobile Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="mobile-number"
                      id="mobile-number"
                      autoComplete="tel"
                      placeholder="Contact number for delivery updates"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email-address"
                      id="email-address"
                      autoComplete="email"
                      placeholder="Enter your email address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="address-line-1"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Address Line 1
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="address-line-1"
                      id="address-line-1"
                      autoComplete="address-line1"
                      placeholder="Street address, P.O. box, company name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="address-line-2"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Address Line 2
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="address-line-2"
                      id="address-line-2"
                      autoComplete="address-line2"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      placeholder="City name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      placeholder="State or Province"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ZIP / Postal Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      placeholder="ZIP or Postal Code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        {/* Billing Address */}

        <div></div>
      </div>
    </div>
  );
}

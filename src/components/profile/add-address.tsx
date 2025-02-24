"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AddressForm from "./address-form";

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
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-bold leading-6 text-gray-900">
              Add Address
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 ">
              Please provide accurate details to ensure timely delivery.
            </p>
          </div>

          <AddressForm />
        </div>
      </div>
    </div>
  );
}

function resetForm() {
  throw new Error("Function not implemented.");
}

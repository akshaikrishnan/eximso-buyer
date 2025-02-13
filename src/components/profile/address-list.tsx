"use client";
import api from "@/lib/api/axios.interceptor";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Loader from "../common/loader/loader";

export default function AddressList() {
  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/address").then((res) => res.data.result),
  });
  if (isLoading) {
    return <Loader fullScreen />;
  }
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
        <Link
          href="/profile/my-addresses/add"
          className="rounded-md flex items-center gap-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon />
          Add Address
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 pt-10 xl:grid-cols-2">
        <AddressBlock
          address={{
            name: "John Doe",
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "United States",
            phone: "555-555-5555",
            type: "Home",
          }}
        />
        <AddressBlock
          address={{
            name: "John Doe",
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "United States",
            phone: "555-555-5555",
            type: "Work",
          }}
        />
        <AddressBlock
          address={{
            name: "Jane Doe",
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "United States",
            phone: "555-555-5555",
            isDefault: true,
            type: "Home",
          }}
        />
      </div>
    </div>
  );
}

export function AddressBlock({ address }: { address: any }) {
  return (
    <address
      className={clsx(
        "bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 relative",
        address.isDefault && "border-2 border-indigo-600"
      )}
    >
      <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3">
        {address?.type}
      </span>
      <button className="text-gray-500 hover:text-red-500 absolute top-2 right-2 p-3 rounded-full hover:bg-gray-100">
        <TrashIcon className="h-4 w-4" />
      </button>
      <h5 className="font-bold">{address?.name}</h5>
      <p>{address?.street}</p>
      <p>
        {address?.city}, {address?.state} {address?.zip}
      </p>
      <p>{address?.country}</p>
      <p>{address?.phone}</p>

      <div className="mt-5 border-t border-gray-200 pt-5 flex items-center justify-between">
        {
          // Add a button to set the address as the default
          address.isDefault ? (
            <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full ">
              Default
            </span>
          ) : (
            <button className="text-indigo-600 text-xs font-semibold">
              Set as Default
            </button>
          )
        }
        <button className="text-indigo-600 text-xs font-semibold">Edit</button>
      </div>
    </address>
  );
}

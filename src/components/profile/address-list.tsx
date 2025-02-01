import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AddressList() {
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
          }}
        />
      </div>
    </div>
  );
}

export function AddressBlock({ address }: { address: any }) {
  return (
    <address className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 relative">
      <button className="text-gray-500 hover:text-red-500 absolute top-2 right-2 p-3 rounded-full hover:bg-gray-100">
        <TrashIcon className="h-4 w-4" />
      </button>
      <h5 className="font-bold">{address.name}</h5>
      <p>{address.street}</p>
      <p>
        {address.city}, {address.state} {address.zip}
      </p>
      <p>{address.country}</p>
      <p>{address.phone}</p>
    </address>
  );
}

// AddressList.tsx
"use client";

import api from "@/lib/api/axios.interceptor";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { PlusIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Loader from "../common/loader/loader";
import { endpoints } from "@/lib/data/endpoints";
import { useToast } from "@/hooks/use-toast";
import EditAddressModal from "@/app/profile/edit-address-modal/address-modal"; 

// Define the Address type with additional fields
interface Address {
  _id: any;
  id: string; // Added ID for tracking
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

export default function AddressList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // delete address
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      await api.delete(`${endpoints.address}/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AddAddress"] });
      toast({ title: "Success", description: "Address deleted successfully!", variant: "default" });
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete address. Please try again.", variant: "default" });
    }
  });

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["AddAddress"],
    queryFn: async () => {
      const res = await api.get(endpoints.address);
      return res.data.result;
    }
  });
  
  const handleEditClick = (address: Address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

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
        {addresses?.map((addr: Address, index: number) => (
          <AddressBlock 
            key={index} 
            address={addr} 
            onEditClick={handleEditClick}
            onDeleteClick={(addressId) => deleteAddressMutation.mutate(addressId)} // Pass delete function
          />
        ))}
      </div>
      
      {isModalOpen && selectedAddress && (
        <EditAddressModal 
          address={selectedAddress} 
          onClose={handleCloseModal}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ["AddAddress"] });
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}

export function AddressBlock({ 
  address, 
  onEditClick,
  onDeleteClick 
}: { 
  address: Address;
  onEditClick: (address: Address) => void;
  onDeleteClick: (addressId: string) => void; 
}) {
  return (
    <address
      className={clsx(
        "bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 relative",
        address.isDefault && "border-2 border-indigo-600"
      )}
    >
      <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3">
        {address?.addressType}
      </span>
      <button className="text-gray-500 hover:text-red-600 absolute top-2 right-2 p-3 rounded-full hover:bg-gray-100"
       onClick={() => onDeleteClick(address._id)} // Call delete function
       >
        <TrashIcon className="h-5 w-5" />
      </button>
      <h5 className="font-bold">{address?.name}</h5>
      <p>{address?.addressLine1}</p>
      {address?.addressLine2 && <p>{address?.addressLine2}</p>}
      <p>
        {address?.city}, {address?.state} {address?.pincode}
      </p>
      <p>{address?.country}</p>
      <p>{address?.phone}</p>
      {address?.altPhone && <p>Alternate No: {address?.altPhone}</p>}
      <p>Email: {address?.email}</p>

      <div className="mt-5 border-t border-gray-200 pt-5 flex items-center justify-between">
        {
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
        <button 
          className="text-indigo-600 text-xs font-semibold"
          onClick={() => onEditClick(address)}
        >
          Edit
        </button>
      </div>
    </address>
  );
}
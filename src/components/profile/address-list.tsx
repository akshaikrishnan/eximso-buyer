// AddressList.tsx
"use client";

import api from "@/lib/api/axios.interceptor";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../common/loader/loader";
import { endpoints } from "@/lib/data/endpoints";
import { useToast } from "@/hooks/use-toast";
import EditAddressModal from "@/app/profile/edit-address-modal/address-modal";

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

export default function AddressList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      await api.delete(`${endpoints.address}/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: "Address deleted successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "default",
      });
    },
  });

  // Set default address mutation
  const setDefaultAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await api.put(`${endpoints.address}/${addressId}`, {
        isDefault: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: "Default address updated successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to set default address. Please try again.",
        variant: "default",
      });
    },
  });

  // Fetch address list
  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get(endpoints.address);
      return res.data.result;
    },
  });

  // 🚀 Redirect to "Add Address" page if no addresses found ON INITIAL LOAD ONLY
  useEffect(() => {
    if (!isLoading && !hasRedirected.current && addresses && addresses.length === 0) {
      hasRedirected.current = true;
      router.push("/profile/my-addresses/add");
    }
  }, [isLoading, addresses, router]);

  const handleEditClick = (address: Address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId);
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  // ✅ Show empty state if no addresses (with option to add)
  if (!addresses || addresses.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Addresses Yet</h2>
          <p className="text-gray-600 mb-6">Add your first address to get started</p>
          <Link
            href="/profile/my-addresses/add"
            className="rounded-md flex items-center gap-2 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon />
            Add Your First Address
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
        <Link
          href="/profile/my-addresses/add"
          className="rounded-md flex items-center gap-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
            onDeleteClick={(addressId) =>
              deleteAddressMutation.mutate(addressId)
            }
            onSetDefault={handleSetDefault}
            isSettingDefault={setDefaultAddressMutation.isPending}
          />
        ))}
      </div>

      {isModalOpen && selectedAddress && (
        <EditAddressModal
          address={selectedAddress}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export function AddressBlock({
  address,
  onEditClick,
  onDeleteClick,
  onSetDefault,
  isSettingDefault,
}: {
  address: Address;
  onEditClick: (address: Address) => void;
  onDeleteClick: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  isSettingDefault?: boolean;
}) {
  return (
    <address
      className={clsx(
        "bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl p-6 relative flex flex-col justify-between",
        address.isDefault && "border-2 border-indigo-600"
      )}
    >
      <div className="grow">
        <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3">
          {address?.addressType}
        </span>

        <button
          className="text-gray-500 hover:text-red-600 absolute top-2 right-2 p-3 rounded-full hover:bg-gray-100"
          onClick={() => onDeleteClick(address._id)}
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
      </div>

      <div className="mt-5 border-t border-gray-200 pt-5 flex items-center justify-between">
        {address.isDefault ? (
          <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full ">
            Default
          </span>
        ) : (
          <button
            className="text-indigo-600 text-xs font-semibold hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onSetDefault(address._id)}
            disabled={isSettingDefault}
          >
            {isSettingDefault ? "Setting..." : "Set as Default"}
          </button>
        )}
        <button
          className="text-indigo-600 text-xs font-semibold hover:text-indigo-700"
          onClick={() => onEditClick(address)}
        >
          Edit
        </button>
      </div>
    </address>
  );
}
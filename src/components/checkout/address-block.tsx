import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "../common/loader/loader";
import { useState } from "react";

interface AddressBlockProps {
  handleCheckoutData: (data: any) => void;
  checkoutData: any;
}

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
const getFormattedAddress = (address: Address) => {
  const parts = [
    address.email,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
    address.country,
    address.altPhone && `Alt. Phone: ${address.altPhone}`,
  ];

  return parts.filter(Boolean).join(", ");
};

export default function AddressBlock({
  handleCheckoutData,
  checkoutData,
}: AddressBlockProps) {
  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get(endpoints.address);
      const defaultAddress = res.data.result.find(
        (address: any) => address.isDefault
      );
      if (defaultAddress) {
        handleCheckoutData({
          shippingAddress: defaultAddress,
          billingAddress: defaultAddress,
        });
      }
      return res.data.result;
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h4 className="w-full text-left text-lg font-medium text-gray-500 mb-3">
          Delivering To
        </h4>
        <button
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          onClick={() => setIsEdit(true)}
        >
          Change
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : isEdit ? (
        <div className="flex flex-col gap-4">
          {addresses?.map((address: any) => (
            <AddressCard
              key={address?._id}
              address={address}
              onChange={handleCheckoutData}
            />
          ))}
        </div>
      ) : checkoutData?.shippingAddress ? (
        selectedAddressCard(checkoutData?.shippingAddress)
      ) : (
        addresses?.map((address: any) => (
          <AddressCard
            key={address?._id}
            address={address}
            onChange={handleCheckoutData}
          />
        ))
      )}
    </div>
  );
}

function selectedAddressCard(address: any) {
  console.log(address);
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-md font-medium text-gray-900">
          {address?.name}
          <span className="text-sm font-normal text-gray-900 ml-3">
            {address?.phone}
          </span>
        </h4>
        <p className="text-sm font-normal text-gray-900">
          {address?.addressLine1}, {address?.city}, {address?.state},{" "}
          {address?.pincode}
        </p>
      </div>
    </div>
  );
}

function AddressCard({
  address,
  onChange,
}: {
  address: any;
  onChange: (data: any) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <input
        type="radio"
        name="address"
        id={address?._id}
        className="cursor-pointer"
        onChange={() => onChange({ shippingAddress: address })}
      />
      <label htmlFor={address?._id} className="cursor-pointer">
        <h5 className="text-sm font-medium">
          <div>
            {address?.name}, {address?.phone}{" "}
            <span className="italic capitalize font-semibold text-slate-600 text-xs px-1 border border-slate-300 rounded-full">
              {address?.addressType}
            </span>
          </div>
        </h5>
        <h5 className="text-sm font-normal text-gray-500">
          {getFormattedAddress(address)}
        </h5>
      </label>
    </div>
  );
}

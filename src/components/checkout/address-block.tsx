import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "../common/loader/loader";
import { useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

const DynamicAddressForm = dynamic(() => import("../profile/address-form"), {
  loading: () => <Loader />,
  ssr: false,
});

const DynamicModal = dynamic(() => import("../ui/modal"));

type AddressType = "shipping" | "billing";
type Address = {
  _id: string;
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

interface AddressBlockProps {
  type: AddressType;
  checkoutData: any;
  handleCheckoutData: (data: any) => void;
}

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
  type,
  checkoutData,
  handleCheckoutData,
}: AddressBlockProps) {
  const [isEdit, setIsEdit] = useState(false);
  const addressKey = `${type}Address` as const;

  const {
    data: addresses,
    isLoading,
    refetch,
  } = useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get(endpoints.address);
      const defaultAddress = res.data.result.find(
        (address: Address) => address.isDefault
      );

      if (defaultAddress) {
        if (type === "shipping")
          handleCheckoutData({ [addressKey]: defaultAddress });
      }
      return res.data.result;
    },
  });

  const handleAddressSelect = (selectedAddress: Address) => {
    handleCheckoutData({ [addressKey]: selectedAddress });
  };

  const selectedAddress = checkoutData?.[addressKey];

  return (
    <div className="">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-medium text-gray-500">
          {type === "shipping" ? "Delivering To" : "Billing Address"}
        </h4>
        {!isLoading && selectedAddress && addresses && addresses.length > 0 && (
          <div>
            {isEdit && <AddAddress />}
            <button
              className={clsx(
                "text-sm font-medium text-indigo-600 hover:text-indigo-500 pl-2",
                isEdit && "border-slate-300  border-l "
              )}
              onClick={() => setIsEdit(!isEdit)}
            >
              {isEdit ? "Cancel" : "Change"}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : addresses && addresses.length === 0 ? (
        <DynamicAddressForm onSave={refetch} />
      ) : isEdit || !selectedAddress ? (
        <div className="flex flex-col gap-4">
          {addresses?.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              selected={address._id === selectedAddress?._id}
              onSelect={handleAddressSelect}
              name={`address-${type}`}
            />
          ))}
        </div>
      ) : (
        <SelectedAddress address={selectedAddress} />
      )}
      {type === "shipping" && (
        <div className="mt-4 text-sm">
          <input
            type="checkbox"
            id="isSameAddress"
            name="isSameAddress"
            className="cursor-pointer"
            checked={checkoutData.isSameAddress}
            onChange={(e) => {
              const addressValue = e.target.checked
                ? checkoutData.shippingAddress
                : null;
              handleCheckoutData({
                billingAddress: addressValue,
                isSameAddress: !checkoutData.isSameAddress,
              });
              console.log(checkoutData);
            }}
          />
          <label htmlFor="isSameAddress" className="cursor-pointer ml-2">
            Billing address is same as shipping address
          </label>
        </div>
      )}
    </div>
  );
}

function SelectedAddress({ address }: { address: Address }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-md font-medium text-gray-900">
          {address.name}
          <span className="text-sm font-normal text-gray-900 ml-3">
            {address.phone}
          </span>
        </h4>
        <p className="text-sm font-normal text-gray-900">
          {getFormattedAddress(address)}
        </p>
      </div>
    </div>
  );
}

function AddressCard({
  address,
  selected,
  onSelect,
  name,
}: {
  address: Address;
  selected: boolean;
  onSelect: (address: Address) => void;
  name: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <input
        type="radio"
        name={name}
        id={`${name}-${address._id}`}
        checked={selected}
        onChange={() => onSelect(address)}
        className="cursor-pointer"
      />
      <label
        htmlFor={`${name}-${address._id}`}
        className="cursor-pointer flex-1"
      >
        <div className="text-sm font-medium">
          {address.name}, {address.phone}
          <span className="ml-2 italic capitalize font-semibold text-slate-600 text-xs px-2 border border-slate-300 rounded-full">
            {address.addressType}
          </span>
        </div>
        <p className="text-sm font-normal text-gray-500">
          {getFormattedAddress(address)}
        </p>
      </label>
    </div>
  );
}

function AddAddress() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="text-sm font-medium text-slate-600 hover:text-indigo-500 pr-2"
        onClick={() => setIsOpen(true)}
      >
        Add Address
      </button>

      <DynamicModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Add Address"
        modalClassName="max-w-7xl!"
        hideButton
      >
        <DynamicAddressForm
          onCancel={() => setIsOpen(false)}
          onSave={() => setIsOpen(false)}
        />
      </DynamicModal>
    </>
  );
}

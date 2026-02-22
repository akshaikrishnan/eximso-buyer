import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "../common/loader/loader";
import { useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import AddressForm from "../profile/address-form";

const DynamicAddressForm = dynamic(() => import("../profile/address-form"), {
  loading: () => <Loader />,
  ssr: false,
});

const DynamicModal = dynamic(() => import("../ui/modal"));

type AddressType = "shipping" | "billing";

export type Address = {
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
      const defaultAddress = res.data.result.find((a: Address) => a.isDefault);

      if (defaultAddress && type === "shipping") {
        handleCheckoutData({ [addressKey]: defaultAddress });
      }
      return res.data.result;
    },
  });

  const selectedAddress = checkoutData?.[addressKey];

  const handleSelect = (address: Address) => {
    handleCheckoutData({ [addressKey]: address });
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h4 className="text-lg font-medium text-gray-500">
          {type === "shipping" ? "Delivering To" : "Billing Address"}
        </h4>

        {selectedAddress && (
          <div className="flex items-center gap-3">
            <AddAddress onSaved={refetch} />
            <button
              onClick={() => setIsEdit(!isEdit)}
              className="text-indigo-600 text-sm"
            >
              {isEdit ? "Cancel" : "Change"}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : addresses?.length === 0 ? (
        <AddressForm />
      ) : isEdit || !selectedAddress ? (
        <div className="flex flex-col gap-4">
          {addresses?.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              selected={selectedAddress?._id === address._id}
              onSelect={handleSelect}
              name={`address-${type}`}
              onUpdated={refetch}
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
            checked={checkoutData.isSameAddress}
            onChange={(e) => {
              handleCheckoutData({
                billingAddress: e.target.checked
                  ? checkoutData.shippingAddress
                  : null,
                isSameAddress: e.target.checked,
              });
            }}
          />
          <label className="ml-2">Billing address is same as shipping</label>
        </div>
      )}
    </div>
  );
}

/* ================= Selected Address ================= */

function SelectedAddress({ address }: { address: Address }) {
  return (
    <div className="border p-4 rounded-lg">
      <div className="font-medium">
        {address.name} — {address.phone}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {getFormattedAddress(address)}
      </div>
    </div>
  );
}

/* ================= Address Card with Edit ================= */

function AddressCard({
  address,
  selected,
  onSelect,
  name,
  onUpdated,
}: {
  address: Address;
  selected: boolean;
  onSelect: (a: Address) => void;
  name: string;
  onUpdated: () => void;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className="border p-4 rounded-lg flex gap-4">
        <input
          type="radio"
          checked={selected}
          name={name}
          onChange={() => onSelect(address)}
        />

        <div className="flex-1">
          <div className="flex justify-between">
            <div className="font-medium">
              {address.name} — {address.phone}
            </div>

            <button
              onClick={() => setIsEditOpen(true)}
              className="text-indigo-600 text-sm"
            >
              Edit
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            {getFormattedAddress(address)}
          </p>
        </div>
      </div>

      <DynamicModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Address"
        hideButton
      >
        <DynamicAddressForm
          address={address}
          onCancel={() => setIsEditOpen(false)}
          onSave={() => {
            setIsEditOpen(false);
            onUpdated();
          }}
        />
      </DynamicModal>
    </>
  );
}

/* ================= Add Address ================= */

function AddAddress({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-slate-600 text-sm">
        Add Address
      </button>

      <DynamicModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add Address"
        hideButton
      >
        <DynamicAddressForm
          onCancel={() => setOpen(false)}
          onSave={() => {
            setOpen(false);
            onSaved();
          }}
        />
      </DynamicModal>
    </>
  );
}

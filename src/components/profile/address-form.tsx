import { toast } from "@/hooks/use-toast";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectInput } from "./select-input";
import countries from "@/lib/data/db/countries.json";

/* ===================== TYPES ===================== */

type Address = {
  _id?: string;
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

type AddressFormProps = {
  address?: Address;
  onCancel?: () => void;
  onSave?: () => void;
};

/* ===================== COUNTRY OPTIONS ===================== */

type Country = { code: string; name: string };
type CountryOption = { value: string; label: string };

const countryOptions: CountryOption[] = (countries as Country[]).map((c) => ({
  value: c.name,
  label: c.name,
}));

/* ===================== INPUT COMPONENT ===================== */

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  errors,
  rules,
  gridClass = "sm:col-span-4",
}: any) => (
  <div className={gridClass}>
    <label className="block text-sm font-medium">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(id, rules)}
      className={`mt-2 w-full rounded-md px-4 py-3 ring-1 ${errors?.[id] ? "ring-red-500" : "ring-gray-300"
        }`}
    />
    {errors?.[id] && (
      <p className="text-sm text-red-600">{errors[id].message}</p>
    )}
  </div>
);

/* ===================== ADDRESS TYPE ===================== */

const AddressTypeRadio = ({ register }: any) => (
  <div className="col-span-full">
    <label className="block text-sm font-medium">Type of Address</label>
    <div className="mt-2 flex gap-4">
      {["home", "office", "other"].map((type) => (
        <label key={type} className="flex items-center gap-2 capitalize">
          <input
            type="radio"
            value={type}
            {...register("addressType")}
            className="text-indigo-600"
          />
          {type}
        </label>
      ))}
    </div>
  </div>
);

/* ===================== MAIN FORM ===================== */

export default function AddressForm({
  address,
  onCancel,
  onSave,
}: AddressFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Address>({
    defaultValues: {
      addressType: "home",
      country: "India",
    },
  });

  /* ================= MUTATION ================= */

  const mutation = useMutation({
    mutationFn: (data: Address) => {
      if (data._id) {
        return api.put(`${endpoints.address}/${data._id}`, data);
      }
      return api.post(endpoints.address, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: address?._id
          ? "Address updated successfully"
          : "Address added successfully",
      });
      reset();
      onSave?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  /* ================= SUBMIT ================= */

  const onSubmit = (data: Address) => {
    mutation.mutate({ ...data, _id: address?._id });
  };

  /* ================= PREFILL (THIS FIXES EMPTY EDIT FORM) ================= */

  useEffect(() => {
    if (address) {
      reset({
        _id: address._id,
        name: address.name,
        phone: address.phone,
        email: address.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        addressType: address.addressType,
        altPhone: address.altPhone,
        isDefault: address.isDefault,
        isDelete: address.isDelete,
      });
    }
  }, [address, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 p-6">

        <FormInput id="name" label="Full Name" register={register} errors={errors} rules={{ required: "Required" }} />
        <FormInput id="phone" label="Phone" register={register} errors={errors} rules={{ required: "Required" }} />
        <FormInput id="email" label="Email" register={register} errors={errors} />

        <FormInput id="addressLine1" label="Address Line 1" gridClass="col-span-full" register={register} errors={errors} />
        <FormInput id="addressLine2" label="Address Line 2" gridClass="col-span-full" register={register} errors={errors} />

        <SelectInput
          control={control}
          name="country"
          label="Country"
          options={countryOptions}
          required
        />

        <FormInput id="city" label="City" register={register} errors={errors} />
        <FormInput id="state" label="State" register={register} errors={errors} />
        <FormInput id="pincode" label="Pincode" register={register} errors={errors} />

        <AddressTypeRadio register={register} />

        <FormInput id="altPhone" label="Alt Phone" register={register} errors={errors} />

      </div>

      <div className="flex justify-end gap-4 p-4 border-t">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

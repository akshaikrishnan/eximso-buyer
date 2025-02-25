import { toast } from "@/hooks/use-toast";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectInput } from "./select-input";
import countries from "@/lib/data/db/countries.json";

type Address = {
  id?: string;
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

type Country = {
  code: string;
  name: string;
};
type CountryOption = {
  value: string;
  label: string;
};
const countryOptions: CountryOption[] = (countries as Country[]).map(
  (country) => ({
    value: country.name,
    label: country.name,
  })
);

type FormInputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: any;
  errors: any;
  rules?: any;
  gridClass?: string;
};

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  errors,
  rules,
  gridClass = "sm:col-span-4",
}: FormInputProps) => (
  <div className={gridClass}>
    <label
      htmlFor={id}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {label}
    </label>
    <div className="mt-2">
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset px-4 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
          errors?.[id] ? "ring-red-500" : "ring-gray-300"
        }`}
        {...register(id, rules)}
      />
      {errors?.[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>
      )}
    </div>
  </div>
);

const AddressTypeRadio = ({ register }: any) => (
  <div className="col-span-full">
    <label className="block text-sm font-medium leading-6 text-gray-900">
      Type of Address
    </label>
    <div className="mt-2 flex space-x-4">
      {["home", "office", "other"].map((type) => (
        <div className="flex items-center" key={type}>
          <input
            type="radio"
            id={type}
            value={type}
            {...register("addressType")}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <label
            htmlFor={type}
            className="ml-2 block text-sm text-gray-900 capitalize"
          >
            {type}
          </label>
        </div>
      ))}
    </div>
  </div>
);

export default function AddressForm({
  address,
  onCancel,
  onSave,
}: AddressFormProps) {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: ({ data, id }: { data: Omit<Address, "id">; id?: string }) => {
      if (id) {
        return api.put(`${endpoints.address}/${id}`, data);
      }
      return api.post(endpoints.address, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressess"] });
      toast({
        title: "Success",
        description: address?.id ? "Address updated!" : "Address added!",
      });
      reset();
      onSave?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: address?.id ? "Update failed" : "Add failed",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Address>({
    defaultValues: address || { addressType: "home", country: "India" },
  });

  const onSubmit = (formData: Address) => {
    const { id, ...data } = formData;
    addressMutation.mutate({ data, id: address?.id });
  };

  useEffect(() => {
    reset(
      address || {
        addressType: "home",
        country: "India",
      }
    );
  }, [address, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="px-4 py-6 sm:p-8">
        <div className="grid  grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <FormInput
            id="name"
            label="Full Name"
            placeholder="Name of recipient"
            register={register}
            errors={errors}
            rules={{ required: "Name is required", minLength: 2 }}
          />

          <FormInput
            id="phone"
            label="Mobile Number"
            type="tel"
            placeholder="Contact number"
            register={register}
            errors={errors}
            rules={{
              required: "Phone is required",
              pattern: { value: /^\d{10}$/, message: "Invalid phone" },
            }}
          />

          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="Email address"
            register={register}
            errors={errors}
            rules={{
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            }}
          />

          <FormInput
            id="addressLine1"
            label="Address Line 1"
            gridClass="col-span-full"
            placeholder="Street address"
            register={register}
            errors={errors}
            rules={{ required: "Address required", minLength: 5 }}
          />

          <FormInput
            id="addressLine2"
            label="Address Line 2"
            gridClass="col-span-full"
            placeholder="Apartment/suite"
            register={register}
            errors={errors}
            rules={{ minLength: 5 }}
          />
          <div className="grid gap-x-6 gap-y-8 col-span-full xl:grid-cols-5 grid-cols-1">
            <SelectInput
              control={control}
              name="country"
              label="Country"
              options={countryOptions}
              placeholder="Select a country"
              className="col-span-3"
              required
              errors={errors}
            />
            <FormInput
              id="city"
              label="City"
              placeholder="City name"
              register={register}
              errors={errors}
              gridClass="col-span-2"
              rules={{ required: "City required", minLength: 2 }}
            />
          </div>
          <div className="grid xl:grid-cols-3 grid-cols-1 col-span-full gap-x-6 gap-y-6">
            <FormInput
              id="pincode"
              label="ZIP/Postal Code"
              placeholder="Postal code"
              gridClass="col-span-1"
              register={register}
              errors={errors}
              rules={{
                required: "Postal code required",
                pattern: { value: /^\d{5,6}$/, message: "Invalid code" },
              }}
            />
            <FormInput
              id="state"
              label="State/Province"
              placeholder="State name"
              register={register}
              errors={errors}
              gridClass="col-span-2"
              rules={{ required: "State required", minLength: 2 }}
            />
          </div>

          <AddressTypeRadio register={register} />

          <FormInput
            id="altPhone"
            label="Alternative Mobile"
            type="tel"
            placeholder="Optional contact"
            register={register}
            errors={errors}
            rules={{ pattern: { value: /^\d{10}$/, message: "Invalid phone" } }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={addressMutation.isPending}
        >
          {addressMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

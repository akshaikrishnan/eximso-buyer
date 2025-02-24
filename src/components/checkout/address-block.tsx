import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "../common/loader/loader";

interface AddressBlockProps {
  handleCheckoutData: (data: any) => void;
  checkoutData: any;
}

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
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h4 className="w-full text-left text-lg font-medium text-gray-500 mb-3">
          Delivering To
        </h4>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Change
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : checkoutData?.shippingAddress ? (
        selectedAddressCard(checkoutData?.shippingAddress)
      ) : (
        <div className="flex flex-col gap-4">
          {addresses?.map((address: any) => (
            <div
              key={address?._id}
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => handleCheckoutData({ address })}
            >
              <input
                type="radio"
                name="address"
                id={address?._id}
                className="cursor-pointer"
              />
              <label htmlFor={address?._id} className="cursor-pointer">
                {address?.name}, {address?.phone}
              </label>
            </div>
          ))}
        </div>
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

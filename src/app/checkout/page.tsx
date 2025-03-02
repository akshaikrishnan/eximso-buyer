"use client";
import AddressBlock from "@/components/checkout/address-block";
import CheckoutBlock from "@/components/checkout/block";
import OrderSummary from "@/components/checkout/order-summary";
import RadioSelector from "@/components/checkout/radio-button";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api/axios.interceptor";
import { sample } from "@/lib/data/checkoutdata";
import { endpoints } from "@/lib/data/endpoints";
import { razorPay } from "@/lib/razorpay";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Loader2Icon } from "lucide-react";
import React from "react";

interface CheckoutData {
  shippingAddress: any;
  billingAddress: any;
  isSameAddress: boolean;
  shippingMethod: any;
  paymentMethod: any;
}

export default function CheckoutPage() {
  const [checkOutData, setCheckOutData] = React.useState<any>({
    shippingAddress: null,
    billingAddress: null,
    isSameAddress: true,
    shippingMethod: sample.shippimngMethods[0],
    paymentMethod: sample.paymentMethods[0],
  });

  const paymentMutation = useMutation({
    mutationFn: (data: any) =>
      api.post(endpoints.checkout, data).then((res) => res.data),
    onSuccess: (data) => {
      razorPay(data);
    },
    onError: (data: any) => {
      console.error(data);
      toast({
        title: "Error",
        description:
          data.response.data?.error?.description || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  const handleCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckOutData({ ...checkOutData, ...data });
  };

  const isValid = () => {
    if (!checkOutData.isSameAddress && !checkOutData.billingAddress) {
      return false;
    }
    if (!checkOutData.shippingAddress) {
      return false;
    }
    return true;
  };

  const initiatePayment = () => {
    paymentMutation.mutate({
      shippingAddress: checkOutData.shippingAddress._id,
      billingAddress: checkOutData.isSameAddress
        ? checkOutData.shippingAddress._id
        : checkOutData.billingAddress._id,
      shippingMethod: checkOutData.shippingMethod._id,
      paymentMethod: checkOutData.paymentMethod._id,
    });
  };
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto container px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-8 lg:px-8 xl:px-2 xl:pt-14 relative overflow-auto">
          <h1 className="sr-only">Checkout</h1>

          <div className="mx-auto grid max-w-lg grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="mx-auto w-full max-w-lg order-1 xl:order-2 xl:sticky top-2">
              <OrderSummary>
                <div className="hidden lg:block">
                  <PlaceOrderButton
                    action={initiatePayment}
                    isValid={isValid()}
                    className="mt-4"
                    isLoading={paymentMutation.isPending}
                  />
                </div>
              </OrderSummary>
            </div>
            <div className="mx-auto w-full order-2 xl:order-1">
              <CheckoutBlock>
                <AddressBlock
                  type="shipping"
                  checkoutData={checkOutData}
                  handleCheckoutData={handleCheckoutData}
                />
              </CheckoutBlock>

              {!checkOutData.isSameAddress && (
                <CheckoutBlock>
                  <AddressBlock
                    type="billing"
                    checkoutData={checkOutData}
                    handleCheckoutData={handleCheckoutData}
                  />
                </CheckoutBlock>
              )}

              <CheckoutBlock>
                <RadioSelector
                  items={sample.shippimngMethods}
                  selectedItem={checkOutData.shippingMethod}
                  onChange={(item) => {
                    handleCheckoutData({ shippingMethod: item });
                  }}
                  label="Shipping Methods"
                  isGrid
                />
              </CheckoutBlock>

              <CheckoutBlock>
                <RadioSelector
                  items={sample.paymentMethods}
                  selectedItem={checkOutData.paymentMethod}
                  onChange={(item) => {
                    handleCheckoutData({ paymentMethod: item });
                  }}
                  label="Payment Methods"
                  isGrid
                />
              </CheckoutBlock>
              <PlaceOrderButton
                action={initiatePayment}
                isValid={isValid()}
                isLoading={paymentMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const PlaceOrderButton = ({
  isValid,
  className,
  action,
  isLoading,
}: {
  isValid: boolean;
  action: () => void;
  className?: string;
  isLoading: boolean;
}) => {
  return (
    <button
      disabled={!isValid || isLoading}
      title="Secured Checkout"
      type="submit"
      onClick={action}
      className={clsx(
        "w-full flex items-center cursor-pointer font-bold justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base  text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <LockClosedIcon className="h-6 w-6 text-white" aria-hidden="true" />
      )}
      <span className="ml-1">Place Order</span>
    </button>
  );
};

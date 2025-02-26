"use client";
import AddressBlock from "@/components/checkout/address-block";
import CheckoutBlock from "@/components/checkout/block";
import OrderSummary from "@/components/checkout/order-summary";
import RadioSelector from "@/components/checkout/radio-button";
import { sample } from "@/lib/data/checkoutdata";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React from "react";

interface CheckoutData {
  address: string;
  paymentMethod: any;
  shippingMethod: any;
}

export default function CheckoutPage() {
  const [checkOutData, setCheckOutData] = React.useState({
    shippingAddress: null,
    billingAddress: null,
    isSameAddress: true,
    shippingMethod: sample.shippimngMethods[0],
    paymentMethod: sample.paymentMethods[0],
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
  return (
    <div className="bg-white">
      <div className="mx-auto container px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-8 lg:px-8 xl:px-2 xl:pt-14 relative overflow-auto">
        <h1 className="sr-only">Checkout</h1>

        <div className="mx-auto grid max-w-lg grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="mx-auto w-full max-w-lg order-1 xl:order-2 xl:sticky top-2">
            <OrderSummary>
              <div className="hidden lg:block">
                <PlaceOrderButton isValid={isValid()} className="mt-4" />
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
            <PlaceOrderButton isValid={isValid()} />
          </div>
        </div>
      </div>
    </div>
  );
}

const PlaceOrderButton = ({
  isValid,
  className,
}: {
  isValid: boolean;
  className?: string;
}) => {
  return (
    <button
      disabled={!isValid}
      title="Secured Checkout"
      type="submit"
      className={clsx(
        "w-full flex items-center cursor-pointer font-bold justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base  text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      <LockClosedIcon className="h-6 w-6 text-white" aria-hidden="true" />
      <span className="ml-1">Place Order</span>
    </button>
  );
};

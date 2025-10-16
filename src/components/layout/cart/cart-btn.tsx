import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import clsx from "clsx";

export default function CartBtn({ product }: any) {
  const { product: productData, quantity: initialQuantity } = product;
  const minimumOrderQuantity = productData.minimumOrderQuantity || 1;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [inputValue, setInputValue] = useState(initialQuantity);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (newQuantity: number) =>
      api.post(`${endpoints.cart}/update`, {
        productId: productData._id,
        quantity: newQuantity,
      }),
    mutationKey: ["cart"],
    onSuccess: (data) => {
      console.log("Update successful:", data);
      setQuantity(inputValue);
      setError("");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Update failed:", error);
      setError("Failed to update quantity. Please try again.");
      setInputValue(quantity); // Reset to previous quantity on error
    },
  });

  const handleIncrement = () => {
    if (inputValue >= productData.stock) {
      setError("Cannot exceed available stock");
      return;
    }
    const newQuantity = quantity + 1;
    setInputValue(newQuantity);
    updateMutation.mutate(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > minimumOrderQuantity) {
      const newQuantity = quantity - 1;
      setInputValue(newQuantity);
      updateMutation.mutate(newQuantity);
    } else {
      setError(`Minimum order quantity is ${minimumOrderQuantity}`);
    }
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setInputValue(value);
      if (error) setError("");
    }
  };

  const handleInputBlur = () => {
    const parsedValue = parseInt(inputValue, 10);
    if (isNaN(parsedValue)) {
      // If input is empty, reset to previous quantity
      setInputValue(quantity);
      setError("");
      return;
    }

    if (parsedValue < minimumOrderQuantity) {
      setError(`Minimum order quantity is ${minimumOrderQuantity}`);
      setInputValue(quantity);
      return;
    }

    if (parsedValue !== quantity) {
      updateMutation.mutate(parsedValue);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center border-gray-100 mt-5">
        <span
          onClick={handleDecrement}
          className={`cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-eximblue-500 hover:text-blue-50 ${
            quantity <= minimumOrderQuantity
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          -
        </span>
        <input
          className="h-8 w-16 border bg-white text-center text-xs outline-hidden"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min={minimumOrderQuantity}
        />
        <span
          onClick={handleIncrement}
          className={clsx(
            "cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-eximblue-500 hover:text-blue-50",
            inputValue < productData.stock
              ? ""
              : "opacity-50 cursor-not-allowed"
          )}
        >
          +
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

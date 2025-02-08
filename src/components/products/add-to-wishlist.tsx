"use client";
import { useAddToWishlist } from "@/hooks/use-add-to-wishlist";
import { FaHeart } from "react-icons/fa";
import React, { useState } from "react";

export default function AddToWishlistBtn({ product }: any) {
  const addToWishlist = useAddToWishlist(product);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleClick = () => {
    addToWishlist();
    setIsInWishlist(!isInWishlist); // Toggle the wishlist state
  };

  return (
    <div 
      onClick={handleClick}
      // className="cursor-pointer flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-purple-600 px-8 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
    >
      <FaHeart className={`w-8 h-8 ${isInWishlist ? 'text-red-500' : 'text-gray-300'}`} />
    </div>
  );
}
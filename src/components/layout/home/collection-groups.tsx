import Image from "next/image";
import Link from "next/link";
import React from "react";

// Product type definition
interface Product {
  title: string;
  href: string;
  image: string;
  thumbnail?: string;
  name?: string;
  slug?: string;
}

// Collection group type definition
interface CollectionGroupProps {
  title: string;
  bannerImage?: string;
  products: Product[];
}

// Individual Collection Group component
const CollectionGroup: React.FC<{ collectionGroup: CollectionGroupProps }> = ({
  collectionGroup
}) => {
  return (
    <div className="space-y-4">
      {/* Section Title */}
      <h2 className="text-2xl text-center font-bold capitalize">
        {collectionGroup.title}
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 p-0 md:p-4">
        {collectionGroup.products.map((product, productIndex) => (
          <Link
            key={productIndex}
            href={product.slug ? "/" + product.slug : product.href}
            className="group flex flex-col bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Product Image */}
            <div className="w-full aspect-3/4 relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.thumbnail || product.image || "/placeholder.png"}
                alt={product.name || product.title || "Product"}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Product Title - Fixed Height */}
            <div className="mt-4 h-10 flex items-center justify-center">
              <span className="font-medium text-center text-sm line-clamp-2 leading-tight">
                {product.name || product.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Main wrapper component
export default function CollectionGroups({
  data,
  title,
  bestProducts,
}: {
  data: CollectionGroupProps[];
  title?: string;
  bestProducts?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      {title && <h1 className="text-3xl font-bold text-center">{title}</h1>}

      {/* Optional Best Products Section */}
      {bestProducts && (
        <div className="border p-4 rounded-lg bg-yellow-50">
          <h2 className="text-xl font-semibold mb-2">Best Products</h2>
          {bestProducts}
        </div>
      )}

      {/* Grouped Product Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {data.map((collectionGroup, index) => (
          <CollectionGroup key={index} collectionGroup={collectionGroup} />
        ))}
      </div>
    </div>
  );
}

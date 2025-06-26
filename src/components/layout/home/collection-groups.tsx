import Image from "next/image";
import React from "react";

// Define the product structure
interface Product {
  title: string;
  href: string;
  image: string;
  thumbnail?: string;
  description?: string;
  name?: string
}

// Define the collection group structure
interface CollectionGroupProps {
  title: string;
  description?: string;
  bannerImage?: string;
  products: Product[];
}

// Collection Component - Renders each collection group
const Collection: React.FC<{ data: CollectionGroupProps[] }> = ({ data }) => {
  return (
    <>
      {data.map((collectionGroup, index) => (
        <div key={index} className="mb-8">
          {/* Banner Image */}
          {/* {collectionGroup.bannerImage && (
            <Image
              src={collectionGroup.bannerImage}
              alt={`${collectionGroup.title} Banner`}
              width={800}
              height={200}
              className="w-full h-auto rounded-lg mb-4 object-cover"
            />
          )} */}

          {/* Collection Title */}
          <h2 className="text-2xl text-center font-bold mb-2">{collectionGroup.title}</h2>

          {/* Optional Description */}
          {/* {collectionGroup.description && (
            <p className="text-sm text-gray-600 mb-4">
              {collectionGroup.description}
            </p>
          )} */}

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 h-full">
            {collectionGroup.products.map((product, productIndex) => (
              <a
                key={productIndex}
                href={product.href}
                className="group flex flex-col item-center object-cover text-md bg-white p-3 pb-0 rounded-lg shadow hover:shadow-md transition"
              >
                {/* Product Thumbnail */}
                <div className="xl:w-[12rem] xl:h-[15rem] rounded-lg ">
                  <Image
                    src={product.thumbnail || 'no image'}
                    alt={product.title||'title'}
                    className="w-full h-full object-cover object-center"
                    width={240}
                    height={240}

                  />
                </div>

                {/* Product Title */}
                <span className="mt-4 font-medium text-center">{product.name||'title'}</span>

                {/* Optional Product Description */}
                {product.description && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {/* {product.description||'description'} */}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

// Main Wrapper Component
export default function CollectionGroups({
  data,
  title,
  description,
  bestProducts,
}: {
  data: CollectionGroupProps[];
  title?: string;
  description?: string;
  bestProducts?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Main Title */}
      {title && <h1 className="text-3xl font-bold">{title}</h1>}

      {/* Main Description */}
      {description && <p className="text-gray-600">{description}</p>}

      {/* Best Products Section */}
      {bestProducts && (
        <div className="border p-4 rounded-lg bg-yellow-50">
          <h2 className="text-xl font-semibold mb-2">Best Products</h2>
          {bestProducts}
        </div>
      )}

      {/* Collection Groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Collection data={data} />
      </div>
    </div>
  );
}

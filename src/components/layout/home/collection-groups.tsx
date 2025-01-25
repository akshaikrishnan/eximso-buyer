import Image from "next/image";
import React from "react";

interface Product {
  title: string;
  href: string;
  image: string;
  description?: string;
}

interface CollectionGroupProps {
  title: string;
  products: Product[];
}

const Collection: React.FC<{ data: CollectionGroupProps[] }> = ({ data }) => {
  return (
    <>
      {data.map((collectionGroup, index) => (
        <div key={index}>
          <h2 className="text-xl font-bold mb-4">{collectionGroup.title}</h2>
          <div className="grid grid-cols-2 gap-1">
            {collectionGroup.products.map((product, productIndex) => (
              <a
                key={productIndex}
                href={product.href}
                className="group flex flex-col items-center text-sm"
              >
                <div className="w-42 h-42 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-center object-cover"
                    width={240}
                    height={240}
                  />
                </div>
                <span className="mt-2">{product.title}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
export default function CollectionGroups({
  data,
}: {
  data: CollectionGroupProps[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Collection data={data} />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeroThreeGrid() {
  return (
    <div className="col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid grid-cols-2 gap-2 md:gap-3.5 lg:gap-5 xl:gap-7">
      <div className="mx-auto col-span-2 w-full">
        <Link
          className="h-full group flex justify-center relative overflow-hidden"
          href={"/"}
        >
          <Image
            className="bg-gray-300 object-cover w-full rounded-md"
            src="/images/banners/banner-1.webp"
            width={760}
            height={450}
            alt="Hero"
            priority={true} 
          />

        </Link>
      </div>
      <div className="mx-auto col-span-1 w-full ">
        <Link
          className="h-full group flex justify-center relative overflow-hidden"
          href={"/"}
        >
          <Image
            className="bg-gray-300 object-cover w-full rounded-md"
            src="/images/banners/banner-2.webp"
            width={370}
            height={450}
            alt="Hero"
            priority={true} 
          />
        </Link>
      </div>
      <div className="mx-auto col-span-1 w-full ">
        <Link
          className="h-full group flex justify-center relative overflow-hidden"
          href={"/"}
        >
          <Image
            className="bg-gray-300 object-cover w-full rounded-md"
            src="/images/banners/banner-3.webp"
            width={370}
            height={450}
            alt="Hero"
            priority={true} 
          />
        </Link>
      </div>
    </div>
  );
}

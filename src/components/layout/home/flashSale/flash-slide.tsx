import Image from "next/image";
import React from "react";

export default function FlashSlide({
  image,
  title,
  description,
  link,
  price,
  offerPrice,
}: {
  image: string;
  title: string;
  description: string;
  link: string;
  price: string;
  offerPrice?: string;
}) {
  return (
    <div className="h-full flex flex-col justify-between py-10">
      <div className="flex flex-col justify-between gap-10">
        <Image
          className="bg-gray-300 object-cover rounded-s-md rounded-md transition duration-150 ease-linear transform group-hover:scale-105"
          src={image}
          alt={title}
          width={500}
          height={500}
        />
        <div className="w-full overflow-hidden p-2 ltr:pl-0 rtl:pr-0">
          <h2 className="truncate mb-1 font-semibold md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-heading">
            {title}
          </h2>
          <p className="text-body text-xs lg:text-sm leading-normal xl:leading-relaxed max-w-[250px] truncate">
            {description}
          </p>
          <div
            className="font-semibold text-sm sm:text-xl mt-1.5 flex flex-wrap gap-x-2 md:text-base lg:text-xl md:mt-2.5 2xl:mt-3
           text-heading"
          >
            <span className="inline-block false">
              {offerPrice ? offerPrice : price}
            </span>
            <del className="text-gray-500">{price}</del>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span>Claimed : 180</span>
          <span>Total : 400</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-eximblue-500 h-2.5 rounded-full"
            style={{ width: "45%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

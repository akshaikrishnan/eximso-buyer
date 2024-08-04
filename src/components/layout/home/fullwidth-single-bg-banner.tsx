import Image from "next/image";

export default function FullwidthSingleBgBanner() {
  return (
    <div className="bg-white">
      <div className="relative bg-gray-900 h-96">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/banners/home-page-01-hero-full-width.jpg"
            alt=""
            className="w-full h-full object-center object-cover"
            width={1920}
            height={400}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gray-900 opacity-50"
        />

        <div className="relative h-full max-w-3xl mx-auto justify-center px-6 flex flex-col items-center text-center  lg:px-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-6xl">
            New arrivals are here
          </h1>
          <p className="mt-4 text-xl text-white">
            The new arrivals have, well, newly arrived. Check out the latest
            options from our summer small-batch release while they're still in
            stock.
          </p>
          <a
            href="#"
            className="mt-8 inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Shop New Arrivals
          </a>
        </div>
      </div>
    </div>
  );
}

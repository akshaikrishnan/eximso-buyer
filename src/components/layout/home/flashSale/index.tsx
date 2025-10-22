import FlashSlide from "./flash-slide";

export default function FlashSale() {
  const data = {
    image: "/images/products/elyse decor.jpg",
    title: "Elysee Decor Seven horses",
    description: "Elysee Decor Seven horses.",
    link: "/elysee-decor-seven-horses",
    price: 3500,
    offerPrice: 2449,
  };
  return (
    <div className="lex flex-col border border-gray-300 rounded-lg pt-6 sm:pt-7 lg:pt-8 xl:pt-7 2xl:pt-9 px-4 md:px-5 lg:px-7 pb-6 lg:pb-7 col-span-full 2xl:col-span-2">
      <h2 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-heading">
        Flash Sale
      </h2>
      <FlashSlide {...data} />
    </div>
  );
}

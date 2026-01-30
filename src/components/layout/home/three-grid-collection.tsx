const callouts = [
  {
    name: "ANGANA HERBAL OILS AND CREAM",
    description: "A premium herbal skincare and haircare.",
    imageSrc:
      // "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg",
      "/images/products/angana.jpg",
    imageAlt:
      "A premium herbal skincare and haircare",
    href: "/products/beauty-products",
  },
  {
    name: "ANGANA HERBAL POWDER",
    description: "Angana herbal powders for natural coloring, cleansing, and dandruff control.",
    imageSrc:
      // "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg",
      "/images/products/power.jpg",
    imageAlt:
      "Angana herbal powders for natural coloring, cleansing, and dandruff control.",
    href: "/products/beauty-products",
  },
  {
    name: "Handcrafted Home Decor Showpiece",
    description: "Beautiful handmade decor crafted by local artisans perfect for elevating your living room aesthetics.",
    imageSrc: "/images/products/HomeDecorShowpiece.webp",
    imageAlt: "Handcrafted home decor showpiece.",
    href: "/products/home-decor",
  }
];

export default function ThreeGridCollection() {
  return (
    <div className="mx-auto max-w-2xl lg:max-w-none ">
      <h2 className="text-2xl font-bold text-gray-900">Collections</h2>

      <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
        {callouts.map((callout) => (
          <div key={callout.name} className="group relative">
            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
              <img
                alt={callout.imageAlt}
                src={callout.imageSrc}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h3 className="mt-6 text-sm text-gray-500">
              <a href={callout.href}>
                <span className="absolute inset-0" />
                {callout.name}
              </a>
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {callout.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

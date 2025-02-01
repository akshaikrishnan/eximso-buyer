import { TrashIcon } from "@heroicons/react/24/outline";

const WishlistPage = () => {
  const wishlistItems = [
    {
      id: 1,
      image:
        "https://m.media-amazon.com/images/I/61FtjbjXX1L._AC_UF1000,1000_QL80_.jpg",
      name: "QXORE Solar Light Outdoor 77 Led Motion Sensor Security Camera Shaped Wall Lamp Solar Light Set",
      price: "₹449",
      originalPrice: "₹2,499",
      discount: "82% off",
      availability: "Available",
    },
    {
      id: 2,
      image:
        "https://rukminim2.flixcart.com/image/850/1000/xif0q/shoe/f/p/f/-original-imahfk95gaahmwac.jpeg?q=20&crop=false",
      name: "PUMA Icon Canvas Shoe For Men",
      price: "₹1,789",
      originalPrice: "₹3,299",
      discount: "45% off",
      availability: "Currently unavailable",
    },
    {
      id: 3,
      image: "https://m.media-amazon.com/images/I/814WvVzrIsL._AC_UY1000_.jpg",
      name: "ROCKFIELD Sneakers For Men",
      price: "₹699",
      originalPrice: "₹999",
      discount: "30% off",
      availability: "Currently unavailable",
    },
  ];

  return (
    <div className="container mx-auto py-8 ">
      <h1 className="text-2xl font-bold text-gray-800">
        My Wishlist ({wishlistItems.length})
      </h1>
      <div className="mt-6 space-y-4">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-5 shadow-sm ring-1 ring-gray-900/5 sm:rounded pb-4"
          >
            {/* Product Details */}
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {item.availability === "Currently unavailable" ? (
                    <span className="text-red-500">{item.availability}</span>
                  ) : (
                    item.availability
                  )}
                </p>
                <div className="mt-2 flex items-center space-x-2 text-sm">
                  <p className="text-lg font-semibold text-gray-900">
                    {item.price}
                  </p>
                  <p className="text-gray-500 line-through">
                    {item.originalPrice}
                  </p>
                  <p className="text-green-500">{item.discount}</p>
                </div>
              </div>
            </div>
            {/* Remove Button */}
            <button className="text-gray-500 hover:text-red-500">
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

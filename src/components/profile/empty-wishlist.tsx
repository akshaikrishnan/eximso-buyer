export default function EmptyWishlist() {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
          alt="Empty Wishlist"
          className="h-32 w-32"
        />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500">Start adding your favorite items!</p>
      </div>
    );
  }
  
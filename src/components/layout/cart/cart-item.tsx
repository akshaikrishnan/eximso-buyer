import { XMarkIcon, CheckIcon, ClockIcon } from "@heroicons/react/20/solid";
import CartBtn from "./cart-btn";
import { CartItem as CartItemType } from "@/hooks/use-cart";
import { Price } from "@/components/common/price";

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <img
          src={item.product.thumbnail}
          alt={item.product.name}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <a
                  href={`/${item.product.slug}`}
                  className="font-medium text-gray-700 hover:text-gray-800 text-lg"
                >
                  {item.product.name}
                </a>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              {item.color && <p className="text-gray-500">{item.color}</p>}
              {item.size && (
                <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                  {item.size}
                </p>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {(() => {
                const displayPrice =
                  typeof item.product.offerPrice === "number" && item.product.offerPrice !== 0
                    ? item.product.offerPrice
                    : item.product.price;
                return <Price amount={displayPrice} />;
              })()}
            </p>
            <CartBtn product={item} />
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="absolute right-0 top-0">
              <button
                onClick={() => onRemove(item.product._id)}
                type="button"
                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Remove</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
          {item.inStock ? (
            <CheckIcon
              className="h-5 w-5 flex-shrink-0 text-green-500"
              aria-hidden="true"
            />
          ) : (
            <ClockIcon
              className="h-5 w-5 flex-shrink-0 text-gray-300"
              aria-hidden="true"
            />
          )}
          <span>
            {item.inStock
              ? "In stock"
              : `Ships in ${Math.ceil(10 * Math.random())} days`}
          </span>
        </p>
      </div>
    </li>
  );
}

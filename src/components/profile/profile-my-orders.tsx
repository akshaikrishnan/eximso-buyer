import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

// Mock order data
const orders = [
  {
    id: 1,
    date: "Oct 13, 2024",
    items: ["AlexVyan Standard 1 Pcs White"],
    status: "Delivered",
    total: "$50.00",
    image:
      "https://rukminim2.flixcart.com/image/850/1000/knqd3m80/support/e/3/w/na-toe-corrector-device-bunion-treatment-orthopedic-brace-splint-original-imaf4tzefsrnmzrb.jpeg?q=90&crop=false",
    color: "blue",
    description: "This is a great product for foot care.",
  },
  {
    id: 2,
    date: "Aug 27, 2024",
    items: ["LORSHEL Bee Venom for Pain"],
    status: "Delivered",
    total: "$20.00",
    image: "https://m.media-amazon.com/images/I/51CSbQUgjwL.jpg",
    color: "blue",
    description: "Effective pain relief solution.",
  },
  {
    id: 3,
    date: "Aug 05, 2024",
    items: ["Wellcore Micronised Creatine Monohydrate"],
    status: "Cancelled",
    total: "$30.00",
    image:
      "https://m.media-amazon.com/images/I/51uuF4s+5iL._AC_UF1000,1000_QL80_.jpg",
    color: "blue",
    description: "High-quality creatine for athletes.",
  },
  {
    id: 4,
    date: "Aug 01, 2024",
    items: ["Grey casual shoe for men"],
    status: "Returned",
    total: "$25.00",
    image:
      "https://cdn.khadims.com/image/tr:e-sharpen-01,h-822,w-940,cm-pad_resize/catalog/khadims/product/51972351926/51972351922_1.JPG",
    color: "blue",
    description: "Stylish and comfortable shoes.",
  },
];

export default function MyOrders() {
  return (
    <div className="container mx-auto py-8 ">
      <h1 className="text-2xl font-bold text-gray-800">
        My Orders ({orders.length})
      </h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl pb-4"
          >
            {/* Product Details */}
            <div className="flex items-center space-x-4 p-5">
              <img
                src={order.image}
                alt={order.items[0]}
                className="h-20 w-20 rounded object-cover"
              />
              <div>
                <h3
                  className="text-lg font-semibold text-gray-800"
                  style={{
                    width: "100%",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                  }}
                >
                  {order.items[0]}
                </h3>
                <p className="mt-1 text-sm font-normal ">{order.description}</p>
                <p className="mt-1 text-sm font-normal ">
                  Color: {order.color}
                </p>
              </div>
            </div>
            {/* Price and Status */}
            <div className="text-center p-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {order.total}
              </h1>
              <p className="text-xs font-normal">Delivered on {order.date}</p>
              <p className="text-xs font-normal">
                Your item has been {order.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

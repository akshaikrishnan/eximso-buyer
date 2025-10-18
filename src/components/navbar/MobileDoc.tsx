"use client";

import { usePathname } from "next/navigation";
import { HomeIcon, ShoppingCartIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { Squares2X2Icon } from "@heroicons/react/24/solid"; // Use solid icon for filled effect
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

const MobileDoc = () => {
    const pathname = usePathname(); // Get the current route

    const { data: cart } = useQuery({
        queryKey: ["cart"],
        queryFn: () => api.get(endpoints.cart).then((res) => res.data.result),
    });

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-md sm:hidden z-50">
            <div className="flex justify-around py-2 text-gray-700 pb-6">
                <Link
                    href="/"
                    className={`flex flex-col items-center ${pathname === "/" ? "text-indigo-600 font-bold" : "text-gray-500"}`}
                >
                    <HomeIcon className={`w-6 h-6 ${pathname === "/" ? "text-indigo-600 fill-indigo-600" : "text-gray-500"}`} />
                    <span className="text-xs">Home</span>
                </Link>

                <Link
                    href="/category"
                    className={`flex flex-col items-center ${pathname === "/category" ? "text-indigo-600 font-bold" : "text-gray-500"}`}
                >
                    <Squares2X2Icon className={`w-6 h-6 ${pathname === "/category" ? "text-indigo-600 fill-indigo-600" : "text-gray-500"}`} />
                    <span className="text-xs">Category</span>
                </Link>

                <Link
                    href="/cart"
                    className={`relative flex flex-col items-center ${pathname === "/cart" ? "text-indigo-600 font-bold" : "text-gray-500"
                        }`}
                >
                    {/* Badge positioned relative to the icon */}
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 min-w-5 flex items-center justify-center text-xs">
                        {cart?.items?.length || 0}
                    </span>
                    <ShoppingCartIcon
                        className={`w-6 h-6 ${pathname === "/cart" ? "text-indigo-600 fill-indigo-600" : "text-gray-500"
                            }`}
                    />
                    <span className="text-xs">Cart</span>
                </Link>

                <Link
                    href="/profile"
                    className={`flex flex-col items-center ${pathname === "/profile" ? "text-indigo-600 font-bold" : "text-gray-500"}`}
                >
                    <UserCircleIcon className={`w-6 h-6 ${pathname === "/profile" ? "text-indigo-600 fill-indigo-600" : "text-gray-500"}`} />
                    <span className="text-xs">Account</span>
                </Link>
            </div>
        </div>
    );
};

export default MobileDoc;

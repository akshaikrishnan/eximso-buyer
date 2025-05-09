"use client";

import React, { Suspense, useCallback } from "react";
import { useState, useEffect } from "react";

import Link from "next/link";
import {
  BuildingStorefrontIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import TopBar from "./topbar";
import HeaderMenu from "./header-menu";
// import { menu } from "@/lib/data/menu";
import { Bars3BottomRightIcon } from "@heroicons/react/20/solid";
import { useUI } from "@/contexts/ui.context";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Searchbar from "./searchbar";
import { toast } from "@/hooks/use-toast";

const Navbar = (props: any) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get(endpoints.categories).then((res) => res.data.result),
  });

  const path = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  var [isNavOpen, setIsNavOpen] = useState(false);
  const { openSidebar } = useUI();

  useEffect(() => {
    if (isNavOpen) {
      document.body.classList.add("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isNavOpen]);

  const handleMobileMenu = useCallback(() => {
    return openSidebar({
      view: "DISPLAY_MOBILE_MENU",
    });
  }, []);

  const {
    data: user,
    isLoading: userLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.get(endpoints.user).then((res) => res.data.result),
  });

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => api.get(endpoints.cart).then((res) => res.data.result),
  });

  const getProfileUrl = () => {
    if (user) {
      return "/profile";
    }
    return (
      process.env.NEXT_PUBLIC_SELLER_URL +
      "/auth/login" +
      "?from=" +
      path +
      "&userType=Buyer"
    );
  };

  useEffect(() => {
    console.log(searchParams.get("from"));
    setTimeout(() => {
      if (searchParams.get("from") === "logout") {
        toast({
          title: "Logged out",
          description: "You have been logged out",
          variant: "default",
        });
        router.replace(path);
      }
    }, 1000);
  }, [searchParams]);

  const { data: menu } = useQuery({
    queryKey: ["menu"],
    queryFn: () => api.get(endpoints.menu).then((res) => res.data.result),
  });

  return (
    <>
      <TopBar className="px-5 container mx-auto" />
      <nav className="bg-gray-100 text-black  top-0 z-30">
        {/* Upper part */}
        {/* MOBILE MENU */}
        <HamburgerMenu isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        {/*  */}
        <ul className="nav px-3 py-2.5 flex flex-wrap justify-between items-center gap-4 md:gap-6 md:flex-nowrap md:px-6  whitespace-nowrap 2xl:justify-center">
          <li className="nav-item flex items-center gap-4">
            <button
              className="hamburger cursor-pointer text-2xl md:hidden"
              // onClick={() => setIsNavOpen((initialValue) => !initialValue)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <Link
              href={"/"}
              className="Eximso-logo cursor-pointer mt-1 w-20 md:w-28"
            >
              <img
                className="h-full"
                src={"/images/common/logo.png"}
                alt="Eximso.com"
              />
            </Link>
          </li>
          <li className="flex-1 md:hidden"></li>
          <li className="md:order-5">
            <Link
              href={getProfileUrl()}
              className="user cursor-pointer flex items-center text-xs gap-1 "
            >
              {!user && (
                <span className="flex items-center">
                  Sign in <ChevronRightIcon className="w-5 h-5" />
                </span>
              )}
              <span>
                {user && user?.logo ? (
                  <Avatar>
                    <AvatarImage src={user?.logo} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name
                        ? user?.name.split(" ").length > 1
                          ? user?.name.split(" ")[0].charAt(0) +
                            user?.name.split(" ")[1].charAt(0)
                          : user?.name.charAt(0) // If there is only one word, take the first letter
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircleIcon className="w-7 h-7" />
                )}
              </span>
            </Link>
          </li>
          <li className="cart cursor-pointer text-xl md:order-7 hidden md:block">
            <Link href={"/cart"} className="relative">
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart?.items?.length || 0}
              </span>
              <ShoppingCartIcon className="w-8 h-8" />
            </Link>
          </li>
          <li className="nav-item mx-auto w-full">
            <Suspense>
              <Searchbar categories={categories} />
            </Suspense>
          </li>
          <li className="nav-item location cursor-pointer flex items-end gap-2 md:order-2">
            <div className="text-xl">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="space-y-0 leading-5">
              <div className="upper text-gray-400 text-xs">Select your</div>
              <div className="lower font-medium flex gap-1">
                <MapPinIcon className="w-5" /> Location
              </div>
            </div>
          </li>
          <li className="nav-item country cursor-pointer flex items-center gap-2 md:order-4">
            {/* <div className="w-5">
              <img
                className="w-full h-full"
                src={"indian_flag"}
                alt="indian-flag"
              />
            </div> */}
            <div className="flex items-center gap-1 font-medium">
              EN <i className="fa-solid fa-sort-down text-xs text-gray-400"></i>
            </div>
          </li>
          <li className="nav-item returns cursor-pointer md:order-6">
            <div className="space-y-0 leading-5">
              <div className="upper text-start text-xs">Returns</div>
              <div className="lower font-medium">& Orders</div>
            </div>
          </li>
        </ul>
        {/* lower part */}
        {/* <ul className="flex items-center gap-4 overflow-auto bg-eximblue-700 text-white px-4 py-2.5 text-sm whitespace-nowrap 2xl:justify-center 2xl:gap-16">
          <li className="hamburger-all cursor-pointer hidden md:block">
            <button
              className="hamburger cursor-pointer text-xl gap-2 flex items-center"
              onClick={() => setIsNavOpen((initialValue) => !initialValue)}
            >
              <i className="fa-solid fa-bars"></i>
              <span className="text-sm"> All</span>
            </button>
          </li>
          <li className=" cursor-pointer ">Eximso miniTV</li>
          <li className=" cursor-pointer ">Sell</li>
          <li className=" cursor-pointer ">Best Sellers</li>
          <li className=" cursor-pointer ">{"Today's deals"}</li>
          <li className=" cursor-pointer ">Mobiles</li>
          <li className=" cursor-pointer ">New Releases</li>
          <li className=" cursor-pointer ">Customer Service</li>
          <li className=" cursor-pointer flex items-center gap-1">
            Prime{" "}
            <i className="fa-solid fa-sort-down text-xs text-gray-400"></i>
          </li>
        </ul> */}
        <div className="px-5 relative z-10 flex">
          <button
            className="hamburger cursor-pointer text-xl gap-2 flex items-center px-5 rounded-lg font-medium"
            // onClick={() => setIsNavOpen((initialValue) => !initialValue)}
            onClick={openSidebar}
          >
            <Bars3BottomRightIcon className="w-5 h-5" />
            <span className="text-sm whitespace-nowrap"> All Categories</span>
          </button>
          <HeaderMenu
            data={menu}
            className="hidden lg:flex ltr:md:ml-6 ltr:xl:ml-10 rtl:md:mr-6 rtl:xl:mr-10"
          />
          <button className="bg-eximblue-600 whitespace-nowrap rounded-xl px-5 py-3 font-medium text-white  gap-2 flex items-center">
            <BuildingStorefrontIcon className="w-6 h-6" />
            Become a Seller
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

// hamburger menu

const HamburgerMenu = (props: any) => {
  const { isNavOpen, setIsNavOpen } = props;
  return (
    <div
      className={
        isNavOpen
          ? "flex h-screen w-screen fixed top-0 left-0 translate-x-0 duration-500 z-50"
          : "flex h-screen w-screen fixed top-0 left-0 -translate-x-full duration-500 z-50"
      }
    >
      <nav className="h-full w-[80%] max-w-[350px] bg-white flex flex-col overflow-auto text-black pb-20">
        <header className="flex flex-col gap-2 px-5 py-4 bg-eximblue-800 text-white">
          <p className="user self-end">
            <Link
              href={"/sign-in"}
              className="cursor-pointer flex items-center text-xs gap-1"
              onClick={() =>
                setIsNavOpen((initialValue: boolean) => !initialValue)
              }
            >
              <span className="flex whitespace-nowrap">
                Sign in <ChevronRightIcon />
              </span>
              <span>
                <UserCircleIcon className="w-8 h-8" />
              </span>
            </Link>
          </p>
          <p className="cursor-pointer text-xl w-fit font-semibold">
            <Link
              href={"/"}
              onClick={() =>
                setIsNavOpen((initialValue: boolean) => !initialValue)
              }
            >
              {" "}
              Browse <br />
              <span className="text-2xl font-normal">Eximso</span>
            </Link>
          </p>
        </header>
        <section>
          <Link
            href={"/"}
            onClick={() =>
              setIsNavOpen((initialValue: boolean) => !initialValue)
            }
          >
            <li className="cursor-pointer flex justify-between items-center px-5 py-5 text-xl font-bold">
              <span>Eximso Home</span>
              <i className="fa-solid fa-house"></i>
            </li>
          </Link>
          <hr className="border-2" />
          <ul className="flex flex-col">
            {/* heading */}
            <li className="px-5 py-3.5 text-xl font-bold">Trending</li>
            <li className="px-5 py-3.5 cursor-pointer">Best Sellers</li>
            <li className="px-5 py-3.5 cursor-pointer">New Releases</li>
            <li className="px-5 py-3.5 cursor-pointer">Movers and Shakers</li>
          </ul>
          <hr className="border-2 mt-2" />
          <ul className="flex flex-col">
            {/* heading */}
            <li className="px-5 py-3.5 text-xl font-bold">
              Top Categories For You
            </li>
            <li className="px-5 py-3.5 cursor-pointer">Mobiles</li>
            <li className="px-5 py-3.5 cursor-pointer">Computers</li>
            <li className="px-5 py-3.5 cursor-pointer">Books</li>
            <li className="px-5 py-3.5 cursor-pointer">Eximso Fashion</li>
            <li className="px-5 py-3.5 cursor-pointer">See All Categories</li>
          </ul>
          <hr className="border-2 mt-2" />
          <ul className="flex flex-col">
            {/* heading */}
            <li className="px-5 py-3.5 text-xl font-bold">
              Programs & Features
            </li>
            <li className="px-5 py-3.5 cursor-pointer">Today&apos;s Deals</li>
            <li className="px-5 py-3.5 cursor-pointer">Eximso Pay</li>
            <li className="px-5 py-3.5 cursor-pointer">Eximso LaunchPad</li>
            <li className="px-5 py-3.5 cursor-pointer">Try Prime</li>
            <li className="px-5 py-3.5 cursor-pointer">Sell on Eximso</li>
            <li className="px-5 py-3.5 cursor-pointer">Style Feed</li>
          </ul>
        </section>
      </nav>

      <div
        className={
          isNavOpen
            ? "h-full flex-1 bg-black/75 text-white text-3xl py-4 text-center delay-500 opacity-100 transition-opacity duration-75 sm:text-start sm:px-4"
            : "h-full flex-1 bg-black/75 text-white text-3xl py-4 text-center opacity-0 sm:text-start sm:px-4"
        }
        onClick={() => setIsNavOpen((initialValue: boolean) => !initialValue)}
      >
        <i className="fa-solid fa-xmark cursor-pointer hover:scale-75 duration-300"></i>
      </div>
    </div>
  );
};

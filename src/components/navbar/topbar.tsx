"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CurrencySelector } from "../common/currency-selector";

export default function TopBar({ className }: { className: string }) {
  return (
    <>
      <div
        className={`w-full bg-white h-10 border-b border-gray-200 ${className || ""
          }`}
      >
        <div className="container-x mx-auto h-full">
          <div className="flex justify-between items-center h-full ">
            <div className="topbar-nav ">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/profile">
                    <span className="text-xs leading-6 text-qblack font-500">
                      Account
                    </span>
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href="https://tracking.1shipping.in/">
                    <span className="text-xs leading-6 text-qblack font-500">
                      Track Order
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <span className="text-xs leading-6 text-qblack font-500">
                      Support
                    </span>
                  </Link>
                </li>
                {/* <li>
                  <Link href="/faq">
                    <span className="text-xs leading-6 text-qblack font-500">
                      Post Requirements
                    </span>
                  </Link>
                </li> */}
              </ul>
            </div>

            <div className="topbar-dropdowns relative z-50 block lg:hidden xl:block">
              <CurrencySelector />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

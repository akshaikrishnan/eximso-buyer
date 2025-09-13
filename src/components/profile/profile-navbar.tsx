"use client";
import React from "react";
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  UserIcon,
  UsersIcon,
  HeartIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid";
import { HistoryIcon, LogOutIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLogout } from "@/hooks/use-logout";

const tabs = [
  { name: "My Account", href: "/profile", icon: UserIcon, current: false },
  {
    name: "My Addresses",
    href: "/profile/my-addresses",
    icon: BuildingOfficeIcon,
    current: false,
  },
  {
    name: "My Wishlist",
    href: "/profile/my-wishlist",
    icon: HeartIcon,
    current: false,
  },
  {
    name: "My Orders",
    href: "/profile/my-orders",
    icon: HistoryIcon,
    current: true,
  },
  // {
  //   name: "Billing",
  //   href: "/profile/billing",
  //   icon: CreditCardIcon,
  //   current: false,
  // },
  // {
  //   name: "Reset Password",
  //   href: "/profile/reset-password",
  //   icon: LockClosedIcon,
  //   current: false,
  // },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileNavbar() {
  const pathName = usePathname();

  const isActive = (href: string) => {
    return pathName === href;
  };

  const { logout } = useLogout();

  return (
    <div>
      <div className="sm:hidden flex overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={classNames(
              isActive(tab.href)
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
              "flex items-center border-b-2 py-4 px-6 text-sm font-medium flex-wrap"
            )}
            aria-current={tab.current ? "page" : undefined}
          >
            <span>{tab.name?.split(" ")[1]}</span>
          </Link>
        ))}
        <Link
          key={"logout"}
          href={"#"}
          onClick={logout}
          className={classNames(
            "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            "flex items-center border-b-2 py-4 px-6 text-sm font-medium flex-wrap"
          )}
          aria-current={false}
        >
          <span>Logout</span>
        </Link>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            className="-mb-px flex justify-center space-x-8 container m-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={classNames(
                  isActive(tab.href)
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                <tab.icon
                  className={classNames(
                    isActive(tab.href)
                      ? "text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </Link>
            ))}
            <Link
              key={"logout"}
              href={"#"}
              onClick={logout}
              className={classNames(
                "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
              )}
              aria-current={false}
            >
              <LogOutIcon
                className={classNames(
                  "hover:text-indigo-500",
                  "text-gray-400 group-hover:text-gray-500",
                  "-ml-0.5 mr-2 h-5 w-5"
                )}
                aria-hidden="true"
              />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

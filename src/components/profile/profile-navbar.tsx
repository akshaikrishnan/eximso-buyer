"use client";
import React from "react";
import {
  BuildingOfficeIcon,
  UserCircleIcon,
  HeartIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { HistoryIcon, LogOutIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { useLogout } from "@/hooks/use-logout";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const tabs: Array<{ name: string; href: string; icon: IconType }> = [
  { name: "My Account", href: "/profile", icon: UserCircleIcon },
  { name: "My Addresses", href: "/profile/my-addresses", icon: BuildingOfficeIcon },
  { name: "My Wishlist", href: "/profile/my-wishlist", icon: HeartIcon },
  { name: "My Orders", href: "/profile/my-orders", icon: HistoryIcon },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogout();

  const isActive = (href: string) => pathname === href;

  return (
    <div>
      {/* Mobile: dropdown */}
      <div className="sm:hidden flex justify-end p-2">
        <Menu as="div" className="relative inline-block text-left">
         <Menu.Button className="inline-flex sm:hidden items-center justify-center w-9 h-9 rounded-full bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
  <UserCircleIcon />
</Menu.Button>

          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Menu.Item key={tab.name}>
                  {({ active }) => (
                    <Link
                      href={tab.href}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "flex items-center px-4 py-2 text-sm"
                      )}
                    >
                      <Icon className="mr-2 h-5 w-5 text-gray-400" />
                      {tab.name}
                    </Link>
                  )}
                </Menu.Item>
              );
            })}
            <div className="border-t border-gray-200 my-1" />
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={logout}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "flex w-full items-center px-4 py-2 text-sm"
                  )}
                >
                  <LogOutIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Desktop (unchanged, still tabs) */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            className="-mb-px flex justify-center space-x-8 container m-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    active
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={classNames(
                      active ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500",
                      "-ml-0.5 mr-2 h-5 w-5"
                    )}
                  />
                  {tab.name}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="group inline-flex items-center border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              <LogOutIcon className="-ml-0.5 mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

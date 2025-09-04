"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useUI } from "@/contexts/ui.context";
import Logo from "../ui/logo";
import Scrollbar from "../ui/scrollbar";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

type SubItem = {
  name: string;
  image?: string | null;
  slug: string;
  url: string;
};
type CatItem = {
  id: string;
  name: string;
  image?: string | null;
  subcategories: SubItem[];
};

export default function MobileMenu() {
  const [activeMenus, setActiveMenus] = useState<string[]>([]);
  const { closeSidebar } = useUI();

  // Keep a ref to the scroll container so we can preserve scroll position
  const scrollBodyRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  const { data, isLoading, isError } = useQuery<CatItem[]>({
    queryKey: ["categoryNav"],
    queryFn: async () => {
      const res = await api.get(endpoints.categoryPage);
      return res.data as CatItem[];
    },
  });

  const categories = useMemo(() => data ?? [], [data]);

  const preserveScroll = (fn: () => void) => {
    // store current scrollTop of the scrollable div
    if (scrollBodyRef.current)
      lastScrollTopRef.current = scrollBodyRef.current.scrollTop;
    fn();
    // restore next paint
    requestAnimationFrame(() => {
      if (scrollBodyRef.current)
        scrollBodyRef.current.scrollTop = lastScrollTopRef.current;
    });
  };

  const handleArrowClick = (menuName: string) => {
    preserveScroll(() => {
      setActiveMenus((prev) =>
        prev.includes(menuName)
          ? prev.filter((m) => m !== menuName)
          : [...prev, menuName]
      );
    });
  };

  // Normalize API payload to what the list renderer expects
  const normalizedMenu = useMemo(
    () =>
      categories.map((c) => ({
        id: c.id,
        label: c.name,
        path: `/products/${encodeURIComponent(c.id)}`,
        image: c.image || undefined,
        subMenu: c.subcategories.map((s) => ({
          label: s.name,
          path: s.url,
          image: s.image || undefined,
        })),
      })),
    [categories]
  );

  const ListMenu = ({
    dept,
    item,
    hasSubMenu,
    menuName,
    menuIndex,
    className = "",
  }: {
    dept: number;
    item: {
      label: string;
      path: string;
      image?: string | null;
      subMenu?: Array<{ label: string; path: string; image?: string | null }>;
    };
    hasSubMenu: boolean;
    menuName: string;
    menuIndex: number;
    className?: string;
  }) => {
    const isOpen = activeMenus.includes(menuName);
    return (
      <li className={`mb-0.5 ${className}`}>
        <div className="flex items-center justify-between">
          <Link
            href={item.path}
            className="w-full text-[15px] menu-item relative py-3 ltr:pl-5 ltr:md:pl-7 rtl:pr-5 rtl:md:pr-7 ltr:pr-4 rtl:pl-4 transition duration-200 ease-in-out flex items-center gap-3"
            onClick={closeSidebar}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.label}
                width={28}
                height={28}
                className="h-7 w-7 rounded object-cover flex-shrink-0"
              />
            ) : null}
            <span className="block w-full">{item.label}</span>
          </Link>

          {hasSubMenu && (
            <button
              type="button"
              className="cursor-pointer w-10 md:w-12 h-8 flex-shrink-0 flex items-center justify-center"
              onClick={() => handleArrowClick(menuName)}
              onMouseDown={(e) => e.preventDefault()} // prevent focusing that can sometimes jump
              aria-label="Toggle submenu"
            >
              <ChevronDownIcon
                className={`text-heading w-4 h-4 transition-transform duration-400 ${
                  isOpen ? "-rotate-180" : "rotate-0"
                }`}
              />
            </button>
          )}
        </div>

        {/* subtle separator */}
        <div className="border-t border-gray-100" />

        {hasSubMenu && (
          <SubMenu
            dept={dept}
            data={item.subMenu!}
            toggle={isOpen}
            menuIndex={menuIndex}
          />
        )}
      </li>
    );
  };

  // Smooth height/opacity submenu
  const SubMenu = ({
    dept,
    data,
    toggle,
    menuIndex,
  }: {
    dept: number;
    data: Array<{ label: string; path: string; image?: string | null }>;
    toggle: boolean;
    menuIndex: number;
  }) => {
    // Using "max-height" + "opacity" trick for a simple transition
    return (
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          toggle ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="pt-0.5">
          {data?.map((m, idx) => {
            const menuName = `sidebar-submenu-${dept + 1}-${menuIndex}-${idx}`;
            const hasSub = false;
            return (
              <li
                key={menuName}
                className={dept + 1 > 1 ? "ltr:pl-4 rtl:pr-4" : ""}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={m.path}
                    className="w-full text-[14px] py-2 ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 flex items-center gap-3 transition duration-150 hover:bg-gray-50"
                    onClick={closeSidebar}
                  >
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.label}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded object-cover flex-shrink-0"
                      />
                    ) : null}
                    <span className="block w-full">{m.label}</span>
                  </Link>
                </div>
                <div className="border-t border-gray-50" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      {/* Header */}
      <div className="w-full border-b border-gray-100 flex justify-between items-center relative ltr:pl-5 ltr:md:pl-7 rtl:pr-5 rtl:md:pr-7 flex-shrink-0 py-1">
        <Logo />
        <button
          className="flex items-center justify-center text-gray-700 px-4 md:px-5 py-5 lg:py-7 focus:outline-none transition-opacity hover:opacity-70"
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable body - attach ref here to preserve scroll */}
      <Scrollbar className="menu-scrollbar flex-grow mb-auto">
        <div
          className="flex flex-col py-5 px-0 lg:px-2 text-heading"
          ref={scrollBodyRef}
        >
          {isLoading && (
            <div className="px-5 text-sm text-gray-500">
              Loading categories…
            </div>
          )}
          {isError && (
            <div className="px-5 text-sm text-red-500">
              Failed to load categories.
            </div>
          )}
          {!isLoading && !isError && (
            <ul className="mobileMenu">
              {normalizedMenu.map((menu, index) => {
                const dept = 1;
                const menuName = `sidebar-menu-${dept}-${index}`;
                const hasSub = Boolean(menu.subMenu && menu.subMenu.length);
                return (
                  <ListMenu
                    key={menuName}
                    dept={dept}
                    item={menu}
                    hasSubMenu={hasSub}
                    menuName={menuName}
                    menuIndex={index}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </Scrollbar>
    </div>
  );
}

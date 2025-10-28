"use client";

import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import mergeClasses from "@/lib/utils/classNames";
import { useQueryParamState } from "@/lib/hooks/useQueryParamState";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import FilterCheckbox from "../helpers/filter-checkbox";

const rawSortOptions = [
  { name: "Most Popular", sortValue: "", current: true },
  { name: "Best Rating", sortValue: "popular", current: false },
  { name: "Newest", sortValue: "createdAt", current: false },
  { name: "Price: Low to High", sortValue: "price", current: false },
  { name: "Price: High to Low", sortValue: "-price", current: false },
];
const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];
const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: true },
    ],
  },
];

type GridLayoutConfig = {
  mobile: number;
  desktop: number;
};

const desktopLayoutOptions = [
  { label: "4 per row", value: 4 },
  { label: "5 per row", value: 5 },
  { label: "6 per row", value: 6 },
];

const mobileLayoutOptions = [
  { label: "1 per row", value: 1 },
  { label: "2 per row", value: 2 },
];

const LayoutPreview = ({ columns }: { columns: number }) => {
  const totalItems = columns > 4 ? 6 : columns * 2;
  const displayColumns = Math.min(columns, 3);

  return (
    <span
      aria-hidden="true"
      className="grid h-5 w-5 shrink-0 gap-0.5 text-gray-500"
      style={{ gridTemplateColumns: `repeat(${displayColumns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: totalItems }).map((_, idx) => (
        <span
          key={idx}
          className="block h-1.5 w-full rounded-sm bg-current"
        ></span>
      ))}
    </span>
  );
};

export default function ProductLayout({
  children,
  params,
  searchParams,
  title,
}: {
  children: ReactNode;
  params?: any;
  searchParams?: any;
  title?: string;
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [gridLayout, setGridLayout] = useState<GridLayoutConfig>({
    mobile: 2,
    desktop: 5,
  });
  const [sort, setSort] = useQueryParamState<string>("sort", "", {
    parse: (v) => v ?? "",
    serialize: (v) => (v ? v : null),
  });

  useEffect(() => {
    const handleResize = () => {
      const matches = window.matchMedia("(max-width: 767px)").matches;
      setIsMobileViewport(matches);
      setGridLayout((prev) => ({
        mobile: matches ? Math.min(prev.mobile, 2) : prev.mobile || 2,
        desktop: matches ? prev.desktop || 5 : Math.max(prev.desktop, 4),
      }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridLayoutOptions = useMemo(
    () => (isMobileViewport ? mobileLayoutOptions : desktopLayoutOptions),
    [isMobileViewport]
  );

  const activeLayoutValue = isMobileViewport
    ? gridLayout.mobile
    : gridLayout.desktop;

  const enhancedChildren = useMemo(
    () =>
      Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child;
        }

        return cloneElement(child, {
          gridLayout,
        });
      }),
    [children, gridLayout]
  );

  // annotate which option is currently active
  const sortOptions = useMemo(
    () =>
      rawSortOptions.map((option) => ({
        ...option,
        current: option.sortValue === sort,
      })),
    [sort]
  );

  const {
    data: filterData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["filterData", params],
    queryFn: () =>
      api
        .get(endpoints.filters, {
          params: searchParams,
        })
        .then((res) => res.data),
  });
  console.log("filterData", filterData);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                  {filterData?.relatedCollections?.map((category: any) => (
                    <li key={category.name}>
                      <a href={category.href} className="block px-2 py-3">
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {filterData?.filters.map((section: any) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map(
                          (option: any, optionIdx: number) => (
                            <FilterCheckbox
                              key={`${section.id}-${option.value}-${optionIdx}`}
                              sectionId={section.id}
                              option={option}
                              inputId={`filter-mobile-${section.id}-${optionIdx}`}
                            />
                          )
                        )}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-5">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option, idx) => (
                      <MenuItem key={`${option.name}-${idx}`}>
                        <a
                          onClick={() => setSort(option.sortValue)}
                          className={mergeClasses(
                            option.current
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm data-focus:bg-gray-100"
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <Menu as="div" className="relative ml-3 sm:ml-5">
                <MenuButton className="-m-2 flex items-center gap-2 rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <span className="sr-only">View grid</span>
                  <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
                  <LayoutPreview columns={activeLayoutValue} />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
                >
                  {gridLayoutOptions.map((option) => (
                    <MenuItem key={`layout-${option.value}`}>
                      <button
                        type="button"
                        onClick={() =>
                          setGridLayout((prev) => ({
                            mobile: isMobileViewport
                              ? option.value
                              : prev.mobile,
                            desktop: isMobileViewport
                              ? prev.desktop
                              : option.value,
                          }))
                        }
                        className={mergeClasses(
                          "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-600 transition data-focus:bg-gray-100",
                          option.value === activeLayoutValue
                            ? "text-gray-900"
                            : ""
                        )}
                      >
                        <LayoutPreview columns={option.value} />
                        <span>{option.label}</span>
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {filterData?.relatedCollections?.map(
                    (category: any, idx: number) => (
                      <li key={`${category.name}-${idx}`}>
                        <a href={category.href}>{category.name}</a>
                      </li>
                    )
                  )}
                </ul>

                {filterData?.filters?.map((section: any) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map(
                          (option: any, optionIdx: number) => (
                            <FilterCheckbox
                              key={`${section.id}-${option.value}`}
                              sectionId={section.id}
                              option={option}
                              inputId={`filter-${section.id}-${optionIdx}`}
                            />
                          )
                        )}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">{enhancedChildren}</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function Searchbar({ categories }: any) {
  const searchParams = useSearchParams();
  const name = searchParams.get("q");
  const selectedCategory = searchParams.get("category");
  const [search, setSearch] = useState(name || "");
  const [selected, setSelected] = useState(
    selectedCategory || "All Categories"
  );
  const handleOnClickCategory = (e: any) => {
    setSelected(e.target.value);
  };
  return (
    <form
      action="/search"
      className="search flex items-center  text-black md:order-3 md:mx-3"
    >
      <select
        onChange={(e) => setSelected(e.target.value)}
        value={selected}
        className="h-10 w-28 hidden lg:block border-2 text-xs rounded-l-md bg-gray-100 text-gray-700"
        name="category"
        id="main-dropdown"
      >
        <option value="All Categories" className="text-base">
          All Categories
        </option>
        {categories?.map((option: any) => {
          return (
            <option
              className="text-base"
              key={option._id}
              value={option._id}
              onClick={handleOnClickCategory}
            >
              {option.name}
            </option>
          );
        })}
      </select>
      <input
        className="w-full rounded-l-lg border-none outline-none px-2 py-2.5 lg:py-2 lg:rounded-none"
        type="search"
        name="q"
        id="search"
        placeholder="Search Eximso.com"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="bg-white rounded-r-lg focus:outline-4 md:rounded-r-lg">
        <button className="cursor-pointer rounded-r-lg outline-none border-none px-4 py-2 bg-eximblue-600 rounded-md hover:bg-eximblue-700 text-white md:py-[7px] lg:py-[5.5px] md:px-3.5 md:text-xl md:rounded-l-none">
          <MagnifyingGlassIcon className="h-7 w-7" />
        </button>
      </div>
    </form>
  );
}

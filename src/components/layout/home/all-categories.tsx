"use client";
import { useState } from "react";
import Link from "next/link";

export default function CategoryMenu({ categories }: { categories: any }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex h-[75dvh]">
        {/* Left Sidebar - Categories */}
        <div className="w-24 md:w-48 sm:w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto scrollbar-hide">
          <div className="p-2">
            {categories.map((category: any) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex flex-col items-center p-3 rounded-lg mb-2 transition-colors ${
                    selectedCategory.id === category.id
                      ? "bg-eximblue-100 text-eximblue-700 border border-eximblue-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.image ? (
                    <div className="w-6 h-6 mb-1 overflow-hidden rounded">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <IconComponent className="w-6 h-6 mb-1" />
                  )}
                  <span className="text-xs text-center font-medium leading-tight">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Subcategories */}
        <div className="flex-1 md:flex-1 sm:w-3/4 overflow-y-auto scrollbar-hide">
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {selectedCategory.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedCategory.subcategories.map(
                (item: any, index: number) => (
                  <Link
                    key={index}
                    href={
                      item.url
                        ? item.url
                        : item.slug
                        ? `/category/${item.slug}`
                        : `/category/${item.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                    }
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="w-20 h-28 bg-gray-100 rounded-lg mb-2 overflow-hidden group-hover:shadow-md transition-shadow">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-center text-gray-700 font-medium leading-tight group-hover:text-eximblue-600 transition-colors">
                      {item.name}
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

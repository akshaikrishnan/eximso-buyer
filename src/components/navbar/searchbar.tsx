"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type AutocompleteSuggestion = {
  type: "product" | "text";
  name?: string;
  slug?: string;
  thumbnail?: string;
  text?: string;
};

export default function Searchbar({ categories }: any) {
  const searchParams = useSearchParams();
  const name = searchParams.get("q");
  const selectedCategory = searchParams.get("category");
  const [search, setSearch] = useState(name || "");
  const [selected, setSelected] = useState(
    selectedCategory || "All Categories"
  );
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    setIsLoading(true);
    setOpen(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const controller = new AbortController();

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/backend/web/products/autocomplete?query=${encodeURIComponent(
            search.trim()
          )}&limit=10`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        if (data?.success && Array.isArray(data?.result)) {
          setSuggestions(data.result);
          setOpen(data.result.length > 0);
          setHighlightedIndex(-1);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Autocomplete error", error);
        setSuggestions([]);
        setOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      setIsLoading(false);
      controller.abort();
    };
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buildSearchUrl = (value: string) => {
    const params = new URLSearchParams();
    if (selected && selected !== "All Categories") {
      params.set("category", selected);
    }
    params.set("q", value);
    return `/search?${params.toString()}`;
  };

  const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
    if (!suggestion) return;

    setOpen(false);
    setHighlightedIndex(-1);

    if (suggestion.type === "product" && suggestion.slug) {
      if (suggestion.name) {
        setSearch(suggestion.name);
      }
      router.push(`/${suggestion.slug}`);
    } else if (suggestion.type === "text" && suggestion.text) {
      setSearch(suggestion.text);
      router.push(buildSearchUrl(suggestion.text));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(suggestions.length > 0);
        return;
      }
      setHighlightedIndex((prev) => {
        const nextIndex = Math.min(prev + 1, suggestions.length - 1);
        return suggestions.length === 0 ? -1 : nextIndex;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        const nextIndex = prev - 1;
        return nextIndex >= 0 ? nextIndex : -1;
      });
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        event.preventDefault();
        handleSuggestionSelect(suggestions[highlightedIndex]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleOnClickCategory = (e: any) => {
    setSelected(e.target.value);
  };

  return (
    <div ref={containerRef} className="relative md:order-3 md:mx-3">
      <form
        action="/search"
        className="search flex items-center text-black border border-gray-200 rounded-lg bg-white"
      >
        <select
          onChange={(e) => setSelected(e.target.value)}
          value={selected}
          className="h-10 w-28 hidden lg:block text-xs rounded-l-md bg-gray-100 text-gray- border-gray-300"
          name="category"
          id="main-dropdown"
        >
          <option value="" className="text-base">
            All Categories
          </option>
          {categories?.map((option: any) => {
            return (
              <option
                className="text-base"
                key={option._id}
                value={option.slug}
                onClick={handleOnClickCategory}
              >
                {option.name}
              </option>
            );
          })}
        </select>
        <input
          className="w-full rounded-l-lg border-none outline-hidden px-2 py-2.5 lg:py-2 lg:rounded-none bg-gray-50 focus:ring-4 focus:ring-eximblue-300 md:py-2.5 md:px-3.5 md:text-sm lg:rounded-l-lg"
          type="search"
          name="q"
          id="search"
          placeholder="Search Eximso.com"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(suggestions.length > 0 || isLoading)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <div className="bg-white rounded-r-lg focus:outline-4 md:rounded-r-lg">
          <button className="cursor-pointer rounded-r-lg outline-hidden border-none px-4 py-2 bg-eximblue-600 rounded-md hover:bg-eximblue-700 text-white md:py-[7px] lg:py-[5.5px] md:px-3.5 md:text-xl md:rounded-l-none">
            <MagnifyingGlassIcon className="h-7 w-7" />
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-72 overflow-y-auto py-2 text-sm text-gray-900">
            {isLoading && (
              <li className="px-4 py-2 text-gray-500">Loading suggestions...</li>
            )}
            {!isLoading && suggestions.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No suggestions found</li>
            )}
            {!isLoading &&
              suggestions.map((suggestion, index) => {
                const isHighlighted = index === highlightedIndex;
                const itemClasses = isHighlighted
                  ? "bg-gray-100"
                  : "hover:bg-gray-100";

                if (suggestion.type === "product") {
                  return (
                    <li key={`${suggestion.slug}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left ${itemClasses}`}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {suggestion.thumbnail && (
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={suggestion.thumbnail}
                              alt={suggestion.name || "Product thumbnail"}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {suggestion.name}
                        </span>
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={`${suggestion.text}-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`w-full px-4 py-2 text-left text-sm text-gray-700 ${itemClasses}`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {suggestion.text}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}

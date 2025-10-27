"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type AutocompleteSuggestion = {
  type: "product" | "text";
  name?: string;
  slug?: string;
  thumbnail?: string;
  text?: string;
};

type AutocompleteResponse = {
  success: boolean;
  result: AutocompleteSuggestion[];
};

export default function Searchbar({ categories }: any) {
  const searchParams = useSearchParams();
  const name = searchParams.get("q");
  const selectedCategory = searchParams.get("category");
  const [search, setSearch] = useState(name || "");
  const [selected, setSelected] = useState(
    selectedCategory || "All Categories"
  );
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);
  const trimmedQuery = debouncedSearch.trim();

  const {
    data: suggestions = [],
    isFetching,
    isLoading,
    isError,
  } = useQuery<AutocompleteResponse, Error, AutocompleteSuggestion[]>({
    queryKey: ["product-autocomplete", trimmedQuery],
    queryFn: async () => {
      const response = await api.get<AutocompleteResponse>(
        endpoints.productAutocomplete,
        {
          params: {
            query: trimmedQuery,
            limit: 10,
          },
        }
      );

      return response.data;
    },
    enabled: Boolean(trimmedQuery),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    select: (data) => data?.result ?? [],
  });

  useEffect(() => {
    if (!search.trim()) {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  }, [search]);

  useEffect(() => {
    if (trimmedQuery && isFocused) {
      setOpen(true);
    }
  }, [trimmedQuery, isFocused]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(-1);
        setIsFocused(false);
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
    setIsFocused(false);

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
        setOpen(true);
        return;
      }
      setHighlightedIndex((prev) => {
        if (!suggestions.length) {
          return -1;
        }
        return Math.min(prev + 1, suggestions.length - 1);
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
    <div
      ref={containerRef}
      className="relative w-full md:order-3 md:mx-3 md:max-w-xl lg:max-w-2xl"
    >
      <form
        action="/search"
        className="search flex w-full items-center rounded-xl border border-gray-200 bg-white text-black shadow-sm transition focus-within:border-eximblue-400 focus-within:shadow-md"
      >
        <select
          onChange={(e) => setSelected(e.target.value)}
          value={selected}
          className="hidden h-11 w-32 shrink-0 rounded-l-xl border-r border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-600 lg:block"
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
          className="w-full rounded-l-xl border-none bg-transparent px-3 py-3 text-sm outline-hidden focus:ring-0 md:px-3.5 md:py-3.5 md:text-base"
          type="search"
          name="q"
          id="search"
          placeholder="Search Eximso.com"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (trimmedQuery) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <div className="rounded-r-xl bg-white md:rounded-r-xl">
          <button className="cursor-pointer rounded-r-xl border-none bg-eximblue-600 px-4 py-3 text-white transition hover:bg-eximblue-700 md:py-[11px] md:px-4 md:text-xl md:rounded-l-none">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <ul className="max-h-80 overflow-y-auto py-2 text-sm text-gray-900">
            {(isLoading || isFetching) && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <li
                    key={`skeleton-${index}`}
                    className="flex w-full items-center gap-3 px-4 py-2"
                  >
                    <div className="h-10 w-10 rounded-md bg-gray-200/80 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded-full bg-gray-200/80 animate-pulse" />
                      <div className="h-3 w-1/2 rounded-full bg-gray-100 animate-pulse" />
                    </div>
                  </li>
                ))}
              </>
            )}

            {!isLoading && !isFetching && suggestions.length === 0 && !isError && (
              <li className="px-4 py-6 text-center text-sm text-gray-500">
                No suggestions found
              </li>
            )}

            {!isLoading && !isFetching && isError && (
              <li className="px-4 py-6 text-center text-sm text-red-500">
                Unable to load suggestions. Please try again.
              </li>
            )}

            {!isLoading &&
              !isFetching &&
              suggestions.map((suggestion, index) => {
                const isHighlighted = index === highlightedIndex;
                const itemClasses = isHighlighted
                  ? "bg-gray-100"
                  : "hover:bg-gray-100";

                if (suggestion.type === "product") {
                  return (
                    <li key={`${suggestion.slug ?? "product"}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left ${itemClasses}`}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {suggestion.thumbnail ? (
                          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={suggestion.thumbnail}
                              alt={suggestion.name || "Product thumbnail"}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-500">
                            {suggestion.name?.[0]?.toUpperCase() ?? "P"}
                          </div>
                        )}
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {suggestion.name}
                          </span>
                          <span className="text-xs text-gray-500">View product</span>
                        </div>
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={`${suggestion.text ?? "text"}-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`w-full px-4 py-3 text-left text-sm text-gray-700 transition ${itemClasses}`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {suggestion.text}
                        </span>
                        <span className="text-xs text-gray-500">
                          Search for this term
                        </span>
                      </div>
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

// hooks/useQueryParamState.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Serializer<T> = {
  parse: (value: string | null) => T;
  serialize: (value: T) => string | null;
};

/**
 * Syncs a piece of state with a URL query‐parameter in Next.js App Router.
 *
 * @param key           The query‐param name, e.g. "page"
 * @param defaultValue  Fallback when the param is absent or invalid
 * @param serializer    How to map between string↔T (defaults to string)
 */
export function useQueryParamState<T>(
  key: string,
  defaultValue: T,
  serializer: Serializer<T> = {
    parse: (v) => (v == null ? defaultValue : (v as unknown as T)),
    serialize: (v) => (v == null ? null : String(v)),
  }
): [T, (newValue: T) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read current param (or default)
  const read = useCallback((): T => {
    try {
      return serializer.parse(searchParams.get(key));
    } catch {
      return defaultValue;
    }
  }, [searchParams, key, serializer, defaultValue]);

  const [value, setValue] = useState<T>(read);

  // Keep React state in sync if the URL changes externally
  useEffect(() => {
    setValue(read());
  }, [read]);

  // Update the URL query param (replace history entry)
  const setParam = useCallback(
    (newValue: T) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      const str = serializer.serialize(newValue);

      if (!str) {
        params.delete(key);
      } else {
        params.set(key, str);
      }

      const newSearch = params.toString();
      router.push(`${pathname}${newSearch ? "?" + newSearch : ""}`, {
        scroll: false,
      });
    },
    [key, pathname, router, searchParams, serializer]
  );

  return [value, setParam];
}

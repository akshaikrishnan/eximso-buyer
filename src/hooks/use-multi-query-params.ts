"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function toCSV(values: string[]) {
  return values.length ? values.join(",") : null; // null removes the param
}

export function useMultiQueryParam(param: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Current values from URL (?param=a,b,c)
  const values = useMemo(() => {
    const raw = searchParams.get(param) || "";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [searchParams, param]);

  const has = useCallback((value: string) => values.includes(value), [values]);

  const toggle = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const set = new Set(values);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      const csv = toCSV(Array.from(set));
      if (csv) next.set(param, csv);
      else next.delete(param);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, values, param]
  );

  const setAll = useCallback(
    (vals: string[]) => {
      const next = new URLSearchParams(searchParams.toString());
      const csv = toCSV(vals);
      if (csv) next.set(param, csv);
      else next.delete(param);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, param]
  );

  return { values, has, toggle, setAll };
}

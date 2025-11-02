"use client";

import { useEffect, useMemo, useState } from "react";

import { homeBentoGrids, type HomeBentoGridKey } from "./bento-grids/directory";
import type { BentoGridContent } from "./bento-grids/types";
import HomePageWidgetsSkeleton from "./homepage-widgets-skeleton";
import { endpoints } from "@/lib/data/endpoints";

interface HomeWidgetResponse {
  widget: HomeBentoGridKey;
  title?: string;
  data?: BentoGridContent;
}

export default function HomePageWidgets() {
  const [widgets, setWidgets] = useState<HomeWidgetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWidgets() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.homepageLayout}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load homepage widgets: ${response.status}`
          );
        }

        const payload = await response.json();
        const items: HomeWidgetResponse[] =
          payload?.result?.layouts ?? payload?.data ?? [];

        console.log(items, "response widgets");

        if (isMounted) {
          setWidgets(items);
        }
      } catch (err) {
        console.error("Unable to load homepage widgets", err);
        if (isMounted) {
          setError(
            "We couldn't load the latest highlights. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWidgets();

    return () => {
      isMounted = false;
    };
  }, []);

  const availableWidgets = useMemo(
    () =>
      Array.isArray(widgets)
        ? widgets.filter((widget) => {
            if (homeBentoGrids[widget.widget]) {
              return true;
            }

            console.warn(`Unknown homepage widget received: ${widget.widget}`);
            return false;
          })
        : [],
    [widgets]
  );

  if (isLoading) {
    return <HomePageWidgetsSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (availableWidgets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {availableWidgets.map((widget, index) => {
        const WidgetComponent = homeBentoGrids[widget.widget];
        const data = widget.data ?? {};

        return (
          <WidgetComponent
            key={`${widget.widget}-${index}`}
            title={widget.title ?? data.title}
            products={data.products}
            banners={data.banners}
          />
        );
      })}
    </div>
  );
}

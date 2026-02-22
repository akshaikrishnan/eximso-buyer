import NewsListing from "@/components/news/news-listing";
import {
  fetchNewsList,
  newsQueryKeys,
  type NewsListParams,
} from "@/lib/api/news";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "News | Eximso",
  description:
    "Latest export, import, and policy insights from Eximso newsroom.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    type: "website",
    title: "News | Eximso",
    description:
      "Latest export, import, and policy insights from Eximso newsroom.",
    url: "/news",
  },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const params: NewsListParams = {
    page: Number(resolvedSearchParams.page ?? 1),
    limit: Number(resolvedSearchParams.limit ?? 5),
    search:
      typeof resolvedSearchParams.search === "string"
        ? resolvedSearchParams.search
        : undefined,
    tag:
      typeof resolvedSearchParams.tag === "string"
        ? resolvedSearchParams.tag
        : undefined,
  };

  const newsData = await fetchNewsList(params).catch(() => ({
    items: [],
    meta: {
      page: params.page ?? 1,
      limit: params.limit ?? 5,
      totalItems: 0,
      totalPages: 1,
    },
  }));

  return <NewsListing searchParams={params} newsData={newsData} />;
}

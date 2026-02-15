import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import NewsDetail from "@/components/news/news-detail";
import { fetchNewsDetail, fetchNewsList, newsQueryKeys, type NewsItem } from "@/lib/api/news";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eximso.com";

async function getAdjacentNews(slug: string) {
  const { items } = await fetchNewsList({ page: 1, limit: 50 }).catch(() => ({ items: [] }));
  const index = items.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return { previousNews: null, nextNews: null };
  }

  return {
    previousNews:
      index > 0
        ? {
            slug: items[index - 1].slug,
            title: items[index - 1].title,
          }
        : null,
    nextNews:
      index < items.length - 1
        ? {
            slug: items[index + 1].slug,
            title: items[index + 1].title,
          }
        : null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const news = await fetchNewsDetail(slug).catch(() => null);
  if (!news) {
    return {
      title: "News not found | Eximso",
      robots: { index: false, follow: false },
    };
  }

  const title = news.seoTitle || `${news.title} | Eximso News`;
  const description = news.seoDescription || news.summary || "Read the latest Eximso news update.";
  const canonical = `${SITE_URL}/news/${news.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: news.publishedAt || news.createdAt,
      tags: news.tags,
      images: news.coverImage ? [news.coverImage] : undefined,
    },
    twitter: {
      card: news.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: news.coverImage ? [news.coverImage] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const queryClient = new QueryClient();
  await queryClient
    .prefetchQuery({
      queryKey: newsQueryKeys.detail(slug),
      queryFn: () => fetchNewsDetail(slug),
    })
    .catch(() => null);

  const news = queryClient.getQueryData<NewsItem | null>(newsQueryKeys.detail(slug));

  if (!news) {
    notFound();
  }

  const { previousNews, nextNews } = await getAdjacentNews(slug);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.seoDescription || news.summary || "",
    datePublished: news.publishedAt || news.createdAt,
    dateModified: news.createdAt,
    author: news.author
      ? {
          "@type": "Person",
          name: news.author,
        }
      : undefined,
    image: news.coverImage ? [news.coverImage] : undefined,
    keywords: news.tags?.join(","),
    mainEntityOfPage: `${SITE_URL}/news/${news.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Eximso",
    },
  };

  return (
    <>
      <Script id="news-article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <Script
        id="news-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "News",
                item: `${SITE_URL}/news`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: news.title,
                item: `${SITE_URL}/news/${news.slug}`,
              },
            ],
          }),
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NewsDetail slug={slug} previousNews={previousNews} nextNews={nextNews} />
      </HydrationBoundary>
    </>
  );
}

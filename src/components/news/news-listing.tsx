"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { fetchNewsList, formatNewsDate, newsQueryKeys, type NewsListParams } from "@/lib/api/news";

interface NewsListingProps {
  searchParams: NewsListParams;
}

function createPageHref(searchParams: NewsListParams, page: number) {
  const query = new URLSearchParams();

  query.set("page", String(page));
  query.set("limit", String(searchParams.limit ?? 6));
  if (searchParams.search) query.set("search", searchParams.search);
  if (searchParams.tag) query.set("tag", searchParams.tag);

  const queryString = query.toString();
  return queryString ? `/news?${queryString}` : "/news";
}

export default function NewsListing({ searchParams }: NewsListingProps) {
  const { data } = useQuery({
    queryKey: newsQueryKeys.list(searchParams),
    queryFn: () => fetchNewsList(searchParams),
  });

  const items = data?.items ?? [];
  const meta = data?.meta;

  const previousPage = meta && meta.page > 1 ? meta.page - 1 : null;
  const nextPage = meta && meta.page < meta.totalPages ? meta.page + 1 : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Eximso Newsroom</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Latest updates on global trade & policy</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Read curated insights, regulatory changes, and practical market intelligence from our editorial team.</p>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((news, index) => (
          <Link
            key={news._id}
            href={`/news/${news.slug}`}
            className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              index === 0 ? "md:col-span-2" : ""
            }`}
          >
            {news.coverImage ? (
              <div className={`relative overflow-hidden ${index === 0 ? "h-72" : "h-52"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={news.coverImage}
                  alt={news.title}
                  loading={index <= 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ) : null}
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{formatNewsDate(news.publishedAt || news.createdAt)}</span>
                {news.author ? <span>• {news.author}</span> : null}
              </div>

              <h2 className="line-clamp-2 text-xl font-semibold text-slate-900">{news.title}</h2>

              {news.summary ? <p className="line-clamp-3 text-sm leading-6 text-slate-600">{news.summary}</p> : null}

              <div className="flex flex-wrap gap-2">
                {(news.tags ?? []).slice(0, 4).map((tag) => (
                  <span key={`${news._id}-${tag}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">No published news found.</div>
      ) : null}

      {meta ? (
        <nav className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6" aria-label="Pagination">
          <Link
            href={previousPage ? createPageHref(searchParams, previousPage) : "#"}
            className={`rounded-xl border px-4 py-2 text-sm font-medium ${
              previousPage ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "pointer-events-none border-slate-200 text-slate-300"
            }`}
          >
            Previous
          </Link>
          <p className="text-sm text-slate-600">
            Page {meta.page} of {meta.totalPages}
          </p>
          <Link
            href={nextPage ? createPageHref(searchParams, nextPage) : "#"}
            className={`rounded-xl border px-4 py-2 text-sm font-medium ${
              nextPage ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "pointer-events-none border-slate-200 text-slate-300"
            }`}
          >
            Next
          </Link>
        </nav>
      ) : null}
    </main>
  );
}

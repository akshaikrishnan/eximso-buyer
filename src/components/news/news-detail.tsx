import Link from "next/link";

import { formatNewsDate, type NewsItem } from "@/lib/api/news";
import styles from "@/components/news/news-detail-content.module.css";

interface AdjacentNews {
  slug: string;
  title: string;
}

interface NewsDetailProps {
  news: NewsItem;
  previousNews: AdjacentNews | null;
  nextNews: AdjacentNews | null;
}

export default function NewsDetail({
  news,
  previousNews,
  nextNews,
}: NewsDetailProps) {
  if (!news) {
    return (
      <main className="mx-auto min-h-[40vh] w-full max-w-5xl px-4 py-12 text-center text-slate-600 sm:px-6 lg:px-8">
        This news article is unavailable.
      </main>
    );
  }

  const typedNews: NewsItem = news;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {typedNews.coverImage ? (
          <div className="h-72 w-full overflow-hidden sm:h-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={typedNews.coverImage}
              alt={typedNews.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        ) : null}

        <div className="space-y-6 p-6 sm:p-10">
          <div className="flex flex-wrap gap-2">
            {(typedNews.tags ?? []).map((tag) => (
              <span
                key={`${typedNews._id}-${tag}`}
                className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {typedNews.title}
          </h1>

          <div className="text-sm text-slate-500">
            {formatNewsDate(typedNews.publishedAt || typedNews.createdAt)}
            {typedNews.author ? ` • ${typedNews.author}` : ""}
          </div>

          {typedNews.summary ? (
            <p className="text-lg leading-8 text-slate-600">
              {typedNews.summary}
            </p>
          ) : null}

          {typedNews.content ? (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: typedNews.content }}
            />
          ) : null}
        </div>
      </article>

      <nav className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <div>
          {previousNews ? (
            <Link
              href={`/news/${previousNews.slug}`}
              className="group block rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Previous
              </p>
              <p className="mt-2 font-medium text-slate-800 group-hover:text-slate-900">
                {previousNews.title}
              </p>
            </Link>
          ) : null}
        </div>
        <div>
          {nextNews ? (
            <Link
              href={`/news/${nextNews.slug}`}
              className="group block rounded-2xl border border-slate-200 p-4 text-right transition hover:border-slate-300 hover:bg-slate-50"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Next
              </p>
              <p className="mt-2 font-medium text-slate-800 group-hover:text-slate-900">
                {nextNews.title}
              </p>
            </Link>
          ) : null}
        </div>
      </nav>
    </main>
  );
}

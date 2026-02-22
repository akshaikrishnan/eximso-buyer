export default function NewsDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Cover Image Skeleton */}
        <div className="h-72 w-full animate-pulse bg-slate-200 sm:h-96" />

        <div className="space-y-6 p-6 sm:p-10">
          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
          </div>

          {/* Title Skeleton */}
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-200 sm:h-12" />

          {/* Date/Author Skeleton */}
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

          {/* Summary Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>

          {/* Content Skeleton */}
          <div className="mt-8 space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </article>

      {/* Navigation Skeleton */}
      <nav className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <div className="h-24 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-50/50" />
        <div className="h-24 w-full animate-pulse rounded-2xl border border-slate-200 bg-slate-50/50" />
      </nav>
    </main>
  );
}

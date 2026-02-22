export default function NewsLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-10 w-3/4 animate-pulse rounded-2xl bg-slate-200 sm:h-12" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-2/3 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Featured Item Skeleton */}
        <div className="md:col-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-72 w-full animate-pulse bg-slate-200" />
          <div className="space-y-4 p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Regular Items Skeletons */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-52 w-full animate-pulse bg-slate-200" />
            <div className="space-y-4 p-6">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination Skeleton */}
      <nav className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
        <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
      </nav>
    </main>
  );
}

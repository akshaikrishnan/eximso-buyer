import React from "react";

const LinePlaceholder = ({ width = "w-full" }: { width?: string }) => (
  <div className={`h-4 rounded-full bg-slate-200/80 ${width}`} />
);

const BlockPlaceholder = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-3xl bg-slate-200/60 ${className}`} />
);

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
        <div className="space-y-8">
          <BlockPlaceholder className="h-[520px] border border-slate-200" />
          <BlockPlaceholder className="h-48 border border-slate-200" />
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-7 w-20 rounded-full bg-slate-200/70" />
              <div className="h-7 w-28 rounded-full bg-slate-200/70" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-10 w-3/4 rounded-full bg-slate-200/80" />
              <LinePlaceholder width="w-full" />
              <LinePlaceholder width="w-10/12" />
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <div className="h-12 w-40 rounded-2xl bg-slate-200" />
              <div className="h-7 w-28 rounded-full bg-red-100/70" />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-100/80 px-4 py-4">
              <div className="h-6 w-40 rounded-full bg-slate-200/80" />
              <div className="h-6 w-24 rounded-full bg-slate-200/80" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="h-12 flex-1 rounded-xl bg-indigo-200/60" />
              <div className="h-12 flex-1 rounded-xl border border-slate-200 bg-white" />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-6 w-24 rounded-full border border-indigo-100 bg-indigo-50/80"
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100/70" />
              <div className="h-6 w-32 rounded-full bg-slate-200/80" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 rounded-2xl border border-slate-100 bg-slate-100/80"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100/70" />
          <div className="h-6 w-64 rounded-full bg-slate-200/80" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <LinePlaceholder width="w-full" />
            <LinePlaceholder width="w-11/12" />
            <LinePlaceholder width="w-10/12" />
            <LinePlaceholder width="w-9/12" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
              >
                <div className="h-5 w-40 rounded-full bg-slate-200/80" />
                <div className="mt-3 space-y-2">
                  <LinePlaceholder width="w-full" />
                  <LinePlaceholder width="w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl space-y-12">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="h-8 w-56 rounded-full bg-slate-200/80" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-60 rounded-2xl bg-slate-100/80" />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="h-8 w-52 rounded-full bg-slate-200/80" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-60 rounded-2xl bg-slate-100/80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;

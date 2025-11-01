"use client";

export function PayuEmiCardSkeleton() {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="h-12 w-12 rounded-2xl bg-slate-200" />
        <div className="flex flex-col gap-2">
          <span className="h-3 w-28 rounded bg-slate-200" />
          <span className="h-5 w-40 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <span className="h-3 w-32 rounded bg-slate-200" />
        <span className="h-3 w-3/4 rounded bg-slate-200" />
      </div>
    </div>
  );
}

// app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function NotFound({ categories }: { categories: any }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="relative min-h-[100dvh] bg-gradient-to-b from-white via-slate-50 to-white text-slate-800">
      {/* Subtle decorative glows */}
      <div className="pointer-events-none absolute inset-0 overflow-x-hidden">
        <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-fuchsia-300/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        {/* Copy + actions */}
        <div className="relative order-2 md:order-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Page not found
          </div>

          <h1 className="leading-tight">
            <span className="block text-7xl font-black tracking-tight md:text-8xl">
              <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                404
              </span>
            </span>
            <span className="mt-2 block text-2xl font-semibold text-slate-700 md:text-3xl">
              We lost this page in the warehouse.
            </span>
          </h1>

          <p className="mt-4 max-w-prose text-slate-600">
            The link might be broken, moved, or never existed. Try searching for
            a product, or explore our top categories below.
          </p>

          {/* Search */}
          <form
            onSubmit={onSearch}
            className="mt-6 flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
            role="search"
            aria-label="Site search"
          >
            <input
              className="w-full rounded-xl bg-transparent px-4 py-3 outline-none placeholder:text-slate-400"
              placeholder="Search products, brands, categories…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search query"
            />
            <button
              className="rounded-xl bg-[#8600f0] px-4 py-3 font-medium text-white transition hover:opacity-90"
              type="submit"
            >
              Search
            </button>
          </form>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              ← Go Home
            </Link>
            <Link
              href="/post-requirements"
              className="rounded-xl border border-violet-300/60 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-800 transition hover:bg-violet-100"
            >
              Post a Requirement
            </Link>
            <Link
              href="/profile/my-orders"
              className="rounded-xl border border-cyan-300/60 bg-cyan-50 px-4 py-2.5 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100"
            >
              Track an Order
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
            >
              Contact Support
            </Link>
          </div>

          {/* Why/What info */}
          <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700">
                ?
              </span>
              <div>
                <p className="font-medium text-slate-800">
                  Why am I seeing this?
                </p>
                <p className="text-sm text-slate-600">
                  The page was moved or the URL has a typo. If you reached here
                  from another page on our site,{" "}
                  <Link
                    href="/contact"
                    className="text-[#8600f0] underline underline-offset-4"
                  >
                    report the broken link
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm">
                💡
              </span>
              <div>
                <p className="font-medium text-slate-800">What can I do?</p>
                <p className="text-sm text-slate-600">
                  Try a search, go back to the homepage, or jump into a category
                  below. You can also{" "}
                  <Link
                    href="/profile/my-orders"
                    className="text-[#8600f0] underline underline-offset-4"
                  >
                    view your orders
                  </Link>{" "}
                  anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Illustration + category grid */}
        <div className="order-1 md:order-2">
          {/* Playful box illustration */}
          <div className="relative mx-auto max-w-md">
            <div className="relative aspect-[4/3] w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="absolute inset-0 rounded-3xl [mask-image:radial-gradient(100%_100%_at_50%_50%,black,transparent)]" />
              <div className="mt-20">
                <div className="mx-auto mt-2 h-28 w-28 animate-bounce rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 p-[2px]">
                  <div className="grid h-full w-full place-items-center rounded-2xl bg-white">
                    <span className="text-4xl">📦</span>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-slate-600">
                  We checked every aisle… still couldn’t find it.
                </p>
              </div>

              <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rotate-12 rounded-xl bg-fuchsia-200/30 blur-xl" />
              <div className="pointer-events-none absolute -right-6 bottom-10 h-20 w-20 -rotate-12 rounded-xl bg-cyan-200/30 blur-xl" />
            </div>
          </div>

          {/* Category shortcuts */}
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Explore Categories
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((c: any) => (
                <Link
                  key={c.name}
                  href={`/products/${c.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
                >
                  <div className="text-lg font-semibold text-slate-800 transition group-hover:translate-x-0.5">
                    {c.name} →
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Browse curated items
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Extra help */}
          <div className="mt-8 rounded-2xl border border-emerald-300/60 bg-emerald-50 p-4 text-emerald-800">
            <p className="text-sm">
              Need a hand? Chat with us or email{" "}
              <a
                className="text-emerald-900 underline underline-offset-4"
                href="mailto:support@eximso.com?subject=404%20Help"
              >
                support@eximso.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Footer mini-nav */}
      <footer className="relative mx-auto w-full max-w-6xl px-6 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <p>© {new Date().getFullYear()} Eximso. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="/policy/privacy-policy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/policy/return-policy" className="hover:underline">
              Returns
            </Link>
            <Link href="/policy/shipping-policy" className="hover:underline">
              Shipping
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

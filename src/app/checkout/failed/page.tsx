// app/payment/failure/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";

type OrderDetails = {
  orderId: string;
  amount: number;
  currency: string;
  items: number;
};

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function PaymentFailurePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const details: OrderDetails = useMemo(() => {
    const get = (k: string) =>
      Array.isArray(searchParams?.[k])
        ? (searchParams?.[k] as string[])[0]
        : (searchParams?.[k] as string | undefined);

    const amount = Number(get("amount")) || 0;
    const currency = (get("currency") || "INR").toUpperCase();
    const items = Number(get("items")) || 1;
    const orderId = get("orderId") || "ORD-FAILED";

    return { orderId, amount, currency, items };
  }, [searchParams]);

  return (
    <main className="mx-auto flex min-h-[80dvh] w-full max-w-3xl flex-col items-center justify-center px-4 py-10">
      {/* Animated failure icon */}
      <div
        className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-rose-50 shadow-inner"
        aria-hidden
      >
        <svg
          className="h-16 w-16 text-rose-600 drop-shadow-sm"
          viewBox="0 0 72 72"
          role="img"
          aria-label="Payment failed"
        >
          <circle
            className="fail-circle"
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="fail-x-a"
            d="M26 26 L46 46"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            className="fail-x-b"
            d="M46 26 L26 46"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h1 className="text-center text-3xl font-semibold tracking-tight text-rose-700">
        Payment Failed
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        We couldn&apos;t process your payment. If funds were deducted,
        they&apos;ll be auto‑refunded.
      </p>

      {/* Order summary card */}
      <section className="mt-8 w-full">
        <div className="rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-rose-600">
                Reference
              </p>
              <p className="mt-0.5 text-lg font-medium text-foreground">
                {details.orderId}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
              Failed
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <dt className="text-xs text-muted-foreground">Amount</dt>
              <dd className="mt-1 text-base font-semibold">
                {formatAmount(details.amount, details.currency)}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <dt className="text-xs text-muted-foreground">Items</dt>
              <dd className="mt-1 text-base font-semibold">{details.items}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <dt className="text-xs text-muted-foreground">Currency</dt>
              <dd className="mt-1 text-base font-semibold">
                {details.currency}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-xs text-muted-foreground">
            You can retry your payment from the orders page or continue
            shopping.
          </p>
        </div>
      </section>

      {/* CTA buttons */}
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href="/checkout"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600/60"
        >
          Go to Cart
        </Link>
        <Link
          href="/"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Subtle shards animation */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="shard shard-a" />
        <div className="shard shard-b" />
        <div className="shard shard-c" />
      </div>

      <style jsx>{`
        .fail-circle {
          stroke-dasharray: 190;
          stroke-dashoffset: 190;
          animation: circle-draw 900ms ease-out forwards;
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.08));
        }
        .fail-x-a,
        .fail-x-b {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: x-draw 650ms 420ms ease-out forwards;
        }
        @keyframes circle-draw {
          from {
            stroke-dashoffset: 190;
            transform: scale(0.95);
          }
          60% {
            transform: scale(1.02);
          }
          to {
            stroke-dashoffset: 0;
            transform: scale(1);
          }
        }
        @keyframes x-draw {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .shard {
          position: absolute;
          top: -20vh;
          width: 6px;
          height: 16px;
          opacity: 0.9;
          border-radius: 2px;
        }
        .shard-a {
          left: 20%;
          background: #fb7185;
          animation: fall 3.2s ease-in forwards;
        }
        .shard-b {
          left: 52%;
          background: #fca5a5;
          animation: fall 3.6s ease-in forwards;
        }
        .shard-c {
          left: 80%;
          background: #f59e0b;
          animation: fall 3.8s ease-in forwards;
        }
        @keyframes fall {
          0% {
            transform: translateY(-20vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(540deg);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}

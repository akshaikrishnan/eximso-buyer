// app/payment/success/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";

// If you're on Next.js 13/14 App Router, this file lives under /app.
// TailwindCSS required. Animation uses scoped CSS (no extra deps).

// Type for the order details we render
type OrderDetails = {
  orderId: string;
  amount: number;
  currency: string;
  items: number;
};

// Utility to format currency nicely
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

export default function PaymentSuccessPage({
  // Next.js App Router passes query via searchParams in Page component props
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
    const orderId = get("orderId") || "ORD-XXXX-XXXX";

    return { orderId, amount, currency, items };
  }, [searchParams]);

  return (
    <main className="mx-auto flex min-h-[80dvh] w-full max-w-3xl flex-col items-center justify-center px-4 py-10">
      {/* Animated success icon */}
      <div
        className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50 shadow-inner"
        aria-hidden
      >
        <svg
          className="h-16 w-16 text-emerald-600 drop-shadow-sm"
          viewBox="0 0 72 72"
          role="img"
          aria-label="Payment successful"
        >
          <circle
            className="success-circle"
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="success-check"
            d="M22 38 l10 10 L50 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="text-center text-3xl font-semibold tracking-tight text-emerald-700">
        Payment Successful
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Thanks for your purchase! Your order has been placed and is being
        processed.
      </p>

      {/* Order summary card */}
      <section className="mt-8 w-full">
        <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-600">
                Order Number
              </p>
              <p className="mt-0.5 text-lg font-medium text-foreground">
                {details.orderId}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Paid
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
            A confirmation email with your order details has been sent to your
            inbox.
          </p>
        </div>
      </section>

      {/* CTA buttons */}
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href="/account/orders"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-eximblue-600 px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60"
        >
          Go to Orders
        </Link>
        <Link
          href="/"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Optional: little confetti trails on mount */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="confetti confetti-a" />
        <div className="confetti confetti-b" />
        <div className="confetti confetti-c" />
      </div>

      {/* Scoped animation styles */}
      <style jsx>{`
        /* Draw circle perimeter */
        .success-circle {
          stroke-dasharray: 190;
          stroke-dashoffset: 190;
          animation: circle-draw 900ms ease-out forwards;
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.08));
        }
        /* Draw check */
        .success-check {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: check-draw 700ms 400ms ease-out forwards;
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
        @keyframes check-draw {
          from {
            stroke-dashoffset: 80;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Minimal confetti (three repeating strips) */
        .confetti {
          position: absolute;
          top: -20vh;
          width: 6px;
          height: 14px;
          opacity: 0.9;
          border-radius: 2px;
        }
        .confetti-a {
          left: 15%;
          background: #34d399;
          animation: fall 3.2s ease-in forwards;
        }
        .confetti-b {
          left: 48%;
          background: #60a5fa;
          animation: fall 3.6s ease-in forwards;
        }
        .confetti-c {
          left: 78%;
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

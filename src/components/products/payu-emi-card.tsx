"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Price } from "../common/price";

interface PayuEmiPlan {
  amount?: number;
  emi_value?: number;
  emiMdrNote?: string | null;
  card_type?: string;
  loanAmount?: number;
  paybackAmount?: number;
  emiBankInterest?: number | string | null;
  bankCharge?: number;
  bankRate?: number | string | null;
  emiAmount?: number;
  emi_interest_paid?: number;
  transactionAmount?: number;
  tenure?: string;
  additionalCost?: string;
}

type PayuEmiResponse = Record<string, Record<string, PayuEmiPlan>>;

interface PayuEmiPlanEntry {
  bankCode: string;
  planCode: string;
  plan: PayuEmiPlan;
}

interface PayuEmiCardProps {
  amount: number;
}

function parseTenure(tenure?: string): number {
  if (!tenure) {
    return Number.MAX_SAFE_INTEGER;
  }

  const match = tenure.match(/(\d+)/);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number.parseInt(match[1] ?? "0", 10) || Number.MAX_SAFE_INTEGER;
}

function normalisePlans(data: PayuEmiResponse | null | undefined): PayuEmiPlanEntry[] {
  if (!data) {
    return [];
  }

  return Object.entries(data).flatMap(([bankCode, plans]) =>
    Object.entries(plans ?? {}).map(([planCode, plan]) => ({
      bankCode,
      planCode,
      plan,
    }))
  );
}

function getPlanDisplayValue(plan: PayuEmiPlan): number | null {
  const candidates = [plan.emi_value, plan.emiAmount, plan.amount].map((value) =>
    typeof value === "string" ? Number.parseFloat(value) : value
  );

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

export default function PayuEmiCard({ amount }: PayuEmiCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PayuEmiResponse | null>(null);

  useEffect(() => {
    if (!amount || amount <= 0) {
      setResponse(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    async function fetchEmiDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const payload = { amount: amount.toString() };
        const { data } = await api.post<PayuEmiResponse>(
          `${endpoints.paymentProviders}/payu/emi`,
          payload,
          {
            signal: controller.signal,
          }
        );

        if (!isActive) {
          return;
        }

        setResponse(data ?? null);
      } catch (err) {
        if (!isActive) {
          return;
        }

        if ((err as any)?.name === "CanceledError") {
          return;
        }

        console.error("Unable to fetch PayU EMI plans", err);
        setError("Unable to load EMI offers at the moment.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchEmiDetails();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [amount]);

  const plans = useMemo(() => {
    const entries = normalisePlans(response);

    return entries.sort((a, b) => {
      const tenureDiff = parseTenure(a.plan.tenure) - parseTenure(b.plan.tenure);
      if (tenureDiff !== 0) {
        return tenureDiff;
      }

      const aValue = getPlanDisplayValue(a.plan) ?? Number.POSITIVE_INFINITY;
      const bValue = getPlanDisplayValue(b.plan) ?? Number.POSITIVE_INFINITY;

      return aValue - bValue;
    });
  }, [response]);

  const groupedPlans = useMemo(() => {
    return plans.reduce<Record<string, PayuEmiPlanEntry[]>>((acc, entry) => {
      if (!acc[entry.bankCode]) {
        acc[entry.bankCode] = [];
      }
      acc[entry.bankCode].push(entry);
      return acc;
    }, {});
  }, [plans]);

  const startingEmi = useMemo(() => {
    let minimum = Number.POSITIVE_INFINITY;

    for (const plan of plans) {
      const value = getPlanDisplayValue(plan.plan);
      if (value !== null && value < minimum) {
        minimum = value;
      }
    }

    return Number.isFinite(minimum) ? minimum : null;
  }, [plans]);

  const hasPlans = plans.length > 0;
  const isDisabled = isLoading || Boolean(error) || !hasPlans;

  if (!amount || amount <= 0) {
    return null;
  }

  return (
    <>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={isDisabled}
          className="w-full text-left"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="overflow-hidden rounded-2xl bg-slate-100 p-1">
                <Image
                  src="/images/common/payu.svg"
                  alt="PayU logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Flexible EMIs via PayU
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {isLoading && <span className="text-sm text-slate-500">Checking offers…</span>}
                  {!isLoading && error && <span className="text-sm text-red-600">EMI offers unavailable</span>}
                  {!isLoading && !error && startingEmi !== null && (
                    <span className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-slate-500">EMI starting from</span>
                      <Price amount={startingEmi} className="text-xl font-semibold text-indigo-600" />
                    </span>
                  )}
                  {!isLoading && !error && startingEmi === null && (
                    <span className="text-sm text-slate-500">EMI details will be available soon</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-1 text-sm font-medium text-indigo-600 sm:items-end">
              <span>
                {isLoading
                  ? "Fetching plans…"
                  : error
                  ? "Unavailable"
                  : hasPlans
                  ? "View EMI plans"
                  : "Coming soon"}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                {isLoading
                  ? ""
                  : hasPlans
                  ? `${plans.length} option${plans.length === 1 ? "" : "s"}`
                  : ""}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Choose a suitable tenure and complete your purchase with instant approval directly on PayU.
          </p>
        </button>
        <p className="mt-4 text-xs text-slate-500">
          PayU independently manages these EMI facilities as a third-party payment partner. Eximso is not a lender and
          assumes no legal responsibility for the financing arrangements offered.
        </p>
        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onClose={setIsModalOpen} className="relative z-50">
        <div className="fixed inset-0 bg-slate-900/40" aria-hidden="true" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-3xl transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl font-semibold text-slate-900">PayU EMI plans</DialogTitle>
                  <p className="mt-1 text-sm text-slate-600">
                    Review the available instalment plans before completing your payment on PayU. Final approval, pricing,
                    and fulfilment are handled by PayU and the issuing bank.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  aria-label="Close"
                >
                  <span aria-hidden>×</span>
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {Object.keys(groupedPlans).length === 0 && (
                  <p className="text-sm text-slate-500">EMI details will be available soon.</p>
                )}

                {Object.entries(groupedPlans)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([bankCode, bankPlans]) => (
                    <div key={bankCode} className="rounded-2xl border border-slate-200">
                      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <h3 className="text-base font-semibold text-slate-900">{bankCode}</h3>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {bankPlans[0]?.plan.card_type ?? "EMI"}
                        </p>
                      </div>
                      <div className="divide-y divide-slate-200">
                        {bankPlans.map(({ planCode, plan }) => {
                          const monthlyEmi = getPlanDisplayValue(plan);
                          const interestAmount = typeof plan.emi_interest_paid === "number" ? plan.emi_interest_paid : null;
                          const tenureLabel = plan.tenure ?? planCode;
                          const parsedInterest =
                            typeof plan.emiBankInterest === "number"
                              ? plan.emiBankInterest
                              : typeof plan.emiBankInterest === "string"
                              ? Number.parseFloat(plan.emiBankInterest)
                              : null;
                          const interestRate =
                            parsedInterest !== null && Number.isFinite(parsedInterest)
                              ? `${parsedInterest.toFixed(2).replace(/\.00$/, "")} %`
                              : plan.emiBankInterest || "As per bank";
                          const additionalCost =
                            plan.additionalCost && Number.parseFloat(plan.additionalCost) > 0
                              ? Number.parseFloat(plan.additionalCost)
                              : null;

                          return (
                            <div key={planCode} className="grid gap-4 px-4 py-4 sm:grid-cols-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{tenureLabel}</p>
                                <p className="text-xs text-slate-500">Plan code: {planCode}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">Monthly EMI</p>
                                {monthlyEmi !== null ? (
                                  <Price amount={monthlyEmi} className="text-base font-semibold text-indigo-600" />
                                ) : (
                                  <p className="text-sm text-slate-500">Will be shared during checkout</p>
                                )}
                                {additionalCost !== null && (
                                  <p className="mt-1 text-xs text-amber-600">
                                    Additional cost: <Price amount={additionalCost} className="font-semibold" />
                                  </p>
                                )}
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">Indicative interest</p>
                                <p className="text-sm font-medium text-slate-700">{interestRate}</p>
                                {interestAmount !== null && (
                                  <p className="text-xs text-slate-500">
                                    Total interest payable: <Price amount={interestAmount} className="font-semibold" />
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>

              <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
                PayU provides these EMI services independently as a third-party facilitator. By proceeding, you acknowledge
                that Eximso neither originates credit nor assumes any legal or financial obligations arising from the EMI
                arrangements. All loan terms, approvals, and repayments remain strictly between you, PayU, and the issuing
                bank.
              </p>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

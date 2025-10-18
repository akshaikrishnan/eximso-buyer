"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

interface TrackingStep {
  status: string;
  date: string;
  description?: string;
}

interface OrderTrackingProps {
  orderId: string;
  status?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  status,
}) => {
  const {
    data: trackingRes,
    isLoading,
    isError,
    error,
  } = useQuery<TrackingStep[]>({
    queryKey: ["tracking", orderId],
    queryFn: async () => {
      const res = await api.get(`${endpoints.tracking}/${orderId}`);
      const trackingHistory = res?.data?.result?.trackingHistory;
      if (!Array.isArray(trackingHistory)) {
        throw new Error("Unexpected response shape");
      }
      // Transform trackingHistory to match TrackingStep interface
      const steps: TrackingStep[] = trackingHistory.map((item: any) => ({
        status: item.status,
        date: new Date(item.datetime).toLocaleString(),
        description: item.message || item.location,
      }));
      return steps;
    },
    enabled: !!orderId,
    retry: (failureCount, err: any) =>
      err?.response?.status && err.response.status >= 400 && err.response.status < 500
        ? false
        : failureCount < 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  if (isLoading) {
    return (
      <div className="mt-6 grow sm:mt-8 lg:mt-0">
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order history</h3>
          <p className="text-gray-500 text-sm">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (isError || !trackingRes) {
    return (
      <div className="mt-6 grow sm:mt-8 lg:mt-0">
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order history</h3>
          <p className="text-gray-500 text-sm">Order processing...</p>
        </div>
      </div>
    );
  }

  const steps = trackingRes;

  return (
    <div className="mt-6 grow sm:mt-8 lg:mt-0">
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order history</h3>

        {steps.length === 0 ? (
          <p className="text-gray-500 text-sm">No tracking information available.</p>
        ) : (
          <ol className="relative ms-3 border-s border-blue-500 dark:border-blue-400">
            {steps.map((step, index) => (
              <li key={index} className="mb-10 ms-6">
                <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 ring-8 ring-blue-100 dark:bg-blue-600 dark:ring-blue-900">
                  <svg className="h-4 w-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                  </svg>
                </span>
                <h4 className="mb-0.5 text-base font-semibold text-blue-900 dark:text-blue-100">{step.date}</h4>
                <p className="text-sm font-normal text-blue-700 dark:text-blue-300">{step.status}</p>
                {step.description && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">{step.description}</p>
                )}
              </li>
            ))}
          </ol>
        )}

        {status && (
          <p className="mt-3 text-sm text-gray-800 dark:text-gray-400">
            Current Status: <span className="font-semibold">{status}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

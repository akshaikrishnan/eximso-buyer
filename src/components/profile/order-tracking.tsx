"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { toast } from '@/hooks/use-toast';

type CancellationReason = 'Ordered by mistake' | 'Item delayed' | 'Found a better price' | 'Changed my mind' | 'Duplicate order' | 'Other';

interface TrackingStep {
  status: string;
  date: string;
  description?: string;
}

interface OrderTrackingProps {
  orderId: string;
  status?: string;
  onStatusChange?: (newStatus: string) => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  status,
  onStatusChange,
}) => {
  const [showCancelDropdown, setShowCancelDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState<CancellationReason | ''>('');
  const [customReason, setCustomReason] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);

  const currentStatus = localStatus || status;

  const cancellationReasons: CancellationReason[] = [
    'Ordered by mistake',
    'Item delayed',
    'Found a better price',
    'Changed my mind',
    'Duplicate order',
    'Other'
  ];

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

  const handleCancelClick = () => {
    setShowCancelDropdown(!showCancelDropdown);
    if (!showCancelDropdown) {
      setSelectedReason('');
      setCustomReason('');
    }
  };

  const handleReasonSelect = (reason: CancellationReason) => {
    setSelectedReason(reason);
    if (reason !== 'Other') {
      setCustomReason('');
    }
  };

  const handleConfirmCancel = async () => {
    setIsConfirming(true);
    let reasonToSend = selectedReason === 'Other' ? customReason : selectedReason;
    reasonToSend = reasonToSend.trim();

    if (!reasonToSend) {
      toast({ title: 'Cancellation reason is required.' });
      setIsConfirming(false);
      return;
    }

    try {
      const response = await api.put(`${endpoints.order}/${orderId}/cancel`, {
        cancellationReason: reasonToSend,
      });

      setLocalStatus('cancelled');

      if (onStatusChange) {
        onStatusChange('cancelled');
      }

      toast({ title: 'Order cancellation request submitted successfully!' });
      setShowCancelDropdown(false);
      setSelectedReason('');
      setCustomReason('');
    } catch (error: any) {
      toast({ title: `Error: ${error.response?.data?.message || error.message}` });
    } finally {
      setIsConfirming(false);
    }
  };

  const isConfirmDisabled = !selectedReason || (selectedReason === 'Other' && !customReason.trim());

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

        {/* Cancel Order Section */}
        <div className="space-y-4">
          <div className="gap-4 sm:flex sm:items-center">
            {currentStatus === 'cancelled' ? (
              <div className="w-full rounded-lg border border-red-200 bg-red-50 px-5 py-3 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-start space-x-2">
                  <svg
                    className="h-5 w-5 text-red-500 dark:text-red-400 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
                        1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 
                        16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">
                      Cancelled
                    </span>
                    <span className="text-xs text-red-700 dark:text-red-400">
                      Refund is processing
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCancelClick}
                className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-hidden focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                {showCancelDropdown ? 'Close Cancel Options' : 'Cancel the order'}
              </button>
            )}
          </div>

          {/* Cancellation Dropdown Panel */}
          {showCancelDropdown && currentStatus !== 'cancelled' && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
              <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Please select a reason for cancellation:
              </h4>

              {/* Reason Selection */}
              <div className="space-y-2">
                {cancellationReasons.map((reason) => (
                  <label key={reason} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => handleReasonSelect(reason)}
                      className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{reason}</span>
                  </label>
                ))}
              </div>

              {/* Custom Reason Input */}
              {selectedReason === 'Other' && (
                <div className="mt-3">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Please specify your reason:
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter your reason for cancellation..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-hidden focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  />
                </div>
              )}

              {/* Confirm Button */}
              {selectedReason && (
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    disabled={isConfirming || isConfirmDisabled}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-hidden focus:ring-4 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    {isConfirming ? (
                      <span className="flex items-center">
                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Confirm Cancellation'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelDropdown(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
"use client";

import { useEffect, useMemo, useState } from "react";

interface CountdownResult {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  label: string;
}

const getTimeParts = (targetTime?: number | null): CountdownResult => {
  if (!targetTime || Number.isNaN(targetTime)) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      label: "Expired",
    };
  }

  const now = Date.now();
  const totalMs = Math.max(targetTime - now, 0);

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const formatSegment = (value: number) => value.toString().padStart(2, "0");
  const segments = [
    days > 0 ? `${days}d` : null,
    `${formatSegment(hours)}h`,
    `${formatSegment(minutes)}m`,
    `${formatSegment(seconds)}s`,
  ].filter(Boolean);

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    expired: totalMs <= 0,
    label: segments.join(" "),
  };
};

export function useCountdown(target?: string | number | Date | null) {
  const targetTime = useMemo(() => {
    if (!target) return null;
    if (target instanceof Date) return target.getTime();
    if (typeof target === "number") return target;

    const parsed = Date.parse(target);
    return Number.isNaN(parsed) ? null : parsed;
  }, [target]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetTime) return;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  return useMemo(() => {
    if (!targetTime) {
      return {
        totalMs: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true,
        label: "Expired",
      } satisfies CountdownResult;
    }

    // Force update when `now` changes.
    void now;

    return getTimeParts(targetTime);
  }, [now, targetTime]);
}

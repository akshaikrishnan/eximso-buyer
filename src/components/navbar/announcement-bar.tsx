// components/AnnouncementBar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { XMarkIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

type Announcement = { text: string; link?: string };
type ApiResponse = Announcement[];

const STORAGE_KEY = "announcement:hidden:v1";
const STORAGE_HASH_KEY = "announcement:hash:v1";
const ROTATE_MS = 6000;

function isInternal(link?: string) {
  return !!link && (link.startsWith("/") || link.startsWith("#"));
}

function hashString(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export default function AnnouncementBar() {
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await api.get<ApiResponse>("/messages/announcement");
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const messages = useMemo<Announcement[]>(
    () => (Array.isArray(data) ? data.filter(Boolean) : []),
    [data]
  );

  const contentHash = useMemo(
    () => hashString(JSON.stringify(messages ?? [])),
    [messages]
  );

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    const savedHash =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_HASH_KEY)
        : null;
    const savedHidden =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY) === "1"
        : false;

    if (savedHash !== contentHash) {
      localStorage.setItem(STORAGE_HASH_KEY, contentHash);
      localStorage.removeItem(STORAGE_KEY);
      setHidden(false);
    } else {
      setHidden(savedHidden);
    }
  }, [contentHash, isLoading]);

  // Rotation + cube animation
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const timerRef = useRef<number | null>(null);
  const rotateEnabled = messages.length > 1;

  useEffect(() => {
    if (!rotateEnabled) return;

    const tick = () => {
      setPhase("out"); // trigger exit animation
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setPhase("in"); // enter animation
      }, 220); // must match exit duration below
    };

    timerRef.current = window.setInterval(tick, ROTATE_MS) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [messages.length, rotateEnabled]);

  if (hidden || isLoading || isError || messages.length === 0) return null;

  const msg = messages[index] ?? messages[0];

  const handleClose = () => {
    setHidden(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="w-full bg-eximblue-700 text-white text-sm"
    >
      <div className="mx-auto px-3">
        {/* Grid keeps text perfectly centered with left icon & right close */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 py-2">
          {/* Left: announcement icon */}
          <div className="flex items-center justify-start pl-0.5">
            <MegaphoneIcon className="h-5 w-5 opacity-90" aria-hidden="true" />
          </div>

          {/* Center: message with 3D cube-flip animation */}
          <div
            className="relative text-center leading-6"
            // perspective for 3D effect
            style={{ perspective: "900px", transformStyle: "preserve-3d" }}
            aria-live="polite"
          >
            <div
              key={index}
              className={`inline-block backface-hidden will-change-transform
                ${phase === "in" ? "cube-in" : "cube-out"}
              `}
            >
              {msg.link ? (
                isInternal(msg.link) ? (
                  <Link
                    href={msg.link}
                    className="hover:underline underline-offset-2 hover:opacity-90"
                  >
                    {msg.text}
                  </Link>
                ) : (
                  <a
                    href={msg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-2 hover:opacity-90"
                  >
                    {msg.text}
                  </a>
                )
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          </div>

          {/* Right: close button */}
          <div className="flex justify-end">
            <button
              aria-label="Close announcement"
              onClick={handleClose}
              className="p-1 rounded-md hover:bg-white/10 focus:outline-hidden focus:ring-2 focus:ring-white/40"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scoped animation styles */}
      <style jsx>{`
        /* Exit: rotates upward like a cube edge + fades out */
        .cube-out {
          animation: cubeOut 220ms ease forwards;
        }
        /* Enter: rotates up from behind + fades in */
        .cube-in {
          animation: cubeIn 260ms ease forwards;
        }

        @keyframes cubeOut {
          0% {
            opacity: 1;
            transform: rotateX(0deg) translateY(0px);
          }
          100% {
            opacity: 0;
            transform: rotateX(-85deg) translateY(-8px);
          }
        }
        @keyframes cubeIn {
          0% {
            opacity: 0;
            transform: rotateX(85deg) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: rotateX(0deg) translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}

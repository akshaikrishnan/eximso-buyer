"use client";
import React, { useEffect, useState } from "react";

export default function UnauthorizedPage() {
  const LOGIN_URL = process.env.NEXT_PUBLIC_SELLER_URL!;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect when countdown hits 0
    if (countdown === 0) {
      window.location.href = LOGIN_URL;
    }

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        {/* Animated SVG Section */}
        <div className="flex justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#521dd3] animate-bounce"
          >
            {/* Shield Background */}
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              className="fill-[#4dadf1]/10"
            />
            {/* Lock Body */}
            <rect x="9" y="11" width="6" height="5" rx="1" fill="#521dd3" />
            {/* Animated Shackle */}
            <path
              d="M10 11V9a2 2 0 1 1 4 0v2"
              className="animate-pulse"
              style={{ transformOrigin: "center" }}
            />
            {/* Slash line (Unauthorized symbol) */}
            <line
              x1="4"
              y1="4"
              x2="20"
              y2="20"
              stroke="#4dadf1"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Information Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500">
            You don't have permission to view this page. You will be redirected
            to the login page to verify your identity.
          </p>
        </div>

        {/* Countdown Indicator */}
        <div className="relative pt-4">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            Redirecting in
          </div>
          <div className="text-5xl font-extrabold text-[#521dd3] my-2">
            {countdown}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <a
            href={LOGIN_URL}
            className="inline-block w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md transition-all duration-200 bg-[#521dd3] hover:bg-[#4116a8] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4dadf1] focus:ring-offset-2"
          >
            Login Now (Skip Wait)
          </a>
          <p className="mt-4 text-xs text-gray-400">
            Security check by Eximso Auth System
          </p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#521dd3]">
        <div
          className="h-full bg-[#4dadf1] transition-all duration-1000 ease-linear"
          style={{ width: `${(countdown / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

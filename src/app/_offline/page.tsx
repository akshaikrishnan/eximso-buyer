import React from "react";

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#1e293b",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: "1.5rem" }}
      >
        <path d="M17 17a5 5 0 0 0-10 0" />
        <line x1="12" y1="3" x2="12" y2="7" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        You are offline
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b" }}>
        Please check your internet connection and try again.
      </p>
    </div>
  );
}

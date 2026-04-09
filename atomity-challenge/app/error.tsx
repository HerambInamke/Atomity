"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      padding: "24px",
      textAlign: "center",
    }}>
      <span style={{ fontSize: "40px" }} aria-hidden>⚠️</span>
      <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--text)" }}>
        Something went wrong
      </h2>
      <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>
        An unexpected error occurred. Try again or refresh the page.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "8px",
          padding: "8px 20px",
          borderRadius: "999px",
          border: "1.5px solid var(--accent)",
          color: "var(--accent-dark)",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          background: "var(--accent-dim)",
        }}
      >
        Try again
      </button>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
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
      <span style={{ fontSize: "48px" }} aria-hidden>404</span>
      <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--text)" }}>
        Page not found
      </h1>
      <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "8px",
          padding: "8px 20px",
          borderRadius: "999px",
          border: "1.5px solid var(--accent)",
          color: "var(--accent-dark)",
          fontSize: "13px",
          fontWeight: 600,
          textDecoration: "none",
          background: "var(--accent-dim)",
        }}
      >
        Back to home
      </Link>
    </main>
  );
}

"use client";

import { motion } from "framer-motion";
import { tokens } from "@/tokens";

function Pulse({ width, height, delay = 0 }: { width: string; height: string; delay?: number }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{
        width,
        height,
        borderRadius: tokens.radius.md,
        background: tokens.colors.border,
        flexShrink: 0,
      }}
    />
  );
}

export function SkeletonChart() {
  const heights = ["120px", "80px", "150px", "60px"];
  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.lg,
        padding: "clamp(16px, 3vw, 28px)",
      }}
    >
      <Pulse width="160px" height="13px" />
      <div style={{ display: "flex", gap: "clamp(8px, 2vw, 16px)", alignItems: "flex-end", marginTop: "24px" }}>
        {heights.map((h, i) => (
          <Pulse key={i} width="100%" height={h} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div
      style={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.lg,
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "10px 14px",
          background: tokens.colors.surface,
          borderBottom: `1px solid ${tokens.colors.border}`,
        }}
      >
        {["140px", "80px", "80px", "80px", "80px", "80px"].map((w, i) => (
          <Pulse key={i} width={w} height="12px" delay={i * 0.05} />
        ))}
      </div>
      {/* rows */}
      {[0, 1, 2, 3].map((row) => (
        <div
          key={row}
          style={{
            display: "flex",
            gap: "16px",
            padding: "10px 14px",
            background: row % 2 === 0 ? tokens.colors.bg : tokens.colors.surface,
            borderBottom: `1px solid ${tokens.colors.border}`,
          }}
        >
          {["140px", "80px", "80px", "80px", "80px", "80px"].map((w, i) => (
            <Pulse key={i} width={w} height="12px" delay={row * 0.08 + i * 0.03} />
          ))}
        </div>
      ))}
    </div>
  );
}

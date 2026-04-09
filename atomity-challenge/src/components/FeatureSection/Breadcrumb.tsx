"use client";

import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";

interface Props {
  path: string[];
  onNavigate: (index: number) => void;
}

export function Breadcrumb({ path, onNavigate }: Props) {
  const crumbs = ["All Clusters", ...path];

  return (
    <nav aria-label="Drill-down navigation" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
      <AnimatePresence mode="popLayout">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          const isClickable = !isLast;

          return (
            <motion.span
              key={crumb}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              {i > 0 && (
                <span style={{ color: tokens.colors.muted, fontSize: "12px" }} aria-hidden>›</span>
              )}
              <button
                onClick={() => isClickable && onNavigate(i - 1)}
                disabled={!isClickable}
                aria-current={isLast ? "page" : undefined}
                style={{
                  background: "none",
                  border: "none",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  cursor: isClickable ? "pointer" : "default",
                  fontSize: "clamp(11px, 1.5vw, 13px)",
                  fontWeight: isLast ? 600 : 400,
                  color: isLast ? tokens.colors.text : tokens.colors.muted,
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (isClickable) {
                    (e.currentTarget as HTMLButtonElement).style.color = tokens.colors.accent;
                    (e.currentTarget as HTMLButtonElement).style.background = tokens.colors.surface;
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = isLast ? tokens.colors.text : tokens.colors.muted;
                  (e.currentTarget as HTMLButtonElement).style.background = "none";
                }}
              >
                {crumb}
              </button>
            </motion.span>
          );
        })}
      </AnimatePresence>
    </nav>
  );
}

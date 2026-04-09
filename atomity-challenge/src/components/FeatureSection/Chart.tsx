"use client";

import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@/tokens";
import { Bar } from "./Bar";

interface BarItem {
  id: string;
  name: string;
  total: number;
}

interface Props {
  items: BarItem[];
  selectedId: string | null;
  level: "cluster" | "namespace" | "pod";
  onSelect: (id: string) => void;
}

export function Chart({ items, selectedId, level, onSelect }: Props) {
  const maxValue = Math.max(...items.map((i) => i.total), 1);
  const isPod = level === "pod";

  return (
    <section
      aria-label={`${level} cost chart`}
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.lg,
        padding: "clamp(16px, 3vw, 28px)",
      }}
    >
      <p style={{ fontSize: "clamp(11px, 1.4vw, 13px)", color: tokens.colors.muted, marginBottom: "20px", margin: "0 0 20px" }}>
        {isPod ? "Pod-level breakdown — no further drill-down" : "Click a bar to drill down"}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={items.map((i) => i.id).join(",")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: "flex",
            gap: "clamp(8px, 2vw, 16px)",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {items.map((item, i) => (
            <Bar
              key={item.id}
              id={item.id}
              label={item.name}
              value={item.total}
              maxValue={maxValue}
              index={i}
              isClickable={!isPod}
              isSelected={selectedId === item.id}
              isDimmed={selectedId !== null && selectedId !== item.id}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

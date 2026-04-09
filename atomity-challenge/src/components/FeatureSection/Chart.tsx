"use client";

import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@/tokens";
import { Bar } from "./Bar";

interface BarItem {
  id: string;
  name: string;
  total: number;
  cpu: number;
  ram: number;
  storage: number;
  network: number;
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
    <section aria-label={`${level} cost chart`} style={{ position: "relative" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={items.map((i) => i.id).join(",")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            gap: "clamp(16px, 4vw, 40px)",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            overflowX: "auto",
            paddingBottom: "4px",
            paddingTop: "8px",
            paddingLeft: "20px",
            paddingRight: "20px",
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
              cpu={item.cpu}
              ram={item.ram}
              storage={item.storage}
              network={item.network}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <p style={{
        margin: "12px 0 0",
        fontSize: "11px",
        color: tokens.colors.muted,
        fontStyle: "italic",
        paddingLeft: "20px",
      }}>
        {isPod ? "Pod-level — no further drill-down" : "Click a bar to drill down"}
      </p>
    </section>
  );
}

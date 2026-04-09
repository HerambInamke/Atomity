"use client";

import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@/tokens";
import { Bar } from "./Bar";
import { AnimatedNumber } from "./AnimatedNumber";

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

const BAR_TRACK_HEIGHT = 200; // must match Bar.tsx BAR_MAX_HEIGHT
const Y_TICKS = [0.25, 0.5, 0.75, 1]; // fractions of maxValue

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
          style={{ display: "flex", alignItems: "flex-end", gap: "0" }}
        >
          {/* Y-axis labels */}
          <div style={{
            position: "relative",
            height: `${BAR_TRACK_HEIGHT}px`,
            width: "48px",
            flexShrink: 0,
            marginBottom: "14px", // align with bar track bottom
          }}>
            {Y_TICKS.map((frac, i) => {
              const tickValue = Math.round(maxValue * frac);
              const bottomPct = frac * 100;
              return (
                <motion.div
                  key={`${tickValue}-${i}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.3, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    bottom: `${bottomPct}%`,
                    right: "8px",
                    transform: "translateY(50%)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: tokens.colors.muted,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  <AnimatedNumber
                    key={tickValue}
                    value={tickValue}
                    prefix="$"
                    delay={i * 0.07 + 0.1}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Bars */}
          <div style={{
            flex: 1,
            display: "flex",
            gap: "clamp(16px, 4vw, 40px)",
            alignItems: "flex-end",
            overflowX: "auto",
            paddingBottom: "4px",
            paddingTop: "8px",
            paddingRight: "8px",
          }}>
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
          </div>
        </motion.div>
      </AnimatePresence>

      <p style={{
        margin: "12px 0 0",
        fontSize: "11px",
        color: tokens.colors.muted,
        fontStyle: "italic",
        paddingLeft: "56px",
      }}>
        {isPod ? "Pod-level — no further drill-down" : "Click a bar to drill down"}
      </p>
    </section>
  );
}

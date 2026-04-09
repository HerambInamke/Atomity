"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import { AnimatedNumber } from "./AnimatedNumber";

interface Props {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  index: number;
  isClickable: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  cpu: number;
  ram: number;
  storage: number;
  network: number;
}

const BAR_MAX_HEIGHT = 200;

const BREAKDOWN = [
  { key: "cpu"     as const, label: "CPU" },
  { key: "ram"     as const, label: "RAM" },
  { key: "storage" as const, label: "Storage" },
  { key: "network" as const, label: "Network" },
];

const pillStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: "75%",
  height: "8px",
  borderRadius: "999px",
  background: "linear-gradient(to right, rgba(255,255,255,0.15), rgba(255,255,255,0.5), rgba(255,255,255,0.15))",
  pointerEvents: "none",
};

export function Bar({
  label, value, maxValue, index, isClickable, isSelected, isDimmed, onClick,
  cpu, ram, storage, network,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const heightPx = Math.max(24, (value / maxValue) * BAR_MAX_HEIGHT);
  const breakdown = { cpu, ram, storage, network };

  return (
    <motion.div
      layout
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        flex: "1 1 0",
        minWidth: "80px",
        maxWidth: "160px",
        cursor: isClickable ? "pointer" : "default",
        position: "relative",
      }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        filter: isDimmed ? "blur(2px)" : "blur(0px)",
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={(e) => { if (isClickable && (e.key === "Enter" || e.key === " ")) onClick(); }}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={isClickable ? `Drill into ${label}, $${value}` : `${label}, $${value}`}
    >
      {/* Value above */}
      <span style={{
        fontSize: "13px",
        color: hovered ? tokens.colors.text : tokens.colors.muted,
        fontVariantNumeric: "tabular-nums",
        fontWeight: hovered ? 700 : 500,
        transition: "color 0.15s",
      }}>
        <AnimatedNumber value={value} prefix="$" />
      </span>

      {/* Track */}
      <div style={{
        width: "100%",
        height: `${BAR_MAX_HEIGHT}px`,
        display: "flex",
        alignItems: "flex-end",
        position: "relative",
      }}>
        {/* Dashed grid lines */}
        {[25, 50, 75].map((pct) => (
          <div key={pct} style={{
            position: "absolute",
            left: "-20px",
            right: "-20px",
            bottom: `${pct}%`,
            borderTop: `1px dashed ${tokens.colors.gridLine}`,
            pointerEvents: "none",
            zIndex: 0,
          }} />
        ))}

        {/* Bar — single solid block */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: heightPx,
            opacity: 1,
            y: hovered ? -4 : 0,
            scale: hovered ? 1.05 : isSelected ? 1.03 : 1,
            filter: hovered ? "brightness(1.05)" : "brightness(1)",
          }}
          transition={{
            height: { delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            opacity: { delay: index * 0.08, duration: 0.3 },
            y: { duration: 0.2, ease: "easeOut" },
            scale: { duration: 0.2, ease: "easeOut" },
            filter: { duration: 0.2 },
          }}
          whileTap={isClickable ? { scale: 1.08 } : {}}
          style={{
            width: "100%",
            borderRadius: "18px",
            background: "linear-gradient(to top, #16a34a, #4ade80)",
            boxShadow: hovered
              ? "0 12px 28px rgba(34,197,94,0.4)"
              : isSelected
              ? "0 10px 30px rgba(34,197,94,0.35)"
              : "0 8px 20px rgba(34,197,94,0.15)",
            transformOrigin: "bottom",
            position: "relative",
            zIndex: 1,
            transition: "box-shadow 0.2s ease",
            overflow: "visible",
          }}
        >
          {/* Pill 1 — closer to top */}
          <motion.div
            animate={{
              opacity: hovered ? 1 : 0,
              y: hovered ? -2 : 2,
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ ...pillStyle, top: "-10px" }}
          />

          {/* Pill 2 — further above */}
          <motion.div
            animate={{
              opacity: hovered ? 0.7 : 0,
              y: hovered ? -2 : 2,
            }}
            transition={{ duration: 0.18, delay: 0.04, ease: "easeOut" }}
            style={{ ...pillStyle, top: "-22px", width: "55%" }}
          />
        </motion.div>
      </div>

      {/* Label */}
      <span style={{
        fontSize: "clamp(12px, 1.4vw, 14px)",
        color: tokens.colors.text,
        fontWeight: 700,
        textAlign: "center",
        wordBreak: "break-word",
        maxWidth: "100%",
        lineHeight: 1.3,
      }}>
        {label}
      </span>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 16px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: tokens.colors.card,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: "14px",
              padding: "14px 16px",
              minWidth: "170px",
              zIndex: 200,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              pointerEvents: "none",
            }}
          >
            <div style={{
              fontSize: "13px",
              fontWeight: 700,
              color: tokens.colors.text,
              marginBottom: "10px",
              paddingBottom: "8px",
              borderBottom: `1px solid ${tokens.colors.border}`,
            }}>
              {label}
            </div>

            {BREAKDOWN.map((seg) => {
              const v = breakdown[seg.key];
              const pct = value > 0 ? Math.round((v / value) * 100) : 0;
              return (
                <div key={seg.key} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                  gap: "12px",
                }}>
                  <span style={{ fontSize: "12px", color: tokens.colors.muted }}>{seg.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: tokens.colors.text, fontVariantNumeric: "tabular-nums" }}>
                      ${v.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: tokens.colors.accentDark,
                      background: tokens.colors.accentDim,
                      padding: "1px 6px",
                      borderRadius: "999px",
                      border: `1px solid ${tokens.colors.accent}`,
                    }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: `1px solid ${tokens.colors.border}`,
            }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: tokens.colors.muted }}>Total</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: tokens.colors.accentDark, fontVariantNumeric: "tabular-nums" }}>
                ${value.toLocaleString()}
              </span>
            </div>

            {/* Arrow */}
            <div style={{
              position: "absolute",
              bottom: "-5px",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: "8px",
              height: "8px",
              background: tokens.colors.card,
              border: `1px solid ${tokens.colors.border}`,
              borderTop: "none",
              borderLeft: "none",
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

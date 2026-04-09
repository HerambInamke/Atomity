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

const BAR_MAX_HEIGHT = 180;
const PILL_1_H = 10;
const PILL_2_H = 10;
const PILL_GAP = 6;
const PILLS_TOTAL = PILL_1_H + PILL_GAP + PILL_2_H + 10;

const BREAKDOWN = [
  { key: "cpu"     as const, label: "CPU" },
  { key: "ram"     as const, label: "RAM" },
  { key: "storage" as const, label: "Storage" },
  { key: "network" as const, label: "Network" },
];

export function Bar({
  label, value, maxValue, index, isClickable, isSelected, isDimmed, onClick,
  cpu, ram, storage, network,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const bodyH = Math.max(40, (value / maxValue) * (BAR_MAX_HEIGHT - PILLS_TOTAL));
  const totalH = bodyH + PILLS_TOTAL;
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
        transition: "color 0.15s, font-weight 0.15s",
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

        {/* Bar group */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: totalH, opacity: 1 }}
          transition={{
            height: { delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            opacity: { delay: index * 0.08, duration: 0.3 },
          }}
          whileHover={isClickable ? { y: -4, scale: 1.04, filter: "brightness(1.04)" } : { y: -2 }}
          whileTap={isClickable ? { scale: 1.08 } : {}}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: `${PILL_GAP}px`,
            transformOrigin: "bottom",
            position: "relative",
            zIndex: 1,
            transition: "filter 0.2s ease",
          }}
        >
          {/* Pill 1 */}
          <div style={{
            width: "75%",
            height: `${PILL_1_H}px`,
            borderRadius: "999px",
            background: tokens.colors.accent,
            flexShrink: 0,
          }} />
          {/* Pill 2 */}
          <div style={{
            width: "88%",
            height: `${PILL_2_H}px`,
            borderRadius: "999px",
            background: tokens.colors.accent,
            flexShrink: 0,
          }} />
          {/* Main body */}
          <div style={{
            width: "100%",
            height: `${bodyH}px`,
            borderRadius: "16px",
            background: tokens.colors.accent,
            boxShadow: hovered
              ? "0 12px 28px rgba(34,197,94,0.35)"
              : isSelected
              ? tokens.shadow.barSelected
              : tokens.shadow.bar,
            flexShrink: 0,
            transition: "box-shadow 0.25s ease",
          }} />
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

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 12px)",
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
            {/* Header */}
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

            {/* Rows */}
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
                    <span style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: tokens.colors.text,
                      fontVariantNumeric: "tabular-nums",
                    }}>
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

            {/* Total */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: `1px solid ${tokens.colors.border}`,
            }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: tokens.colors.muted }}>Total</span>
              <span style={{
                fontSize: "13px",
                fontWeight: 700,
                color: tokens.colors.accentDark,
                fontVariantNumeric: "tabular-nums",
              }}>
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

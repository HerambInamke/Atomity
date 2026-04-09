"use client";

import { motion } from "framer-motion";
import { tokens } from "@/tokens";
import { barVariants } from "@/utils/animation";
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
}

const BAR_MAX_HEIGHT = 180;

export function Bar({ label, value, maxValue, index, isClickable, isSelected, isDimmed, onClick }: Props) {
  const heightPx = Math.max(8, (value / maxValue) * BAR_MAX_HEIGHT);

  return (
    <motion.div
      layout
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        flex: "1 1 0",
        minWidth: "48px",
        maxWidth: "120px",
        cursor: isClickable ? "pointer" : "default",
        opacity: isDimmed ? 0.3 : 1,
        filter: isDimmed ? "blur(1px)" : "none",
        transition: "opacity 0.25s, filter 0.25s",
      }}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={(e) => { if (isClickable && (e.key === "Enter" || e.key === " ")) onClick(); }}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={isClickable ? `Drill into ${label}` : label}
      whileHover={isClickable ? { scale: 1.04 } : {}}
      whileTap={isClickable ? { scale: 0.97 } : {}}
    >
      {/* Value label */}
      <span style={{ fontSize: "clamp(10px, 1.2vw, 12px)", color: tokens.colors.muted, fontVariantNumeric: "tabular-nums" }}>
        <AnimatedNumber value={value} prefix="$" />
      </span>

      {/* Bar track */}
      <div
        style={{
          width: "100%",
          height: `${BAR_MAX_HEIGHT}px`,
          display: "flex",
          alignItems: "flex-end",
          borderRadius: tokens.radius.md,
          background: tokens.colors.surface,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          custom={index}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            width: "100%",
            height: `${heightPx}px`,
            borderRadius: tokens.radius.md,
            background: isSelected
              ? tokens.colors.accent
              : `linear-gradient(180deg, ${tokens.colors.accent} 0%, ${tokens.colors.accentDim} 100%)`,
            transformOrigin: "bottom",
            boxShadow: isSelected ? `0 0 16px ${tokens.colors.accent}55` : "none",
            transition: "box-shadow 0.2s",
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: "clamp(10px, 1.3vw, 12px)",
          color: isSelected ? tokens.colors.accent : tokens.colors.text,
          fontWeight: isSelected ? 600 : 400,
          textAlign: "center",
          wordBreak: "break-word",
          maxWidth: "100%",
          transition: "color 0.2s",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

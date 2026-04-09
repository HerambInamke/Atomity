"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { tokens } from "@/tokens";

export function Cursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Spring-follow for smooth lag
  const x = useSpring(rawX, { stiffness: 500, damping: 40 });
  const y = useSpring(rawY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX - 6);
      rawY.set(e.clientY - 6);
      setVisible(true);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[role='button'], button, a")) setHovered(true);
    };
    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[role='button'], button, a")) setHovered(false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [rawX, rawY]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x,
        y,
        width: hovered ? "20px" : "12px",
        height: hovered ? "20px" : "12px",
        borderRadius: "50%",
        background: hovered ? tokens.colors.accent : tokens.colors.muted,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
        transition: "width 0.2s, height 0.2s, background 0.2s",
      }}
    />
  );
}

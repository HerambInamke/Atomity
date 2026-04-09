"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number; // stagger delay in seconds
}

export function AnimatedNumber({ value, prefix = "", suffix = "", className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Always count from 0 on first mount or when value resets context (drill-down)
    const from = prevRef.current ?? 0;
    prevRef.current = value;

    const controls = animate(from, value, {
      duration: 0.75,
      delay,
      ease: [0.16, 1, 0.3, 1], // fast start, slight overshoot feel
      onUpdate(v) {
        el.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, prefix, suffix, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
}

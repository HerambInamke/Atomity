"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({ value, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = prevRef.current;
    prevRef.current = value;

    const controls = animate(from, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
}

import type { Variants } from "framer-motion";

export const barVariants: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
  exit: { scaleY: 0, opacity: 0, transition: { duration: 0.2 } },
};

export const tableRowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

export const spring = { type: "spring", stiffness: 300, damping: 30 } as const;

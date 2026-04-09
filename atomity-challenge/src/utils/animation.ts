export const barVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: { scaleY: 0, opacity: 0, transition: { duration: 0.2 } },
};

export const tableRowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" },
  }),
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export const spring = { type: "spring", stiffness: 300, damping: 30 } as const;

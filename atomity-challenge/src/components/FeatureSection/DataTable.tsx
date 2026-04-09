"use client";

import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import { tableRowVariants } from "@/utils/animation";
import { AnimatedNumber } from "./AnimatedNumber";

interface Row {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  total: number;
}

interface Props {
  rows: Row[];
  level: "cluster" | "namespace" | "pod";
}

const cols: { key: keyof Row; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "cpu", label: "CPU ($)" },
  { key: "ram", label: "RAM ($)" },
  { key: "storage", label: "Storage ($)" },
  { key: "network", label: "Network ($)" },
  { key: "total", label: "Total ($)" },
];

const cellStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: "clamp(11px, 1.3vw, 13px)",
  borderBottom: `1px solid ${tokens.colors.border}`,
  whiteSpace: "nowrap",
  color: tokens.colors.text,
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  color: tokens.colors.muted,
  fontWeight: 600,
  fontSize: "clamp(10px, 1.2vw, 12px)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  background: tokens.colors.surface,
};

export function DataTable({ rows, level }: Props) {
  return (
    <section
      aria-label={`${level} cost table`}
      style={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.lg,
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.key} scope="col" style={headerStyle}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={rows.map((r) => r.id).join(",")}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  custom={i}
                  variants={tableRowVariants}
                  style={{ background: i % 2 === 0 ? tokens.colors.bg : tokens.colors.surface }}
                >
                  {cols.map((c) => (
                    <td key={c.key} style={cellStyle}>
                      {c.key === "name" ? (
                        row.name
                      ) : (
                        <AnimatedNumber value={row[c.key] as number} />
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>
    </section>
  );
}

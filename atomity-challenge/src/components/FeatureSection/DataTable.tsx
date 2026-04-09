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

// Derive GPU and Efficiency from existing data deterministically
function gpu(row: Row) { return Math.round(row.total * 0.08); }
function efficiency(row: Row) {
  const score = Math.min(99, Math.round(70 + (row.cpu / (row.total || 1)) * 40));
  return score;
}

const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: "11px",
  fontWeight: 700,
  color: tokens.colors.muted,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  background: tokens.colors.surface,
  borderBottom: `1px solid ${tokens.colors.border}`,
  whiteSpace: "nowrap",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "11px 16px",
  fontSize: "clamp(11px, 1.3vw, 13px)",
  borderBottom: `1px solid ${tokens.colors.border}`,
  whiteSpace: "nowrap",
  color: tokens.colors.textSecondary,
};

const tdTotalStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 700,
  color: tokens.colors.text,
};

export function DataTable({ rows, level }: Props) {
  return (
    <section aria-label={`${level} cost table`} style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
        <thead>
          <tr>
            {["Name", "CPU", "RAM", "Storage", "Network", "GPU", "Efficiency", "Total"].map((h) => (
              <th key={h} scope="col" style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <AnimatePresence mode="wait">
          <motion.tbody key={rows.map((r) => r.id).join(",")}>
            {rows.map((row, i) => (
              <motion.tr
                key={row.id}
                custom={i}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ background: i % 2 === 0 ? tokens.colors.card : tokens.colors.surface }}              >
                <td style={{ ...tdStyle, fontWeight: 600, color: tokens.colors.text }}>{row.name}</td>
                <td style={tdStyle}><AnimatedNumber value={row.cpu} prefix="$" delay={i * 0.04} /></td>
                <td style={tdStyle}><AnimatedNumber value={row.ram} prefix="$" delay={i * 0.04 + 0.05} /></td>
                <td style={tdStyle}><AnimatedNumber value={row.storage} prefix="$" delay={i * 0.04 + 0.1} /></td>
                <td style={tdStyle}><AnimatedNumber value={row.network} prefix="$" delay={i * 0.04 + 0.15} /></td>
                <td style={tdStyle}><AnimatedNumber value={gpu(row)} prefix="$" delay={i * 0.04 + 0.2} /></td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "40px",
                      height: "4px",
                      borderRadius: "2px",
                      background: tokens.colors.border,
                      overflow: "hidden",
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${efficiency(row)}%` }}
                        transition={{ delay: i * 0.05 + 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: "100%", background: tokens.colors.accent, borderRadius: "2px" }}
                      />
                    </div>
                    <span style={{ fontSize: "11px", color: tokens.colors.muted }}>{efficiency(row)}%</span>
                  </div>
                </td>
                <td style={tdTotalStyle}><AnimatedNumber value={row.total} prefix="$" delay={i * 0.04 + 0.25} /></td>
              </motion.tr>
            ))}
          </motion.tbody>
        </AnimatePresence>
      </table>
    </section>
  );
}

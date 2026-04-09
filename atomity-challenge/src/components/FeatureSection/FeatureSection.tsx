"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/tokens";
import { useCostData, ClusterData, NamespaceData } from "@/hooks/useCostData";
import { Chart } from "./Chart";
import { DataTable } from "./DataTable";
import { SkeletonChart, SkeletonTable } from "./Skeleton";

type Level = "cluster" | "namespace" | "pod";

export default function FeatureSection() {
  const { data, isLoading, isError, refetch } = useCostData();

  const [level, setLevel] = useState<Level>("cluster");
  const [path, setPath] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { items, dynamicLabel, aggregatedBy } = useMemo(() => {
    if (!data) return { items: [], dynamicLabel: "Cluster", aggregatedBy: "Cluster" };

    if (level === "cluster") {
      return { items: data, dynamicLabel: "Cluster", aggregatedBy: "Cluster" };
    }

    const cluster = data.find((c) => c.id === path[0]) as ClusterData;
    if (!cluster) return { items: [], dynamicLabel: "Cluster", aggregatedBy: "Cluster" };

    if (level === "namespace") {
      return {
        items: cluster.namespaces,
        dynamicLabel: `${cluster.name} — Namespace`,
        aggregatedBy: "Namespace",
      };
    }

    const ns = cluster.namespaces.find((n) => n.id === path[1]) as NamespaceData;
    if (!ns) return { items: [], dynamicLabel: "Cluster", aggregatedBy: "Cluster" };

    return {
      items: ns.pods,
      dynamicLabel: `${cluster.name} — ${ns.name} — Pods`,
      aggregatedBy: "Pod",
    };
  }, [data, level, path]);

  function handleSelect(id: string) {
    setSelectedId(id);
    setTimeout(() => {
      setSelectedId(null);
      if (level === "cluster") { setPath([id]); setLevel("namespace"); }
      else if (level === "namespace") { setPath((p) => [p[0], id]); setLevel("pod"); }
    }, 380);
  }

  function handleBack() {
    setSelectedId(null);
    if (level === "pod") { setLevel("namespace"); setPath((p) => [p[0]]); }
    else if (level === "namespace") { setLevel("cluster"); setPath([]); }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px)",
      }}
    >
      {/* White card */}
      <div style={{
        background: tokens.colors.card,
        borderRadius: tokens.radius.xl,
        boxShadow: tokens.shadow.card,
        border: `1px solid ${tokens.colors.border}`,
        overflow: "hidden",
      }}>

        {/* ── Card Header ── */}
        <div style={{
          padding: "clamp(20px, 3vw, 32px) clamp(20px, 3vw, 32px) 0",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
          {/* Top row: time filters left, back button right */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            {/* Single time filter pill */}
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{
                padding: "5px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
                border: `1.5px solid ${tokens.colors.accent}`,
                background: "rgba(74, 222, 128, 0.1)",
                color: tokens.colors.accent,
              }}>
                Last 30 Days
              </span>
            </div>

            {/* Back button */}
            <AnimatePresence>
              {level !== "cluster" && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  onClick={handleBack}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: `1.5px solid ${tokens.colors.border}`,
                    background: "transparent",
                    color: tokens.colors.muted,
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = tokens.colors.accent;
                    (e.currentTarget as HTMLButtonElement).style.color = tokens.colors.accentDark;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = tokens.colors.border;
                    (e.currentTarget as HTMLButtonElement).style.color = tokens.colors.muted;
                  }}
                >
                  ← Back
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic center label */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <AnimatePresence mode="wait">
              <motion.h2
                key={dynamicLabel}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  margin: 0,
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  fontWeight: 700,
                  color: tokens.colors.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {dynamicLabel}
              </motion.h2>
            </AnimatePresence>

            {/* Aggregated by badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={aggregatedBy}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: `1.5px solid ${tokens.colors.accent}`,
                  background: tokens.colors.accentDim,
                  width: "fit-content",
                }}
              >
                <span style={{ fontSize: "11px", color: tokens.colors.accentDark }}>Aggregated by:</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: tokens.colors.accentDark }}>{aggregatedBy}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Card Body ── */}
        <div style={{ padding: "clamp(16px, 3vw, 28px) clamp(20px, 3vw, 32px) clamp(20px, 3vw, 32px)" }}>

          {/* Loading */}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <SkeletonChart />
              <SkeletonTable />
            </motion.div>
          )}

          {/* Error */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "32px" }} aria-hidden>⚠️</span>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: tokens.colors.text }}>Failed to load cost data</p>
              <p style={{ margin: 0, fontSize: "13px", color: tokens.colors.muted }}>Check your connection and try again.</p>
              <button
                onClick={() => refetch()}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: `1.5px solid ${tokens.colors.accent}`,
                  background: "transparent",
                  color: tokens.colors.accentDark,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Main content */}
          {data && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <Chart items={items} selectedId={selectedId} level={level} onSelect={handleSelect} />
              <div style={{ borderTop: `1px solid ${tokens.colors.border}`, paddingTop: "24px" }}>
                <DataTable rows={items} level={level} />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

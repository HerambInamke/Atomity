"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { tokens } from "@/tokens";
import { useCostData, ClusterData, NamespaceData } from "@/hooks/useCostData";
import { Chart } from "./Chart";
import { DataTable } from "./DataTable";
import { Breadcrumb } from "./Breadcrumb";
import { SkeletonChart, SkeletonTable } from "./Skeleton";

type Level = "cluster" | "namespace" | "pod";

export default function FeatureSection() {
  const { data, isLoading, isError, refetch } = useCostData();

  const [level, setLevel] = useState<Level>("cluster");
  const [path, setPath] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { items, breadcrumbLabels } = useMemo(() => {
    if (!data) return { items: [], breadcrumbLabels: [] };

    if (level === "cluster") return { items: data, breadcrumbLabels: [] };

    const cluster = data.find((c) => c.id === path[0]) as ClusterData;
    if (!cluster) return { items: [], breadcrumbLabels: [] };

    if (level === "namespace") {
      return { items: cluster.namespaces, breadcrumbLabels: [cluster.name] };
    }

    const ns = cluster.namespaces.find((n) => n.id === path[1]) as NamespaceData;
    if (!ns) return { items: [], breadcrumbLabels: [] };

    return { items: ns.pods, breadcrumbLabels: [cluster.name, ns.name] };
  }, [data, level, path]);

  function handleSelect(id: string) {
    setSelectedId(id);
    setTimeout(() => {
      setSelectedId(null);
      if (level === "cluster") {
        setPath([id]);
        setLevel("namespace");
      } else if (level === "namespace") {
        setPath((p) => [p[0], id]);
        setLevel("pod");
      }
    }, 350);
  }

  function handleBreadcrumb(index: number) {
    if (index < 0) { setLevel("cluster"); setPath([]); }
    else if (index === 0) { setLevel("namespace"); setPath((p) => [p[0]]); }
    setSelectedId(null);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Cloud cost explorer"
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "clamp(24px, 5vw, 64px) clamp(16px, 4vw, 32px)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "flex", flexDirection: "column", gap: "6px" }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 700,
            color: tokens.colors.text,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Cloud Cost Explorer
        </h2>
        <p style={{ margin: 0, fontSize: "clamp(13px, 1.6vw, 15px)", color: tokens.colors.muted }}>
          Drill down from clusters → namespaces → pods
        </p>
      </motion.div>

      {/* Loading skeleton */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* fake breadcrumb */}
          <div style={{ display: "flex", gap: "8px" }}>
            {["80px", "60px", "60px"].map((w, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                style={{ width: w, height: "20px", borderRadius: "999px", background: tokens.colors.border }}
              />
            ))}
          </div>
          <SkeletonChart />
          <SkeletonTable />
        </motion.div>
      )}

      {/* Error state */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "48px 24px",
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius.lg,
            background: tokens.colors.surface,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "32px" }} aria-hidden>⚠️</span>
          <p style={{ margin: 0, fontSize: "clamp(14px, 2vw, 16px)", color: tokens.colors.text, fontWeight: 600 }}>
            Failed to load cost data
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: tokens.colors.muted }}>
            Check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: `1px solid ${tokens.colors.accent}`,
              background: "transparent",
              color: tokens.colors.accent,
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = tokens.colors.accentDim; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Main content */}
      {data && (
        <>
          <Breadcrumb path={breadcrumbLabels} onNavigate={handleBreadcrumb} />

          {/* Level pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {(["cluster", "namespace", "pod"] as Level[]).map((l) => (
              <motion.span
                key={l}
                layout
                style={{
                  padding: "3px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  background: level === l ? tokens.colors.accent : tokens.colors.surface,
                  color: level === l ? tokens.colors.bg : tokens.colors.muted,
                  border: `1px solid ${level === l ? tokens.colors.accent : tokens.colors.border}`,
                  transition: "all 0.2s",
                }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          <Chart items={items} selectedId={selectedId} level={level} onSelect={handleSelect} />
          <DataTable rows={items} level={level} />
        </>
      )}
    </motion.section>
  );
}

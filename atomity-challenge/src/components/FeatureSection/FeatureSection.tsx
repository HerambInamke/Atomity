"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { tokens } from "@/tokens";
import { useCostData, ClusterData, NamespaceData } from "@/hooks/useCostData";
import { Chart } from "./Chart";
import { DataTable } from "./DataTable";
import { Breadcrumb } from "./Breadcrumb";

type Level = "cluster" | "namespace" | "pod";

export default function FeatureSection() {
  const { data, isLoading, isError } = useCostData();

  const [level, setLevel] = useState<Level>("cluster");
  const [path, setPath] = useState<string[]>([]); // [clusterId, namespaceId]
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { items, breadcrumbLabels } = useMemo(() => {
    if (!data) return { items: [], breadcrumbLabels: [] };

    if (level === "cluster") {
      return { items: data, breadcrumbLabels: [] };
    }

    const cluster = data.find((c) => c.id === path[0]) as ClusterData;
    if (!cluster) return { items: [], breadcrumbLabels: [] };

    if (level === "namespace") {
      return {
        items: cluster.namespaces,
        breadcrumbLabels: [cluster.name],
      };
    }

    const ns = cluster.namespaces.find((n) => n.id === path[1]) as NamespaceData;
    if (!ns) return { items: [], breadcrumbLabels: [] };

    return {
      items: ns.pods,
      breadcrumbLabels: [cluster.name, ns.name],
    };
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
    // index -1 = root, 0 = cluster level, 1 = namespace level
    if (index < 0) {
      setLevel("cluster");
      setPath([]);
    } else if (index === 0) {
      setLevel("namespace");
      setPath((p) => [p[0]]);
    }
    setSelectedId(null);
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0", color: tokens.colors.muted }}>
        Loading cost data...
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0", color: tokens.colors.muted }}>
        Failed to load data. Please refresh.
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 700,
            color: tokens.colors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Cloud Cost Explorer
        </h2>
        <p style={{ margin: 0, fontSize: "clamp(13px, 1.6vw, 15px)", color: tokens.colors.muted }}>
          Drill down from clusters to namespaces to pods
        </p>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb path={breadcrumbLabels} onNavigate={handleBreadcrumb} />

      {/* Level badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {(["cluster", "namespace", "pod"] as Level[]).map((l) => (
          <span
            key={l}
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
          </span>
        ))}
      </div>

      {/* Chart */}
      <Chart
        items={items}
        selectedId={selectedId}
        level={level}
        onSelect={handleSelect}
      />

      {/* Table */}
      <DataTable rows={items} level={level} />
    </motion.section>
  );
}

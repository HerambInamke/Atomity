"use client";

import { useQuery } from "@tanstack/react-query";

export interface CostNode {
  id: string;
  name: string;
  total: number;
  cpu: number;
  ram: number;
  storage: number;
  network: number;
}

export interface PodData extends CostNode {}

export interface NamespaceData extends CostNode {
  pods: PodData[];
}

export interface ClusterData extends CostNode {
  namespaces: NamespaceData[];
}

// Split a total into 4 cost buckets deterministically
function breakdown(total: number, seed: number) {
  const weights = [0.35, 0.30, 0.20, 0.15];
  const jitter = (i: number) => 1 + ((seed * (i + 1) * 7) % 20) / 100 - 0.1;
  const raw = weights.map((w, i) => Math.round(total * w * jitter(i)));
  // Adjust last bucket so sum === total
  const diff = total - raw.slice(0, 3).reduce((a, b) => a + b, 0);
  return { cpu: raw[0], ram: raw[1], storage: raw[2], network: Math.max(0, diff) };
}

const fetchData = async (): Promise<ClusterData[]> => {
  const res = await fetch("https://dummyjson.com/products");
  const json = await res.json();

  return json.products.slice(0, 4).map(
    (p: { price: number; title: string }, i: number) => {
      const clusterTotal = Math.round(p.price * 10);
      const clusterBreakdown = breakdown(clusterTotal, i + 1);

      const namespaces: NamespaceData[] = [1, 2, 3].map((n) => {
        const nsTotal = Math.round(p.price * (n + 1));
        const nsBreakdown = breakdown(nsTotal, i * 10 + n);

        const pods: PodData[] = [1, 2, 3].map((x) => {
          const podTotal = Math.max(1, Math.floor(p.price / (x + 1)));
          const podBreakdown = breakdown(podTotal, i * 100 + n * 10 + x);
          return {
            id: `c${i}-ns${n}-pod${x}`,
            name: `Pod ${x}`,
            total: podTotal,
            ...podBreakdown,
          };
        });

        return {
          id: `c${i}-ns${n}`,
          name: `Namespace ${n}`,
          total: nsTotal,
          ...nsBreakdown,
          pods,
        };
      });

      return {
        id: `c${i}`,
        name: `Cluster ${String.fromCharCode(65 + i)}`,
        total: clusterTotal,
        ...clusterBreakdown,
        namespaces,
      };
    }
  );
};

export const useCostData = () => {
  return useQuery({
    queryKey: ["cost-data"],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
  });
};

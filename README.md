# Atomity Challenge — Cloud Cost Explorer

An interactive, animated cloud cost visualization built with Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, and React Query.

## Live Features

- Drill-down bar chart: Cluster → Namespace → Pod
- Animated bars with hover pill highlights and cost tooltip
- Animated Y-axis labels and count-up numbers throughout
- Skeleton loading states and error UI with retry
- Scroll-triggered section entrance animation
- Custom spring-follow cursor
- Fully responsive layout with `clamp()` typography

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS variables |
| Animation | Framer Motion |
| Data fetching | React Query (`@tanstack/react-query`) |
| Data source | [DummyJSON Products API](https://dummyjson.com/products) |

## Project Structure

```
atomity-challenge/
├── app/
│   ├── globals.css          # CSS variables (token definitions)
│   ├── layout.tsx           # Root layout + React Query provider + Cursor
│   └── page.tsx             # Entry point
└── src/
    ├── tokens/
    │   └── index.ts         # Design token object (references CSS vars)
    ├── hooks/
    │   └── useCostData.ts   # Data fetching + hierarchy transform
    ├── utils/
    │   └── animation.ts     # Shared Framer Motion variants
    └── components/
        ├── Providers.tsx    # QueryClientProvider wrapper
        ├── Cursor.tsx       # Custom spring cursor
        └── FeatureSection/
            ├── FeatureSection.tsx  # Main orchestrator (state, drill logic)
            ├── Chart.tsx           # Bar chart + Y-axis
            ├── Bar.tsx             # Single bar with hover pills + tooltip
            ├── DataTable.tsx       # Cost breakdown table
            ├── AnimatedNumber.tsx  # Count-up number animation
            ├── Breadcrumb.tsx      # Animated drill path
            └── Skeleton.tsx        # Loading placeholders
```

## Data Model

Fetches from `https://dummyjson.com/products` and transforms into:

```
ClusterData[]
  └── NamespaceData[]
        └── PodData[]
```

Each node has: `id`, `name`, `total`, `cpu`, `ram`, `storage`, `network`.
Cost breakdown is derived deterministically from the product price.

## Getting Started

```bash
cd atomity-challenge
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design System

All colors are defined as CSS variables in `globals.css` and referenced through `src/tokens/index.ts`. No raw hex values exist outside those two files.

| Token | Value |
|---|---|
| `--bg` | `#f4f6f8` |
| `--card` | `#ffffff` |
| `--accent` | `#4ade80` |
| `--accent-dark` | `#16a34a` |
| `--muted` | `#9ca3af` |
| `--border` | `#e5e7eb` |

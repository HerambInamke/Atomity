import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Cursor } from "@/components/Cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cloud Cost Explorer",
    template: "%s | Cloud Cost Explorer",
  },
  description: "Interactive drill-down cloud cost visualization. Explore costs by Cluster, Namespace, and Pod with animated charts and breakdowns.",
  keywords: ["cloud cost", "kubernetes", "cost explorer", "dashboard", "visualization"],
  authors: [{ name: "Atomity" }],
  creator: "Atomity",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Cloud Cost Explorer",
    description: "Interactive drill-down cloud cost visualization by Cluster, Namespace, and Pod.",
    siteName: "Cloud Cost Explorer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Cost Explorer",
    description: "Interactive drill-down cloud cost visualization.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4ade80",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <Providers>
          <Cursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}

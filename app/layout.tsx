import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import CaveatBanner from "@/components/CaveatBanner";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "H1 Probe Dashboard",
  description:
    "Interactive results viewer for the H1 hidden-state error-detection probe experiment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fafafa] text-gray-900">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-600" />
              <span className="font-semibold tracking-tight">
                H1 Probe Dashboard
              </span>
            </Link>
            <Nav />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          <div className="mb-6">
            <CaveatBanner tone="info">
              Probe error-scores shown throughout this dashboard are raw,
              uncalibrated model outputs, not probabilities — treat them as a
              relative ranking signal, not a calibrated confidence level.
            </CaveatBanner>
          </div>
          {children}
        </main>
        <footer className="border-t border-gray-200 py-5 text-center text-xs text-gray-400">
          H1 experiment results — static viewer, no live model inference.
        </footer>
      </body>
    </html>
  );
}

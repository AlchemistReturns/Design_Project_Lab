import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import CaveatBanner from "@/components/CaveatBanner";

export const metadata: Metadata = {
  title: "H1 Probe Dashboard",
  description:
    "Interactive results viewer for the H1 hidden-state error-detection probe experiment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
            <Link href="/" className="font-semibold">
              H1 Probe Dashboard
            </Link>
            <nav className="flex gap-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                overview
              </Link>
              <Link href="/layers" className="hover:text-gray-900">
                layer-depth explorer
              </Link>
              <Link href="/chains" className="hover:text-gray-900">
                hop &amp; question explorer
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
          <div className="mb-4">
            <CaveatBanner tone="info">
              Probe error-scores shown throughout this dashboard are raw,
              uncalibrated model outputs, not probabilities — treat them as a
              relative ranking signal, not a calibrated confidence level.
            </CaveatBanner>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}

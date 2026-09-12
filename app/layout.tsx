import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "H1 Probe Dashboard",
  description:
    "Exploring whether a linear probe on hidden-state activations can catch injected factual errors in multi-hop reasoning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#fafafa] font-sans text-gray-900">
        <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
              <span className="font-semibold tracking-tight">
                H1 Probe Dashboard
              </span>
            </Link>
            <Nav />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 py-5 text-center text-xs text-gray-400">
          H1 · hidden-state error-localization probe
        </footer>
      </body>
    </html>
  );
}

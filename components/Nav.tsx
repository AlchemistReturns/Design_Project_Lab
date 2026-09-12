"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/layers", label: "Layer-Depth Explorer" },
  { href: "/chains", label: "Hop & Question Explorer" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 text-sm">
      {LINKS.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              active
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

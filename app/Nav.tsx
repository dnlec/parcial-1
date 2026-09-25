"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/actors", label: "Actors" },
  { href: "/actors/new", label: "Create actor" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="max-w-3xl mx-auto flex gap-6 px-6 py-4">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={active ? "font-semibold" : "text-gray-600 hover:underline"}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

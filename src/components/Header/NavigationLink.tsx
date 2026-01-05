"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationLink() {
  const pathname = usePathname();
  // Define the nav items
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/people", label: "People" },
    { href: "/people/new", label: "Add Person" },
  ];

  return (
    <div className="flex items-center justify-center gap-1">
      {navItems.map((item, idx) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={idx}
            href={item.href}
            className={cn(
              "hover:bg-background/5 text-background font-bodoni px-4 py-2.5 text-sm text-nowrap capitalize transition-colors duration-300 ease-in",
              isActive ? "bg-background/5" : "",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

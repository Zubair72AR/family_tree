"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationLinkProps = {
  role: string;
};

export default function NavigationLink({ role }: NavigationLinkProps) {
  const pathname = usePathname();
  // Define the nav items
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/people", label: "People" },
    { href: "/people/new", label: "Add Person" },
    { href: "/admin/new-user", label: "share" },
  ];

  return (
    <div className="flex items-center justify-center gap-1">
      {navItems.map((item, idx) => {
        if (item.href === "/people/new" && role === "viewer") return null;
        if (item.href === "/admin/new-user" && role !== "admin") return null;
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

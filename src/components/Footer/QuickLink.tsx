"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QuickLink() {
  const pathname = usePathname();
  // Define the nav items
  const navItems = [
    { key: "reviews", href: "/reviews", label: "Reviews" },
    { key: "privacy-policy", href: "/privacy-policy", label: "Privacy Policy" },
    {
      key: "terms-and-conditions",
      href: "/terms-and-conditions",
      label: "Terms & Conditions",
    },
    { key: "faqs", href: "/faqs", label: "FAQs" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 py-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "hover:text-primary font-bodoni text-sm text-nowrap capitalize",
              isActive ? "text-background" : "text-background/65",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

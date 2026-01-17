import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type ProfileInfoRowProps = {
  label: string; // e.g., "Father:"
  value: string | number | null;
  href?: string; // link for value
  showArrow?: boolean; // default true
  emptyPlaceholder?: string; // default "—"
  className?: string;
  arrowClassName?: string;
};

export default function ProfileInfoRow({
  label,
  value,
  href,
  showArrow = true,
  emptyPlaceholder = "—",
  className,
  arrowClassName,
}: ProfileInfoRowProps) {
  const content =
    value === null || value === "Unknown" ? (
      <span title="No information available" className="text-foreground/30">
        {emptyPlaceholder}
      </span>
    ) : (
      <span className="flex items-center gap-2">
        {value}
        {showArrow && (
          <ArrowUpRight
            className={cn(
              "text-primary size-3 transition-transform duration-150 ease-in group-hover:rotate-45",
              arrowClassName,
            )}
          />
        )}
      </span>
    );

  return href ? (
    <Link
      href={href}
      className={cn(
        "group hover:bg-accent bg-accent/50 hover:text-primary flex justify-between space-x-2 px-2 py-1",
        className,
      )}
    >
      <span className="font-semibold text-nowrap">{label}</span>
      {content}
    </Link>
  ) : (
    <p className={cn("flex justify-between space-x-2 px-2 py-1", className)}>
      <span className="font-semibold text-nowrap">{label}</span>
      {content}
    </p>
  );
}

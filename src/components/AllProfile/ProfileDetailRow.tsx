import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProfileDetailRowProps = {
  label: string;
  value?: string | number | ReactNode | null;
  className?: string;
  fallback?: string;
};

export default function ProfileDetailRow({
  label,
  value,
  className,
  fallback = "—",
}: ProfileDetailRowProps) {
  return (
    <p className={cn("flex justify-between space-x-2 px-2 py-1", className)}>
      <span className="font-semibold text-nowrap">{label}</span>
      <span>{value ?? fallback}</span>
    </p>
  );
}

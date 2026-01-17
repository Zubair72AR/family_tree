import React from "react";
import { cn } from "@/lib/utils";

interface CloseIconProps {
  className?: string;
  crossClassName?: string;
}

export const CloseIcon: React.FC<CloseIconProps> = ({
  className,
  crossClassName,
}) => {
  return (
    <div className={cn("group relative", className)}>
      <span
        className={cn(
          "rotate-45",
          "absolute top-1/2 inline-block h-[2px] -translate-y-1/2 transition-all duration-300 ease-in group-hover:rotate-180 ltr:-translate-x-1/2 rtl:translate-x-1/2",
          crossClassName,
        )}
      />
      <span
        className={cn(
          "-rotate-45",
          "absolute top-1/2 inline-block h-[2px] -translate-y-1/2 transition-all duration-300 ease-in group-hover:-rotate-180 ltr:-translate-x-1/2 rtl:translate-x-1/2",
          crossClassName,
        )}
      />
    </div>
  );
};

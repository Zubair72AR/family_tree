"use client";

import { ReactNode } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  label: string; // Tooltip text
  children: ReactNode; // The element to wrap, e.g., + Add button
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const InfoTooltip = ({
  label,
  children,
  side = "top",
  align = "center",
}: InfoTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

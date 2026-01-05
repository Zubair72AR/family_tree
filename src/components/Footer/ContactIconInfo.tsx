import { cn } from "@/lib/utils";
import { ElementType } from "react";

interface ContactIconInfoProps {
  className?: string;
  text: string;
  head: string;
  textClass?: string;
  headClass?: string;
  iconClass: string;
  circleClass: string;
  Icon: ElementType;
}

export default function ContactIconInfo({
  className,
  text,
  head,
  textClass,
  headClass,
  iconClass,
  circleClass,
  Icon,
}: ContactIconInfoProps) {
  return (
    <div className={cn("flex items-start justify-start gap-4", className)}>
      <div className="relative">
        <Icon className={cn("size-7 stroke-1", iconClass)} />
        <span
          className={cn(
            "absolute top-1/3 left-1/3 size-7 rounded-full opacity-20 rtl:-left-1/3",
            circleClass,
          )}
        ></span>
      </div>
      <div>
        <p className={cn("text-xs text-nowrap opacity-50", textClass)}>
          {text}
        </p>
        <p
          className={cn("text-sm font-medium text-nowrap", headClass)}
          dir="auto"
        >
          {head}
        </p>
      </div>
    </div>
  );
}

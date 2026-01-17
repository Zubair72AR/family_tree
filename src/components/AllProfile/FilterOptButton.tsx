import { cn } from "@/lib/utils";

interface FilterOptBtnProps {
  text: string;
  activeBtn?: boolean;
  onClicked: () => void;
  numCount?: number;
  className?: string;
}
export default function FilterOptBtn({
  text,
  activeBtn,
  onClicked,
  numCount,
  className,
}: FilterOptBtnProps) {
  return (
    <button
      onClick={onClicked}
      className={cn(
        "group transition-color hover:bg-foreground hover:text-background flex items-end justify-center gap-1.5 border px-2 py-1.5 text-xs capitalize duration-100 ease-in",
        activeBtn
          ? "bg-primary text-primary-foreground border-primary/50"
          : "bg-accent text-foreground",
        className,
      )}
    >
      {text}
      {numCount && (
        <span
          className={cn(
            "group-hover:bg-background group-hover:text-foreground grid h-4.5 min-w-4.5 place-items-center rounded-md p-0.5 text-[10px]",
            activeBtn
              ? "text-primary bg-primary-foreground"
              : "bg-foreground/35 text-background",
          )}
        >
          {numCount}
        </span>
      )}
    </button>
  );
}

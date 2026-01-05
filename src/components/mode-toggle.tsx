"use client";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ToggleButtonProps {
  className?: string;
}

export function ModeToggle({ className }: ToggleButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button onClick={toggleTheme} className={cn("cursor-pointer", className)}>
      {theme === "dark" ? (
        <Moon className="size-5.5 stroke-2" />
      ) : (
        <Sun className="size-5.5 stroke-2" />
      )}
    </button>
  );
}

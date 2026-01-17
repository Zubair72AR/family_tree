"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { DropDownProfile } from "@/lib/types";

interface ComboboxProps {
  label: string;
  value: string | null;
  onChange: (val: string | null) => void;
  options: DropDownProfile[];
}

export function Combobox({ label, value, onChange, options }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((o) => o.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "bg-accent text-primary w-full justify-between font-medium",
            !selected && "text-foreground/50",
          )}
        >
          <span>
            {selected ? selected.name : `Select ${label}`}
            {selected?.fatherName && selected.fatherName != "Unknown" && (
              <span className="text-muted-foreground font-normal normal-case">
                {selected.gender === "male"
                  ? ` (S/o ${selected.fatherName})`
                  : ` (D/o ${selected.fatherName})`}
              </span>
            )}
          </span>
          <ChevronsUpDown className="text-foreground/50 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-[300px] p-0 md:min-w-[400px]">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.name}
                  onSelect={() => {
                    onChange(opt.id === value ? null : opt.id);
                    setOpen(false);
                  }}
                >
                  {opt.gender && (
                    <Image
                      src={
                        opt?.photo
                          ? opt?.photo
                          : opt?.gender === "female"
                            ? "/female_profile.svg"
                            : "/male_profile.svg"
                      }
                      alt={opt?.name || "Profile Photo"}
                      width={50}
                      height={50}
                      priority={false}
                      className="aspect-square rounded-lg border object-cover"
                    />
                  )}
                  <span>
                    <span className="text-foreground/65 text-base leading-tight font-semibold">
                      {opt.name}
                    </span>
                    {opt.fatherName && opt.fatherName != "Unknown" && (
                      <span className="text-foreground/65 block text-sm leading-tight font-light">
                        {opt.gender === "male"
                          ? `S/o Mr. ${opt.fatherName}`
                          : `D/o Mr. ${opt.fatherName}`}
                      </span>
                    )}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto stroke-3 text-green-600",
                      value === opt.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

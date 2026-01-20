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
import { AdminLineage } from "@/lib/types";

interface ComboboxProps {
  label: string;
  value: string | null;
  onChange: (val: string | null) => void;
  options: AdminLineage[];
}

export function ComboBoxLineage({
  label,
  value,
  onChange,
  options,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((o) => o.lineage_id === value);

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
            {selected ? selected.lineage_name : `Select ${label}`}
            {selected?.total_profiles && (
              <span className="text-muted-foreground font-normal normal-case">
                {" "}
                ({selected?.total_profiles}{" "}
                {selected?.total_profiles > 1 ? "Members" : "Member"})
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
                  key={opt.lineage_id}
                  value={opt.lineage_name}
                  onSelect={() => {
                    onChange(opt.lineage_id === value ? null : opt.lineage_id);
                    setOpen(false);
                  }}
                >
                  <span>
                    <span className="text-foreground/65 text-base leading-tight font-semibold">
                      {opt.lineage_name}
                    </span>
                    {opt.total_profiles && (
                      <span className="text-muted-foreground font-normal normal-case">
                        {" "}
                        ({opt.total_profiles}{" "}
                        {opt.total_profiles > 1 ? "Members" : "Member"})
                      </span>
                    )}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto stroke-3 text-green-600",
                      value === opt.lineage_id ? "opacity-100" : "opacity-0",
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

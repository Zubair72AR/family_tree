"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

interface DateInputProps {
  value?: string | null; // optional
  onChange: (val: string | null) => void;
}

export function DateInput({ value, onChange }: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );
  const [inputValue, setInputValue] = React.useState(value || "");

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      setDate(parsed);
      onChange(formatDate(parsed));
    } else {
      setDate(undefined);
      onChange(null);
    }
  };

  const handleCalendarSelect = (selected: Date | undefined) => {
    if (selected) {
      setDate(selected);
      const formatted = formatDate(selected);
      setInputValue(formatted);
      onChange(formatted);
    }
    setOpen(false);
  };

  return (
    <div className="relative flex w-full items-center">
      <Input
        placeholder="DD-MM-YYYY"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="flex-1 appearance-none pr-10"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-0 -translate-y-1/2"
          >
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            required={false} // allow empty selection
            selected={date}
            captionLayout="dropdown"
            onSelect={handleCalendarSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

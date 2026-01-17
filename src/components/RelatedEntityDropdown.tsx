"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "./ui/combobox";
import { InfoTooltip } from "./ui/InfoTooltip";
import { toast } from "sonner";

type EntityDropdownProps = {
  label: string;
  fetchItems: () => Promise<any[]>;
  addItem: (name: string) => Promise<void>;
  value: string | null;
  onChange: (val: string) => void;
};

export function EntityDropdown({
  label,
  fetchItems,
  addItem,
  value,
  onChange,
}: EntityDropdownProps) {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");

  // Load items from API
  const loadItems = async () => {
    const data = await fetchItems();
    setItems(data || []);
  };

  // Add new item
  const handleAdd = async () => {
    if (!newItem.trim()) return;

    try {
      await addItem(newItem.trim());
      await loadItems();
      setNewItem("");

      // Notification
      toast.success(`${label} added successfully`, {
        description: `"${newItem}" has been added successfully.`,
      });
    } catch (err: any) {
      console.error(err);

      // If your DB throws duplicate error, you can catch it here
      let msg = "Failed to add item";

      // Detect Postgres unique violation
      if (err?.message?.includes("23505")) {
        msg = `"${newItem}" already exists. Please select it from the list.`;
      } else if (err?.message) {
        msg = err.message;
      }

      toast.error(`Error adding "${label}"`, {
        description: msg,
      });
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Get display name for combobox options
  const getDisplayName = (item: any) =>
    item.name ||
    item.degree ||
    item.branch_name ||
    item.city_name ||
    item.occupation ||
    "Unknown";

  // Map items for Combobox
  const comboboxOptions = items.map((item) => ({
    id: item.id,
    name: getDisplayName(item),
  }));

  return (
    <div className="grid w-full grid-cols-[1fr_auto] gap-2">
      {/* Combobox replaces Select */}
      <Combobox
        label={label}
        value={value}
        onChange={(val) => onChange(val || "")}
        options={comboboxOptions}
      />

      {/* Add new item dialog */}
      <Dialog>
        <InfoTooltip label={`Click to add a new ${label.toLowerCase()}`}>
          <DialogTrigger asChild>
            <Button>+ Add New</Button>
          </DialogTrigger>
        </InfoTooltip>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {label}</DialogTitle>
            <DialogDescription className="text-foreground/70 text-sm leading-5">
              Please enter the name of the "{label.toLowerCase()}" you want to
              add. This will allow you to link it to profiles accurately. Make
              sure the name is correct, as it will be used for filtering and
              sharing related profiles.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Enter ${label.toLowerCase()} name`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

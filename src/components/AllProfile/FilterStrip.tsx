import { Filters } from "@/lib/types";
import FilterOptBtn from "./FilterOptButton";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterStrip({
  filters,
  setFilters,
  displayMap,
  search,
  clearSearch, // new
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  displayMap: Record<string, Record<string, string>>;
  search?: string;
  clearSearch?: () => void;
}) {
  const hasAnyFilter = Object.values(filters).some((arr) => arr.length > 0);

  const removeSingleFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      fathers: [],
      mothers: [],
      cities: [],
      castes: [],
      educations: [],
      professions: [],
      branches: [],
      lifeStatus: [],
    });
    if (clearSearch) clearSearch(); // also clear search
  };

  type filterUIType = {
    fathers: string;
    mothers: string;
    cities: string;
    castes: string;
    educations: string;
    branches: string;
    lifeStatus: string;
  };

  const filterLabels: filterUIType = {
    fathers: "Children of: Mr. ", // UI text
    mothers: "Children of: Miss ",
    cities: "City: ",
    castes: "Caste: ",
    educations: "Education: ",
    branches: "Branch: ",
    lifeStatus: "Life Status: ",
  };

  return (
    <div>
      {(hasAnyFilter || search) && (
        <div className="bg-accent">
          <div className="pad-x mx-auto flex max-w-6xl flex-wrap gap-1 py-1">
            {/* 🔹 Search Filter Button */}
            {search && clearSearch && (
              <button
                onClick={clearSearch}
                className="transition-color hover:bg-foreground hover:text-background bg-background text-foreground flex items-center gap-1 border px-2 py-1.5 text-xs capitalize duration-100 ease-in"
              >
                Search Result: {search}
                <X className="size-4" />
              </button>
            )}

            {/* 🔹 Existing Filters */}
            {Object.entries(filters).map(([key, values]) =>
              values.map((val) => {
                const filterKey = key as keyof filterUIType; // cast to TypeScript key
                const displayVal = displayMap[key]?.[val] || val; // map id → name for father/mother

                return (
                  <button
                    key={`${key}-${val}`}
                    onClick={() =>
                      removeSingleFilter(key as keyof Filters, val)
                    }
                    className={cn(
                      "transition-color hover:bg-foreground hover:text-background bg-background text-foreground items-centers flex cursor-pointer justify-between gap-1 border px-2 py-1.5 text-xs capitalize duration-100 ease-in",
                    )}
                  >
                    {filterLabels[filterKey]}
                    {displayVal}
                    <X className="size-4" />
                  </button>
                );
              }),
            )}
            <FilterOptBtn
              text="Clear All Filters"
              onClicked={clearAllFilters}
              className="bg-destructive border-destructive/50 text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

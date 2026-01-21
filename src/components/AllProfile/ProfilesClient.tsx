"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { Filters, ProfileWithRelatives } from "@/lib/types";
import ProfileCard from "./ProfileCard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import FilterOptBtn from "./FilterOptButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterStrip } from "./FilterStrip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

type SortKey =
  | "featured"
  | "name"
  | "father"
  | "mother"
  | "caste"
  | "education"
  | "profession"
  | "city"
  | "birth"
  | "age"
  | "lineage";

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

export default function ProfilesClient({
  profiles,
  role,
}: {
  profiles: ProfileWithRelatives[];
  role: string;
}) {
  const [filters, setFilters] = useState<Filters>({
    fathers: [],
    mothers: [],
    cities: [],
    castes: [],
    educations: [],
    professions: [],
    branches: [],
    lifeStatus: [],
  });
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage, setProfilesPerPage] = useState(24);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(t);
  }, [search]);

  const PerPage = [12, 24, 36, 48, 96];

  const toTime = useCallback((d: Date | string | null, fallback: number) => {
    if (!d) return fallback;
    const date = d instanceof Date ? d : new Date(d);
    return isNaN(date.getTime()) ? fallback : date.getTime();
  }, []);
  const getAgeMs = useCallback((p: ProfileWithRelatives) => {
    if (!p.date_of_birth) return Infinity;
    const dob = new Date(p.date_of_birth).getTime();
    const endDate = p.date_of_death
      ? new Date(p.date_of_death).getTime()
      : Date.now();
    return endDate - dob;
  }, []);

  const {
    fathers,
    mothers,
    cities,
    castes,
    educations,
    professions,
    branches,
    aliveCount,
    deadCount,
  } = useMemo(() => {
    let alive = 0,
      dead = 0;

    const fatherMap = new Map<string, { name: string; count: number }>();
    const motherMap = new Map<string, { name: string; count: number }>();
    const cityMap = new Map<string, number>();
    const casteMap = new Map<string, number>();
    const educationMap = new Map<string, number>();
    const professionMap = new Map<string, number>();
    const branchMap = new Map<string, number>();

    for (const p of profiles) {
      // Track alive/dead
      p.date_of_death ? dead++ : alive++;

      // Father
      if (p.father_id) {
        const existing = fatherMap.get(p.father_id);
        if (existing) {
          existing.count += 1; // count this child
        } else {
          fatherMap.set(p.father_id, {
            name: p.father_name || "Unknown",
            count: 1, // first child
          });
        }
      }

      // Mother
      if (p.mother_id) {
        const existing = motherMap.get(p.mother_id);
        if (existing) {
          existing.count += 1; // count this child
        } else {
          motherMap.set(p.mother_id, {
            name: p.mother_name || "Unknown",
            count: 1, // first child
          });
        }
      }

      // Other filters
      if (p.place_of_birth_city)
        cityMap.set(
          p.place_of_birth_city,
          (cityMap.get(p.place_of_birth_city) || 0) + 1,
        );
      if (p.caste_name)
        casteMap.set(p.caste_name, (casteMap.get(p.caste_name) || 0) + 1);
      if (p.education_degree)
        educationMap.set(
          p.education_degree,
          (educationMap.get(p.education_degree) || 0) + 1,
        );
      if (p.occupation_name)
        professionMap.set(
          p.occupation_name,
          (professionMap.get(p.occupation_name) || 0) + 1,
        );
      if (p.lineage_branch_name)
        branchMap.set(
          p.lineage_branch_name,
          (branchMap.get(p.lineage_branch_name) || 0) + 1,
        );
    }

    const mapToOptionsWithCount = (
      map: Map<string, { name: string; count: number }>,
    ) =>
      Array.from(map.entries())
        .map(([id, data]) => ({ id, label: data.name, count: data.count }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const mapToOptionsSimple = (map: Map<string, number>) =>
      Array.from(map.entries())
        .map(([id, count]) => ({ id, label: id, count }))
        .sort((a, b) => a.label.localeCompare(b.label));

    return {
      fathers: mapToOptionsWithCount(fatherMap),
      mothers: mapToOptionsWithCount(motherMap),
      cities: mapToOptionsSimple(cityMap),
      castes: mapToOptionsSimple(casteMap),
      educations: mapToOptionsSimple(educationMap),
      professions: mapToOptionsSimple(professionMap),
      branches: mapToOptionsSimple(branchMap),
      aliveCount: alive,
      deadCount: dead,
    };
  }, [profiles]);

  const toggle = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => {
      if (key === "lifeStatus")
        return {
          ...prev,
          lifeStatus:
            prev.lifeStatus[0] === value ? [] : [value as "alive" | "dead"],
        };
      const list = prev[key] as string[];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  }, []);

  const filteredProfiles = useMemo(() => {
    const hasFilters = Object.values(filters).some((f) => f.length);
    if (!hasFilters && !debouncedSearch) return profiles;

    const result: { profile: ProfileWithRelatives; score: number }[] = [];
    for (const p of profiles) {
      let passed = true;
      if (
        filters.fathers.length &&
        !filters.fathers.includes(p.father_id || "")
      )
        passed = false;
      if (
        passed &&
        filters.mothers.length &&
        !filters.mothers.includes(p.mother_id || "")
      )
        passed = false;
      if (
        passed &&
        filters.cities.length &&
        !filters.cities.includes(p.place_of_birth_city || "")
      )
        passed = false;
      if (
        passed &&
        filters.castes.length &&
        !filters.castes.includes(p.caste_name || "")
      )
        passed = false;
      if (
        passed &&
        filters.educations.length &&
        !filters.educations.includes(p.education_degree || "")
      )
        passed = false;
      if (
        passed &&
        filters.professions.length &&
        !filters.professions.includes(p.occupation_name || "")
      )
        passed = false;
      if (
        passed &&
        filters.branches.length &&
        !filters.branches.includes(p.lineage_branch_name || "")
      )
        passed = false;
      if (passed && filters.lifeStatus.length) {
        const alive = p.date_of_death === null;
        if (
          (alive && !filters.lifeStatus.includes("alive")) ||
          (!alive && !filters.lifeStatus.includes("dead"))
        )
          passed = false;
      }

      if (passed && debouncedSearch) {
        const searchText = debouncedSearch.toLowerCase();
        let score = 0;
        if (
          p.name_eng.toLowerCase().includes(searchText) ||
          p.name_native_lang?.toLowerCase().includes(searchText)
        )
          score += 100;
        if (p.spouse_name?.toLowerCase().includes(searchText)) score += 50;
        if (p.father_name?.toLowerCase().includes(searchText)) score += 30;
        if (p.mother_name?.toLowerCase().includes(searchText)) score += 30;
        const otherFields = [
          p.place_of_birth_city,
          p.caste_name,
          p.education_degree,
          p.occupation_name,
          p.lineage_branch_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (otherFields.includes(searchText)) score += 10;
        if (score === 0) passed = false;
        if (passed) result.push({ profile: p, score });
      } else if (passed) result.push({ profile: p, score: 0 });
    }
    result.sort((a, b) => b.score - a.score);
    return result.map((r) => r.profile);
  }, [profiles, filters, debouncedSearch]);

  const sortedProfiles = useMemo(() => {
    if (sortBy === "featured") return filteredProfiles;
    const sorted = [...filteredProfiles];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name_eng.localeCompare(b.name_eng);
        case "father":
          return (a.father_name || "").localeCompare(b.father_name || "");
        case "mother":
          return (a.mother_name || "").localeCompare(b.mother_name || "");
        case "caste":
          return (a.caste_name || "").localeCompare(b.caste_name || "");
        case "education":
          return (a.education_degree || "").localeCompare(
            b.education_degree || "",
          );
        case "profession":
          return (a.occupation_name || "").localeCompare(
            b.occupation_name || "",
          );
        case "lineage":
          return (a.lineage_branch_name || "").localeCompare(
            b.lineage_branch_name || "",
          );
        case "city":
          return (a.place_of_birth_city || "").localeCompare(
            b.place_of_birth_city || "",
          );
        case "birth":
          return (
            toTime(a.date_of_birth, Infinity) -
            toTime(b.date_of_birth, Infinity)
          );
        case "age":
          return getAgeMs(a) - getAgeMs(b);
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredProfiles, sortBy, toTime, getAgeMs]);

  const paginatedProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * profilesPerPage;
    return sortedProfiles.slice(startIndex, startIndex + profilesPerPage);
  }, [sortedProfiles, currentPage, profilesPerPage]);

  const totalPages = Math.ceil(sortedProfiles.length / profilesPerPage);
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => setCurrentPage(1), [filters, debouncedSearch]);

  const renderFilterGroup = useCallback(
    (
      title: string,
      key: keyof Filters,
      options: FilterOption[],
      showClear = true,
    ) => {
      if (options.length <= 1) return null;
      return (
        <FilterGroup title={title}>
          {options.map(({ id, label, count }) => (
            <FilterOptBtn
              key={id}
              text={label}
              activeBtn={(filters[key] as string[]).includes(id)}
              onClicked={() => toggle(key, id)}
              numCount={count}
            />
          ))}
          {showClear && (filters[key] as string[]).length > 0 && (
            <FilterOptBtn
              text="Clear All"
              onClicked={() => setFilters((prev) => ({ ...prev, [key]: [] }))}
              className="bg-destructive border-destructive/50 text-white"
            />
          )}
        </FilterGroup>
      );
    },
    [filters, toggle],
  );

  return (
    <div className="py-8">
      <h1 className="pad-x font-bodoni mx-auto mb-2 max-w-6xl text-3xl">
        All Profiles
      </h1>

      <div className="pad-x mx-auto flex w-full max-w-6xl items-center justify-between gap-2">
        {profiles.length > 3 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="min-w-30">
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filter Profiles By</DialogTitle>
              </DialogHeader>
              {renderFilterGroup("Father Name", "fathers", fathers)}
              {renderFilterGroup("Mother Name", "mothers", mothers)}
              {renderFilterGroup("Caste / Community", "castes", castes)}
              {renderFilterGroup("Birth City", "cities", cities)}
              {renderFilterGroup("Education", "educations", educations)}
              {renderFilterGroup("Profession", "professions", professions)}
              {renderFilterGroup(
                "Family Lineage / Branch",
                "branches",
                branches,
              )}
              <FilterGroup title="Life Status">
                <FilterOptBtn
                  text="Alive"
                  activeBtn={filters.lifeStatus.includes("alive")}
                  onClicked={() => toggle("lifeStatus", "alive")}
                  numCount={aliveCount}
                />
                <FilterOptBtn
                  text="Deceased"
                  activeBtn={filters.lifeStatus.includes("dead")}
                  onClicked={() => toggle("lifeStatus", "dead")}
                  numCount={deadCount}
                />
              </FilterGroup>
            </DialogContent>
          </Dialog>
        )}
        <div className="flex items-center gap-2">
          <p className="text-foreground/65 text-sm">Sort by:</p>
          <Select
            value={sortBy}
            onValueChange={(v) => {
              setSortBy(v as SortKey);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="min-w-30">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="father">Father Name</SelectItem>
              <SelectItem value="mother">Mother Name</SelectItem>
              <SelectItem value="caste">Caste</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="profession">Profession</SelectItem>
              <SelectItem value="lineage">Family Lineage</SelectItem>
              <SelectItem value="city">Birth City</SelectItem>
              <SelectItem value="birth">Birth Date</SelectItem>
              <SelectItem value="age">Young → Old</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative mx-auto my-3 max-w-96">
        <Search className="text-foreground/50 absolute top-1/2 left-2 size-5 -translate-y-1/2" />
        <Input
          placeholder="Search name, father, mother, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8"
        />
      </div>

      <FilterStrip
        filters={filters}
        setFilters={setFilters}
        displayMap={{
          fathers: Object.fromEntries(fathers.map((f) => [f.id, f.label])),
          mothers: Object.fromEntries(mothers.map((f) => [f.id, f.label])),
          cities: Object.fromEntries(cities.map((f) => [f.id, f.label])),
          castes: Object.fromEntries(castes.map((f) => [f.id, f.label])),
          educations: Object.fromEntries(
            educations.map((f) => [f.id, f.label]),
          ),
          professions: Object.fromEntries(
            professions.map((f) => [f.id, f.label]),
          ),
          branches: Object.fromEntries(branches.map((f) => [f.id, f.label])),
          lifeStatus: { alive: "Alive", dead: "Deceased" },
        }}
        search={search}
        clearSearch={() => setSearch("")}
      />

      <div className="pad-x text-foreground/65 mx-auto my-4 max-w-6xl text-center font-semibold">
        Showing{" "}
        {Math.min(
          (currentPage - 1) * profilesPerPage + 1,
          sortedProfiles.length,
        )}
        -{Math.min(currentPage * profilesPerPage, sortedProfiles.length)} of{" "}
        {sortedProfiles.length} profiles
      </div>

      <div className="pad-x mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedProfiles.map((p) => (
          <ProfileCard
            key={p.id}
            id={p.id}
            profile_photo={p.profile_photo}
            name_eng={p.name_eng}
            name_native_lang={p.name_native_lang}
            gender={p.gender}
            caste={p.caste_name || null}
            fatherName={p.father_name || null}
            fatherID={p.father_id || null}
            motherName={p.mother_name || null}
            motherID={p.mother_id || null}
            spouseName={p.spouse_name || null}
            spouseID={p.spouse_id || null}
            numChildren={p.children_count}
            place_of_birth={p.place_of_birth_city || null}
            date_of_birth={p.date_of_birth}
            date_of_death={p.date_of_death}
            education={p.education_degree || null}
            occupation={p.occupation_name || null}
            family_branch={p.lineage_branch_name || null}
            role={role}
          />
        ))}
      </div>

      <div className="mt-6 mb-4 flex items-center justify-center gap-2">
        <span className="text-sm text-nowrap">Profiles Per Page:</span>
        <Select
          value={profilesPerPage.toString()}
          onValueChange={(v) => {
            setProfilesPerPage(Number(v));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="min-w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PerPage.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  currentPage > 1 && handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum =
                totalPages <= 5
                  ? i + 1
                  : currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;
              if (pageNum < 1 || pageNum > totalPages) return null;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  currentPage < totalPages && handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

const FilterGroup = ({ title, children }: any) => (
  <div>
    <Label>{title}</Label>
    <div className="mt-1 flex flex-wrap items-center gap-1">{children}</div>
  </div>
);

"use client";

import { useState } from "react";
import { FamilyHeadDropDOwn, FamilyHeadWithRelatives } from "@/lib/types";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, Loader2, MoveRight, Plus } from "lucide-react";
import { addFamilyHead, removeFamilyHead } from "@/actions/familyHead";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Combobox } from "../ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { CloseIcon } from "../CloseIcon";
import { LoadingButton } from "../loading-button";

type AddFamilyHeadProps = {
  profiles: FamilyHeadDropDOwn[];
  familyHeads: FamilyHeadWithRelatives[];
};

export default function AddFamilyHead({
  profiles,
  familyHeads,
}: AddFamilyHeadProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [proId, setProId] = useState<string | null>(null);
  const router = useRouter();

  // Add Family Head
  async function addHeadHandle(id: string) {
    if (!id) return;
    try {
      setIsSaving(true);
      setSavingId(id);
      await addFamilyHead(id);
      router.refresh();
      toast.info("Family head added", {
        description: "Profile added successfully.",
        action: {
          label: "View",
          onClick: () => (window.location.href = `/people/${id}`),
        },
      });
      setProId(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Error occurred", {
        description: err?.message || "Something went wrong",
      });
    } finally {
      setIsSaving(false);
      setSavingId(null);
    }
  }

  // Remove Family Head with toast confirmation
  async function removeHeadHandle(id: string) {
    try {
      setRemovingId(id);
      await removeFamilyHead(id);
      router.refresh();
      toast.success("Family head removed", {
        description: "Profile removed from family heads.",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Error occurred", {
        description: err?.message || "Something went wrong",
      });
    } finally {
      setRemovingId(null);
    }
  }

  const suggestedHeads = profiles
    .filter((p) => !p.father_id && p.children_count > 0) // root profiles only
    .sort((a, b) => {
      if (a.date_of_birth && b.date_of_birth) {
        return (
          new Date(a.date_of_birth).getTime() -
          new Date(b.date_of_birth).getTime()
        );
      } else {
        return a.name.localeCompare(b.name); // fallback
      }
    });

  return (
    <div className="pad-x mx-auto w-full max-w-6xl py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-bodoni text-3xl">Family Heads</h1>
          <p className="text-foreground/65 text-sm">
            Quickly access and explore family trees through family heads.
          </p>
        </div>

        {familyHeads.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary" disabled={isSaving}>
                <Plus />
                Add Family Head
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Family Head</DialogTitle>
                <DialogDescription>
                  Pick a profile to add as a family head for quick access.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                {/* Combobox Search */}
                <Combobox
                  label="Family Head"
                  value={proId}
                  onChange={setProId}
                  options={profiles.map((p) => ({
                    id: p.id,
                    name: p.name,
                    fatherName: p.fatherName,
                    gender: p.gender,
                    photo: p.photo,
                  }))}
                />

                {/* Confirm Add */}
                <LoadingButton
                  loading={isSaving}
                  onClick={() => proId && addHeadHandle(proId)}
                  className="w-full"
                >
                  <Plus />
                  Add Family Head
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Family Heads Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {familyHeads.length > 0 ? (
          familyHeads.map((head) => (
            <div
              key={head.profile_id}
              className="relative col-span-1 shadow-md dark:shadow-black/100"
            >
              {/* Photo */}
              <Link
                href={`/tree/${head.profile_id}`}
                className="group bg-foreground/10 hover:bg-primary transition-color block h-full border p-1 duration-200 ease-in"
              >
                <div className="relative overflow-hidden">
                  {removingId === head.profile_id && (
                    <div className="bg-foreground/50 text-background absolute inset-0 z-10 flex flex-col items-center justify-center text-sm">
                      <Loader2 className="mb-2 animate-spin" />
                      Removing...
                    </div>
                  )}
                  {/* Dark Overlay */}
                  {removingId !== head.profile_id && (
                    <div className="absolute inset-0 z-20 transition-transform duration-200 ease-in group-hover:bg-black/35" />
                  )}

                  {/* Arrow Icon */}
                  {removingId !== head.profile_id && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <MoveRight className="size-5 text-white" />
                    </div>
                  )}
                  <Image
                    src={
                      head.profile_photo
                        ? head.profile_photo
                        : head.gender === "female"
                          ? "/female_profile.svg"
                          : "/male_profile.svg"
                    }
                    alt={head.name_eng}
                    width={500}
                    height={500}
                    className="bg-background aspect-4/5 object-cover transition-transform duration-200 ease-in group-hover:scale-105"
                  />
                </div>

                <div className="p-1">
                  {/* Name */}
                  <p
                    className={cn(
                      "font-bodoni group-hover:text-primary-foreground transition-color text-lg capitalize duration-200 ease-in [--icon-size:12px]",
                      !head.date_of_death && "verifiedIcon",
                    )}
                  >
                    {head.name_eng}
                  </p>
                  {head.father_name && (
                    <p className="text-foreground/65 transition-color text-xs leading-tight duration-200 ease-in group-hover:text-white">
                      {head.gender === "male" ? "S/o " : "D/o "}
                      {head.father_name}
                    </p>
                  )}
                </div>
              </Link>
              {/* Remove */}
              {removingId !== head.profile_id && (
                <button
                  className="bg-destructive absolute -top-1.5 -left-1.5 z-50 text-white"
                  onClick={() => removeHeadHandle(head.profile_id)}
                >
                  <CloseIcon
                    className="bg-destructive p-3"
                    crossClassName="w-3 bg-white"
                  />
                </button>
              )}
            </div>
          ))
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <div className="hover:bg-accent col-span-full cursor-pointer space-y-6 rounded-2xl border border-dashed px-6 py-20 text-center">
                <div className="space-y-1">
                  <h1 className="font-bodoni text-[26px]">
                    No Family Heads Added Yet
                  </h1>
                  <p className="text-foreground/65 mb-4 text-sm">
                    Add a family head to get quick access to your family trees.
                  </p>
                </div>
                <Button variant="primary">
                  <Plus />
                  Add Family Head
                </Button>
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Family Head</DialogTitle>
                <DialogDescription>
                  Pick a profile to add as a family head for quick access.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                {/* Combobox Search */}
                <Combobox
                  label="Family Head"
                  value={proId}
                  onChange={setProId}
                  options={profiles.map((p) => ({
                    id: p.id,
                    name: p.name,
                    fatherName: p.fatherName,
                    gender: p.gender,
                    photo: p.photo,
                  }))}
                />

                {/* Confirm Add */}
                <LoadingButton
                  loading={isSaving}
                  onClick={() => proId && addHeadHandle(proId)}
                  className="w-full"
                >
                  <Plus />
                  Add Family Head
                </LoadingButton>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {suggestedHeads.length > 0 && (
        <div className="mt-8">
          <p className="font-bodoni mb-2 text-xl">Suggested Family Heads</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
            {suggestedHeads.slice(0, 10).map((p) => (
              <button
                key={p.id}
                onClick={() => addHeadHandle(p.id)}
                className="group border-border/50 hover:bg-primary/75 transition-color relative flex flex-col border p-1 shadow-md duration-200 ease-in dark:shadow-black/100"
                aria-label={`Add ${p.name} as Family Head`}
              >
                <div className="relative overflow-hidden rounded-3xl">
                  {savingId === p.id && (
                    <div className="bg-foreground/50 text-background absolute inset-0 z-10 flex flex-col items-center justify-center text-sm">
                      <Loader2 className="mb-2 animate-spin" />
                      Saving...
                    </div>
                  )}
                  <Image
                    src={p.photo ?? "/male_profile.svg"}
                    alt={p.name}
                    width={250}
                    height={250}
                    className="bg-accent aspect-3/4 rounded-3xl object-cover"
                  />
                </div>

                {savingId !== p.id && (
                  <Plus className="bg-foreground text-background absolute -top-1.5 -right-1.5 z-10 size-5.5 rounded-full stroke-3 p-1 transition-transform duration-200 ease-in group-hover:rotate-180 group-hover:bg-green-500 group-hover:text-white" />
                )}
                {/* Name */}
                <p
                  className={cn(
                    "font-bodoni group-hover:text-primary-foreground transition-color line-clamp-2 p-1 pt-2 text-sm capitalize duration-200 ease-in [--icon-size:12px]",
                    !p.date_of_death && "verifiedIcon",
                  )}
                >
                  {p.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

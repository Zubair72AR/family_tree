"use client";

import Image from "next/image";
import { ProfileWithRelatives } from "@/lib/types";
import DateDisplay from "../AllProfile/DateDisplay";
import { cn } from "@/lib/utils";

interface NodeProfileCardProps {
  profile: ProfileWithRelatives;
  className?: string;
}

export function NodeProfileCard({ profile, className }: NodeProfileCardProps) {
  // Fallbacks
  const nameEng = profile.name_eng || "-";
  const nameNative = profile.name_native_lang || "-";
  const dateOfBirth = profile.date_of_birth || null;
  const dateOfDeath = profile.date_of_death || null;
  const profilePhoto =
    profile.profile_photo ||
    (profile.gender === "female" ? "/female_profile.svg" : "/male_profile.svg");

  return (
    <div className={cn("w-full px-1 py-2", className)}>
      {/* Profile Image */}
      <div
        className={cn(
          "bg-background mx-auto w-[120px] overflow-hidden rounded-full border-3",
          profile.gender === "male"
            ? "border-[#784efd]/50"
            : "border-[#ff277a]/50",
        )}
      >
        <Image
          src={profilePhoto}
          alt={`${nameEng} Profile Photo`}
          width={200}
          height={200}
          priority={false}
          className="aspect-square object-cover transition-transform duration-150 ease-in hover:scale-115"
        />
      </div>

      {/* Profile Details */}
      <div className="my-1 space-y-0.5 text-center">
        {/* Name in English */}
        <p className="font-bodoni text-sm capitalize">{nameEng}</p>

        {/* Name in Native Language */}
        <p className="font-langs text-xs leading-none capitalize opacity-65">
          {nameNative}
        </p>

        {/* Date of Birth / Date of Death */}
        <p className="my-1 text-[10px] opacity-50">
          {dateOfDeath ? (
            `${dateOfBirth ? new Date(dateOfBirth).getFullYear() : "—"} — ${new Date(dateOfDeath).getFullYear()}`
          ) : dateOfBirth ? (
            <span>
              DoB: <DateDisplay date={dateOfBirth} />
            </span>
          ) : (
            "—"
          )}
        </p>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { TreeProfile } from "@/lib/types";
import DateDisplay from "../AllProfile/DateDisplay";
import { cn } from "@/lib/utils";
import ProfileAvatar from "../AllProfile/ProfileAvatar";

interface NodeProfileCardProps {
  profile: TreeProfile;
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
      <ProfileAvatar
        src={profilePhoto}
        alt={`${profile.name_eng} Profile Photo`}
        gender={profile.gender}
        className="mx-auto w-[130px] border-2 bg-white"
      />

      {/* Profile Details */}
      <div className="my-1 space-y-0.5 text-center">
        {/* Name in English */}
        <p
          className={cn(
            "font-bodoni text-sm capitalize",
            profile.date_of_death ? "" : "verifiedIcon [--icon-size:10px]",
          )}
        >
          {nameEng}
        </p>

        {/* Name in Native Language */}
        <p className="font-langs text-xs leading-none capitalize opacity-75">
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

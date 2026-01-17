"use client";
import Image from "next/image";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { InfoTooltip } from "../ui/InfoTooltip";
import DateDisplay from "./DateDisplay";
import calculateExactAge from "./CalculateExactAge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, Eye, Network, Trash2, UserPen } from "lucide-react";
import { Button } from "../ui/button";
import { deleteProfile } from "@/actions/deleteProfile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProfileAvatar from "./ProfileAvatar";
import ProfileName from "./ProfileName";
import ProfileNameNative from "./ProfileNameNative";
import ProfileInfoRow from "./ProfileInfoRow";
import ProfileDetailRow from "./ProfileDetailRow";

type ProfileCardProps = {
  id: string;
  profile_photo: string | null;
  name_eng: string;
  name_native_lang: string | null;
  gender: "male" | "female" | "other";
  caste: string | null;
  fatherName?: string | null;
  fatherID?: string | null;
  motherName?: string | null;
  motherID?: string | null;
  spouseName: string | null;
  spouseID: string | null;
  numChildren: number | null;
  place_of_birth: string | null;
  date_of_birth: Date | null;
  date_of_death: Date | null;
  education: string | null;
  occupation: string | null;
  notes?: string | null;
  family_branch: string | null;
  className?: string;
};

export default function ProfileCard({
  id,
  profile_photo,
  name_eng,
  name_native_lang,
  gender,
  caste,
  fatherName,
  fatherID,
  motherName,
  motherID,
  spouseName,
  spouseID,
  numChildren,
  place_of_birth,
  date_of_birth,
  date_of_death,
  education,
  occupation,
  notes,
  family_branch,
  className,
}: ProfileCardProps) {
  const router = useRouter();
  // Calculate Age
  const age = calculateExactAge(date_of_birth, date_of_death);

  return (
    <div
      className={cn(
        "bg-background border-border/50 flex w-full flex-col items-center rounded-[30px] border border-y-10 p-4 pt-6 shadow-md dark:shadow-black",
        className,
        gender === "male" ? "border-b-[#784efd]/60" : "border-b-[#ff277a]/60",
        date_of_death ? "border-t-red-500/60" : "border-t-green-500/60",
      )}
    >
      {/* Profile Photo */}
      <ProfileAvatar
        href={`/people/${id}`}
        src={profile_photo}
        alt={`${name_eng} Profile Photo`}
        gender={gender}
        className=""
      />

      {/* Name in English */}
      {name_eng && (
        <ProfileName
          href={`/people/${id}`}
          name={name_eng}
          isAlive={!date_of_death}
          className="text-[22px]"
        />
      )}

      {/* Name in Native Language */}
      {name_native_lang && (
        <ProfileNameNative
          href={`/people/${id}`}
          nameNative={name_native_lang}
          className="text-base leading-none"
        />
      )}

      {/* Relatives */}
      <div className="text-foreground/80 divide-border mt-3 w-full space-y-[3px] divide-y divide-dashed text-sm">
        {/* Father */}
        {fatherName && (
          <ProfileInfoRow
            label="Father:"
            value={fatherName}
            href={`/people/${fatherID}`}
          />
        )}

        {/* Mother */}
        {motherName && (
          <ProfileInfoRow
            label="Mother:"
            value={motherName}
            href={`/people/${motherID}`}
          />
        )}

        {/* Spouse */}
        {spouseName && (
          <ProfileInfoRow
            label={gender === "male" ? "Husband of:" : "Wife of:"}
            value={spouseName}
            href={`/people/${spouseID}`}
          />
        )}

        {/* Children */}
        {spouseID && numChildren !== null && (
          <ProfileInfoRow
            label="Children:"
            value={numChildren}
            href={`/people/${id}/children`}
            showArrow={true}
          />
        )}

        {/* Single / fallback */}
        {!spouseID && (
          <ProfileInfoRow
            label="Marital Status:"
            value="Single (NA)"
            showArrow={false}
          />
        )}

        {caste && <ProfileDetailRow label="Caste:" value={caste} />}
        {education && <ProfileDetailRow label="Education:" value={education} />}
        {occupation && (
          <ProfileDetailRow label="Profession:" value={occupation} />
        )}
        {place_of_birth && (
          <ProfileDetailRow label="Born in:" value={place_of_birth} />
        )}
        {date_of_birth && (
          <ProfileDetailRow
            label="Born on:"
            value={<DateDisplay date={date_of_birth} />}
          />
        )}
        {date_of_death && (
          <ProfileDetailRow
            label="Passed Away:"
            value={<DateDisplay date={date_of_death} />}
          />
        )}
        {date_of_birth && (
          <ProfileDetailRow
            label={date_of_death ? "Age:" : "Current Age:"}
            value={age}
          />
        )}
        {family_branch && (
          <ProfileDetailRow label="Family Lineage:" value={family_branch} />
        )}

        <div className="mt-3 flex justify-center gap-1">
          <Link href={`/tree/${id}`}>
            <Button
              variant="ghost"
              className="bg-accent hover:bg-primary dark:hover:bg-primary h-8 px-1 py-1 hover:text-white"
            >
              <Network /> Family Tree
            </Button>
          </Link>
          <Link href={`/people/${id}/edit`}>
            <Button
              variant="ghost"
              className="bg-accent hover:bg-foreground dark:hover:bg-foreground hover:text-background h-8 px-1 py-1"
            >
              <UserPen /> Edit
            </Button>
          </Link>
          <Button
            className="bg-accent hover:bg-destructive dark:hover:bg-destructive h-8 px-1 py-1 hover:text-white"
            variant="ghost"
            onClick={() => {
              toast.warning("Confirm Delete", {
                description: `"${name_eng}" will be permanently removed.`,
                action: {
                  label: "Yes, Delete",
                  onClick: async () => {
                    try {
                      const deletedProfile = await deleteProfile(id);
                      toast.info("Deleted Successfully", {
                        description: `"${name_eng}" has been removed.`,
                      });
                      // Refresh server data to update UI
                      router.refresh();
                    } catch (err: any) {
                      toast.error("Delete Failed", {
                        description: err?.message || "Something went wrong",
                      });
                    }
                  },
                },
                duration: 10000, // 10s for user to click
              });
            }}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

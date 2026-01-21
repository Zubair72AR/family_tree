import Link from "next/link";
import { cn } from "@/lib/utils";
import ProfileAvatar from "@/components/AllProfile/ProfileAvatar";
import { getSignedUrl } from "@/actions/getSignedUrl";
import { ProfileWithRelatives } from "@/lib/types";

type RelativeCardProps = {
  person: ProfileWithRelatives;
  label?: string; // Father Name, Mother Name, Spouse Name
  showParentOf?: boolean; // S/o, D/o
  showSpouseOf?: boolean; // Husband of / Wife of
};
const labelColorMap: Record<string, { bg: string; border: string }> = {
  Father: {
    bg: "bg-blue-500",
    border: "border-blue-300",
  },
  Mother: {
    bg: "bg-green-500",
    border: "border-green-300",
  },
  Husband: {
    bg: "bg-rose-500",
    border: "border-rose-300",
  },
  Wife: {
    bg: "bg-rose-500",
    border: "border-rose-300",
  },
  Brother: {
    bg: "bg-orange-500",
    border: "border-orange-300",
  },
  Sister: {
    bg: "bg-emerald-500",
    border: "border-emerald-300",
  },
  Son: {
    bg: "bg-purple-500",
    border: "border-purple-300",
  },
  Daughter: {
    bg: "bg-pink-500",
    border: "border-pink-300",
  },
};

export default async function RelativeCard({
  person,
  label,
  showParentOf = false,
  showSpouseOf = false,
}: RelativeCardProps) {
  const isMale = person.gender === "male";

  return (
    <div className="relative flex min-w-[300px] flex-col items-center rounded-4xl border p-2 pt-5 hover:shadow-md">
      {label && (
        <p
          className={cn(
            "absolute top-0 left-1/2 grid h-5.5 min-w-18 -translate-1/2 place-items-center rounded-full border text-[10px] text-white uppercase shadow-md/25",
            labelColorMap[label]?.bg,
            labelColorMap[label]?.border,
          )}
        >
          {label}
        </p>
      )}
      <ProfileAvatar
        href={`/people/${person.id}`}
        src={await getSignedUrl(person.profile_photo)}
        alt={`${person.name_eng} Profile Photo`}
        gender={person.gender}
        className="bg-background size-28 border-4"
      />
      <Link
        title="View Profile Details"
        href={`/people/${person.id}`}
        className={cn(
          "font-bodoni hover:text-primary text-center text-xl",
          person.date_of_death ? "" : "verifiedIcon [--icon-size:12px]",
        )}
      >
        {person.name_eng}
      </Link>
      <p className="font-langs text-foreground/65 text-center text-base leading-tight">
        {person.name_native_lang}
      </p>
      {showParentOf && (
        <p className="text-foreground/65 text-center text-sm font-light">
          {isMale ? "S/o " : "D/o "}
          {person.father_id ? (
            <Link
              href={`/people/${person.father_id}`}
              className="hover:text-primary"
              title="View Profile Details"
            >
              <span className="font-semibold">{person.father_name}</span>
            </Link>
          ) : (
            "—"
          )}
        </p>
      )}
      {showSpouseOf &&
        (person.spouse_id ? (
          <p className="text-foreground/65 text-center text-sm font-light">
            {isMale ? "H/o " : "W/o "}
            {person.spouse_id ? (
              <Link
                href={`/people/${person.spouse_id}`}
                className="hover:text-primary"
                title="View Profile Details"
              >
                <span className="font-semibold">{person.spouse_name}</span>
              </Link>
            ) : (
              "—"
            )}
          </p>
        ) : (
          <p className="text-foreground/65 text-sm font-light">Single (NA)</p>
        ))}
    </div>
  );
}

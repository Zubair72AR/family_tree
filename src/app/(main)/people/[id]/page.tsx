import { notFound } from "next/navigation";
import { fetchProfiles } from "@/lib/supabase/fetch";
import { getSignedUrl } from "@/actions/getSignedUrl";
import ProfileAvatar from "@/components/AllProfile/ProfileAvatar";
import Link from "next/link";
import { Network, UserPen } from "lucide-react";
import { cn } from "@/lib/utils";
import RelativeCard from "@/components/AllProfile/RelativeCard";
import ProfileDetailRow from "@/components/AllProfile/ProfileDetailRow";
import DateDisplay from "@/components/AllProfile/DateDisplay";
import calculateExactAge from "@/components/AllProfile/CalculateExactAge";
import { getServerSession } from "@/lib/get-session";
import { Button } from "@/components/ui/button";
import DeleteProfileBtn from "@/components/AllProfile/DeleteProfileBtn";

type PersonPageProps = {
  params: { id: string };
};

export default async function PersonID({ params }: PersonPageProps) {
  // Get Session - User
  const session = await getServerSession();
  const user = session?.user;

  const { id } = await params;

  // Fetch all profiles once
  const profiles = await fetchProfiles();

  // Find the profile by ID
  const profile = profiles.find((p) => p.id === id);
  // Profile not FOund
  if (!profile || !profiles || profiles.length === 0) return notFound();
  // find Gender
  const isMale = profile?.gender === "male";

  // Relatives
  const mother = profiles.find((p) => p.id === profile?.mother_id);
  const father = profiles.find((p) => p.id === profile?.father_id);
  const spouse = profiles.find((p) => p.id === profile?.spouse_id);
  const children = profiles
    .filter((p) => (isMale ? p.father_id === id : p.mother_id === id))
    .sort((a, b) => {
      const dateA = a.date_of_birth
        ? new Date(a.date_of_birth).getTime()
        : Infinity;
      const dateB = b.date_of_birth
        ? new Date(b.date_of_birth).getTime()
        : Infinity;
      return dateA - dateB;
    });
  const siblings = profiles
    .filter(
      (p) =>
        p.id !== id &&
        ((p.father_id && p.father_id === profile.father_id) ||
          (p.mother_id && p.mother_id === profile.mother_id)),
    )
    .sort((a, b) => {
      const dateA = a.date_of_birth
        ? new Date(a.date_of_birth).getTime()
        : Infinity;
      const dateB = b.date_of_birth
        ? new Date(b.date_of_birth).getTime()
        : Infinity;
      return dateA - dateB; // elder → younger
    });

  // Calculate Age
  const age = calculateExactAge(profile.date_of_birth, profile.date_of_death);

  // Pass the transformed profile to ProfileCard
  return (
    <div className="pad-x mx-auto my-8 flex w-full max-w-6xl flex-col items-center">
      {/* Profile Photo */}
      <ProfileAvatar
        src={await getSignedUrl(profile.profile_photo)}
        alt={`${profile.name_eng} Profile Photo`}
        gender={profile.gender}
        className=""
      />

      {/* Name */}
      <h1
        className={cn(
          "font-bodoni mt-3 text-center text-2xl sm:text-3xl",
          profile.date_of_death ? "" : "verifiedIcon [--icon-size:14px]",
        )}
      >
        {isMale ? "Mr. " : "Ms. "}
        {profile.name_eng}
      </h1>

      {/* Native Name */}
      <p className="font-langs text-foreground/65 my-1 text-center text-xl sm:text-2xl">
        {profile.name_native_lang}
      </p>

      {/* Other Details */}
      <div className="divide-border text-foreground/65 my-4 w-full max-w-[450px] space-y-[3px] divide-y divide-dashed text-sm sm:text-base">
        {profile.spouse_id && (
          <ProfileDetailRow label="Children:" value={profile.children_count} />
        )}
        <ProfileDetailRow label="Caste:" value={profile.caste_name} />
        <ProfileDetailRow label="Education:" value={profile.education_degree} />
        <ProfileDetailRow label="Profession:" value={profile.occupation_name} />
        <ProfileDetailRow
          label="Born in:"
          value={profile.place_of_birth_city}
        />
        <ProfileDetailRow
          label="Born on:"
          value={<DateDisplay date={profile.date_of_birth} />}
        />
        {profile.date_of_birth && (
          <ProfileDetailRow
            label={profile.date_of_death ? "Age:" : "Current Age:"}
            value={age}
          />
        )}
        {profile.date_of_death && (
          <ProfileDetailRow
            label="Passed Away:"
            value={<DateDisplay date={profile.date_of_death} />}
          />
        )}
        <ProfileDetailRow
          label="Family Lineage:"
          value={profile.lineage_branch_name}
        />
        {profile.notes && (
          <p className="px-2 py-1">
            <span className="font-semibold text-nowrap">Biography:</span>
            <span className="block">{profile.notes}</span>
          </p>
        )}
      </div>

      <div className="mt-3 flex justify-center gap-1">
        <Link href={`/tree/${id}`}>
          <Button
            variant="ghost"
            className="bg-accent hover:bg-primary dark:hover:bg-primary h-8 px-1 py-1 hover:text-white"
          >
            <Network /> Family Tree
          </Button>
        </Link>
        {user?.role === "admin" ||
          (user?.role === "editor" && (
            <Link href={`/people/${id}/edit`}>
              <Button
                variant="ghost"
                className="bg-accent hover:bg-foreground dark:hover:bg-foreground hover:text-background h-8 px-1 py-1"
              >
                <UserPen /> Edit
              </Button>
            </Link>
          ))}
        {(user?.role === "admin" || user?.role === "editor") && (
          <DeleteProfileBtn profileId={id} profileName={profile.name_eng} />
        )}
      </div>

      {/* Parents and Spouse */}
      {(father || mother || spouse) && (
        <div>
          <h2 className="font-bodoni mt-6 text-center text-3xl uppercase">
            Family Members
          </h2>
          <div className="my-4 grid gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {father && (
              <RelativeCard person={father} label="Father" showParentOf />
            )}
            {mother && (
              <RelativeCard person={mother} label="Mother" showParentOf />
            )}
            {spouse && (
              <RelativeCard
                person={spouse}
                label={isMale ? "Wife" : "Husband"}
                showParentOf
              />
            )}
          </div>
        </div>
      )}

      {/* Children Details */}
      {children.length > 0 && (
        <div>
          <h2 className="font-bodoni mt-6 text-center text-3xl uppercase">
            Children
          </h2>
          <div className="my-4 grid gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => {
              return (
                <RelativeCard
                  person={child}
                  label={child.gender === "male" ? "Son" : "Daughter"}
                  showSpouseOf
                  key={child.id}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Siblings Details */}
      {siblings.length > 0 && (
        <div>
          <h2 className="font-bodoni mt-6 text-center text-3xl uppercase">
            Siblings
          </h2>
          <div className="my-4 grid gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((sib) => {
              return (
                <RelativeCard
                  person={sib}
                  label={sib.gender === "male" ? "Brother" : "Sister"}
                  showSpouseOf
                  key={sib.id}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

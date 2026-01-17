import ProfileCard from "@/components/AllProfile/ProfileCard";
import { fetchProfiles } from "@/lib/supabase/fetch";
import { getSignedUrl } from "@/actions/getSignedUrl";
import NotFound from "@/app/not-found";
import Link from "next/link";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ProfileAvatar from "@/components/AllProfile/ProfileAvatar";

type ChildrenPageProps = {
  params: { id: string };
};

export default async function PersonChildren({ params }: ChildrenPageProps) {
  const { id } = await params;

  // Fetch all profiles once
  const profiles = await fetchProfiles();

  // Get the person's Profile
  const person = profiles.find((p) => p.id === id);

  // 👉 If no profiles found
  if (!person || !profiles || profiles.length === 0)
    return (
      <NotFound
        title="Profile Not Found"
        description="The profile you are looking for is not available. This could be due to an incorrect ID, no profile added yet, or a network issue. Please check the ID or try again later."
        buttonLabel="Go to All Profiles"
        buttonHref="/people"
      />
    );

  const isMale = person.gender === "male";

  // Get children based on gender
  const children = profiles.filter((p) =>
    isMale ? p.father_id === id : p.mother_id === id,
  );

  // Transform photos (signed URLs)
  const profilesWithPhotos = await Promise.all(
    children.map(async (p) => ({
      ...p,
      profile_photo: p.profile_photo
        ? await getSignedUrl(p.profile_photo)
        : null,
    })),
  );
  const personWithPhoto = {
    ...person,
    profile_photo: person.profile_photo
      ? await getSignedUrl(person.profile_photo)
      : null,
  };

  // 👉 If no Child found
  if (!children || children.length === 0)
    return (
      <NotFound
        title="No Children Found"
        description="Either there is no child added for this person yet, or the child data is temporarily unavailable. Please check back later."
        buttonLabel="Go to All Profiles"
        buttonHref="/people"
      />
    );

  return (
    <div className="py-8">
      <div className="pad-x mx-auto mb-4 flex max-w-6xl items-center gap-2 sm:gap-4">
        {/* Profile Photo */}
        <ProfileAvatar
          href={`/people/${id}`}
          src={personWithPhoto.profile_photo}
          alt={`${personWithPhoto.name_eng} Profile Photo`}
          gender={personWithPhoto.gender}
          className="max-w-44"
        />

        <div>
          <p className="text-foreground/65 text-sm font-light">Children of</p>

          <h1 className="font-bodoni flex items-center gap-1 text-2xl sm:text-3xl">
            <Link
              href={`/people/${id}`}
              className="hover:text-primary"
              title="View Profile Details"
            >
              {isMale ? "Mr. " : "Mrs. "}
              {personWithPhoto.name_eng}
            </Link>
            {!personWithPhoto.date_of_death && (
              <InfoTooltip label="This person is alive">
                <RiVerifiedBadgeFill className="mt-1 size-4 text-green-500" />
              </InfoTooltip>
            )}
          </h1>
          {personWithPhoto.father_name && (
            <p className="text-foreground/65 text-sm font-light">
              {isMale ? "S/o " : "D/o"}
              <Link
                href={`/people/${personWithPhoto.father_id}`}
                className="hover:text-primary"
                title="View Profile Details"
              >
                <span className="font-semibold">
                  {isMale ? "Mr. " : "Mrs. "} {personWithPhoto.father_name}
                </span>
              </Link>
            </p>
          )}
          {personWithPhoto.spouse_name && (
            <p className="text-foreground/65 text-sm font-light">
              {isMale ? "Husband of " : "Wife of "}
              <Link
                href={`/people/${personWithPhoto.spouse_id}`}
                className="hover:text-primary"
                title="View Profile Details"
              >
                <span className="font-semibold">
                  {isMale ? "Mrs. " : "Mr. "} {personWithPhoto.spouse_name}
                </span>
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Profile Grid */}
      <div className="pad-x mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profilesWithPhotos.map((p) => {
          return (
            <ProfileCard
              key={p.id}
              id={p.id}
              profile_photo={p.profile_photo}
              name_eng={p.name_eng}
              name_native_lang={p.name_native_lang}
              gender={p.gender}
              caste={p.caste_name || null}
              // fatherName={p.father_name || null}
              // fatherID={p.father_id || null}
              // motherName={p.mother_name || null}
              // motherID={p.mother_id || null}
              spouseName={p.spouse_name || null}
              spouseID={p.spouse_id || null}
              numChildren={p.children_count}
              place_of_birth={p.place_of_birth_city || null}
              date_of_birth={p.date_of_birth}
              date_of_death={p.date_of_death}
              education={p.education_degree || null}
              occupation={p.occupation_name || null}
              family_branch={p.lineage_branch_name || null}
            />
          );
        })}
      </div>
    </div>
  );
}

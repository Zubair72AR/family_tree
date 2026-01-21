import { fetchProfiles } from "@/lib/supabase/fetch";
import { getSignedUrl } from "@/actions/getSignedUrl";
import NotFound from "@/app/not-found";
import Link from "next/link";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ProfileAvatar from "@/components/AllProfile/ProfileAvatar";
import RelativeCard from "@/components/AllProfile/RelativeCard";

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
    <div className="pad-x mx-auto my-8 flex w-full max-w-6xl flex-col items-center">
      <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
        {/* Profile Photo */}
        <ProfileAvatar
          href={`/people/${id}`}
          src={await getSignedUrl(person.profile_photo)}
          alt={`${person.name_eng} Profile Photo`}
          gender={person.gender}
          className="max-w-44"
        />

        <div className="text-center sm:text-left">
          <p className="text-foreground/65 text-sm font-light">Children of</p>

          <h1 className="font-bodoni flex items-center gap-1 text-2xl sm:text-3xl">
            <Link
              href={`/people/${id}`}
              className="hover:text-primary"
              title="View Profile Details"
            >
              {isMale ? "Mr. " : "Ms. "}
              {person.name_eng}
            </Link>
            {!person.date_of_death && (
              <InfoTooltip label="This person is alive">
                <RiVerifiedBadgeFill className="mt-1 size-4 text-green-500" />
              </InfoTooltip>
            )}
          </h1>
          {person.father_name && (
            <p className="text-foreground/65 text-sm font-light">
              {isMale ? "S/o " : "D/o"}
              <Link
                href={`/people/${person.father_id}`}
                className="hover:text-primary"
                title="View Profile Details"
              >
                <span className="font-semibold">
                  {isMale ? "Mr. " : "Ms. "} {person.father_name}
                </span>
              </Link>
            </p>
          )}
          {person.spouse_name && (
            <p className="text-foreground/65 text-sm font-light">
              {isMale ? "Husband of " : "Wife of "}
              <Link
                href={`/people/${person.spouse_id}`}
                className="hover:text-primary"
                title="View Profile Details"
              >
                <span className="font-semibold">
                  {isMale ? "Ms. " : "Mr. "} {person.spouse_name}
                </span>
              </Link>
            </p>
          )}
        </div>
      </div>

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
    </div>
  );
}

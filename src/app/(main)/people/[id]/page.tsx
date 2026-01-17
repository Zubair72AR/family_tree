import { notFound } from "next/navigation";
import ProfileCard from "@/components/AllProfile/ProfileCard";
import { fetchProfiles } from "@/lib/supabase/fetch";
import { getSignedUrl } from "@/actions/getSignedUrl";

type PersonPageProps = {
  params: { id: string };
};

export default async function PersonID({ params }: PersonPageProps) {
  const { id } = await params;

  // Fetch all profiles once
  const profiles = await fetchProfiles();

  // Find the profile by ID
  const profile = profiles.find((p) => p.id === id);

  if (!profile) return notFound();

  // Transform profile photo URL
  const profileWithPhoto = {
    ...profile,
    profile_photo: profile.profile_photo
      ? await getSignedUrl(profile.profile_photo)
      : null,
  };

  // Pass the transformed profile to ProfileCard
  return (
    <div className="mx-auto max-w-2xl p-4">
      <ProfileCard
        id={profileWithPhoto.id}
        profile_photo={profileWithPhoto.profile_photo}
        name_eng={profileWithPhoto.name_eng}
        name_native_lang={profileWithPhoto.name_native_lang}
        gender={profileWithPhoto.gender}
        caste={profileWithPhoto.caste_name || null}
        fatherName={profileWithPhoto.father_name || null}
        fatherID={profileWithPhoto.father_id || null}
        motherName={profileWithPhoto.mother_name || null}
        motherID={profileWithPhoto.mother_id || null}
        spouseName={profileWithPhoto.spouse_name || null}
        spouseID={profileWithPhoto.spouse_id || null}
        numChildren={profileWithPhoto.children_count}
        place_of_birth={profileWithPhoto.place_of_birth_city || null}
        date_of_birth={profileWithPhoto.date_of_birth}
        date_of_death={profileWithPhoto.date_of_death}
        education={profileWithPhoto.education_degree || null}
        occupation={profileWithPhoto.occupation_name || null}
        notes={profileWithPhoto.notes}
        family_branch={profileWithPhoto.lineage_branch_name || null}
      />
    </div>
  );
}

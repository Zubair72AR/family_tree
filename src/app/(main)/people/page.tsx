import { fetchProfiles } from "@/lib/supabase/fetch";
import { getSignedUrl } from "@/actions/getSignedUrl";
import ProfilesClient from "@/components/AllProfile/ProfilesClient";
import NotFound from "@/app/not-found";
import { getServerSession } from "@/lib/get-session";

export default async function ProfilesPage() {
  // Get Session - User
  const session = await getServerSession();
  const user = session?.user;

  const profiles = await fetchProfiles();

  const profilesWithPhotos = await Promise.all(
    profiles.map(async (p) => ({
      id: p.id,
      name_eng: p.name_eng,
      name_native_lang: p.name_native_lang,
      gender: p.gender,
      caste_name: p.caste_name,
      education_degree: p.education_degree,
      occupation_name: p.occupation_name,
      place_of_birth_city: p.place_of_birth_city,
      lineage_branch_name: p.lineage_branch_name,
      father_id: p.father_id,
      mother_id: p.mother_id,
      spouse_id: p.spouse_id,
      date_of_birth: p.date_of_birth,
      date_of_death: p.date_of_death,
      children_count: p.children_count,
      father_name: p.father_name,
      mother_name: p.mother_name,
      spouse_name: p.spouse_name,
      profile_photo: p.profile_photo
        ? await getSignedUrl(p.profile_photo)
        : null,
    })),
  );

  // 👉 If no profiles found
  if (!profiles || profiles.length === 0)
    return (
      <NotFound
        title="No Profile Found"
        description="No family profiles are available at the moment. Please add a new member or try again later."
        buttonLabel="Add Person"
        buttonHref="/people/new"
      />
    );

  return (
    <ProfilesClient profiles={profilesWithPhotos} role={user?.role || ""} />
  );
}

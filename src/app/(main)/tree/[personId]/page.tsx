import { getSignedUrl } from "@/actions/getSignedUrl";
import TreeClient from "@/components/Tree/TreeClient";
import { fetchProfiles } from "@/lib/supabase/fetch";
import { TreeProfile } from "@/lib/types";

type FocusedProfileProps = {
  params: { personId: string };
};

export default async function TreePage({ params }: FocusedProfileProps) {
  const { personId } = await params;

  // Fetch all profiles once
  const profiles = await fetchProfiles();

  // 2️⃣ Attach signed image URLs and map to TreeProfile (only necessary fields)
  const treeProfiles: TreeProfile[] = await Promise.all(
    profiles.map(async (profile) => ({
      id: profile.id,
      name_eng: profile.name_eng,
      name_native_lang: profile.name_native_lang,
      gender: profile.gender,
      father_id: profile.father_id,
      mother_id: profile.mother_id,
      spouse_id: profile.spouse_id,
      date_of_birth: profile.date_of_birth,
      date_of_death: profile.date_of_death,
      children_count: profile.children_count,
      father_name: profile.father_name,
      profile_photo: profile.profile_photo
        ? await getSignedUrl(profile.profile_photo)
        : null,
    })),
  );

  return (
    <div className="h-screen w-full">
      <TreeClient profiles={treeProfiles} focusId={personId} />
    </div>
  );
}

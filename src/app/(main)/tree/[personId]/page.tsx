import { getSignedUrl } from "@/actions/getSignedUrl";
import TreeClient from "@/components/Tree/TreeClient";
import { fetchProfiles } from "@/lib/supabase/fetch";

type FocusedProfileProps = {
  params: { personId: string };
};

export default async function TreePage({ params }: FocusedProfileProps) {
  const { personId } = await params;

  // Fetch all profiles once
  const profiles = await fetchProfiles();

  // 2️⃣ Attach signed image URLs (IMPORTANT)
  const profilesWithSignedPhotos = await Promise.all(
    profiles.map(async (profile) => ({
      ...profile,
      profile_photo: profile.profile_photo
        ? await getSignedUrl(profile.profile_photo)
        : null,
    })),
  );

  return (
    <div className="h-screen w-full">
      <TreeClient profiles={profilesWithSignedPhotos} focusId={personId} />
    </div>
  );
}

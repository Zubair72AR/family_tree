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
      ...p,
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

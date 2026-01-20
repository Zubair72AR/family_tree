import { getSignedUrl } from "@/actions/getSignedUrl";
import NotFound from "@/app/not-found";
import NewProfileAdd from "@/components/AllProfile/NewProfileAdd";
import { getServerSession } from "@/lib/get-session";
import { fetchProfiles } from "@/lib/supabase/fetch";
import { notFound } from "next/navigation";

export default async function AddPersonPage() {
  // Get Session - User
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role === "viewer")
    return (
      <NotFound
        title="Permission Required"
        description="You don’t have permission to add new family members. Please contact the family admin if you believe this is a mistake."
        buttonLabel="Go Back"
        buttonHref="/people"
      />
    );

  // Fetch Profiles
  const profiles = await fetchProfiles();

  if (!profiles) return notFound();

  const profilesWithSignedPhotos = await Promise.all(
    profiles.map(async (profile) => ({
      ...profile,
      profile_photo: profile.profile_photo
        ? await getSignedUrl(profile.profile_photo)
        : null,
    })),
  );

  return (
    <div className="pad-x mx-auto mt-6 max-w-2xl">
      <div className="bg-background border-border/50 w-full border p-4 shadow-md sm:p-6 md:p-8">
        <h1 className="font-bodoni mb-4 text-3xl">Add Family Member</h1>
        <NewProfileAdd allProfiles={profilesWithSignedPhotos} />
      </div>
    </div>
  );
}

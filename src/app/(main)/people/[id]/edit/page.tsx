import { getSignedUrl } from "@/actions/getSignedUrl";
import NotFound from "@/app/not-found";
import EditProfileForm from "@/components/AllProfile/EditProfileForm";
import { getServerSession } from "@/lib/get-session";
import { fetchProfileByID, fetchProfiles } from "@/lib/supabase/fetch";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: { id: string };
}

export default async function EditProfilePage({ params }: EditPageProps) {
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

  const { id } = await params;

  // Fetch all profiles once
  const profiles = await fetchProfiles();
  const profileEdit = await fetchProfileByID(id);

  // If not Find then
  if (!profileEdit) return notFound();

  // Get All Profile Signin URL
  const profilesWithSignedPhotos = await Promise.all(
    profiles.map(async (profile) => ({
      ...profile,
      profile_photo: profile.profile_photo
        ? await getSignedUrl(profile.profile_photo)
        : null,
    })),
  );

  // Transform profile photo URL
  const profileWithPhoto = {
    ...profileEdit,
    profile_photo: profileEdit.profile_photo
      ? await getSignedUrl(profileEdit.profile_photo)
      : null,
  };

  return (
    <div className="pad-x mx-auto mt-6 max-w-2xl">
      <div className="bg-background border-border/50 w-full border p-4 shadow-md sm:p-6 md:p-8">
        <h1 className="font-bodoni mb-4 text-3xl">Edit Family Member</h1>
        <EditProfileForm
          allProfiles={profilesWithSignedPhotos}
          ProfileEdit={profileWithPhoto}
        />
      </div>
    </div>
  );
}

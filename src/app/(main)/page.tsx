import { getSignedUrl } from "@/actions/getSignedUrl";
import AddFamilyHead from "@/components/Home/AddFamilyHead";
import NoMemberUI from "@/components/Home/NoMemberUI";
import NotSignedInCTA from "@/components/Home/NotSignedInCTA";
import { getServerSession } from "@/lib/get-session";
import { fetchFamilyHead, fetchProfiles } from "@/lib/supabase/fetch";

export default async function HomePage() {
  // Check if user is signed in
  const session = await getServerSession();

  if (!session) {
    // User not signed in → show logo + tagline + sign in button
    return <NotSignedInCTA />;
  }

  // User is signed in → fetch all profiles for this user
  const profiles = await fetchProfiles();
  // Fetch Family Head
  const familyHeads = await fetchFamilyHead();

  // If no member is added yet
  if (profiles.length === 0 && !profiles) {
    return <NoMemberUI />;
  }

  // family head profile ids
  const familyHeadIds = new Set(familyHeads.map((fh) => fh.profile_id));

  // only profiles NOT in familyHeads
  const availableProfiles = profiles.filter((p) => !familyHeadIds.has(p.id));

  // Profile Photo
  const profilesWithSignedPhotos = await Promise.all(
    availableProfiles.map(async (profile) => ({
      id: profile.id,
      name: profile.name_eng, // use name_eng as name
      gender: profile.gender, // optional
      fatherName: profile.father_name ?? null, // optional nullable
      father_id: profile.father_id,
      children_count: profile.children_count,
      date_of_birth: profile.date_of_birth,
      date_of_death: profile.date_of_death,
      photo: profile.profile_photo
        ? await getSignedUrl(profile.profile_photo)
        : null,
    })),
  );

  // Family Head Profile Photo
  const familyHeadsWithSignedPhotos = await Promise.all(
    familyHeads.map(async (familyHead) => ({
      ...familyHead,
      profile_photo: familyHead.profile_photo
        ? await getSignedUrl(familyHead.profile_photo)
        : null,
    })),
  );

  return (
    <AddFamilyHead
      profiles={profilesWithSignedPhotos}
      familyHeads={familyHeadsWithSignedPhotos}
    />
  );
}

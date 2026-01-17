"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { getServerSession } from "@/lib/get-session";

async function getAdminId(): Promise<{
  adminId: string;
  role: string;
  createdByAdminID: string | null;
}> {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  return {
    adminId: session.user.id,
    role: session.user.role,
    createdByAdminID: session.user.createdByAdminID ?? null,
  };
}

export async function updateProfile(
  id: string,
  profile: {
    profile_photo?: string | null;
    name_eng: string;
    name_native_lang: string;
    gender: "male" | "female" | "other";
    caste_id: string | null;
    father_id?: string | null;
    mother_id?: string | null;
    spouse_id?: string | null;
    place_of_birth_id: string | null;
    date_of_birth?: Date | null;
    date_of_death?: Date | null;
    education_id: string | null;
    // admin_id: string;
    notes: string | null;
    occupation_id: string | null;
    lineage_id?: string | null; // updated
  },
) {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;

  const sanitizeUUID = (id: string | null | undefined) =>
    id && id.trim() !== "" ? id : null;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({
      profile_photo: profile.profile_photo ?? null,
      name_eng: profile.name_eng,
      name_native_lang: profile.name_native_lang,
      gender: profile.gender,
      caste_id: sanitizeUUID(profile.caste_id),
      father_id: sanitizeUUID(profile.father_id ?? null),
      mother_id: sanitizeUUID(profile.mother_id ?? null),
      spouse_id: sanitizeUUID(profile.spouse_id ?? null),
      place_of_birth_id: sanitizeUUID(profile.place_of_birth_id),
      date_of_birth: profile.date_of_birth ?? null,
      date_of_death: profile.date_of_death ?? null,
      education_id: sanitizeUUID(profile.education_id),
      admin_id: targetAdminId,
      notes: profile.notes,
      occupation_id: sanitizeUUID(profile.occupation_id),
      lineage_id: sanitizeUUID(profile.lineage_id ?? null), // NEW FIELD
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // ✅ Auto-sync spouse
  if (profile.spouse_id) {
    const { data: spouse } = await supabaseAdmin
      .from("profiles")
      .select("id, spouse_id")
      .eq("id", profile.spouse_id)
      .single();

    if (spouse && !spouse.spouse_id) {
      await supabaseAdmin
        .from("profiles")
        .update({ spouse_id: id })
        .eq("id", profile.spouse_id);
    }
  }

  return data;
}

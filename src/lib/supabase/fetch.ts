"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { getServerSession } from "@/lib/get-session";
import {
  AdminLineage,
  FamilyHeadWithRelatives,
  Profile,
  ProfileWithRelatives,
} from "../types";

// -----------------------------
// 1️⃣ Fetch individual entities using session admin_id
// -----------------------------
async function getAdminId(): Promise<{
  adminId: string;
  role: string;
  createdByAdminID: string | null;
  lineage_id: string | null;
}> {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  return {
    adminId: session.user.id,
    role: session.user.role,
    createdByAdminID: session.user.createdByAdminID ?? null,
    lineage_id: session.user.lineage_id ?? null,
  };
}

export async function fetchCastes() {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;
  const { data, error } = await supabaseAdmin
    .from("castes")
    .select("*")
    .eq("admin_id", targetAdminId)
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchEducations() {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;
  const { data, error } = await supabaseAdmin
    .from("educations")
    .select("*")
    .eq("admin_id", targetAdminId)
    .order("degree", { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchOccupations() {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;
  const { data, error } = await supabaseAdmin
    .from("occupations")
    .select("*")
    .eq("admin_id", targetAdminId)
    .order("occupation", { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchPlaces() {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;
  const { data, error } = await supabaseAdmin
    .from("place_of_birth_city")
    .select("*")
    .eq("admin_id", targetAdminId)
    .order("city_name", { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchFamilyBranches() {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;
  const { data, error } = await supabaseAdmin
    .from("family_branches")
    .select("*")
    .eq("admin_id", targetAdminId)
    .order("branch_name", { ascending: true });
  if (error) throw error;
  return data;
}

// -----------------------------
// 2️⃣ Fetch profiles with all relations (filtered by session admin_id)
// -----------------------------
export async function fetchProfiles(): Promise<ProfileWithRelatives[]> {
  const { adminId, role, createdByAdminID, lineage_id } = await getAdminId();

  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;
  const targetLineageId = lineage_id ?? null;

  // Explicitly select all needed fields except admin_id and lineage_id
  let query = supabaseAdmin
    .from("profiles_with_relatives")
    .select(
      `
      id,
      profile_photo,
      name_eng,
      name_native_lang,
      gender,
      caste_name,
      education_degree,
      occupation_name,
      place_of_birth_city,
      lineage_branch_name,
      father_id,
      mother_id,
      spouse_id,
      date_of_birth,
      date_of_death,
      notes,
      father_name,
      mother_name,
      spouse_name,
      children_count
    `,
    )
    .eq("admin_id", targetAdminId);

  if (targetLineageId) {
    query = query.eq("lineage_id", targetLineageId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []) as ProfileWithRelatives[];
}

// FETCH SINGLE PROFILE
export async function fetchProfileByID(id: string): Promise<Profile | null> {
  let query = supabaseAdmin
    .from("profiles")
    .select(
      `
     id,
      profile_photo,
      name_eng,
      name_native_lang,
      gender,
      caste_id,
      father_id,
      mother_id,
      spouse_id,
      place_of_birth_id,
      date_of_birth,
      date_of_death,
      education_id,
      notes,
      admin_id,
      occupation_id,
      lineage_id
    `,
    )
    .eq("id", id)
    .single(); // 👈 fetch one profile only

  const { data, error } = await query;
  if (error) throw error;

  return data;
}

// FETCH FAMILY HEADS
export async function fetchFamilyHead(): Promise<FamilyHeadWithRelatives[]> {
  const { adminId, role, createdByAdminID, lineage_id } = await getAdminId();

  const targetAdminId = role === "admin" ? adminId : createdByAdminID!;
  const targetLineageId = lineage_id ?? null;

  let query = supabaseAdmin
    .from("family_heads_with_relatives")
    .select(
      `
      profile_id,
      profile_photo,
      name_eng,
      gender,
      date_of_death,
      father_name
    `,
    )
    .eq("admin_id", targetAdminId);

  if (targetLineageId) {
    query = query.eq("lineage_id", targetLineageId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []) as FamilyHeadWithRelatives[];
}

// fetch lineage id dropdown for admin new user
export async function fetchAdminLineages(): Promise<AdminLineage[]> {
  const { adminId } = await getAdminId();

  const { data, error } = await supabaseAdmin
    .from("lineage_usage_summary")
    .select(
      `
      lineage_id,
      lineage_name,
      total_profiles
    `,
    )
    .eq("admin_id", adminId);

  if (error) throw error;

  return data as AdminLineage[];
}

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { getServerSession } from "@/lib/get-session";

// Helper to get admin_id from logged-in user
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

/**
 * Add Caste
 * @param name - caste name
 */
export async function addCaste(name: string): Promise<void> {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const admin_id = role === "admin" ? adminId : createdByAdminID!;
  const { error } = await supabaseAdmin
    .from("castes")
    .insert({ name, admin_id });
  if (error) throw error;
}

/**
 * Add Education
 * @param degree - education degree
 */
export async function addEducation(degree: string): Promise<void> {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const admin_id = role === "admin" ? adminId : createdByAdminID!;
  const { error } = await supabaseAdmin
    .from("educations")
    .insert({ degree, admin_id });
  if (error) throw error;
}

/**
 * Add Family Branch
 * @param branch_name - family branch name
 */
export async function addFamilyBranch(branch_name: string): Promise<void> {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const admin_id = role === "admin" ? adminId : createdByAdminID!;
  const { error } = await supabaseAdmin
    .from("family_branches")
    .insert({ branch_name, admin_id });
  if (error) throw error;
}

/**
 * Add Occupation
 * @param occupation - occupation name
 */
export async function addOccupation(occupation: string): Promise<void> {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const admin_id = role === "admin" ? adminId : createdByAdminID!;
  const { error } = await supabaseAdmin
    .from("occupations")
    .insert({ occupation, admin_id });
  if (error) throw error;
}

/**
 * Add Place of Birth City
 * @param city_name - city name
 */
export async function addPlaceOfBirth(city_name: string): Promise<void> {
  const { adminId, role, createdByAdminID } = await getAdminId();
  const admin_id = role === "admin" ? adminId : createdByAdminID!;
  const { error } = await supabaseAdmin
    .from("place_of_birth_city")
    .insert({ city_name, admin_id });
  if (error) throw error;
}

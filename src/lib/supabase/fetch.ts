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

  // 1️⃣ If no lineage_id, fetch all profiles for admin
  if (!lineage_id) {
    const { data, error } = await supabaseAdmin
      .from("profiles_with_relatives")
      .select("*")
      .eq("admin_id", targetAdminId);

    if (error) throw error;
    return data || [];
  }

  // --- HELPER FETCHES WITH MINIMAL FIELDS ---
  async function fetchMinimalProfilesByIds(ids: string[]) {
    if (!ids.length) return [];
    const { data, error } = await supabaseAdmin
      .from("profiles_with_relatives")
      .select("id, spouse_id, father_id, mother_id, gender")
      .in("id", ids);

    if (error) throw error;
    return data || [];
  }

  async function fetchMinimalChildrenByParentIds(parentIds: string[]) {
    if (!parentIds.length) return [];
    const { data, error } = await supabaseAdmin
      .from("profiles_with_relatives")
      .select("id, spouse_id, father_id, mother_id, gender")
      .or(
        `father_id.in.(${parentIds.join(",")}),mother_id.in.(${parentIds.join(",")})`,
      );

    if (error) throw error;
    return data || [];
  }

  // 2️⃣ Start with lineage members (minimal fields)
  const { data: lineageData, error: lineageError } = await supabaseAdmin
    .from("profiles_with_relatives")
    .select("id, spouse_id, father_id, mother_id, gender")
    .eq("admin_id", targetAdminId)
    .eq("lineage_id", lineage_id);

  if (lineageError) throw lineageError;

  let result: typeof lineageData = [];
  let queue: typeof lineageData = lineageData || [];

  while (queue.length) {
    const currentLevel = queue;
    queue = [];

    result.push(...currentLevel);

    // --- Fetch spouses ---
    const spouseIds = currentLevel
      .map((p) => p.spouse_id)
      .filter(Boolean) as string[];
    const spouses = await fetchMinimalProfilesByIds(spouseIds);

    const newSpouses = spouses.filter(
      (s) => !result.some((r) => r.id === s.id),
    );
    queue.push(...newSpouses);

    // --- Fetch children ---
    const parentIds: string[] = [];
    for (const p of currentLevel) {
      parentIds.push(p.id);
      if (p.spouse_id) {
        const spouse = spouses.find((s) => s.id === p.spouse_id);
        if (!spouse) continue;
        parentIds.push(spouse.id);
      }
    }

    const children = await fetchMinimalChildrenByParentIds(parentIds);
    for (const child of children) {
      if (!result.some((r) => r.id === child.id)) {
        const mother = spouses.find((s) => s.id === child.mother_id);
        if (!mother || mother.gender !== "female") {
          queue.push(child);
        }
        result.push(child);
      }
    }
  }

  // --- Deduplicate IDs ---
  const uniqueIds = Array.from(new Set(result.map((p) => p.id)));

  // --- FINAL FETCH: full profile info ---
  if (!uniqueIds.length) return [];

  const { data: fullProfiles, error: fullError } = await supabaseAdmin
    .from("profiles_with_relatives")
    .select("*")
    .in("id", uniqueIds)
    .eq("admin_id", targetAdminId); // still filter by admin

  if (fullError) throw fullError;

  return fullProfiles || [];
}

// export async function fetchProfiles(): Promise<ProfileWithRelatives[]> {
//   const { adminId, role, createdByAdminID, lineage_id } = await getAdminId();
//   const targetAdminId = role === "admin" ? adminId : createdByAdminID!;

//   // 1️⃣ If no lineage_id, fetch all profiles for admin
//   if (!lineage_id) {
//     const { data, error } = await supabaseAdmin
//       .from("profiles_with_relatives")
//       .select("*")
//       .eq("admin_id", targetAdminId);

//     if (error) throw error;
//     return data || [];
//   }

//   // Helper fetch by IDs
//   async function fetchProfilesByIds(
//     ids: string[],
//   ): Promise<ProfileWithRelatives[]> {
//     if (!ids.length) return [];
//     const { data, error } = await supabaseAdmin
//       .from("profiles_with_relatives")
//       .select("*")
//       .in("id", ids);
//     if (error) throw error;
//     return data || [];
//   }

//   // Helper fetch children by parent IDs
//   async function fetchChildrenByParentIds(
//     parentIds: string[],
//   ): Promise<ProfileWithRelatives[]> {
//     if (!parentIds.length) return [];
//     const { data, error } = await supabaseAdmin
//       .from("profiles_with_relatives")
//       .select("*")
//       .or(
//         `father_id.in.(${parentIds.join(",")}),mother_id.in.(${parentIds.join(",")})`,
//       );
//     if (error) throw error;
//     return data || [];
//   }

//   // 2️⃣ Start with lineage members
//   const { data: lineageData, error: lineageError } = await supabaseAdmin
//     .from("profiles_with_relatives")
//     .select("*")
//     .eq("admin_id", targetAdminId)
//     .eq("lineage_id", lineage_id);

//   if (lineageError) throw lineageError;

//   let result: ProfileWithRelatives[] = [];
//   let queue: ProfileWithRelatives[] = lineageData || [];

//   while (queue.length) {
//     const currentLevel = queue;
//     queue = [];

//     // Add current level to result
//     result.push(...currentLevel);

//     // 1️⃣ Fetch spouses of current level
//     const spouseIds = currentLevel
//       .map((p) => p.spouse_id)
//       .filter(Boolean) as string[];

//     const spouses = await fetchProfilesByIds(spouseIds);

//     // Add spouses to next level if not already in result
//     const newSpouses = spouses.filter(
//       (s) => !result.some((r) => r.id === s.id),
//     );
//     queue.push(...newSpouses);

//     // 2️⃣ Fetch children
//     const parentIds: string[] = [];
//     for (const p of currentLevel) {
//       parentIds.push(p.id);
//       // If spouse exists
//       if (p.spouse_id) {
//         const spouse = spouses.find((s) => s.id === p.spouse_id);
//         if (!spouse) continue;
//         // Female spouse rule: only fetch her children once
//         if (spouse.gender === "female") {
//           parentIds.push(spouse.id);
//         } else {
//           // Male spouse: include in recursive queue
//           parentIds.push(spouse.id);
//         }
//       }
//     }

//     const children = await fetchChildrenByParentIds(parentIds);

//     // Apply the female spouse stop rule
//     const newChildren: ProfileWithRelatives[] = [];
//     for (const child of children) {
//       if (!result.some((r) => r.id === child.id)) {
//         newChildren.push(child);

//         // If child’s mother is female spouse, do not continue recursively
//         const mother = spouses.find((s) => s.id === child.mother_id);
//         if (!mother || mother.gender !== "female") {
//           queue.push(child);
//         }
//       }
//     }
//   }

//   // Deduplicate final result
//   const uniqueProfiles = Array.from(
//     new Map(result.map((p) => [p.id, p])).values(),
//   );

//   return uniqueProfiles;
// }

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

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Deletes a profile by ID (no admin check)
 * @param id Profile ID to delete
 * @returns Deleted profile data
 */
export async function deleteProfile(id: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getSignedUrl(fileName: string | null) {
  if (!fileName) return null;

  const { data, error } = await supabaseAdmin.storage
    .from("profile-photos")
    .createSignedUrl(fileName, 3600);

  if (error) {
    console.error(error);
    return null;
  }

  return data.signedUrl;
}

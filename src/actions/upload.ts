// app/actions/upload.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function uploadPhoto(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const fileBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from("profile-photos")
    .upload(fileName, Buffer.from(fileBuffer), {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error("Photo upload failed: " + error.message);
  }

  // ✅ RETURN ONLY FILE PATH
  return fileName;
}

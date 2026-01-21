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

export async function uploadUserPhoto(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const fileBuffer = await file.arrayBuffer();

  // Upload the file
  const { error: uploadError } = await supabaseAdmin.storage
    .from("Public_User_Images") // your public bucket
    .upload(fileName, Buffer.from(fileBuffer), {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error("Photo upload failed: " + uploadError.message);
  }

  // ✅ Get public URL correctly
  const { data } = supabaseAdmin.storage
    .from("Public_User_Images")
    .getPublicUrl(fileName);

  return data.publicUrl; // <-- this is the full URL
}

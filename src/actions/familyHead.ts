"use server";

import { getServerSession } from "@/lib/get-session";
import { supabaseAdmin } from "@/lib/supabase/server";

async function getTargetAdminId(): Promise<string> {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  return session.user.role === "admin"
    ? session.user.id
    : session.user.createdByAdminID!;
}

export async function addFamilyHead(profileId: string): Promise<void> {
  const adminId = await getTargetAdminId();

  const { error } = await supabaseAdmin.from("family_heads").insert({
    admin_id: adminId,
    profile_id: profileId,
  });

  if (error) throw error;
}

export async function removeFamilyHead(profileId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("family_heads")
    .delete()
    .eq("profile_id", profileId);

  if (error) throw error;
}

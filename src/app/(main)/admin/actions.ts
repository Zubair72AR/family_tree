"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * 🔥 FULL APPLICATION DELETE
 * - Deletes ALL Supabase data by admin_id
 * - Deletes ALL Prisma users created by this admin
 * - Admin only
 * - Transaction safe (Prisma)
 */
export async function deleteApplication() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "admin") forbidden();

  const admin_id = user.id;

  /* ================================
     1️⃣ DELETE SUPABASE DATA
     ================================ */

  const supabaseTables = [
    "profiles",
    "castes",
    "educations",
    "family_branches",
    "occupations",
    "place_of_birth_city",
  ];

  for (const table of supabaseTables) {
    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq("admin_id", admin_id);

    if (error) {
      console.error(`Supabase delete failed on ${table}`, error);
      throw new Error(`Failed deleting ${table}`);
    }
  }

  /* ================================
     2️⃣ DELETE PRISMA USERS (BetterAuth)
     ================================ */

  await prisma.$transaction(async (tx) => {
    // Delete users created by this admin
    await tx.user.deleteMany({
      where: {
        createdByAdminID: admin_id,
      },
    });

    // Optional: delete admin himself
    await tx.user.delete({
      where: {
        id: admin_id,
      },
    });
  });

  return { success: true };
}

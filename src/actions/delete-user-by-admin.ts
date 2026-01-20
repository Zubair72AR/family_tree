// actions/delete-user-by-admin.ts
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

export async function deleteUserByAdmin(userId: string) {
  const session = await getServerSession();
  const admin = session?.user;

  if (!admin || admin.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    // delete accounts first
    await prisma.account.deleteMany({
      where: { userId },
    });

    // delete user
    await prisma.user.delete({
      where: {
        id: userId,
        createdByAdminID: admin.id, // safety check
      },
    });

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete user" };
  }
}

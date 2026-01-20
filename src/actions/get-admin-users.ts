// app/actions/get-admin-users.ts
"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

export async function getUsersCreatedByAdmin() {
  const session = await getServerSession();
  const admin = session?.user;

  if (!admin || admin.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const users = await prisma.user.findMany({
    where: {
      createdByAdminID: admin.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lineage_id: true,
      // createdAt: true,
      emailVerified: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

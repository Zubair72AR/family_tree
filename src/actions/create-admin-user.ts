"use server";

import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";

export async function createUserByAdmin(formData: {
  name: string;
  email: string;
  role: "editor" | "viewer";
  lineage_id?: string;
}) {
  try {
    const session = await getServerSession();
    const admin = session?.user;

    if (!admin || admin.role !== "admin")
      return { error: "Unauthorized. Only admins can create users." };

    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });
    if (existingUser) return { error: "User with this email already exists." };

    // Create user **without password**
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        emailVerified: false, // User must verify via reset link
        role: formData.role,
        ...(formData.lineage_id && { lineage_id: formData.lineage_id }),
        createdByAdminID: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create account without password (Better Auth will handle reset link)
    // await prisma.account.create({
    //   data: {
    //     id: crypto.randomUUID(),
    //     accountId: formData.email,
    //     providerId: "email",
    //     userId: user.id,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // });

    // Trigger Better Auth reset password email
    await authClient.requestPasswordReset({
      email: formData.email,
      redirectTo: "/reset-password",
    });

    return {
      success: true,
      message: "User invited successfully. Email sent to set password.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { error: error.message || "Failed to create user." };
  }
}

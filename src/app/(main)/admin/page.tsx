import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";
import { forbidden, unauthorized } from "next/navigation";
import { DeleteApplication } from "./delete-application";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  if (user.role !== "admin") forbidden();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="font-bodoni text-3xl">Admin</h1>
          <p className="text-foreground/65 mb-4 text-sm">
            You have administrator access.
          </p>
        </div>
        <DeleteApplication />
      </div>
    </main>
  );
}

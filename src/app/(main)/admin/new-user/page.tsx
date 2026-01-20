// src/app/(main)/admin/new-user/page.tsx
import NotFound from "@/app/not-found";
import { AdminUsersSection } from "@/components/Admin/AdminUsersSection";
import { getServerSession } from "@/lib/get-session";
import { fetchAdminLineages } from "@/lib/supabase/fetch";

export default async function NewUserPage() {
  // Get Session - User
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== "admin") {
    return (
      <NotFound
        title="Access Restricted"
        description="Only the family admin can share access with relatives."
        buttonLabel="View Family"
        buttonHref="/people"
      />
    );
  }

  // Get Fetch AdminLineages With Profile Qty
  const lineages = await fetchAdminLineages();

  return <AdminUsersSection lineages={lineages} />;
}

import { getServerSession } from "./get-session";

async function resolveAdminId(): Promise<string | null> {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  if (user.role === "admin") {
    return user.id;
  }

  return user.createdByAdminID ?? null;
}

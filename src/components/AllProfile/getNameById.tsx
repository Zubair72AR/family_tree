import { Profile } from "@/lib/types";

export default function getNameById(
  id: string | null | undefined,
  profiles: Profile[],
  fallback: string = "Unknown",
): string {
  if (!id) return fallback;
  const profile = profiles.find((p) => p.id === id);
  return profile ? profile.name_eng : fallback;
}

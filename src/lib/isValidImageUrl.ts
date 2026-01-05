export function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

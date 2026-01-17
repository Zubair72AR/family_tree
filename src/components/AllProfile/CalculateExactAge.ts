export default function calculateExactAge(
  dateOfBirth?: Date | string | null,
  dateOfDeath?: Date | string | null,
): string | null {
  if (!dateOfBirth) return null;

  const start = new Date(dateOfBirth);
  const end = dateOfDeath ? new Date(dateOfDeath) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (end < start) return null;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];

  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  return parts.length ? parts.join(", ") : null;
}

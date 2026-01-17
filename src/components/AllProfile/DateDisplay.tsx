type DateDisplayProps = {
  date?: Date | string | null;
  locale?: string; // default "en-GB"
  showDayName?: boolean; // e.g., Mon, Tue
  format?: "short" | "long"; // short month (Dec) or long month (December)
};

export default function DateDisplay({
  date,
  locale = "en-GB",
  showDayName = true,
  format = "short",
}: DateDisplayProps) {
  if (!date) return <span className="text-foreground/50">—</span>;

  const d = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: format,
    year: "numeric",
    weekday: showDayName ? "short" : undefined,
  };

  return <span>{d.toLocaleDateString(locale, options)}</span>;
}

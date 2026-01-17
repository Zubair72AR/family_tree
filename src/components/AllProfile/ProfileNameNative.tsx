import Link from "next/link";
import { cn } from "@/lib/utils";

type ProfileNameProps = {
  href: string;
  nameNative: string;
  className?: string;
};

export default function ProfileNameNative({
  href,
  nameNative,
  className,
}: ProfileNameProps) {
  return (
    <Link href={href} title="View Profile Details">
      <p
        className={cn(
          "font-langs text-foreground/65 hover:text-primary capitalize",
          className,
        )}
      >
        {nameNative}
      </p>
    </Link>
  );
}

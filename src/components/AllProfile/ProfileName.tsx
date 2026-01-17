import Link from "next/link";
import { cn } from "@/lib/utils";

type ProfileNameProps = {
  href: string;
  name: string;
  isAlive: boolean;
  className?: string;
};

export default function ProfileName({
  href,
  name,
  isAlive,
  className,
}: ProfileNameProps) {
  return (
    <Link href={href} title="View Profile Details">
      <p
        className={cn(
          "font-bodoni hover:text-primary capitalize",
          isAlive && "verifiedIcon",
          className,
        )}
      >
        {name}
      </p>
    </Link>
  );
}

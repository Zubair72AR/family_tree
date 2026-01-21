import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  href?: string; // make optional
  className?: string;
  src?: string | null;
  alt: string;
  gender: string;
};

export default function ProfileAvatar({
  href,
  className,
  src,
  alt,
  gender,
}: ProfileAvatarProps) {
  const Wrapper: any = href ? Link : "div"; // conditional wrapper
  const wrapperProps = href ? { href, title: "View Profile Details" } : {}; // only Link needs href/title

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "border-border/50 overflow-hidden rounded-full border-8 transition-colors duration-300 ease-in",
        gender === "male"
          ? "hover:border-[#784efd]/60"
          : "hover:border-[#ff277a]/60",
        className,
      )}
    >
      <Image
        src={
          src
            ? src
            : gender === "female"
              ? "/female_profile.svg"
              : "/male_profile.svg"
        }
        alt={alt}
        width={200}
        height={200}
        priority={false}
        className="aspect-square object-cover transition-transform duration-150 ease-in hover:scale-115"
      />
    </Wrapper>
  );
}

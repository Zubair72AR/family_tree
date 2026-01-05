import { FaGithub, FaLinkedinIn, FaBehance } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SocialIconsProps {
  divClassName?: string;
  iconClassName?: string; // For icon
}

const socials = [
  { href: "https://github.com/Zubair72AR", icon: FaGithub },
  {
    href: "https://www.linkedin.com/in/zubair-ahmed-06aa13194/",
    icon: FaLinkedinIn,
  },
  { href: "https://www.behance.net/zubairar72", icon: FaBehance },
];

export default function SocialIcons({
  divClassName,
  iconClassName,
}: SocialIconsProps) {
  return (
    <div className={cn("flex items-center justify-center", divClassName)}>
      {socials.map(({ href, icon: Icon }, idx) => (
        <Link
          key={idx}
          href={href}
          target="_blank"
          className="overflow-hidden rounded-full"
        >
          <Icon
            className={cn("transition-all duration-200 ease-in", iconClassName)}
          />
        </Link>
      ))}
    </div>
  );
}

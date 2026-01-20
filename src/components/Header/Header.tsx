import Image from "next/image";
import { ModeToggle } from "../mode-toggle";
import { UserDropdown } from "../user-dropdown";
import { getServerSession } from "@/lib/get-session";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaWhatsapp } from "react-icons/fa6";
import NavigationLink from "./NavigationLink";
import NavMobile from "./NavMobile";

export default async function Header() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) return null;
  return (
    <header>
      <div className="pad-x mx-auto flex max-w-7xl items-center justify-between gap-4 border-b py-3 md:flex-row-reverse md:border-none md:py-3.5">
        {/* WhatsApp contact button */}
        <Link
          href={"https://wa.me/923423873626"}
          target="blank"
          className="hidden text-nowrap md:block"
        >
          <Button variant={"whatsApp"} className="gap-1">
            <FaWhatsapp className="size-5" />
            <p>+92 342 3873626</p>
          </Button>
        </Link>
        {/* Logo White and Dark Mode */}
        <Link href="/">
          <Image
            src="/ft_logo.svg"
            alt="Family Tree Logo"
            width={150}
            height={50}
            priority
            className="h-12 w-auto md:h-20 dark:hidden"
          />
          <Image
            src="/ft_logo_white.svg"
            alt="Family Tree Logo"
            width={150}
            height={50}
            className="hidden h-12 w-auto md:h-20 dark:block"
          />
        </Link>

        {/* User Icon and Dark Mode Toggle */}
        <div className="flex items-center justify-end gap-3 md:min-w-40 md:flex-row-reverse">
          <UserDropdown user={user} />
          {/* <div className="hidden place-items-center sm:grid"> */}
          <ModeToggle />
          {/* </div> */}
          <NavMobile />
        </div>
      </div>
      <nav className="bg-foreground mx-auto hidden md:block">
        <NavigationLink role={user.role} />
      </nav>
    </header>
  );
}

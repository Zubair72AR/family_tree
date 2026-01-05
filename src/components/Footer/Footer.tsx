import Image from "next/image";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import SocialIcons from "./SocialIcons";
import ContactIconInfo from "./ContactIconInfo";
import QuickLink from "./QuickLink";

export default function Footer() {
  return (
    <div className="relative mt-36">
      {/* top Address / Contact Number / Email */}
      <div className="bg-primary absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-wrap items-center justify-start gap-4 p-6 shadow-lg/50 sm:gap-6 md:px-12 md:py-8 lg:flex-nowrap lg:justify-center lg:gap-8">
        {/* Phone NUmber */}
        <ContactIconInfo
          className=""
          text="Contact (WhatsApp)"
          head="+92 342 3873626"
          textClass="text-white"
          headClass="text-white rtl:text-right"
          iconClass="text-white"
          circleClass="bg-white"
          Icon={PhoneCall}
        />

        {/* Email  */}
        <ContactIconInfo
          className=""
          text="Email"
          head="hzubair717@gmail.com"
          textClass="text-white"
          headClass="text-white"
          iconClass="text-white"
          circleClass="bg-white"
          Icon={Mail}
        />

        {/* Address */}
        <ContactIconInfo
          className=""
          text="Address"
          head="Karachi, Pakistan"
          textClass="text-white"
          headClass="text-white"
          iconClass="text-white"
          circleClass="bg-white"
          Icon={MapPin}
        />
      </div>

      <div className="pad-x bg-foreground flex flex-col items-center justify-center">
        <div className="mt-28 max-w-[700px] lg:mt-24">
          {/* Logo White and Dark Mode */}
          <Link href="/">
            <Image
              src="/ft_logo.svg"
              alt="Family Tree Logo"
              width={150}
              height={50}
              className="mx-auto hidden h-22 w-auto py-2 md:h-28 dark:block"
            />
            <Image
              src="/ft_logo_white.svg"
              alt="Family Tree Logo"
              width={150}
              height={50}
              className="mx-auto h-22 w-auto py-2 md:h-28 dark:hidden"
            />
          </Link>

          {/* Company Info Text */}
          <p className="text-background/65 text-center text-sm font-light">
            FamilyTree lets you create and explore your family heritage. Add
            members, share stories, and discover your lineage in a simple and
            interactive way.
          </p>
        </div>

        <div>
          {/* Social Icons */}
          <SocialIcons
            divClassName="gap-4 mt-14"
            iconClassName="hover:bg-primary hover:text-primary-foreground text-background bg-background/15 p-2 text-3xl"
          />
          {/* Quick Links  */}
          <QuickLink />
        </div>
      </div>

      {/* Copy Right Text */}
      <div className="pad-x bg-secondary text-secondary-foreground flex flex-col items-center justify-between gap-2 py-2.5 text-center text-xs md:flex-row">
        <p className="text-center">© 2026 FamilyTree. All rights reserved.</p>
        <p>
          Developed by: <span className="font-bold">Zubair Ahmed</span>,
          <span className="ml-1">+92 342 3873626, (hzubair717@gmail.com)</span>
        </p>
      </div>
    </div>
  );
}

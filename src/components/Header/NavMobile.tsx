"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import SocialIcons from "../Footer/SocialIcons";

export default function NavMobile() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/people", label: "People" },
    { href: "/people/new", label: "Add Person" },
  ];

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="z-50 md:hidden">
      {/* <Menu onClick={handleClick} /> */}
      <button
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        className={cn(
          "relative z-10 flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out lg:hidden",
          open ? "bg-destructive p-3.5" : "p-3.5",
        )}
      >
        <span
          className={cn(
            "absolute h-[3px] rounded-full transition-all duration-300 ease-in-out",
            open
              ? "bg-primary-foreground w-[22px] rotate-45"
              : "bg-foreground w-5 -translate-y-[7px]",
          )}
        ></span>
        <span
          className={cn(
            "bg-foreground absolute h-[3px] w-5 rounded-full transition-all duration-300 ease-in-out",
            open ? "opacity-0" : "opacity-100",
          )}
        ></span>
        <span
          className={cn(
            "absolute h-[3px] rounded-full transition-all duration-300 ease-in-out",
            open
              ? "bg-primary-foreground w-[22px] translate-x-0 -rotate-45"
              : "bg-foreground w-2.5 translate-x-1.25 translate-y-[7px] rtl:-translate-x-1.25",
          )}
        ></span>
      </button>

      {/* Mobile Menu */}
      <div
        className={cn(
          "bg-foreground fixed inset-0 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full min-w-[300px] flex-col justify-between gap-4 px-8 py-14">
          <div className="flex flex-col gap-14">
            {/* Logo White and Dark Mode */}
            <Link href="/">
              <Image
                src="/ft_logo.svg"
                alt="Family Tree Logo"
                width={150}
                height={50}
                className="hidden h-14 w-auto dark:block"
              />
              <Image
                src="/ft_logo_white.svg"
                alt="Family Tree Logo"
                width={150}
                height={50}
                className="h-14 w-auto dark:hidden"
              />
            </Link>
            {/* Navigation Links */}
            <div className="w-full">
              <p className="text-background/65 px-2 py-4 text-sm tracking-[.15rem] uppercase">
                Navigation
              </p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group hover:bg-background/5 hover:text-background font-bodoni border-border/25 flex items-center justify-between border-b px-3 py-2 text-2xl",
                      isActive ? "text-background" : "text-background/65",
                    )}
                  >
                    {item.label}
                    <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                  </Link>
                );
              })}
            </div>
          </div>
          {/* Social Icons */}
          <SocialIcons
            divClassName="gap-4"
            iconClassName="hover:bg-primary hover:text-primary-foreground text-background bg-background/15 p-2 text-3xl"
          />
        </div>
      </div>
    </div>
  );
}

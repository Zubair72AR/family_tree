import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function NotSignedInCTA() {
  return (
    <div className="pad-x flex min-h-screen flex-col items-center justify-center text-center">
      {/* Welcome text */}
      <p className="text-foreground/65 text-lg tracking-widest uppercase">
        Welcome to
      </p>

      {/* Logo placeholder */}
      <div className="my-4 sm:my-8">
        <Image
          src="/ft_logo.svg"
          alt="Family Tree Logo"
          width={150}
          height={50}
          priority
          className="h-28 w-auto dark:hidden"
        />
        <Image
          src="/ft_logo_white.svg"
          alt="Family Tree Logo"
          width={150}
          height={50}
          className="hidden h-28 w-auto dark:block"
        />
      </div>

      {/* Tagline */}
      <p className="text-foreground/65 max-w-[550px] text-sm">
        Build, explore, and preserve your family history in a secure and private
        space. Create meaningful family trees, document relationships across
        generations, and keep your family’s legacy organized and protected.
      </p>
      {/* Sign in button */}
      <Link href="/sign-in" className="mt-12">
        <Button variant="primary" className="min-w-30">
          Sign In
        </Button>
      </Link>
    </div>
  );
}

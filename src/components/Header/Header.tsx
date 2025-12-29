import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="flex justify-center items-center gap-3">
      <Link href="/">Home</Link>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link href="/auth/sign-in">Sign In</Link>
      </SignedOut>
    </div>
  );
}

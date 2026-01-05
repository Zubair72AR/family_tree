"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UnauthorizedPage() {
  const pathname = usePathname();

  return (
    <main className="mx-auto grid min-h-[600px] w-full max-w-6xl place-items-center px-4 py-12">
      <div className="space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="font-bodoni text-3xl">401 - Unauthorized</h1>
          <p className="text-foreground/65 mb-4 text-sm">
            Please sign in to continue.
          </p>
        </div>
        <Link href={`/sign-in?redirect=${pathname}`}>
          <Button variant="primary">Sign in</Button>
        </Link>
      </div>
    </main>
  );
}

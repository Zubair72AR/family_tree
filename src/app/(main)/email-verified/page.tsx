import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Verified",
};

export default function EmailVerifiedPage() {
  return (
    <main className="flex min-h-[600px] items-center justify-center px-4">
      <div className="space-y-1 text-center">
        <h1 className="font-bodoni text-3xl">Email verified</h1>
        <p className="text-foreground/65 mb-4 text-sm">
          Your email has been verified successfully.
        </p>
        <Link href="/dashboard">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    </main>
  );
}

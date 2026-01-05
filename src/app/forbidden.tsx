import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto grid min-h-[600px] w-full max-w-6xl place-items-center px-4 py-12">
      <div className="space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="font-bodoni text-3xl">403 - Forbidden</h1>
          <p className="text-foreground/65 mb-4 text-sm">
            You don&apos;t have access to this page.
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}

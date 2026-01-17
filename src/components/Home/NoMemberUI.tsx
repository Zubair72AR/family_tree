import Link from "next/link";
import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";

export default function NoMemberUI() {
  return (
    <div className="pad-x flex min-h-screen flex-col items-center justify-center text-center">
      {/* Welcome text */}
      <p className="font-bodoni text-3xl">Welcome to Your Family Tree</p>

      {/* Tagline */}
      <p className="text-foreground/65 mt-2 max-w-[550px] text-sm">
        Add family members to your records. Family trees are created
        automatically using the people you add.
      </p>
      {/* Sign in button */}
      <Link href="/people/new" className="mt-6">
        <Button variant="primary" className="min-w-30">
          <UserRoundPlus />
          Add First Family Member
        </Button>
      </Link>
    </div>
  );
}

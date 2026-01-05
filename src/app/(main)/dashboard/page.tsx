import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@/lib/auth";
import { getServerSession } from "@/lib/get-session";
import { format } from "date-fns";
import { CalendarDaysIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="font-bodoni text-3xl">Dashboard</h1>
          <p className="text-foreground/65 mb-4 text-sm">
            Welcome back! Here&apos;s your account overview.
          </p>
        </div>
        {!user.emailVerified && <EmailVerificationAlert />}
        <ProfileInformation user={user} />
      </div>
    </main>
  );
}

interface ProfileInformationProps {
  user: User;
}

function ProfileInformation({ user }: ProfileInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <UserIcon className="size-5" />
          Profile Information
        </CardTitle>
        <CardDescription className="text-foreground/65 text-sm">
          Your account details and current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-32 border sm:size-24"
            />
            {user.role && (
              <Badge>
                <ShieldIcon className="size-3" />
                {user.role}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-bodoni text-2xl">{user.name}</h3>
              <p className="text-foreground/65 text-sm">{user.email}</p>
            </div>

            <div className="space-y-1">
              <div className="text-foreground/65 flex items-center gap-2 text-sm">
                <CalendarDaysIcon className="size-4" />
                Member Since
              </div>
              <p className="text-sm font-medium">
                {format(user.createdAt, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmailVerificationAlert() {
  return (
    <div className="border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/30">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <MailIcon className="size-6 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Please verify your email address to access all features.
          </span>
        </div>
        <Link href="/verify-email">
          <Button>Verify Email</Button>
        </Link>
      </div>
    </div>
  );
}

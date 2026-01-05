import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";
import { redirect, unauthorized } from "next/navigation";
import { ResendVerificationButton } from "./resend-verification-button";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function VerifyEmailPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  if (user.emailVerified) redirect("/dashboard");

  return (
    <main className="flex min-h-[600px] items-center justify-center px-4">
      <div className="space-y-1 text-center">
        <h1 className="font-bodoni text-3xl">Verify your email</h1>
        <p className="text-foreground/65 mb-4 text-sm">
          A verification email has been sent to <strong>{user.email}</strong>.
          <span className="block">
            Open your inbox and click the link to verify your account. Didn’t
            get it? Use the button below to resend.
          </span>
        </p>
        <ResendVerificationButton email={user.email} />
      </div>
    </main>
  );
}

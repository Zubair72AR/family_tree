import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      {token ? (
        <ResetPasswordUI token={token} />
      ) : (
        <div role="alert" className="text-destructive font-bodoni text-lg">
          Token is missing.
        </div>
      )}
    </main>
  );
}

interface ResetPasswordUIProps {
  token: string;
}

function ResetPasswordUI({ token }: ResetPasswordUIProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-bodoni text-3xl">Reset password</h1>
        <p className="text-foreground/65 text-sm">
          Please enter your new password below to securely update your account.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}

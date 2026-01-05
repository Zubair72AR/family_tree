import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-bodoni text-3xl">Forgot password</h1>
          <p className="text-foreground/65 text-sm">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}

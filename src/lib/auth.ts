import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, twoFactor } from "better-auth/plugins";
import db from "./db";
import { ac, roles } from "./permissions";
import { sendOtpEmail } from "./send-otp-email";
import { sendResetPasswordEmail } from "./send-reset-password-email";
import { sendVerificationEmail } from "./send-verification-email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ _, url }) => {
      void sendResetPasswordEmail({
        to: "atiqullah.naemi21@gmail.com",
        subject: "Reset your password",
        url,
      });
    },
  },

  rateLimit: {
    enabled: true,
    window: 10,
    max: 2,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: "atiqullah.naemi21@gmail.com",
        verificationUrl: url,
        userName: user.name,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
    }),
    nextCookies(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ _, otp }) {
          sendOtpEmail({ to: "atiqullah.naemi21@gmail.com", otp });
        },
      },
    }),
  ],
});

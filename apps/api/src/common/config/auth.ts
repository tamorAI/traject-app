import { db } from "@traject/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./email";
import { API_ENV } from "@traject/env/server";

/**
 * Better Auth configuration
 * Defines authentication methods, session behavior, and database integration
 * Review security defaults before production deployment
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: API_ENV.REQUIRE_EMAIL_VERIFICATION,

    // Password reset - enables /api/auth/request-password-reset endpoint
    sendResetPassword: async ({ user, url, token: _token }, _request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html: `
					<h2>Reset Your Password</h2>
					<p>Click the link below to reset your password:</p>
					<a href="${url}">Reset Password</a>
					<p>This link will expire in 1 hour.</p>
					<p>If you didn't request this, please ignore this email.</p>
				`,
      });
    },

    // Optional hook after password reset (extend for logging, notifications, etc.)
    onPasswordReset: async ({ user: _user }, _request) => {},
  },
  // Email verification (separate from emailAndPassword)
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token: _token }, _request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        html: `
					<h2>Verify Your Email</h2>
					<p>Click the link below to verify your email address:</p>
					<a href="${url}">Verify Email</a>
				`,
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: API_ENV.BETTER_AUTH_SECRET!,
  baseURL: API_ENV.BETTER_AUTH_URL,
  trustedOrigins: API_ENV.CORS_ORIGIN,
  advanced: {
    // Secure cookie defaults (adjust if deploying behind a reverse proxy)
    cookiePrefix: "auth",
    useSecureCookies: API_ENV.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      secure: API_ENV.NODE_ENV === "production",
      path: "/",
    },
    // Allow server-to-server requests from Next.js server actions
    disableCSRFCheck: API_ENV.NODE_ENV !== "production",
  },
});

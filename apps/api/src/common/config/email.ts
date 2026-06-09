import { logger } from "@/common/logger";
import { Resend } from "resend";
import { API_ENV } from "@traject/env/server";

/**
 * Email sending helper using Resend
 * Falls back to console logging if RESEND_API_KEY is not set
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  if (API_ENV.RESEND_API_KEY && API_ENV.RESEND_API_KEY.length > 0) {
    try {
      const resend = new Resend(API_ENV.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: API_ENV.EMAIL_FROM,
        to,
        subject,
        text,
        html,
      });
      if (result.error) {
        logger.error(
          { to, subject, error: result.error },
          "Failed to send email via Resend",
        );
      } else {
        logger.info(
          { to, subject, id: result.data?.id },
          "Email sent via Resend",
        );
      }
    } catch (error) {
      logger.error({ to, subject, error }, "Error sending email via Resend");
    }
  } else {
    // Development: Log to console
    logger.info({ to, subject, text }, "Email (not sent - no RESEND_API_KEY)");
  }
};

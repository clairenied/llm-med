// Dynamic import to avoid issues when RESEND_API_KEY is not set
let resend: any = null;

async function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface PasswordResetEmailData {
  to: string;
  name: string;
  resetUrl: string;
}

// Environment-based email routing for development vs production
const getEmailConfig = (userEmail: string) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    // TEMPORARY: Send to real emails in development for testing
    return {
      from: "LLM-Med <noreply@mail.llm-med.art>",
      to: userEmail, // Send to actual user email
      isDevelopment: true,
    };
  }

  // Production configuration
  return {
    from: process.env.FROM_EMAIL || "LLM-Med <noreply@mail.llm-med.art>",
    to: userEmail,
    isDevelopment: false,
  };
};

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailData) {
  // If no API key is configured, return error
  if (!process.env.RESEND_API_KEY) {
    console.error(
      "⚠️  RESEND_API_KEY not configured. Password reset email cannot be sent.",
    );
    throw new Error("Email service not configured");
  }

  try {
    const resendClient = await getResendClient();
    if (!resendClient) {
      throw new Error("Failed to initialize email client");
    }

    // Get environment-appropriate email configuration
    const emailConfig = getEmailConfig(to);
    console.log(
      `📧 ${emailConfig.isDevelopment ? "DEV" : "PROD"} mode: ${emailConfig.from} → ${emailConfig.to}`,
    );

    const { data, error } = await resendClient.emails.send({
      from: emailConfig.from,
      to: [emailConfig.to],
      subject: "Reset Your Password - LLM-Med Review Tracker",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #495057; margin-top: 0;">Hello ${name || "there"},</h2>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                You requested a password reset for your LLM-Med Review Tracker account. Click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Reset My Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6c757d; margin-top: 25px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; color: #007bff; word-break: break-all; background: #f1f3f4; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                <p style="font-size: 14px; color: #6c757d; margin: 0;">
                  <strong>Security Note:</strong> This link will expire in 24 hours. If you didn't request this password reset, you can safely ignore this email.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
              <p>LLM-Med Review Tracker</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error("Failed to send password reset email");
    }

    const logMessage = emailConfig.isDevelopment
      ? `✅ DEV: Password reset email sent to test address: ${emailConfig.to}`
      : `✅ PROD: Password reset email sent successfully: ${data?.id}`;

    console.log(logMessage);

    return {
      success: true,
      message:
        "Password reset instructions have been sent to your email address.",
      emailId: data?.id,
    };
  } catch (error) {
    console.error("Email service error:", error);
    throw new Error("Failed to send password reset email");
  }
}

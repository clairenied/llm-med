/**
 * Email Template Utilities
 *
 * Provides template processing and placeholder replacement for emails.
 * Supported placeholders: {{firstName}}, {{lastName}}, {{email}}, {{signInUrl}}
 */

export interface TemplatePlaceholders {
  firstName?: string;
  lastName?: string;
  email?: string;
  signInUrl?: string;
}

/**
 * Available placeholders with descriptions for the UI
 */
export const AVAILABLE_PLACEHOLDERS = [
  { key: "{{firstName}}", description: "Recipient's first name" },
  { key: "{{lastName}}", description: "Recipient's last name" },
  { key: "{{email}}", description: "Recipient's email address" },
  { key: "{{signInUrl}}", description: "Magic link sign-in URL" },
];

/**
 * Replace placeholders in a template string with actual values
 */
export function processTemplate(
  template: string,
  placeholders: TemplatePlaceholders
): string {
  let result = template;

  // Replace each placeholder with its value or empty string
  result = result.replace(/\{\{firstName\}\}/g, placeholders.firstName || "");
  result = result.replace(/\{\{lastName\}\}/g, placeholders.lastName || "");
  result = result.replace(/\{\{email\}\}/g, placeholders.email || "");
  result = result.replace(/\{\{signInUrl\}\}/g, placeholders.signInUrl || "");

  return result;
}

/**
 * Process both subject and body of an email template
 */
export function processEmailTemplate(
  subject: string,
  body: string,
  placeholders: TemplatePlaceholders
): { subject: string; body: string } {
  return {
    subject: processTemplate(subject, placeholders),
    body: processTemplate(body, placeholders),
  };
}

/**
 * Default invitation template HTML
 */
export const DEFAULT_INVITATION_TEMPLATE = {
  name: "Grader Invitation",
  subject: "Invitation to Grade Peer Reviews - Urology AI Reviewer Project",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
  </div>

  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
    <p style="font-size: 16px;">Hi {{firstName}},</p>

    <p style="font-size: 16px;">Thanks so much for participating in our project to create an artificial intelligence urology manuscript reviewer! We're in the process of using real reviews to teach the AI reviewer, and we need humans like you to grade current human reviews.</p>

    <p style="font-size: 16px;">You'll be presented with a synopsis of a paper, its revisions, and its reviews. You'll grade reviews in 5 domains: clinical relevance, methodology, results, writing clarity, and ethical considerations. You'll choose for each domain whether it is very good, good, poor, very poor, or not applicable.</p>

    <p style="font-size: 16px;">A link to the paper is available, but we hope that the paper summary will meet your assessment needs and lighten the load of grading reviews, which shouldn't be too great.</p>

    <p style="font-size: 16px;">We really appreciate your help with this. We've made logging into the system easy with magic links! So please click the button below to sign up!</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{signInUrl}}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        Sign Up Now
      </a>
    </div>

    <p style="font-size: 16px;">Thanks so much,<br>The Urology AI Reviewer team</p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
    <p>Urology AI Reviewer Project</p>
  </div>
</body>
</html>`,
  type: "INVITATION" as const,
  isDefault: true,
};

/**
 * Default communication template HTML
 */
export const DEFAULT_COMMUNICATION_TEMPLATE = {
  name: "Progress Reminder",
  subject: "Reminder: Reviews Awaiting Your Grades",
  body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Grading Reminder</h1>
  </div>

  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
    <h2 style="color: #495057; margin-top: 0;">Hi {{firstName}},</h2>

    <p style="font-size: 16px;">This is a friendly reminder that there are peer reviews waiting for your grades in the LLM-Med Review Tracker.</p>

    <p style="font-size: 16px;">Your contributions are valuable to our research on improving AI-assisted peer review evaluation.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{signInUrl}}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
        Continue Grading
      </a>
    </div>

    <p style="font-size: 14px; color: #6c757d;">
      If you have any questions, please reply to this email.
    </p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
    <p>Thank you for your participation!</p>
    <p>LLM-Med Review Tracker</p>
  </div>
</body>
</html>`,
  type: "COMMUNICATION" as const,
  isDefault: true,
};

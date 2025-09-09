import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface InvitationEmailData {
  email: string;
  role: string;
  invitationId: string;
  inviterName?: string;
}

export async function sendInvitationEmail(data: InvitationEmailData) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  const signupUrl = `${process.env.NEXTAUTH_URL}/auth/signup?invitation=${data.invitationId}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invitation to LLM-Med Review Tracker</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 LLM-Med Review Tracker</h1>
            <p>You've been invited to join our research platform</p>
          </div>
          <div class="content">
            <h2>Welcome!</h2>
            <p>You've been invited to join <strong>LLM-Med Review Tracker</strong> as a <strong>${data.role.toLowerCase()}</strong>.</p>
            
            <p>Our platform helps researchers track and review medical literature, with a focus on AI and machine learning applications in healthcare.</p>
            
            <p>Click the button below to create your account:</p>
            
            <a href="${signupUrl}" class="button">Accept Invitation & Sign Up</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${signupUrl}
            </p>
            
            <p><strong>Note:</strong> This invitation expires in 7 days.</p>
            
            <div class="footer">
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
              <p>LLM-Med Review Tracker</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const emailText = `
You've been invited to join LLM-Med Review Tracker as a ${data.role.toLowerCase()}.

Our platform helps researchers track and review medical literature, with a focus on AI and machine learning applications in healthcare.

To accept this invitation and create your account, visit:
${signupUrl}

This invitation expires in 7 days.

If you didn't expect this invitation, you can safely ignore this email.

LLM-Med Review Tracker
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'LLM-Med <noreply@llm-med.com>',
      to: [data.email],
      subject: `Invitation to join LLM-Med Review Tracker as ${data.role.toLowerCase()}`,
      html: emailHtml,
      text: emailText,
    });

    console.log('✅ Invitation email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Failed to send invitation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping welcome email');
    return { success: false, error: 'Email service not configured' };
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to LLM-Med Review Tracker</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Welcome to LLM-Med!</h1>
            <p>Your account has been created successfully</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Welcome to <strong>LLM-Med Review Tracker</strong>. Your account has been created and you're ready to start exploring medical literature and AI research.</p>
            
            <p>Here's what you can do:</p>
            <ul>
              <li>📖 Browse and search medical manuscripts</li>
              <li>✍️ Create and track reviews</li>
              <li>📊 Manage manuscript versions</li>
              <li>🤝 Collaborate with other researchers</li>
            </ul>
            
            <a href="${process.env.NEXTAUTH_URL}" class="button">Start Exploring</a>
            
            <div class="footer">
              <p>Happy researching!</p>
              <p>The LLM-Med Team</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'LLM-Med <noreply@llm-med.com>',
      to: [email],
      subject: 'Welcome to LLM-Med Review Tracker!',
      html: emailHtml,
    });

    console.log('✅ Welcome email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"MOMM System" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text: text || '',
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  username: string
) {
  const subject = 'Password Reset Request - MOMM System';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .email-wrapper {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1f2937;
      font-size: 20px;
      margin-top: 0;
    }
    .content p {
      color: #4b5563;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #2563eb !important;
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%) !important;
      color: #ffffff !important;
      text-decoration: none !important;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
      font-size: 16px;
      mso-padding-alt: 0;
      mso-text-raise: 0;
    }
    .button:hover {
      background-color: #1d4ed8 !important;
      background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%) !important;
    }
    /* Fallback styles for Outlook */
    .button-td {
      border-radius: 6px;
      background-color: #2563eb;
    }
    .button-a {
      background-color: #2563eb;
      border: 1px solid #2563eb;
      border-radius: 6px;
      color: #ffffff;
      display: inline-block;
      font-family: sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 44px;
      text-align: center;
      text-decoration: none;
      width: 200px;
      -webkit-text-size-adjust: none;
      mso-hide: all;
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 0;
      color: #1e40af;
      font-size: 14px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 12px;
      margin: 5px 0;
    }
    .link {
      color: #2563eb;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      
      <div class="content">
        <h2>Hello ${username},</h2>
        
        <p>We received a request to reset your password for your MOMM System account. If you didn't make this request, you can safely ignore this email.</p>
        
        <p>To reset your password, click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="14%" stroke="f" fillcolor="#2563eb">
          <w:anchorlock/>
          <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:600;">Reset Your Password</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${resetUrl}" class="button" style="background-color: #2563eb !important; color: #ffffff !important; text-decoration: none !important; padding: 14px 32px; border-radius: 6px; font-weight: 600; display: inline-block;">Reset Your Password</a>
          <!--<![endif]-->
        </div>
        
        <div class="info-box">
          <p><strong>This link will expire in 1 hour</strong></p>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p class="link">${resetUrl}</p>
        
        <p>For security reasons, this password reset link can only be used once.</p>
      </div>
      
      <div class="footer">
        <p><strong>MOMM System</strong> - Minutes of Meeting Management</p>
        <p>This is an automated message, please do not reply to this email.</p>
        <p>If you didn't request a password reset, please contact your system administrator.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Password Reset Request - MOMM System

Hello ${username},

We received a request to reset your password for your MOMM System account. If you didn't make this request, you can safely ignore this email.

To reset your password, visit this link:
${resetUrl}

This link will expire in 1 hour.

For security reasons, this password reset link can only be used once.

---
MOMM System - Minutes of Meeting Management
This is an automated message, please do not reply to this email.
  `;

  return sendEmail({ to: email, subject, html, text });
}

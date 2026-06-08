const nodemailer = require('nodemailer');

// Create reusable SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send OTP email
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} name - Recipient's name
 */
const sendOTPEmail = async (toEmail, otp, name = 'Member') => {
  const transporter = createTransporter();

  const fromName = process.env.SMTP_FROM_NAME || 'MLM System';
  const fromEmail = process.env.SMTP_USER;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    subject: `${otp} - Your MLM Registration OTP Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
      </head>
      <body style="margin:0;padding:0;background:#090d16;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#090d16;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:520px;width:100%;">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#06b6d4);padding:32px;text-align:center;">
                    <div style="font-size:32px;margin-bottom:8px;">🔐</div>
                    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;">OTP Verification</h1>
                    <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">MLM Member Registration</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <p style="color:#9ca3af;font-size:15px;margin:0 0 20px;">Hi <strong style="color:#f3f4f6;">${name}</strong>,</p>
                    <p style="color:#9ca3af;font-size:14px;margin:0 0 28px;line-height:1.6;">
                      You have requested to register a new MLM account. Use the OTP code below to verify your email address. This code is valid for <strong style="color:#f3f4f6;">10 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <div style="background:#1f2937;border:2px dashed rgba(99,102,241,0.4);border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
                      <p style="color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your OTP Code</p>
                      <div style="font-size:42px;font-weight:800;letter-spacing:14px;color:#fff;background:linear-gradient(135deg,#6366f1,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                        ${otp}
                      </div>
                    </div>

                    <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:14px 16px;margin:0 0 24px;">
                      <p style="color:#ef4444;font-size:13px;margin:0;">
                        ⚠️ Do not share this OTP with anyone. Our team will never ask for your OTP.
                      </p>
                    </div>

                    <p style="color:#6b7280;font-size:13px;margin:0;line-height:1.6;">
                      If you didn't request this, please ignore this email. Your account is safe.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#0f172a;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <p style="color:#4b5563;font-size:12px;margin:0;">
                      © ${new Date().getFullYear()} MLM System. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `Hi ${name},\n\nYour MLM Registration OTP Code is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nDo NOT share this OTP with anyone.\n\n© ${new Date().getFullYear()} MLM System`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { sendOTPEmail };

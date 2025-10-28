import { sendEmail } from "./send-email.js"

export function sendPasswordResetEmail({
  token,
  url,
  user
}: {
  token: string
  user: { email: string; name: string }
  url: string
}) {
  console.debug({ token, url, user })
  return sendEmail({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    subject: "Reset your password",
    to: user.email
  })
}

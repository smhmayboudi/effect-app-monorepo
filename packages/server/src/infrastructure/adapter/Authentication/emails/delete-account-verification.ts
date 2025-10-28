import { sendEmail } from "./send-email.js"

export async function sendDeleteAccountVerificationEmail({
  token,
  url,
  user
}: {
  token: string
  url: string
  user: { email: string; name: string }
}) {
  console.debug({ token, url, user })
  await sendEmail({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirm Account Deletion</h2>
        <p>Hello ${user.name},</p>
        <p>We're sorry to see you go! Please confirm your account deletion by clicking the button below:</p>
        <a href="${url}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Confirm Deletion</a>
        <p>If you don't have an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    subject: "Delete your account",
    to: user.email
  })
}

import { sendEmail } from "./send-email.js"

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  console.debug({ user })
  await sendEmail({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our App!</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for signing up for our app! We're excited to have you on board.</p>
        <p>Best regards,
        <br>
        Your App Team</p>
      </div>
    `,
    subject: "Welcome to Our App!",
    to: user.email
  })
}

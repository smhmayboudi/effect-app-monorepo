import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY ?? "")

export async function sendEmail({
  html,
  subject,
  to
}: {
  html: string
  subject: string
  to: string
}) {
  console.debug({ html, subject, to })
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "smhmayboudi@gmail.com",
    to: [to],
    subject,
    html
  })
}

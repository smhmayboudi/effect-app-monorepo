import { sendEmail } from "./send-email.js"

export async function sendOrganizationInviteEmail({
  email,
  invitation,
  inviter,
  organization
}: {
  email: string
  invitation: { id: string }
  inviter: { name: string }
  organization: { name: string }
}) {
  console.debug({ email, invitation, inviter, organization })
  await sendEmail({
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You're invited to join ${organization.name}</h2>
        <p>Hello ${inviter.name},</p>
        <p>${inviter.name} invited you to join the ${organization.name} organization. Please click the button below to accept/reject the invitation:</p>
        <a href="${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Manage Invitation</a>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    subject: `You're invited to join the ${organization.name} organization`,
    to: email
  })
}

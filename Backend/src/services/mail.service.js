import { Resend } from "resend"

/**
 * Initialize Resend email client
 */
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send a forgot password email with a reset link
 * @param {string} email - Recipient's email
 * @param {string} resetToken - The unique reset token
 */
export const sendForgotPasswordEmail = async (email, resetToken) => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured in .env")
    }

    try {
        // Construct the reset link based on FRONTEND_URL
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

        const result = await resend.emails.send({
            from: "noreply@resend.dev", // Use Resend's default sender or configure your domain
            to: email,
            subject: "Password Reset Request - Financial Atelier",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #10b981;">Financial Atelier</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your Financial Atelier account. Click the button below to set a new password. This link will expire in 15 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p>If you didn't request this change, you can safely ignore this email.</p>
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">
                        Or copy and paste this link in your browser:<br/>
                        <a href="${resetUrl}">${resetUrl}</a>
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply directly.</p>
                </div>
            `,
        })

        if (result.error) {
            throw new Error(result.error.message)
        }

        console.log(`✓ Password reset email sent to ${email}`)
        console.log(`Email ID: ${result.data?.id}`)
        return result.data
    } catch (error) {
        console.error(`✗ Error sending password reset email to ${email}:`, error.message)
        throw new Error(`Failed to send reset email: ${error.message}`)
    }
}

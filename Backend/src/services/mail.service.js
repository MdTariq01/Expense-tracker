import nodemailer from "nodemailer"

/**
 * Configure email transporter using SMTP
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

/**
 * Send a forgot password email with a reset link
 * @param {string} email - Recipient's email
 * @param {string} resetToken - The unique reset token
 */
export const sendForgotPasswordEmail = async (email, resetToken) => {
    // Construct the reset link based on CORS_ORIGIN (fallback to localhost)
    const frontendUrl = process.env.CORS_ORIGIN?.split(',')[0] || "http://localhost:5173"
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

    const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || "noreply@financialatelier.com",
        to: email,
        subject: "Password Reset Request - Financial Atelier",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #10b981;">Financial Atelier</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password for your Financial Atelier account. Click the button below to set a new password. This link will expire in 1 hour.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p>If you didn't request this change, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply directly.</p>
            </div>
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log(`Password reset email sent to ${email}`)
    } catch (error) {
        console.error("Error sending email:", error)
        throw new Error("Failed to send reset email")
    }
}

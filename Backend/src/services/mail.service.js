import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendForgotPasswordEmail = async (email, resetToken) => {
    const frontendUrl = process.env.FRONTEND_URL || "https://expense-tracker-xi-five-35.vercel.app/"
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

    const result = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Password Reset Request - Financial Atelier",
        html: `
            <p>Click to reset your password (expires in 15 mins):</p>
            <a href="${resetUrl}">${resetUrl}</a>
        `,
    })

    if (result.error) {
        throw new Error(result.error.message)
    }
}
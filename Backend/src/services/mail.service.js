import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})

export const sendForgotPasswordEmail = async (email, resetToken) => {
    const frontendUrl = process.env.FRONTEND_URL || "https://expense-tracker-xi-five-35.vercel.app/"
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`

    await transporter.sendMail({
        from: `"Financial Atelier" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request - Financial Atelier",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #10b981;">Financial Atelier</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below — this link expires in 15 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p>If you didn't request this, ignore this email.</p>
                <p style="font-size: 12px; color: #666;">Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
            </div>
        `,
    })
}
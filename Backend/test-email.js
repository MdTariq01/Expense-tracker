import { Resend } from "resend"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.resolve(__dirname, ".env")
console.log("📁 Loading .env from:", envPath)
console.log("✓ File exists:", fs.existsSync(envPath))

const result = dotenv.config({ path: envPath })
if (result.error) {
  console.error("❌ Error loading .env:", result.error)
} else {
  console.log("✓ .env loaded successfully")
  console.log("✓ Variables loaded:", Object.keys(result.parsed || {}).length)
  console.log("✓ Loaded variables:", Object.keys(result.parsed || {}))
}

console.log("✓ RESEND_API_KEY value:", process.env.RESEND_API_KEY ? "✅ Found" : "❌ Not found")
console.log("✓ FRONTEND_URL value:", process.env.FRONTEND_URL)

async function testEmail() {
  console.log("\n════════════════════════════════════════")
  console.log("📧 Email Configuration Test (Resend)")
  console.log("════════════════════════════════════════\n")

  if (!process.env.RESEND_API_KEY) {
    console.error("❌ ERROR: RESEND_API_KEY not found in .env")
    console.error("\nPlease add your Resend API key to .env:")
    console.error("  RESEND_API_KEY=re_xxxxxxxxxxxxx")
    console.error("\nGet your API key from: https://resend.com/api-keys")
    process.exit(1)
  }

  console.log("✅ RESEND_API_KEY found")
  console.log(`   Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`)
  console.log(`   Frontend URL: ${process.env.FRONTEND_URL}\n`)

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    console.log("🔄 Sending test email via Resend...")
    
    const emailResponse = await resend.emails.send({
      from: "noreply@resend.dev",
      to: "delivered@resend.dev",
      subject: "✅ Resend Email Configuration Test",
      html: `<h1>Email Test Successful!</h1><p>Your Resend configuration is working.</p>`,
    })

    if (emailResponse.error) {
      throw new Error(`Resend API error: ${emailResponse.error.message}`)
    }

    console.log("✅ Test email sent successfully!")
    console.log(`📧 Email ID: ${emailResponse.data.id}`)
    console.log("\n════════════════════════════════════════")
    console.log("✨ Resend email configuration is working!")
    console.log("════════════════════════════════════════")
  } catch (error) {
    console.error("❌ ERROR: Failed to send email via Resend")
    console.error("\n🔍 Error Details:")
    console.error(error.message || error)
    console.error("\n📋 Troubleshooting Steps:")
    console.error("1. Verify your RESEND_API_KEY is correct")
    console.error("2. Check your Resend account status at: https://resend.com")
    console.error("3. Ensure your API key is active and has proper permissions")
    console.error("4. If you just created the key, wait a moment and try again")
    process.exit(1)
  }
}

testEmail()



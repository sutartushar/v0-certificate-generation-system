import nodemailer from "nodemailer"
import fs from "fs"

// Initialize transporter
let transporter = null

function getTransporter() {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  return transporter
}

export async function sendCertificateEmail(email, certificateData) {
  const { name, jpgPath, pdfPath, certificateId } = certificateData

  const transporter = getTransporter()

  // Verify files exist
  if (!fs.existsSync(jpgPath)) {
    throw new Error(`JPG file not found: ${jpgPath}`)
  }
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF file not found: ${pdfPath}`)
  }

  const attachments = [
    {
      filename: `${certificateId}.jpg`,
      path: jpgPath,
    },
    {
      filename: `${certificateId}.pdf`,
      path: pdfPath,
    },
  ]

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: `Your Certificate of Completion - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a8a;">Certificate of Completion</h1>
        <p>Dear ${name},</p>
        <p>Congratulations! Your certificate of completion has been generated and is attached to this email.</p>
        <p>You will find two versions attached:</p>
        <ul>
          <li><strong>JPG Format:</strong> For viewing and sharing on digital platforms</li>
          <li><strong>PDF Format:</strong> For printing and official records</li>
        </ul>
        <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Certificate Details:</strong><br>
          Certificate ID: ${certificateId}
        </p>
        <p>If you have any questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br>Certificate Generation Team</p>
      </div>
    `,
    attachments,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("[v0] Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

export async function testEmailConnection() {
  const transporter = getTransporter()
  try {
    await transporter.verify()
    return { success: true, message: "Email connection verified" }
  } catch (error) {
    console.error("[v0] Email connection failed:", error)
    throw new Error(`Email connection failed: ${error.message}`)
  }
}

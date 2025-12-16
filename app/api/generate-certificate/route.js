import { NextResponse } from "next/server"
import { generateCertificate } from "@/lib/certificate-generator"
import { sendCertificateEmail } from "@/lib/email-service"

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ["name", "email", "gstNumber", "businessName", "businessAddress"]
    const missing = required.filter((field) => !body[field])

    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    console.log("[v0] Generating certificate for:", body.name)

    // Generate certificate
    const certificateData = await generateCertificate(body)

    console.log("[v0] Certificate generated, sending email...")

    // Send email
    await sendCertificateEmail(body.email, {
      ...certificateData,
      name: body.name,
    })

    console.log("[v0] Certificate emailed to:", body.email)

    return NextResponse.json(
      {
        success: true,
        message: "Certificate generated and sent successfully",
        certificateId: certificateData.certificateId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in generate-certificate route:", error)
    return NextResponse.json({ error: error.message || "Failed to generate certificate" }, { status: 500 })
  }
}

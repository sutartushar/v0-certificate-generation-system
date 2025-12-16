import { createCanvas } from "canvas"
import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

// Create certificates directory if it doesn't exist
const certificatesDir = path.join(process.cwd(), "public", "certificates")
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true })
}

export async function generateCertificate(data) {
  const { name, email, gstNumber, businessName, businessAddress } = data

  // Generate certificate ID
  const certificateId = `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Generate JPG
  const jpgPath = await generateJPG(certificateId, {
    name,
    gstNumber,
    businessName,
    businessAddress,
  })

  // Generate PDF
  const pdfPath = await generatePDF(certificateId, {
    name,
    gstNumber,
    businessName,
    businessAddress,
  })

  return {
    certificateId,
    jpgPath,
    pdfPath,
    fileName: certificateId,
  }
}

async function generateJPG(certificateId, data) {
  const width = 1200
  const height = 800
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#1e3a8a")
  gradient.addColorStop(1, "#1e40af")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Border
  ctx.strokeStyle = "#fbbf24"
  ctx.lineWidth = 8
  ctx.strokeRect(20, 20, width - 40, height - 40)

  // Inner border
  ctx.strokeStyle = "#fbbf24"
  ctx.lineWidth = 3
  ctx.strokeRect(40, 40, width - 80, height - 80)

  // Certificate title
  ctx.fillStyle = "#fbbf24"
  ctx.font = "bold 60px serif"
  ctx.textAlign = "center"
  ctx.fillText("CERTIFICATE OF COMPLETION", width / 2, 120)

  // Decorative line
  ctx.strokeStyle = "#fbbf24"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(200, 160)
  ctx.lineTo(width - 200, 160)
  ctx.stroke()

  // Main content
  ctx.fillStyle = "#ffffff"
  ctx.font = "24px serif"
  ctx.textAlign = "center"
  ctx.fillText("This is to certify that", width / 2, 250)

  // Name (highlight)
  ctx.fillStyle = "#fbbf24"
  ctx.font = "bold 48px serif"
  ctx.fillText(data.name, width / 2, 330)

  // Below name
  ctx.fillStyle = "#ffffff"
  ctx.font = "20px serif"
  ctx.fillText("has successfully completed the requirements", width / 2, 390)

  // Details section
  ctx.font = "18px serif"
  const detailsX = 100
  let detailsY = 470
  const lineHeight = 45

  ctx.fillStyle = "#ffffff"
  ctx.fillText(`Business: ${data.businessName}`, detailsX, detailsY)
  detailsY += lineHeight

  ctx.fillText(`GST Number: ${data.gstNumber}`, detailsX, detailsY)
  detailsY += lineHeight

  ctx.fillText(`Address: ${data.businessAddress}`, detailsX, detailsY)

  // Date and signature area
  ctx.fillStyle = "#ffffff"
  ctx.font = "16px serif"
  ctx.textAlign = "left"
  ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 100, 720)
  ctx.textAlign = "right"
  ctx.fillText("Authorized Signature", width - 100, 720)

  const jpgPath = path.join(certificatesDir, `${certificateId}.jpg`)

  try {
    // canvas.toBuffer requires a callback for JPEG
    const buffer = await new Promise((resolve, reject) => {
      canvas.toBuffer(
        (err, buf) => {
          if (err) reject(err)
          resolve(buf)
        },
        "image/jpeg",
        { quality: 0.95 },
      )
    })

    fs.writeFileSync(jpgPath, buffer)
    console.log("[v0] JPG generated:", jpgPath)
  } catch (error) {
    console.log("[v0] JPEG generation failed, using PNG fallback:", error.message)
    // Fallback to PNG if JPEG fails
    const pngBuffer = canvas.toBuffer("image/png")
    const pngPath = jpgPath.replace(".jpg", ".png")
    fs.writeFileSync(pngPath, pngBuffer)
    console.log("[v0] PNG generated:", pngPath)
    return pngPath
  }

  return jpgPath
}

async function generatePDF(certificateId, data) {
  const pdfPath = path.join(certificatesDir, `${certificateId}.pdf`)

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [1200, 800],
      margin: 20,
    })

    const stream = fs.createWriteStream(pdfPath)

    doc.pipe(stream)

    // Background gradient simulation
    doc.fillColor("#1e3a8a").rect(20, 20, 1160, 760).fill()

    // Border
    doc.strokeColor("#fbbf24").lineWidth(8).rect(20, 20, 1160, 760).stroke()

    doc.strokeColor("#fbbf24").lineWidth(3).rect(40, 40, 1120, 720).stroke()

    // Title
    doc.fillColor("#fbbf24").fontSize(60).font("Courier-Bold").text("CERTIFICATE OF COMPLETION", 0, 100, {
      align: "center",
      width: 1200,
    })

    // Decorative line
    doc.strokeColor("#fbbf24").lineWidth(2).moveTo(200, 160).lineTo(1000, 160).stroke()

    // Subtitle
    doc.fillColor("#ffffff").fontSize(24).font("Courier").text("This is to certify that", 0, 250, {
      align: "center",
      width: 1200,
    })

    // Name
    doc.fillColor("#fbbf24").fontSize(48).font("Courier-Bold").text(data.name, 0, 330, {
      align: "center",
      width: 1200,
    })

    // Below name
    doc.fillColor("#ffffff").fontSize(20).font("Courier").text("has successfully completed the requirements", 0, 390, {
      align: "center",
      width: 1200,
    })

    // Details
    doc.fontSize(18).text(`Business: ${data.businessName}`, 100, 470)
    doc.text(`GST Number: ${data.gstNumber}`, 100, 510)
    doc.text(`Address: ${data.businessAddress}`, 100, 550)

    // Footer
    doc.fontSize(16).text(`Date: ${new Date().toLocaleDateString()}`, 100, 720)
    doc.text("Authorized Signature", 900, 720)

    doc.end()

    stream.on("finish", () => {
      console.log("[v0] PDF generated:", pdfPath)
      resolve(pdfPath)
    })
    stream.on("error", reject)
  })
}

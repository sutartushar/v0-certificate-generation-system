# Certificate Generation and Email Delivery System

A Node.js/Next.js application that generates professional certificates dynamically and delivers them via email.

## Features

- **Dynamic Certificate Generation**: Creates certificates with custom data (name, business info, GST number)
- **Multiple Formats**: Generates both JPG and PDF versions
- **Automated Email Delivery**: Sends certificates automatically to recipient's email
- **Professional Design**: Blue and gold themed certificate template
- **Simple Web Interface**: Easy-to-use form for certificate generation

## Project Structure

```
├── app/
│   ├── page.jsx                 # Home page with certificate form
│   ├── layout.jsx              # Root layout
│   ├── api/
│   │   └── generate-certificate/
│   │       └── route.js        # API endpoint for certificate generation
│   └── globals.css             # Global styles
├── components/
│   └── certificate-form.jsx    # Certificate submission form component
├── lib/
│   ├── certificate-generator.js # Certificate generation logic
│   └── email-service.js        # Email delivery service
└── public/
    └── certificates/           # Generated certificates storage
```

## Setup Instructions

### 1. Install Dependencies

The project includes all required dependencies:
- `canvas` - For JPG generation
- `pdfkit` - For PDF generation
- `nodemailer` - For email delivery

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your email provider credentials:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

**For Gmail Users:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the generated password in `SMTP_PASSWORD`

**For Other Email Providers:**
Use your provider's SMTP settings and credentials

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## How It Works

### Certificate Generation Flow

1. User fills out the form with:
   - Full Name
   - Email Address
   - GST Number
   - Business Name
   - Business Address

2. Form submits to `/api/generate-certificate`

3. Backend:
   - Validates all required fields
   - Generates JPG certificate using Canvas API
   - Generates PDF certificate using PDFKit
   - Stores both files in `/public/certificates`
   - Sends email with both attachments via Nodemailer

4. User receives email with certificate in both formats

### Certificate Template

The certificate features:
- Professional blue and gold color scheme
- Dynamic data population
- Business information display
- Date of issuance
- Signature area
- Decorative borders

## API Reference

### POST `/api/generate-certificate`

Generates and sends a certificate.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "gstNumber": "27AABCT1234H1Z0",
  "businessName": "ABC Corporation",
  "businessAddress": "123 Business Street, City, State 12345"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Certificate generated and sent successfully",
  "certificateId": "cert-1702000000000-abc123def"
}
```

**Response (Error):**
```json
{
  "error": "Missing required fields: name, email"
}
```

## Troubleshooting

### Email Not Sending

1. **Check environment variables**: Ensure all SMTP credentials are correctly set in `.env.local`
2. **SMTP connection**: Verify your email provider allows SMTP access
3. **Gmail specific**: Check if "Less secure apps" needs to be enabled or use App Passwords
4. **Check logs**: Look for error messages in the console

### Certificate Files Not Generating

1. Ensure `/public/certificates` directory exists (auto-created)
2. Check file system permissions
3. Review server logs for canvas/pdfkit errors

### File Size Issues

- JPG files are typically 50-100KB
- PDF files are typically 30-50KB
- Check available disk space if generation fails

## Customization

### Modify Certificate Design

Edit `lib/certificate-generator.js`:
- Change colors in gradient/fillStyle
- Adjust text size and positioning
- Add logos or additional elements
- Modify certificate text and layout

### Change Email Template

Edit the HTML in `lib/email-service.js` `mailOptions.html` section

### Adjust SMTP Settings

Update environment variables based on your email provider's requirements

## Security Considerations

- Never commit `.env.local` to version control
- Use App Passwords instead of main account password (Gmail)
- Keep SMTP credentials secure
- Consider rate limiting for production
- Validate all user inputs server-side

## License

MIT

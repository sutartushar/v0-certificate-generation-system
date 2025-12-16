"use client"
import { Card } from "@/components/ui/card"
import CertificateForm from "@/components/certificate-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Certificate Generator</h1>
              <p className="text-gray-600">Generate and deliver certificates via email instantly</p>
            </div>

            <CertificateForm />
          </div>
        </Card>

        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-75">Generated certificates will be sent to your email in JPG and PDF formats</p>
        </div>
      </div>
    </main>
  )
}

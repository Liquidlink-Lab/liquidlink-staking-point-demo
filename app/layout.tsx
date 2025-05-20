import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ToastProvider } from "@/components/ui/toast"
import { ToastViewport } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <ToastProvider>
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };

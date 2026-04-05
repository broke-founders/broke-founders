import type { Metadata } from "next"
import { Playfair_Display, Instrument_Sans } from "next/font/google"
import "./globals.css"

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400","600","700","800","900"],
  style: ["normal","italic"],
  variable: "--font-serif",
})

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400","500","600"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Broke Founders — For builders who are almost there",
  description: "Where skilled builders find each other. No salaries. No equity negotiation. Declare your scope, build together, split what it earns.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
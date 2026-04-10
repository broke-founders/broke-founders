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
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Broke Founders — For builders who are almost there",
  description: "Skills for equity. Build together. Split what it earns.",
  openGraph: {
    title: "Broke Founders — For builders who are almost there",
    description: "Skills for equity. Build together. Split what it earns.",
    url: "https://broke-founders.vercel.app",
    type: "website",
    images: [{ url: "https://broke-founders.vercel.app/og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Broke Founders — For builders who are almost there",
    description: "Skills for equity. Build together. Split what it earns.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Krit | AI, Data & Digital Builder",
    template: "%s | Krit",
  },
  description:
    "Personal portfolio website for AI, data dashboards, web applications, and content automation systems.",
  keywords: [
    "Krit",
    "AI Builder",
    "Data Dashboard",
    "Web Developer",
    "Next.js",
    "React",
    "Power BI",
    "AI Agent",
    "Digital Builder",
  ],
  authors: [{ name: "Krit" }],
  creator: "Krit",
  openGraph: {
    title: "Krit | AI, Data & Digital Builder",
    description:
      "I build AI solutions, data dashboards, web applications, and content automation systems.",
    type: "website",
    locale: "en_US",
    siteName: "Krit Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krit | AI, Data & Digital Builder",
    description:
      "Personal portfolio website for AI, data, web application, and content automation projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
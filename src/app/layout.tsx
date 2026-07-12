import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { seoConfig } from "@/config/seo"
import { siteConfig } from "@/config/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: seoConfig.title,
    template: `%s | ${siteConfig.personName}`,
  },
  description: seoConfig.description,
  keywords: [...seoConfig.keywords],
  authors: [{ name: siteConfig.personName, url: siteConfig.url }],
  creator: siteConfig.personName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seoConfig.title,
    description: seoConfig.openGraphDescription,
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "Krit Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: seoConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: ["/opengraph-image"],
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

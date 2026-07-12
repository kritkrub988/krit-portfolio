import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/hero/HeroSection"
import StatsSection from "@/components/sections/StatsSection"
import AboutSection from "@/components/sections/AboutSection"
import SkillsSection from "@/components/sections/SkillsSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ServicesSection from "@/components/sections/ServicesSection"
import ContactSection from "@/components/sections/ContactSection"
import { siteConfig } from "@/config/site"
import { socialLinks } from "@/config/social"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.personName,
  jobTitle: siteConfig.role,
  description: siteConfig.description,
  url: siteConfig.url,
  email: `mailto:${siteConfig.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Phitsanulok",
    addressCountry: "TH",
  },
  sameAs: socialLinks
    .filter((link) => link.href.startsWith("https://"))
    .map((link) => link.href),
  knowsAbout: [
    "AI",
    "Data Analytics",
    "Power BI",
    "Web Development",
    "React",
    "Next.js",
    "PostgreSQL",
    "Python",
    "SQL",
    "AI Agents",
    "Automation",
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main>
        <Navbar />
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/hero/HeroSection"
import StatsSection from "@/components/sections/StatsSection"
import AboutSection from "@/components/sections/AboutSection"
import SkillsSection from "@/components/sections/SkillsSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ServicesSection from "@/components/sections/ServicesSection"
import ContactSection from "@/components/sections/ContactSection"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Krit",
  jobTitle: "AI, Data & Digital Builder",
  description:
    "Personal portfolio website for AI, data dashboards, web applications, and content automation systems.",
  url: "https://krit-portfolio.vercel.app",
  sameAs: [
    "https://line.me/ti/p/RvtTijuB7O",
  ],
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
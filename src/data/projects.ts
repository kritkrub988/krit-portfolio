export type Project = {
  title: string
  description: string
  image: string
  technologies: string[]
  overview: string
  href?: string
}

export const projects: Project[] = [
  {
    title: "KRIT AI HUB",
    description: "AI Agent Platform",
    image: "/images/projects/krit-ai-hub.webp",
    technologies: ["Next.js", "TypeScript", "AI Agents"],
    overview:
      "A foundation for practical AI agents and digital workflows, designed to bring reusable automation and knowledge tools into one ecosystem.",
  },
  {
    title: "Dashboard Demo",
    description: "Analytics & Insights",
    image: "/images/projects/dashboard-demo.webp",
    technologies: ["Power BI", "SQL", "Data Analytics"],
    overview:
      "An analytics dashboard concept that turns operational data into clear metrics, trends, and decision-ready insights.",
    href: "https://datastudio.google.com/reporting/df06a97a-dd4e-4858-960d-016b28118044/page/hji3F",
  },
  {
    title: "KRIT HUB AI - Local AI Content Marketing",
    description:
      "ระบบการตลาดคอนเทนต์ยุคใหม่: รังสรรค์ข้อมูลสินค้า สร้างสคริปต์วิดีโอ 15 วินาที และจัดเตรียม Prompt ในระบบส่วนตัวบน Laptop ของคุณโดยไร้ค่าบริการ API ทั่วไป",
    image: "/images/projects/tiktok-content-system.webp",
    technologies: ["Automation", "Content Systems", "AI"],
    overview:
      "A content workflow concept for organizing ideas, production steps, and publishing tasks into a repeatable system.",
    href: "/pdf/portfolio/tiktok-content-system.pdf",
  },
  {
    title: "Internal Web App",
    description: "Management System",
    image: "/images/projects/internal-web-app.webp",
    technologies: ["React", "TypeScript", "PostgreSQL"],
    overview:
      "An internal application concept focused on simplifying management workflows and keeping operational information accessible.",
    href: "https://script.google.com/macros/s/AKfycbyPQI7ce0pdETxZbPOGMTO6JqzxMkwSSUvKBztVRteDoiWZ2Ro3ibzBe_fxYnt6vrFS/exec",
  },
]

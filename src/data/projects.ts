export type Project = {
  title: string
  subtitle?: string
  description: string
  image: string
  technologies: string[]
  overview: string
  href?: string
  ctaLabel?: string
  imageFit?: "cover" | "contain"
}

export const projects: Project[] = [
  {
    title: "LINE Sticker Prompt Builder",
    subtitle: "LINE Sticker Prompt & Studio",
    description:
      "สร้าง Prompt ภาพ 16 อารมณ์ ตัดภาพ ลบพื้นหลัง ใส่ข้อความไทย และดาวน์โหลดไฟล์ได้ใน Browser",
    image: "/images/projects/line-sticker-prompt-preview.png",
    technologies: ["Next.js", "TypeScript", "Canvas", "Browser-only"],
    overview:
      "Studio ฝั่ง Browser สำหรับสร้าง Prompt ภาพล้วน ตัดตาราง 4×4 ลบพื้นหลังสีเรียบ วางข้อความไทย และ Export PNG/ZIP โดยไม่ส่งรูปขึ้น Server",
    href: "/line-sticker-prompt",
    ctaLabel: "ลองทำสติกเกอร์",
    imageFit: "contain",
  },
  {
    title: "AI PORTRAIT PROMPT",
    subtitle: "Professional Portrait Prompt Builder",
    description:
      "ระบบสร้าง Prompt ภาพ Portrait ระดับ Production เลือก Model, Creative Direction, กล้อง, แสง, Film Look และ Shot List ผ่าน Dropdown พร้อมประกอบ Prompt แบบเรียลไทม์",
    image: "/images/projects/ai-portrait-prompt.svg",
    technologies: ["Next.js", "TypeScript", "IndexedDB"],
    overview:
      "Config-driven prompt workspace สำหรับวาง Creative Brief, Model Identity, Camera, Lighting, Color Pipeline และ Shot Planning โดยเก็บ Draft กับ Version History ใน Browser และไม่เชื่อมต่อ AI API",
    href: "/projects/ai-portrait-prompt",
  },
  {
    title: "KRIT HUB AI Tutor",
    description: "ระบบดูหลักสูตร ราคา และจองคิวเรียนคอมพิวเตอร์และ AI",
    image: "/images/projects/krit-ai-hub.webp",
    technologies: ["Next.js", "Google Apps Script", "Google Sheets"],
    overview:
      "ระบบสำหรับดูข้อมูลหลักสูตร ตรวจรอบว่าง และส่งคำขอจองเรียน พร้อมหน้าจัดการรายการสำหรับผู้ดูแล",
    href: "/tutor",
  },
  {
    title: "KRIT AI HUB",
    description: "AI Agent Platform",
    image: "/images/projects/krit-ai-hub.webp",
    technologies: ["Next.js", "TypeScript", "AI Agents"],
    overview:
      "A foundation for practical AI agents and digital workflows, designed to bring reusable automation and knowledge tools into one ecosystem.",
  },
  {
    title: "AI Portrait Prompt — เที่ยวทิพย์",
    subtitle: "Travel Portrait Prompt Generator",
    description:
      "ระบบสร้าง Prompt ภาพท่องเที่ยวจากรูปใบหน้า เลือกระยะภาพ ชุด สถานที่ Mood กล้อง และโทนฟิล์มได้ในหน้าเดียว",
    image: "/projects/ai-portrait-prompt-lite.webp",
    technologies: ["Next.js", "TypeScript", "Browser-only"],
    overview:
      "เครื่องมือสร้าง Prompt ภาพท่องเที่ยวแบบหน้าเดียว พร้อมล็อกตัวตนจากรูปอ้างอิง แสดงผลแบบเรียลไทม์ คัดลอก และส่งออกไฟล์ TXT",
    href: "/projects/ai-portrait-prompt-lite",
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

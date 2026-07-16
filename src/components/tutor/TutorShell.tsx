import Link from "next/link"

import Container from "@/components/common/Container"

const tutorLinks = [
  { href: "/tutor", label: "หน้าหลัก" },
  { href: "/tutor/course", label: "หลักสูตร" },
  { href: "/tutor/pricing", label: "ราคา" },
  { href: "/tutor/booking", label: "จองคิว" },
]

export function TutorHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/tutor" className="font-extrabold tracking-tight text-slate-950">
          <span className="text-blue-600">KRIT HUB AI</span> Tutor
        </Link>
        <nav aria-label="เมนูระบบติวเตอร์" className="flex flex-wrap items-center gap-1 text-sm font-semibold">
          {tutorLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  )
}

export function TutorFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <Container className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>KRIT HUB AI Tutor · หลักสูตรคอมพิวเตอร์และ AI</p>
        <Link href="/" className="font-semibold text-blue-700 hover:text-blue-900">
          กลับ Portfolio
        </Link>
      </Container>
    </footer>
  )
}

export function TutorPageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
    </div>
  )
}

export const tutorPrimaryLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

export const tutorSecondaryLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

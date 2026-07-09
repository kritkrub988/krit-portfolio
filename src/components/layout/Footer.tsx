import Container from "@/components/common/Container"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-6 text-white">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>© 2026 KRIT. All rights reserved.</p>
          <p>AI, Data & Digital Builder</p>
        </div>
      </Container>
    </footer>
  )
}
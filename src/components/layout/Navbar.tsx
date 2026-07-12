"use client"

import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import Container from "@/components/common/Container"
import Button from "@/components/ui/Button"
import { navigationItems } from "@/data/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
      <Container>
        <nav className="flex h-20 items-center justify-between lg:h-18">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600">
              &lt;/&gt;
            </div>

            <span className="text-xl font-extrabold tracking-tight text-slate-950">
              KRIT
            </span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button href="#contact">Contact Me</Button>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 lg:hidden"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {isOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-slate-100 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}

              <div className="px-4 pt-2">
                <Button href="#contact">Contact Me</Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}

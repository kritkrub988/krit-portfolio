import MotionWrapper from "@/components/common/MotionWrapper"
import Button from "@/components/ui/Button"
import { profile } from "@/data/profile"
import { socialLinks } from "@/config/social"

export default function HeroContent() {
  return (
    <MotionWrapper className="relative z-10 order-2 pb-8 text-center lg:order-1 lg:pb-20 lg:text-left">
      <p className="mb-3 text-base font-semibold text-slate-950">
        {profile.greeting}
      </p>

      <h1 className="text-6xl font-extrabold leading-none tracking-tight text-slate-950 lg:text-7xl">
        {profile.name}
      </h1>

      <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
        <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          AI Consultant &amp; Personal Tutor
        </span>
      </h2>

      <p
        lang="th"
        className="mt-5 max-w-xl text-base leading-7 tracking-normal text-slate-700 sm:text-lg sm:leading-8"
      >
        <span className="block">ที่ปรึกษาและติวเตอร์ด้าน AI</span>
        <span className="block">สอนตั้งแต่พื้นฐานจนถึงการสร้าง</span>
        <span className="block">
          AI Agent, Dashboard และ Web Application
        </span>
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
        <Button href={profile.primaryButton.href}>
          {profile.primaryButton.label}
        </Button>

        <Button href={profile.secondaryButton.href} variant="secondary">
          {profile.secondaryButton.label}
        </Button>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-sm font-medium text-slate-500">
          Connect with me
        </p>

        <div className="flex gap-4">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-blue-600"
            >
              {item.shortLabel}
            </a>
          ))}
        </div>
      </div>
    </MotionWrapper>
  )
}

import Image from "next/image"
import Container from "@/components/common/Container"
import Button from "@/components/ui/Button"

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/60"
    >
      <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute left-10 top-32 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl" />

      <Container>
        <div className="relative z-10 grid min-h-[calc(82vh-80px)] items-center gap-12 py-6 lg:grid-cols-2 lg:py-10">
          <div className="relative z-10">
            <p className="mb-4 text-lg font-semibold text-slate-900">
              Hello, I&apos;m
            </p>

            <h1 className="text-7xl font-extrabold leading-none tracking-tight text-slate-950 lg:text-8xl">
              Krit
            </h1>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight lg:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                AI, Data & Digital
              </span>{" "}
              <span className="text-slate-950">Builder</span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              I build AI solutions, data dashboards, web applications, and
              content automation systems that help businesses work smarter and
              grow faster.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="#projects">View My Work →</Button>
              <Button href="#contact" variant="secondary">
                Contact Me ✈
              </Button>
            </div>

            <div className="mt-10">
              <p className="mb-4 text-sm font-medium text-slate-500">
                Connect with me
              </p>

              <div className="flex justify-center gap-4 lg:justify-start">
                {["in", "GH", "✉", "Tiktok"].map((item) => (
                  <div
                    key={item}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[520px]">
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-600 opacity-80" />

            <div className="relative mx-auto aspect-[4/5] w-[76%] overflow-hidden rounded-[3rem] border border-white/80 bg-slate-100 shadow-2xl">
            <Image
              src="/images/profile/krit-profile.png"
              alt="Krit profile photo"
              fill
              priority
              sizes="(max-width: 1024px) 76vw, 390px"
              className="object-contain object-bottom"
              />
            </div>

            <div className="absolute right-0 top-10 rounded-2xl border border-slate-100 bg-white/90 px-5 py-4 shadow-xl backdrop-blur">
              <p className="font-bold text-slate-950">AI Solutions</p>
              <p className="mt-1 text-xs text-slate-500">
                AI Agents, Automation
              </p>
            </div>

            <div className="absolute left-0 top-48 rounded-2xl border border-slate-100 bg-white/90 px-5 py-4 shadow-xl backdrop-blur">
              <p className="font-bold text-slate-950">Data & Analytics</p>
              <p className="mt-1 text-xs text-slate-500">
                Dashboard, BI, Insights
              </p>
            </div>

            <div className="absolute bottom-20 right-4 rounded-2xl border border-slate-100 bg-white/90 px-5 py-4 shadow-xl backdrop-blur">
              <p className="font-bold text-slate-950">Web Development</p>
              <p className="mt-1 text-xs text-slate-500">Web Apps, Systems</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
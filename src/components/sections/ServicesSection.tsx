import { BarChart3, Code2, Megaphone, Sparkles } from "lucide-react"
import Card from "@/components/ui/Card"
import Container from "@/components/common/Container"
import MotionWrapper from "@/components/common/MotionWrapper"
import Section from "@/components/common/Section"
import { services } from "@/data/services"

const iconMap = {
  sparkles: Sparkles,
  barChart: BarChart3,
  code: Code2,
  megaphone: Megaphone,
}

export default function ServicesSection() {
  return (
    <Section id="services" className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            WHAT I DO
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            I build practical digital systems
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            From AI workflows to dashboards and web applications, I focus on
            tools that are useful, simple, and ready to use.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]

            return (
              <MotionWrapper key={service.title} delay={0.06 * index}>
                <Card className="h-full p-6 lg:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={23} strokeWidth={2.3} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950 lg:mt-6">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-5 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 lg:mt-6" />
                </Card>
              </MotionWrapper>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
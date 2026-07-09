import { Code2, Database, RadioTower } from "lucide-react"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Container from "@/components/common/Container"
import Section from "@/components/common/Section"
import { about } from "@/data/about"

const iconMap = {
  radio: RadioTower,
  database: Database,
  code: Code2,
}

export default function AboutSection() {
  return (
    <Section id="about" className="bg-white">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              {about.eyebrow}
            </p>

            <h2 className="mt-4 whitespace-pre-line text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">
              {about.title}
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {about.description}
            </p>

            <div className="mt-8">
              <Button href="#projects" variant="secondary">
                {about.buttonLabel}
              </Button>
            </div>
          </div>

          <Card className="p-7 lg:p-8">
            <div className="space-y-7">
              {about.timeline.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]

                return (
                  <div key={item.title} className="flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon size={24} strokeWidth={2.3} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
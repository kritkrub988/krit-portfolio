import { ArrowUpRight } from "lucide-react"
import Container from "@/components/common/Container"
import MotionWrapper from "@/components/common/MotionWrapper"
import Section from "@/components/common/Section"
import Card from "@/components/ui/Card"
import { projects } from "@/data/projects"

export default function ProjectsSection() {
  return (
    <Section id="projects" className="bg-white">
      <Container>
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              FEATURED PROJECTS
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Selected work and product demos
            </h2>
          </div>

          <a
            href="#contact"
            className="text-sm font-bold text-blue-600 transition hover:text-violet-600"
          >
            View All Projects
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {projects.map((project, index) => (
            <MotionWrapper key={project.title} delay={0.06 * index}>
              <Card className="group h-full overflow-hidden">
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 sm:h-40">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/30 blur-2xl" />
                  <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-violet-500/30 blur-2xl" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-950">
                        {project.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </Container>
    </Section>
  )
}
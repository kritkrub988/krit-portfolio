import Image from "next/image"
import Link from "next/link"
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
              work and product demos
            </h2>
          </div>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {projects.map((project, index) => {
            const isInternalPage = project.href?.startsWith("/")
              && !/^\/(?:pdf|images|downloads)\//i.test(project.href)
            const projectCard = (
              <Card className="group h-full overflow-hidden">
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 sm:h-40">
                  <Image
                    src={project.image}
                    alt={`${project.title} project concept artwork`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`${project.imageFit === "contain" ? "object-contain p-2" : "object-cover"} transition duration-500 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-950">
                    {project.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {project.subtitle ?? project.description}
                  </p>

                  {project.subtitle ? (
                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">
                      {project.description}
                    </p>
                  ) : null}

                  {project.ctaLabel ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
                      {project.ctaLabel}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  ) : null}
                </div>
              </Card>
            )

            return (
              <MotionWrapper key={project.title} delay={0.06 * index}>
                {project.href ? (
                  isInternalPage ? (
                    <Link
                      href={project.href}
                      aria-label={`Open ${project.title}`}
                      className="block h-full rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                    >
                      {projectCard}
                    </Link>
                  ) : (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} resource in a new tab`}
                      className="block h-full rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                    >
                      {projectCard}
                    </a>
                  )
                ) : (
                  projectCard
                )}
              </MotionWrapper>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

import Image from "next/image"
import { notFound } from "next/navigation"
import Button from "@/components/ui/Button"
import Container from "@/components/common/Container"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import Section from "@/components/common/Section"
import { projects } from "@/data/projects"

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: slugify(project.title) }))
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params
  const project = projects.find((item) => slugify(item.title) === slug)

  if (!project) {
    notFound()
  }

  const hasPdfCaseStudy = project.href?.toLowerCase().endsWith(".pdf")

  return (
    <main>
      <Navbar />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
              <Image
                src={project.image}
                alt={`${project.title} project concept artwork`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                PROJECT DETAIL
              </p>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                {project.title}
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {project.description}
              </p>

              <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Technologies
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </div>

              {hasPdfCaseStudy && project.href ? (
                <div className="mt-8">
                  <Button
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${project.title} case study`}
                  >
                    Download Case Study
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Overview
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {project.overview}
            </p>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  )
}

import {
  Atom,
  BarChart3,
  Bot,
  BrainCircuit,
  Code2,
  Database,
  Server,
} from "lucide-react"
import Container from "@/components/common/Container"
import MotionWrapper from "@/components/common/MotionWrapper"
import Section from "@/components/common/Section"
import SectionHeader from "@/components/common/SectionHeader"
import { skills } from "@/data/skills"

const iconMap = {
  python: Code2,
  database: Database,
  server: Server,
  atom: Atom,
  next: Code2,
  bot: Bot,
  barChart: BarChart3,
  brain: BrainCircuit,
}

export default function SkillsSection() {
  return (
    <Section id="skills" className="bg-slate-50">
      <Container>
        <SectionHeader eyebrow="SKILLS & TECHNOLOGIES" title="AI & Development Tools" />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-12 lg:grid-cols-8 lg:gap-4">
          {skills.map((skill, index) => {
            const Icon = iconMap[skill.icon as keyof typeof iconMap]

            return (
              <MotionWrapper key={skill.name} delay={0.04 * index}>
                <div className="group flex h-28 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-3 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100 sm:h-32 lg:h-36 lg:p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white lg:h-14 lg:w-14">
                    <Icon size={24} strokeWidth={2.3} />
                  </div>

                  <h3 className="mt-3 text-xs font-extrabold text-slate-950 sm:text-sm lg:mt-4">
                    {skill.name}
                  </h3>
                </div>
              </MotionWrapper>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
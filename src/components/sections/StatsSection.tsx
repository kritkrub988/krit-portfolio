import { BriefcaseBusiness, Code2, Rocket, Users } from "lucide-react"
import Container from "@/components/common/Container"
import MotionWrapper from "@/components/common/MotionWrapper"
import { stats } from "@/data/stats"

const iconMap = {
  briefcase: BriefcaseBusiness,
  users: Users,
  code: Code2,
  rocket: Rocket,
}

export default function StatsSection() {
  return (
    <section className="relative z-20 -mt-8 lg:-mt-14">
      <Container>
        <MotionWrapper>
          <div className="grid gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/70 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:p-5">
            {stats.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl px-4 py-4 lg:px-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 lg:h-12 lg:w-12">
                    <Icon size={22} strokeWidth={2.4} />
                  </div>

                  <div>
                    <p className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-2xl font-extrabold text-transparent lg:text-3xl">
                      {item.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 lg:text-sm">
                      {item.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </MotionWrapper>
      </Container>
    </section>
  )
}
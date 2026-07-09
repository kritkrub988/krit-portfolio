import MotionWrapper from "@/components/common/MotionWrapper"
import Image from "next/image"
import { profile } from "@/data/profile"
import FloatingCard from "./FloatingCard"

export default function HeroPortrait() {
  return (
    <MotionWrapper
  delay={0.15}
  className="relative z-10 order-1 mx-auto flex min-h-[430px] w-full max-w-[680px] items-end justify-center lg:order-2 lg:min-h-[560px] lg:justify-end lg:translate-x-8">
      
      <div className="relative flex h-[430px] w-full max-w-[390px] items-end justify-center lg:h-[600px] lg:max-w-[560px]">
        
        <div className="absolute bottom-16 left-1/2 h-[470px] w-[470px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_25%,#8fb5ff_0%,#4f6bff_38%,#7c3aed_100%)] opacity-55 shadow-2xl shadow-blue-500/10" />

        <div className="absolute bottom-16 left-1/2 h-[470px] w-[470px] -translate-x-1/2 rounded-full bg-[linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />

        <div className="absolute bottom-16 left-1/2 h-[470px] w-[470px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.28),transparent_32%)] opacity-45" />

        <div className="absolute bottom-0 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />

        <div className="relative z-10 h-[430px] w-[300px] drop-shadow-2xl lg:h-[600px] lg:w-[410px]">
          <Image
            src={profile.image}
            alt={`${profile.name} profile photo`}
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 410px"
            className="object-contain object-bottom"
          />
        </div>

        <FloatingCard
          icon="ai"
          title="AI Solutions"
          description="AI Agents, Automation"
          className="right-0 top-28 hidden lg:block"
          />

        <FloatingCard
          icon="data"
          title="Data & Analytics"
          description="Dashboard, BI, Insights"
          className="-left-10 top-72 hidden lg:block"
          />

        <FloatingCard
          icon="web"
          title="Web Development"
          description="Web Apps, Systems"
          className="bottom-28 -right-2 hidden lg:block"
        />
      </div>
    </MotionWrapper>
  )
}
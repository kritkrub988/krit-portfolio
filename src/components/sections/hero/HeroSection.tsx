import Container from "@/components/common/Container"
import HeroContent from "./HeroContent"
import HeroPortrait from "./HeroPortrait"

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_22%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_86%_24%,rgba(124,58,237,0.22),transparent_34%),linear-gradient(135deg,#eef6ff_0%,#f8fbff_42%,#eadfff_100%)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.055)_1px,transparent_1px)] bg-[size:80px_80px] opacity-45" />

      <div className="absolute inset-0 opacity-40">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="it-network"
              width="260"
              height="190"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M25 50H105M105 50V105M105 105H190M70 145H155M155 145V85"
                fill="none"
                stroke="rgba(37,99,235,0.16)"
                strokeWidth="1"
              />
              <circle cx="25" cy="50" r="3" fill="rgba(37,99,235,0.28)" />
              <circle cx="105" cy="50" r="3" fill="rgba(124,58,237,0.24)" />
              <circle cx="105" cy="105" r="3" fill="rgba(37,99,235,0.22)" />
              <circle cx="190" cy="105" r="3" fill="rgba(124,58,237,0.22)" />
              <circle cx="70" cy="145" r="3" fill="rgba(37,99,235,0.22)" />
              <circle cx="155" cy="145" r="3" fill="rgba(124,58,237,0.22)" />
              <circle cx="155" cy="85" r="3" fill="rgba(37,99,235,0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#it-network)" />
        </svg>
      </div>

      <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />

      <Container>
        <div className="relative z-10 grid min-h-[calc(78vh-80px)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-10 lg:py-8">
          <HeroContent />
          <HeroPortrait />
        </div>
      </Container>
    </section>
  )
}
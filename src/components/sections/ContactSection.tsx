import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import Button from "@/components/ui/Button"
import Container from "@/components/common/Container"
import Section from "@/components/common/Section"
import { contact } from "@/data/contact"

export default function ContactSection() {
  return (
    <Section id="contact" className="bg-slate-950 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div>
            <h2 className="whitespace-pre-line text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {contact.title}
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {contact.description}
            </p>

            <div className="mt-7">
              <Button href={contact.lineUrl}>{contact.buttonLabel}</Button>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-4 text-sm text-slate-300 sm:text-base">
              <Mail size={21} className="shrink-0 text-blue-400" />
              <span className="break-all">{contact.email}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-300 sm:text-base">
              <Phone size={21} className="shrink-0 text-blue-400" />
              <span>{contact.phone}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-300 sm:text-base">
              <MapPin size={21} className="shrink-0 text-blue-400" />
              <span>{contact.location}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-center text-sm font-bold uppercase tracking-wide text-blue-400 lg:text-left">
              LINE QR CODE
            </p>

            <div className="mt-6 flex justify-center">
              <div className="rounded-3xl bg-white p-4 shadow-xl">
                <Image
                  src="/images/icons/line-qr.png"
                  alt="LINE QR Code"
                  width={180}
                  height={180}
                  className="rounded-2xl"
                />
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-slate-300">
              Scan to connect on LINE
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
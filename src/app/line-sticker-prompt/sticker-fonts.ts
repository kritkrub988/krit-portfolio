import {
  Chakra_Petch,
  Itim,
  Kodchasan,
  Mali,
  Mitr,
  Pattaya,
  Sriracha,
} from "next/font/google"

const kodchasan = Kodchasan({
  weight: "700",
  subsets: ["thai", "latin"],
  display: "swap",
  fallback: ["Noto Sans Thai", "sans-serif"],
  variable: "--font-sticker-kodchasan",
})

const mali = Mali({
  weight: ["500", "600"],
  subsets: ["thai", "latin"],
  display: "swap",
  fallback: ["Noto Sans Thai", "sans-serif"],
  variable: "--font-sticker-mali",
})

const mitr = Mitr({
  weight: ["600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  fallback: ["Noto Sans Thai", "sans-serif"],
  variable: "--font-sticker-mitr",
})

const itim = Itim({
  weight: "400",
  subsets: ["thai", "latin"],
  display: "swap",
  fallback: ["Noto Sans Thai", "sans-serif"],
  variable: "--font-sticker-itim",
})

const sriracha = Sriracha({
  weight: "400",
  subsets: ["thai", "latin"],
  display: "swap",
  fallback: ["Noto Sans Thai", "sans-serif"],
  variable: "--font-sticker-sriracha",
})

const chakraPetch = Chakra_Petch({
  weight: ["400", "600"],
  subsets: ["thai", "latin"],
  display: "swap",
  fallback: ["Noto Sans Thai", "sans-serif"],
  variable: "--font-sticker-chakra-petch",
})

const pattaya = Pattaya({
  weight: "400",
  subsets: ["thai", "latin"],
  display: "swap",
  fallback: ["Noto Sans Thai", "sans-serif"],
  variable: "--font-sticker-pattaya",
})

export const stickerFontVariables = [
  kodchasan.variable,
  mali.variable,
  mitr.variable,
  itim.variable,
  sriracha.variable,
  chakraPetch.variable,
  pattaya.variable,
].join(" ")

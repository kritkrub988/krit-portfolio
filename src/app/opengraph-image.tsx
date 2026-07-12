import { ImageResponse } from "next/og"
import { siteConfig } from "@/config/site"

export const alt = siteConfig.title
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 35%), linear-gradient(135deg, #0f172a 0%, #172554 55%, #312e81 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#93c5fd",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          KRIT PORTFOLIO
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 86,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1.05,
            marginTop: 28,
          }}
        >
          AI, Data &amp; Digital Builder
        </div>
        <div
          style={{
            color: "#cbd5e1",
            display: "flex",
            fontSize: 30,
            lineHeight: 1.4,
            marginTop: 34,
          }}
        >
          Building practical AI solutions, dashboards, web applications, and
          automation systems.
        </div>
      </div>
    </div>,
    size,
  )
}

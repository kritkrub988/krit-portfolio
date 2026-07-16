import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/tutor", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/tutor/course", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/tutor/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/tutor/booking", changeFrequency: "weekly" as const, priority: 0.9 },
  ]
  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}

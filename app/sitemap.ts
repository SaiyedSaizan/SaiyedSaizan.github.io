import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { siteUrl } from "@/lib/site-url";

const caseStudies = [
  "projects/agent-governance-runtime.html",
  "projects/flow.html",
  "projects/ai-watch.html",
  "projects/physical-ai.html",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-08-22"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies.map((path) => ({
      url: `${siteUrl}/${path}`,
      lastModified: new Date("2026-08-22"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

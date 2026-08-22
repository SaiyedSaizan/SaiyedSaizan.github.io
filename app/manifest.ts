import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saiyed Saizan Shahnawaz, Software Engineer",
    short_name: "Saiyed Saizan",
    description: "AI systems, developer tools, and robotics software.",
    start_url: "/",
    display: "standalone",
    background_color: "#070908",
    theme_color: "#070908",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

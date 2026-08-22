import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saiyed Saizan Shahnawaz | Software Engineer",
    template: "%s · Saiyed Saizan",
  },
  description:
    "Saiyed Saizan Shahnawaz. Computer Science at UW–Madison, graduating May 2028. I build AI systems, developer tools, and robotics software. Looking for Summer 2027 software engineering and AI internships.",
  keywords: [
    "Saiyed Saizan",
    "Saiyed Saizan Shahnawaz",
    "software engineering internship 2027",
    "AI agents",
    "agent governance",
    "Physical AI",
    "UW Madison Computer Science",
    "Flow campus assistant",
  ],
  authors: [{ name: "Saiyed Saizan Shahnawaz" }],
  creator: "Saiyed Saizan Shahnawaz",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Saiyed Saizan Shahnawaz | Software Engineer",
    description:
      "AI systems, developer tools, and robotics software. Looking for Summer 2027 internships.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Saiyed Saizan Shahnawaz, software engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saiyed Saizan Shahnawaz | Software Engineer",
    description:
      "AI systems, developer tools, and robotics software. Looking for Summer 2027 internships.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070908",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Saiyed Saizan Shahnawaz",
    email: "mailto:shahnawaz@wisc.edu",
    url: siteUrl,
    sameAs: [
      "https://github.com/SaiyedSaizan",
      "https://www.linkedin.com/in/saiyed-saizan-shahnawaz",
    ],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "University of Wisconsin–Madison",
    },
    jobTitle: "Software Engineering Student",
    knowsAbout: [
      "TypeScript",
      "Python",
      "LLM agents",
      "SQLite",
      "PostgreSQL",
      "Robot learning",
      "Software engineering",
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}

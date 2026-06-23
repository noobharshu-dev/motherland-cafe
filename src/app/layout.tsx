import type { Metadata } from "next";
import "./globals.css";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://motherlandcafe.in"),
  title: {
    default: "Motherland Cafe — Escape the Noise. Sip Slowly.",
    template: "%s | Motherland Cafe",
  },
  description:
    "Motherland Cafe in Kolkata — artisanal coffee, healthy food, gluten-free options, and a calm work-friendly atmosphere. Reserve your table today.",
  keywords: [
    "cafe Kolkata",
    "artisanal coffee Kolkata",
    "healthy cafe Kolkata",
    "gluten free cafe Kolkata",
    "work cafe Kolkata",
    "Chowringhee cafe",
    "Motherland Cafe",
  ],
  openGraph: {
    title: "Motherland Cafe — Escape the Noise. Sip Slowly.",
    description:
      "A peaceful escape from the city's noise. Premium coffee, healthy food, and a calm work-friendly atmosphere in Kolkata.",
    type: "website",
    locale: "en_IN",
    siteName: "Motherland Cafe",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <LocalBusinessSchema />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

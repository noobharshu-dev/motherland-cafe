import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Find Motherland Cafe in Kolkata — address, phone, hours, and map directions to our cafe at Kyd Street, Chowringhee Mansion.",
  openGraph: {
    title: "Contact & Directions",
    description: "Find Motherland Cafe in Kolkata — address, phone, hours, and map directions to our cafe at Kyd Street, Chowringhee Mansion.",
    url: "/contact",
    images: [{ url: "https://motherlandcafe.in/og-image.jpg", width: 1200, height: 630, alt: "Contact & Directions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Directions",
    description: "Find Motherland Cafe in Kolkata — address, phone, hours, and map directions to our cafe at Kyd Street, Chowringhee Mansion.",
    images: ["https://motherlandcafe.in/og-image.jpg"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

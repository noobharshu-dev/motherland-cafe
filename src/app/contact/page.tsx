import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Find Motherland Cafe in Kolkata — address, phone, hours, and map directions to our cafe at Kyd Street, Chowringhee Mansion.",
};

export default function ContactPage() {
  return <ContactClient />;
}

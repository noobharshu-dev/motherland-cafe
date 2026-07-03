import type { Metadata } from "next";
import ReservationForm from "./ReservationForm";
import AnimatedSection from "@/components/AnimatedSection";
import { Clock, MapPin, Phone } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { cafeConfig } from "@/config/cafe.config";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description: `Book a table at Motherland Cafe, Kolkata. Reserve your quiet corner for coffee, work, or meaningful conversations.`, // Ideally this should be server rendered dynamically if we want cafeConfig here, but cafeConfig is not exported in a way that breaks server components, wait, cafeConfig is just an object.
  openGraph: {
    title: "Reserve a Table",
    description: `Book a table at Motherland Cafe, Kolkata. Reserve your quiet corner for coffee, work, or meaningful conversations.`,
    url: "/reservations",
    images: [{ url: "https://motherlandcafe.in/og-image.jpg", width: 1200, height: 630, alt: "Reserve a Table" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reserve a Table",
    description: "Book a table at Motherland Cafe, Kolkata. Reserve your quiet corner for coffee, work, or meaningful conversations.",
    images: ["https://motherlandcafe.in/og-image.jpg"],
  },
};

export default function ReservationsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: "8rem", paddingBottom: "4rem", background: "var(--color-bg)" }}>
        <div className="container">
          <AnimatedSection>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-secondary)", display: "block", marginBottom: "0.75rem" }}>
              Reservations
            </span>
            <h1 className="heading" style={{ fontSize: "clamp(2.75rem, 8vw, 5.5rem)", color: "var(--color-cta)", lineHeight: 0.95 }}>
              Reserve Your
              <br />
              Quiet Corner
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-muted)", marginTop: "1.25rem", maxWidth: "440px", lineHeight: 1.75 }}>
              Secure your table and we&apos;ll have everything ready for you — just arrive and unwind.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "start" }}>
            {/* Form */}
            <AnimatedSection>
              <ReservationForm />
            </AnimatedSection>

            {/* Info sidebar */}
            <AnimatedSection delay={0.15}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <h2 className="heading" style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>Good to Know</h2>

                {[
                  { icon: Clock, title: "Walk-ins Welcome", desc: "We accept walk-ins subject to availability, but reservations guarantee your spot." },
                  { icon: MapPin, title: "Finding Us", desc: `${cafeConfig.address}, ${cafeConfig.city} ${cafeConfig.postalCode}.` },
                  { icon: Phone, title: "Need Help?", desc: `Call us at ${cafeConfig.phone} and we'll assist with any special requirements.` },
                ].map(({ icon: Icon, title, desc }) => (
                  <SpotlightCard key={title} className="card" spotlightColor="rgba(212, 175, 55, 0.12)" style={{ padding: "1.5rem", display: "flex", gap: "1rem" }}>
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--color-surface)",
                        border: "1px solid rgba(251, 249, 246, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} color="var(--color-secondary)" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: "0.3rem" }}>{title}</p>
                      <p style={{ fontSize: "0.83rem", color: "var(--color-secondary)", lineHeight: 1.65, opacity: 0.8 }}>{desc}</p>
                    </div>
                  </SpotlightCard>
                ))}

                {/* Hours */}
                <SpotlightCard className="card" spotlightColor="rgba(212, 175, 55, 0.12)" style={{ borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-secondary)", marginBottom: "0.75rem" }}>
                    Opening Hours
                  </p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-cta)", fontWeight: 700 }}>
                    {cafeConfig.openingHoursDisplay.split('•')[1]?.trim() || cafeConfig.openingHoursDisplay}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "0.3rem" }}>
                    Every day of the week, all year round
                  </p>
                </SpotlightCard>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { MapPin, Phone, Clock, Mail, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import SpotlightCard from "@/components/SpotlightCard";
import { cafeConfig } from "@/config/cafe.config";

const INFO_CARDS = [
  {
    icon: Phone,
    title: "Call Us",
    links: [{ label: cafeConfig.phone, href: `tel:${cafeConfig.phone.replace(/\s+/g, "")}` }],
  },
  {
    icon: WhatsAppIcon,
    title: "Connect & Order",
    links: [
      { label: "Instagram", href: cafeConfig.socials.instagram },
      { label: "WhatsApp", href: cafeConfig.socials.whatsapp },
      { label: "Order on Zomato", href: cafeConfig.socials.zomato },
      { label: "Order on Swiggy", href: cafeConfig.socials.swiggy },
    ],
  },
  {
    icon: Mail,
    title: "Email",
    links: [
      { label: cafeConfig.email.reservations, href: `mailto:${cafeConfig.email.reservations}` },
      { label: cafeConfig.email.hello, href: `mailto:${cafeConfig.email.hello}` }
    ],
  },
  {
    icon: MapPin,
    title: "Find Us",
    links: [
      { label: `${cafeConfig.address}, ${cafeConfig.city}`, href: cafeConfig.googleMapsUrl }
    ],
  },
];

export default function ContactClient() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "5rem",
          background: "var(--color-surface)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 60%, rgba(212, 175, 55, 0.05) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <AnimatedSection>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-cta)",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              Find Us
            </span>
            <h1
              className="heading"
              style={{
                fontSize: "clamp(2.75rem, 8vw, 6rem)",
                color: "var(--color-cta)",
                lineHeight: 0.95,
                maxWidth: "700px",
              }}
            >
              Come Say Hello
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.1rem",
                color: "var(--color-muted)",
                marginTop: "1.5rem",
                maxWidth: "480px",
                lineHeight: 1.8,
              }}
            >
              We&apos;re tucked inside {cafeConfig.address.split(",")[1]?.trim() || "Chowringhee Mansion"} on {cafeConfig.address.split(",")[0]} in the
              heart of {cafeConfig.city}. Come in, sit down, and let the day slow down.
            </p>

            {/* Opening Hours Banner */}
            <div
              style={{
                marginTop: "2.5rem",
                padding: "1.25rem 1.5rem",
                background: "rgba(212, 175, 55, 0.05)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div style={{ padding: "0.5rem", background: "rgba(212, 175, 55, 0.15)", borderRadius: "var(--radius-sm)" }}>
                <Clock size={20} color="var(--color-cta)" />
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Opening Hours
                </span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-primary)", fontWeight: 600 }}>
                  {cafeConfig.openingHoursDisplay}
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
              marginBottom: "4rem",
            }}
          >
            {INFO_CARDS.map(({ icon: Icon, title, links }, i) => (
              <AnimatedSection key={title} delay={i * 0.08}>
                <SpotlightCard
                  className="card"
                  spotlightColor="rgba(212, 175, 55, 0.12)"
                  style={{ padding: "2rem", height: "100%", display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(212, 175, 55, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="var(--color-muted)" />
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.15rem",
                      color: "var(--color-primary)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {title}
                  </h2>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {links && links.map((link: any) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.9rem",
                          color: "var(--color-cta)",
                          textDecoration: "none",
                          fontWeight: 600,
                          opacity: 0.9,
                          transition: "opacity 200ms",
                        }}
                      >
                        {link.label}
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                </SpotlightCard>
              </AnimatedSection>
            ))}
          </div>

          {/* Map Embed */}
          <AnimatedSection delay={0.2}>
            <SectionHeading
              eyebrow="Location"
              title={`${cafeConfig.address.split(",")[1]?.trim() || "Chowringhee Mansion"}, ${cafeConfig.city}`}
            />
            <div
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                border: "1px solid var(--color-border)",
                marginTop: "2rem",
                height: "420px",
                position: "relative",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0!2d88.3476!3d22.5626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027701ae7a4d!2sChowringhee+Mansion%2C+Kolkata%2C+West+Bengal!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${cafeConfig.name} Location — ${cafeConfig.address.split(",")[1]?.trim() || "Chowringhee Mansion"}, ${cafeConfig.city}`}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "5rem 0",
          background: "var(--color-surface)",
          textAlign: "center",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <p
              className="heading"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                color: "var(--color-cta)",
                marginBottom: "1.5rem",
              }}
            >
              We&apos;d Love to See You.
            </p>
            <a
              href="/reservations"
              className="btn-primary"
              style={{ display: "inline-flex", margin: "0 auto" }}
            >
              Reserve a Table
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

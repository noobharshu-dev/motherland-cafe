import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Coffee, Leaf, Users } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import SpotlightCard from "@/components/SpotlightCard";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn the story behind Motherland Cafe — Kolkata's peaceful retreat for premium coffee, healthy food, and meaningful conversations.",
};

const VALUES = [
  { icon: Coffee, title: "Craft Over Convenience", desc: "We source single-origin beans and prepare every cup with precision and care — never rushed, never compromised." },
  { icon: Leaf, title: "Nourishing by Design", desc: "Our menu is built around whole ingredients, with clear labels for vegan, vegetarian, and gluten-free options." },
  { icon: Heart, title: "A Space to Breathe", desc: "We designed every corner for quiet focus and unhurried conversation — no loud music, no hustle." },
  { icon: Users, title: "Community First", desc: "From students to professionals to curious travellers, Motherland is open to everyone who needs a calm corner." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "6rem",
          background: "var(--color-surface)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 70% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <AnimatedSection>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: "0.75rem" }}>
              Our Story
            </span>
            <h1 className="heading" style={{ fontSize: "clamp(2.75rem, 8vw, 6rem)", color: "var(--color-cta)", lineHeight: 0.95, maxWidth: "700px" }}>
              A Refuge in the Heart of Kolkata
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: "var(--color-muted)", marginTop: "1.5rem", maxWidth: "520px", lineHeight: 1.8 }}>
              Motherland was built on a simple belief: everyone deserves a peaceful corner in a noisy world.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
            <AnimatedSection>
              <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "3/4", boxShadow: "0 24px 60px rgba(120,53,15,0.18)" }}>
                <Image
                  src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=85"
                  alt="The Motherland Cafe counter"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <SectionHeading eyebrow="How We Started" title="From a Dream to Your Daily Retreat" />
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {[
                  "Motherland Cafe is your neighbourhood European style cafe. Where you can sit, sip a cup of coffee, eat delicious food, network and enjoy your time while engaging in a good conversation!",
                  "It is a fresh scratch kitchen where all delicacies are made in-house — fresh — everyday. We have our own bakery that supplies us with amazing breads and desserts.",
                  "All our pastas are hand made every morning and we use tomatoes imported from Italy for our sauces. Come experience the best of European food in the heart of Kolkata.",
                ].map((para, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.975rem", color: "var(--color-muted)", lineHeight: 1.8, fontWeight: 500 }}>
                    {para}
                  </p>
                ))}
              </div>
              <Link href="/reservations" className="btn-primary" style={{ display: "inline-flex", marginTop: "2rem" }}>
                <ArrowRight size={16} />
                Reserve Your Table
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container">
          <AnimatedSection>
            <SectionHeading eyebrow="What We Stand For" title="Our Values" align="center" />
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.08}>
                <SpotlightCard
                  className="card"
                  spotlightColor="rgba(212, 175, 55, 0.12)"
                  style={{ padding: "2rem" }}
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
                    }}
                  >
                    <Icon size={20} color="var(--color-muted)" />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-primary)", marginBottom: "0.6rem" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section style={{ padding: "5rem 0", background: "var(--color-surface)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <AnimatedSection>
            <p className="heading" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--color-cta)" }}>
              Coffee, Community, Calm.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

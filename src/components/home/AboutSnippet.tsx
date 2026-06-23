import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Wifi, Coffee } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import SpotlightCard from "@/components/SpotlightCard";

// REPLACE THIS WITH YOUR OWN IMAGE LINK:
const ABOUT_IMAGE_URL = "/images/about_corner.png";

const VALUES = [
  {
    icon: Coffee,
    title: "Artisanal Coffee",
    desc: "Single-origin beans, precision-brewed to bring out every nuance.",
  },
  {
    icon: Leaf,
    title: "Nourishing Food",
    desc: "Gluten-free, vegan-friendly options crafted with whole ingredients.",
  },
  {
    icon: Wifi,
    title: "Work-Friendly",
    desc: "Fast Wi-Fi, ample power points, and a calm atmosphere all day.",
  },
];

export default function AboutSnippet() {
  return (
    <section className="section" style={{ background: "var(--color-surface)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Image */}
          <AnimatedSection delay={0}>
            <div
              style={{
                position: "relative",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "4/5",
                boxShadow: "0 24px 60px rgba(120,53,15,0.18)",
              }}
            >
              <Image
                src={ABOUT_IMAGE_URL}
                alt="Motherland Cafe interior — a calm workspace"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Floating card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "1.5rem",
                  background: "rgba(33, 26, 21, 0.95)",
                  backdropFilter: "blur(8px)",
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(251, 249, 246, 0.1)",
                  maxWidth: "220px",
                }}
              >
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-primary)", fontWeight: 700 }}>
                  Chowringhee, Kolkata
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "0.2rem" }}>
                  Open 8 AM – 9:30 PM, every day
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection delay={0.15}>
            <SectionHeading
              eyebrow="Our Story"
              title="A Refuge in the Heart of the City"
              subtitle="Your neighbourhood European style cafe. A fresh scratch kitchen where all delicacies are made in-house — everyday."
            />

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.975rem",
                color: "var(--color-muted)",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              Motherland Cafe is where you can sit, sip a cup of coffee, eat delicious food, network and enjoy your time while engaging in a good conversation! We have our own bakery that supplies us with amazing breads and desserts. All our pastas are hand made every morning and we use tomatoes imported from Italy for our sauces. Come experience the best of European food in the heart of Kolkata.
            </p>

            {/* Values */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
            {VALUES.map(({ icon: Icon, title, desc }) => (
                <SpotlightCard
                  key={title}
                  className="card"
                  spotlightColor="rgba(212, 175, 55, 0.12)"
                  style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.5rem" }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(212, 175, 55, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color="var(--color-secondary)" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: "0.15rem" }}>
                      {title}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", lineHeight: 1.6 }}>
                      {desc}
                    </p>
                  </div>
                </SpotlightCard>
            ))}
            </div>

            <Link href="/about" className="btn-outline">
              <ArrowRight size={16} />
              Our Full Story
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

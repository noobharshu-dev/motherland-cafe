import Link from "next/link";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { cafeConfig } from "@/config/cafe.config";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-surface)",
        color: "var(--color-primary)",
        paddingBlock: "4rem 2rem",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                color: "var(--color-cta)",
              }}
            >
              {cafeConfig.name.split(" ")[0]}
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                opacity: 0.8,
                lineHeight: 1.7,
                maxWidth: "240px",
              }}
            >
              Your neighbourhood European style cafe. A fresh scratch kitchen where all delicacies are made in-house everyday.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}>
              <a
                href={cafeConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "var(--color-cta)", opacity: 0.9, transition: "opacity 200ms" }}
              >
                <Instagram size={20} />
              </a>
              <a
                href={cafeConfig.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{ color: "var(--color-cta)", opacity: 0.9, transition: "opacity 200ms", textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <WhatsAppIcon size={18} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>WhatsApp</span>
                </div>
              </a>
            </div>
          </div>

          {/* Order Links */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-cta)",
                marginBottom: "1rem",
              }}
            >
              Order Online
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: cafeConfig.socials.zomato, label: "Order on Zomato" },
                { href: cafeConfig.socials.swiggy, label: "Order on Swiggy" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    opacity: 0.75,
                    transition: "opacity 200ms",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Quick links */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-cta)",
                marginBottom: "1rem",
              }}
            >
              Explore
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: "/menu", label: "Our Menu" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About Us" },
                { href: "/reservations", label: "Reserve a Table" },
                { href: "/contact", label: "Contact & Directions" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    opacity: 0.75,
                    transition: "opacity 200ms",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-cta)",
                marginBottom: "1rem",
              }}
            >
              Visit Us
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin size={16} style={{ color: "var(--color-cta)", marginTop: "2px", flexShrink: 0 }} />
                <p style={{ fontSize: "0.875rem", opacity: 0.8, lineHeight: 1.6 }}>
                  {cafeConfig.address.split(",")[0]},<br />
                  {cafeConfig.address.split(",")[1]?.trim() || "Chowringhee Mansion"},<br />
                  {cafeConfig.city} {cafeConfig.postalCode}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Phone size={16} style={{ color: "var(--color-cta)", flexShrink: 0 }} />
                <a
                  href={`tel:${cafeConfig.phone.replace(/\s+/g, "")}`}
                  style={{ fontSize: "0.875rem", opacity: 0.8, textDecoration: "none", color: "inherit", transition: "opacity 200ms" }}
                >
                  {cafeConfig.phone}
                </a>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Clock size={16} style={{ color: "var(--color-cta)", flexShrink: 0 }} />
                <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>{cafeConfig.openingHoursDisplay}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
            © {new Date().getFullYear()} {cafeConfig.name}. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>
            {cafeConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

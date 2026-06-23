"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";

// REPLACE THIS WITH YOUR OWN IMAGE LINK:
const HERO_IMAGE_URL = "/images/hero_bg.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      mass: 1,
    },
  },
};

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkOpenStatus = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
      const parts = formatter.formatToParts(now);
      const hourStr = parts.find(p => p.type === 'hour')?.value;
      const minuteStr = parts.find(p => p.type === 'minute')?.value;
      
      if (hourStr && minuteStr) {
        const h = parseInt(hourStr, 10);
        const m = parseInt(minuteStr, 10);
        const timeVal = h + m / 60;
        
        // Open 8:00 AM to 9:30 PM (21.5)
        setIsOpen(timeVal >= 8 && timeVal < 21.5);
      }
    };
    
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      {/* Smooth Background Entry Image */}
      <motion.div 
        style={{ position: "absolute", inset: -50, zIndex: 0 }}
        initial={{ scale: 1.05, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src={HERO_IMAGE_URL}
          alt="Motherland Cafe warm interior"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center" }}
        />
        {/* Dark Moody Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(20, 16, 13, 0.98) 0%, rgba(20, 16, 13, 0.92) 50%, rgba(20, 16, 13, 0.6) 100%)",
          }}
        />
      </motion.div>

      <motion.div 
        className="container" 
        style={{ position: "relative", zIndex: 1, paddingTop: "7rem", paddingBottom: "5rem" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={{ maxWidth: "820px" }}>
          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}
          >
            <div className="divider" />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-secondary)",
              }}
            >
              Kolkata&apos;s Hidden Cafe Retreat
            </span>
          </motion.div>

          {/* Display heading */}
          <motion.h1
            variants={itemVariants}
            className="heading-display"
            style={{ marginBottom: "1.75rem" }}
          >
            Escape the
            <br />
            <span style={{ color: "var(--color-cta)", WebkitTextStroke: "1px rgba(251,249,246,0.1)" }}>
              Noise.
            </span>
            <br />
            Sip Slowly.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.15rem",
              color: "var(--color-muted)",
              lineHeight: 1.75,
              maxWidth: "500px",
              marginBottom: "2.5rem",
              fontWeight: 500,
            }}
          >
            Artisanal coffee, nourishing food, gluten-free options, and a calm
            work-friendly atmosphere in the heart of Kolkata.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}
          >
            <Link href="/menu" className="btn-primary">
              <ArrowRight size={16} />
              Explore Menu
            </Link>
            <Link href="/reservations" className="btn-outline">
              <Calendar size={16} />
              Reserve a Table
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2.5rem",
              marginTop: "3.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(251, 249, 246, 0.1)",
            }}
          >
            {[
              { value: "8 AM", label: "Opens Every Day" },
              { value: "100%", label: "Artisanal Coffee" },
              { value: "GF", label: "Options Available" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginTop: "0.3rem",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating hours badge */}
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1, delay: 0.8 }}
        style={{
          position: "absolute",
          bottom: "3rem",
          right: "2rem",
          background: "rgba(33, 26, 21, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(251, 249, 246, 0.1)",
          color: "var(--color-primary)",
          padding: "1.25rem 1.5rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "0.2rem",
          minWidth: "160px",
        }}
        className="hours-badge"
      >
        <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: mounted ? (isOpen ? "#10B981" : "#EF4444") : "var(--color-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {mounted && (
            <span style={{ display: "block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isOpen ? "#10B981" : "#EF4444", boxShadow: isOpen ? "0 0 8px rgba(16, 185, 129, 0.6)" : "0 0 8px rgba(239, 68, 68, 0.6)" }} />
          )}
          {mounted ? (isOpen ? "Open Now" : "Closed Now") : "Open Today"}
        </span>
        <span style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "var(--color-cta)" }}>
          8:00 AM – 9:30 PM
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>Every day of the week</span>
      </motion.div>

      <style>{`
        @media (max-width: 1024px) {
          .hours-badge { display: none !important; }
        }
      `}</style>
    </section>
  );
}

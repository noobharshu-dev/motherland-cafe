"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Utensils, Image as ImageIcon, Info, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import Dock from "@/components/Dock";



export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileDockVisible, setMobileDockVisible] = useState(true);
  const lastScrollY = useRef(0);
  const router = useRouter();

  const dockItems = [
    { icon: <Home size={22} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <Utensils size={22} />, label: 'Menu', onClick: () => router.push('/menu') },
    { icon: <ImageIcon size={22} />, label: 'Gallery', onClick: () => router.push('/gallery') },
    { icon: <Info size={22} />, label: 'About', onClick: () => router.push('/about') },
    { icon: <Phone size={22} />, label: 'Contact', onClick: () => router.push('/contact') },
  ];

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 40);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setMobileDockVisible(false);
      } else {
        setMobileDockVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        ...(scrolled
          ? {
              background: "rgba(33, 26, 21, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
              borderBottom: "1px solid rgba(251, 249, 246, 0.05)",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            }
          : {
              background: "transparent",
              borderBottom: "1px solid transparent",
              paddingTop: "1.25rem",
              paddingBottom: "1.25rem",
            }),
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.25rem",
          height: "3.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-heading)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--color-primary)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          <Logo width={28} height={28} />
          Motherland
        </Link>

        <div className="desktop-nav" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Dock 
            items={dockItems}
            panelHeight={60}
            baseItemSize={40}
            magnification={65}
          />
        </div>

        {/* CTA — hidden on mobile, shown on desktop */}
        <Link href="/reservations" className="btn-primary nav-reserve" style={{ fontSize: "0.78rem", padding: "0.6rem 1.25rem" }}>
          Reserve Table
        </Link>
      </div>

        <style>{`
          .mobile-nav { display: none !important; }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-nav {
              display: flex !important;
              position: fixed;
              bottom: 1.5rem;
              left: 0;
              right: 0;
              justify-content: center;
              z-index: 999;
            }
            .nav-reserve { display: none !important; }
          }
        `}</style>
      </header>

      {/* Mobile Dock - outside header so it attaches to viewport */}
      <div 
        className="mobile-nav"
        style={{
          transform: mobileDockVisible ? "translateY(0)" : "translateY(150%)",
          opacity: mobileDockVisible ? 1 : 0,
          pointerEvents: mobileDockVisible ? "auto" : "none",
          transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1), opacity 300ms ease-in-out"
        }}
      >
        <Dock 
          items={dockItems}
          panelHeight={55}
          baseItemSize={36}
          magnification={55}
        />
      </div>
    </>
  );
}

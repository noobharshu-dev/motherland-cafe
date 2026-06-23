"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Badge from "@/components/Badge";

export default function MobileScrollStack({ items }: { items: any[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="mobile-stack-section">
      {items.map((item, i) => (
        <StickyCard key={item.id} item={item} index={i} total={items.length} />
      ))}

      <style>{`
        .mobile-stack-section {
          position: relative;
          padding-bottom: 2rem;
        }
        .sticky-card-wrapper {
          position: sticky;
          top: 80px;
          margin-bottom: 1rem;
        }
        .sticky-card-inner {
          border-radius: 28px;
          overflow: hidden;
          background: var(--color-surface);
          border: 1px solid rgba(251,249,246,0.06);
          box-shadow: 0 8px 40px rgba(0,0,0,0.35);
          transform-origin: top center;
          transition: transform 0.3s ease;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

function StickyCard({ item, index, total }: { item: any; index: number; total: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const handleScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const stickyTop = 80;

      // How many pixels past the sticky point
      const overlap = stickyTop - rect.top;

      if (overlap > 0) {
        // Card is pinned; scale it down slightly per unit of overlap
        const scale = Math.max(0.88, 1 - (overlap / 1000) * 0.3);
        inner.style.transform = `scale(${scale})`;
        inner.style.transformOrigin = "top center";
      } else {
        inner.style.transform = "scale(1)";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [index]);

  return (
    <div
      ref={wrapperRef}
      className="sticky-card-wrapper"
      style={{ top: `${80 + index * 12}px`, zIndex: index + 1 }}
    >
      <div ref={innerRef} className="sticky-card-inner">
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "4/3", width: "100%", overflow: "hidden" }}>
          <Image src={item.imageUrl} alt={item.name} fill sizes="100vw" className="object-cover" />
          <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", zIndex: 2 }}>
            <Badge
              isVegetarian={item.isVegetarian}
              isVegan={item.isVegan}
              isGlutenFree={item.isGlutenFree}
            />
          </div>
        </div>

        {/* Text */}
        <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--color-muted)",
          }}>
            {item.category.name}
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "0.4rem 0 0.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "var(--color-primary)" }}>
              {item.name}
            </h3>
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem", color: "var(--color-primary)" }}>
              ₹{item.price}
            </span>
          </div>
          <p style={{ fontSize: "0.83rem", color: "var(--color-muted)", lineHeight: 1.65, fontWeight: 500 }}>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

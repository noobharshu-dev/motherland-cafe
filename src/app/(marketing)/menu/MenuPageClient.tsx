"use client";

import { useState } from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isFeatured: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

export default function MenuPageClient({ categories }: { categories: MenuCategory[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filter, setFilter] = useState<"all" | "vegan" | "gf">("all");

  const displayedCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c.id === activeCategory);

  const filterItem = (item: MenuItem) => {
    if (filter === "vegan") return item.isVegan;
    if (filter === "gf") return item.isGlutenFree;
    return true;
  };

  return (
    <>
      {/* Page Hero */}
      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "4rem",
          background: "var(--color-surface)",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: "0.75rem" }}>
              Our Menu
            </span>
            <h1
              className="heading"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", color: "var(--color-cta)", lineHeight: 1 }}
            >
              Crafted with
              <br />
              Intention
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-muted)", marginTop: "1.25rem", maxWidth: "480px", lineHeight: 1.75 }}>
              Every item on our menu is thoughtfully made — from single-origin espresso to gluten-free bakes.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "1.5rem 0",
          background: "var(--color-surface)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Category tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <TabBtn active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
              All
            </TabBtn>
            {categories.map((cat) => (
              <TabBtn key={cat.id} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)}>
                {cat.name}
              </TabBtn>
            ))}
          </div>

          {/* Dietary filters */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["all", "vegan", "gf"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "999px",
                  border: "1px solid",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 300ms cubic-bezier(0.25, 1, 0.5, 1)",
                  background: filter === f ? "var(--color-primary)" : "transparent",
                  color: filter === f ? "var(--color-surface)" : "var(--color-primary)",
                  borderColor: filter === f ? "var(--color-primary)" : "var(--color-border)",
                }}
              >
                {f === "all" ? "All" : f === "vegan" ? "Vegan" : "Gluten-Free"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu sections */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          {displayedCategories.map((category) => {
            const items = category.items.filter(filterItem);
            if (items.length === 0) return null;

            return (
              <AnimatedSection key={category.id} style={{ marginBottom: "4rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "2rem",
                    paddingBottom: "1rem",
                    borderBottom: "2px solid var(--color-cta)",
                  }}
                >
                  <h2
                    className="heading"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                  >
                    {category.name}
                  </h2>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-secondary)", opacity: 0.6, marginLeft: "auto" }}>
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <motion.div
                  layout
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.25rem",
                  }}
                >
                  <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      whileHover={{ scale: 1.02, y: -5, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
                      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.05 }}
                      className="card" 
                      style={{ display: "flex", cursor: "pointer" }}
                    >
                      <div style={{ position: "relative", width: "6.5rem", flexShrink: 0, overflow: "hidden" }}>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div style={{ padding: "1.25rem", flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary)", maxWidth: "160px", lineHeight: 1.25 }}>
                            {item.name}
                          </h3>
                          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem", color: "var(--color-primary)", flexShrink: 0, marginLeft: "0.5rem" }}>
                            ₹{item.price}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "var(--color-muted)", lineHeight: 1.5, marginBottom: "0.75rem", fontWeight: 500 }}>
                          {item.description}
                        </p>
                        <Badge isVegetarian={item.isVegetarian} isVegan={item.isVegan} isGlutenFree={item.isGlutenFree} />
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>
    </>
  );
}

function TabBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.4rem 1rem",
        borderRadius: "var(--radius-sm)",
        border: "1px solid",
        fontSize: "0.78rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        cursor: "pointer",
        transition: "all 200ms ease",
        background: active ? "var(--color-primary)" : "transparent",
        color: active ? "var(--color-bg)" : "var(--color-primary)",
        borderColor: active ? "var(--color-primary)" : "var(--color-border)",
      }}
    >
      {children}
    </button>
  );
}

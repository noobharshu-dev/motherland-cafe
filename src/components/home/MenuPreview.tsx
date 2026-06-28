import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HoverCard from "@/components/HoverCard";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import Badge from "@/components/Badge";
import { prisma } from "@/lib/prisma";
import MobileScrollStack from "./MobileScrollStack";
import { getCloudinaryUrl } from "@/lib/cloudinary";

// REPLACE THESE WITH YOUR OWN IMAGE LINKS:
const MENU_IMAGES = {
  lavenderLatte: "/images/lavender_latte.png",
  avocadoToast: "/images/avocado_toast.png",
  pourOver: "/images/pour_over.png",
  powerBowl: "/images/power_bowl.png",
};

interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  category: { name: string };
}

const FALLBACK_ITEMS: FeaturedItem[] = [
  {
    id: "1",
    name: "Lavender Oat Latte",
    description: "House-made lavender syrup, steamed oat milk, double shot espresso. Floral, creamy, unforgettable.",
    price: 280,
    imageUrl: MENU_IMAGES.lavenderLatte,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    category: { name: "Specialty Coffee" },
  },
  {
    id: "2",
    name: "Avocado Toast",
    description: "Sourdough, smashed avocado, cherry tomatoes, dukkah, extra-virgin olive oil, microgreens.",
    price: 320,
    imageUrl: MENU_IMAGES.avocadoToast,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    category: { name: "All-Day Brunch" },
  },
  {
    id: "3",
    name: "Single Origin Pour Over",
    description: "Ethiopian Yirgacheffe, hand-ground to order, brewed in a Hario V60. Clean, bright, complex.",
    price: 260,
    imageUrl: MENU_IMAGES.pourOver,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    category: { name: "Specialty Coffee" },
  },
  {
    id: "4",
    name: "Protein Power Bowl",
    description: "Quinoa, roasted chickpeas, cucumber, hummus, pumpkin seeds, lemon tahini dressing.",
    price: 380,
    imageUrl: MENU_IMAGES.powerBowl,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    category: { name: "Wellness Bowls" },
  },
];

export default async function MenuPreview() {
  let featured: FeaturedItem[] = FALLBACK_ITEMS;

  try {
    const dbItems = await prisma.menuItem.findMany({
      where: { isFeatured: true },
      take: 4,
      include: { category: true },
    });
    if (dbItems.length > 0) featured = dbItems;
  } catch {
    // No DB connection yet — use fallback data
  }

  return (
    <section className="section" style={{ background: "var(--color-bg)" }}>
      <div className="container">
        <AnimatedSection>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              gap: "1rem",
            }}
          >
            <SectionHeading
              eyebrow="Signature Dishes"
              title="Made with Heart, Served with Care"
              subtitle="A selection of our most-loved creations — from floral lattes to nourishing bowls."
            />
            <Link
              href="/menu"
              className="btn-outline"
              style={{ flexShrink: 0, alignSelf: "flex-start" }}
            >
              <ArrowRight size={16} />
              Full Menu
            </Link>
          </div>
        </AnimatedSection>

        {/* Desktop Grid (Hidden on Mobile) */}
        <div
          className="desktop-menu-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {featured.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.08}>
              <HoverCard 
                className="card group" 
                style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
              >
                {/* Image wrapper handles hover — not the Next/Image itself */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={getCloudinaryUrl(item.imageUrl)}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      zIndex: 1,
                    }}
                  >
                    <Badge
                      isVegetarian={item.isVegetarian}
                      isVegan={item.isVegan}
                      isGlutenFree={item.isGlutenFree}
                    />
                  </div>
                </div>

                <div style={{ padding: "1.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                    }}
                  >
                    {item.category.name}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      margin: "0.4rem 0 0.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.1rem",
                        color: "var(--color-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "var(--color-primary)",
                      }}
                    >
                      ₹{item.price}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.83rem",
                      color: "var(--color-muted)",
                      lineHeight: 1.65,
                      fontWeight: 500,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </HoverCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Mobile Scroll Stack (Hidden on Desktop) */}
        <MobileScrollStack items={featured} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu-grid {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

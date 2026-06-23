import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "@/components/AnimatedSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual journey through Motherland Cafe — our space, drinks, and food in Kolkata.",
};

const HEIGHTS = [400, 320, 480, 360, 440, 300, 420, 380, 460];

interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
}

const FALLBACK_IMAGES: GalleryImage[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=85",
    title: "Morning Light",
    category: "Space",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=600&q=85",
    title: "Lavender Latte",
    category: "Drinks",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&q=85",
    title: "The Counter",
    category: "Space",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=85",
    title: "Wellness Bowl",
    category: "Food",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=85",
    title: "Pour Over",
    category: "Drinks",
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1603046891744-1f7f7e3b3bcf?w=600&q=85",
    title: "Avocado Toast",
    category: "Food",
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=85",
    title: "Window Seat",
    category: "Space",
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=85",
    title: "Espresso Art",
    category: "Drinks",
  },
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=85",
    title: "The Shelves",
    category: "Space",
  },
];

export default async function GalleryPage() {
  let images: GalleryImage[] = FALLBACK_IMAGES;

  try {
    const dbImages = await prisma.galleryImage.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    });
    if (dbImages.length > 0) images = dbImages;
  } catch {
    // No DB connection yet — use fallback data
  }

  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "4rem",
          background: "var(--color-surface)",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-secondary)",
                opacity: 0.7,
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              Visual Stories
            </span>
            <h1
              className="heading"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1 }}
            >
              Life at
              <br />
              Motherland
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div
            style={{
              columns: "3 280px",
              columnGap: "1.25rem",
            }}
          >
            {images.map((img, i) => (
              <AnimatedSection
                key={img.id}
                delay={i * 0.05}
                style={{ marginBottom: "1.25rem", breakInside: "avoid" }}
              >
                <div
                  className="group transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(120,53,15,0.22)]"
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-warm)",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.title}
                    width={600}
                    height={HEIGHTS[i % HEIGHTS.length]}
                    className="object-cover"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "2rem 1rem 1rem",
                      background:
                        "linear-gradient(transparent, rgba(69,26,3,0.7))",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.9rem",
                        color: "#FEF3C7",
                        fontWeight: 700,
                      }}
                    >
                      {img.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(254,243,199,0.65)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginTop: "0.15rem",
                      }}
                    >
                      {img.category}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MenuPageClient from "./MenuPageClient";

// Revalidate menu every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Motherland Cafe's full menu — artisanal coffee, specialty beverages, healthy mains, and gluten-free options in Kolkata.",
  openGraph: {
    title: "Menu",
    description: "Explore Motherland Cafe",
    url: "/menu",
    images: [{ url: "https://motherlandcafe.in/og-image.jpg", width: 1200, height: 630, alt: "Menu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu",
    description: "Explore Motherland Cafe",
    images: ["https://motherlandcafe.in/og-image.jpg"],
  },
};

const FALLBACK_CATEGORIES = [
  {
    id: "cat-1",
    name: "Specialty Coffee",
    displayOrder: 1,
    items: [
      {
        id: "i-1",
        name: "Lavender Oat Latte",
        description: "House-made lavender syrup, steamed oat milk, double-shot espresso. Floral, creamy, unforgettable.",
        price: 280,
        imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=400&q=80",
        isVegetarian: true, isVegan: true, isGlutenFree: true, isFeatured: true,
      },
      {
        id: "i-2",
        name: "Single Origin Pour Over",
        description: "Ethiopian Yirgacheffe, hand-ground to order, brewed in a Hario V60. Clean and bright.",
        price: 260,
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
        isVegetarian: true, isVegan: true, isGlutenFree: true, isFeatured: true,
      },
      {
        id: "i-3",
        name: "Cortado",
        description: "Equal parts espresso and warm micro-foamed milk. Bold, balanced, precise.",
        price: 220,
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        isVegetarian: true, isVegan: false, isGlutenFree: true, isFeatured: false,
      },
      {
        id: "i-4",
        name: "Cold Brew Tonic",
        description: "18-hour cold brew concentrate over sparkling tonic, a squeeze of citrus.",
        price: 240,
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        isVegetarian: true, isVegan: true, isGlutenFree: true, isFeatured: false,
      },
    ],
  },
  {
    id: "cat-2",
    name: "All-Day Brunch",
    displayOrder: 2,
    items: [
      {
        id: "i-5",
        name: "Avocado Toast",
        description: "Sourdough, smashed avocado, cherry tomatoes, dukkah, extra-virgin olive oil, microgreens.",
        price: 320,
        imageUrl: "https://images.unsplash.com/photo-1603046891744-1f7f7e3b3bcf?w=400&q=80",
        isVegetarian: true, isVegan: true, isGlutenFree: false, isFeatured: true,
      },
      {
        id: "i-6",
        name: "Masala Shakshuka",
        description: "Eggs poached in spiced tomato sauce with cumin, coriander, and fresh herbs. Served with sourdough.",
        price: 340,
        imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80",
        isVegetarian: true, isVegan: false, isGlutenFree: false, isFeatured: false,
      },
      {
        id: "i-7",
        name: "Overnight Oats",
        description: "Rolled oats soaked in coconut milk, chia seeds, mango compote, toasted coconut flakes.",
        price: 260,
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80",
        isVegetarian: true, isVegan: true, isGlutenFree: true, isFeatured: false,
      },
    ],
  },
  {
    id: "cat-3",
    name: "Wellness Bowls",
    displayOrder: 3,
    items: [
      {
        id: "i-8",
        name: "Protein Power Bowl",
        description: "Quinoa, roasted chickpeas, cucumber, hummus, pumpkin seeds, lemon tahini dressing.",
        price: 380,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        isVegetarian: true, isVegan: true, isGlutenFree: true, isFeatured: true,
      },
      {
        id: "i-9",
        name: "Green Goddess Bowl",
        description: "Edamame, kale, cucumber ribbons, avocado, sesame dressing, nori flakes.",
        price: 360,
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
        isVegetarian: true, isVegan: true, isGlutenFree: true, isFeatured: false,
      },
    ],
  },
  {
    id: "cat-4",
    name: "Artisan Bakes",
    displayOrder: 4,
    items: [
      {
        id: "i-10",
        name: "Cardamom Banana Bread",
        description: "House-baked, warm from the oven. A perfect companion to your morning cup.",
        price: 160,
        imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80",
        isVegetarian: true, isVegan: false, isGlutenFree: false, isFeatured: false,
      },
      {
        id: "i-11",
        name: "Almond Flour Brownie",
        description: "Fudgy, rich, gluten-free. Topped with Maldon sea salt. Contains eggs and butter.",
        price: 180,
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
        isVegetarian: true, isVegan: false, isGlutenFree: true, isFeatured: false,
      },
    ],
  },
];

export default async function MenuPage() {
  let categories = FALLBACK_CATEGORIES;

  try {
    const dbCategories = await prisma.menuCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: { items: true },
    });
    if (dbCategories.length > 0) categories = dbCategories;
  } catch {
    // No DB connection yet — use fallback data
  }

  return <MenuPageClient categories={categories} />;
}

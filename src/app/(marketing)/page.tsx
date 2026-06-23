import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import AboutSnippet from "@/components/home/AboutSnippet";
import MenuPreview from "@/components/home/MenuPreview";
import ReviewsSection from "@/components/home/ReviewsSection";
import ReservationCTA from "@/components/home/ReservationCTA";

// Revalidate every 5 minutes — fresh enough, but served from cache
export const revalidate = 300;

const FALLBACK_REVIEWS = [
  {
    id: "1",
    name: "Priya Banerjee",
    rating: 5,
    reviewText:
      "Motherland is my favourite corner in all of Kolkata. The lavender oat latte is unreal, and the space just makes you want to stay for hours. I come here every weekend without fail.",
    source: "Google",
  },
  {
    id: "2",
    name: "Arjun Mehta",
    rating: 5,
    reviewText:
      "Finally a cafe in Kolkata that gets the vibe right. Quiet, beautiful, incredible food. The avocado toast is the best I've had outside of Mumbai. Highly recommend.",
    source: "Zomato",
  },
  {
    id: "3",
    name: "Shreya Das",
    rating: 5,
    reviewText:
      "I've been to hundreds of cafes across India and Motherland stands with the very best. The attention to detail — from the acoustics to the espresso temperature — is extraordinary.",
    source: "Google",
  },
];

export default async function HomePage() {
  let reviews = FALLBACK_REVIEWS;

  try {
    const dbReviews = await prisma.review.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    if (dbReviews.length > 0) reviews = dbReviews;
  } catch {
    // No DB connection yet — use fallback data
  }

  return (
    <>
      <HeroSection />
      <AboutSnippet />
      <MenuPreview />
      <ReviewsSection reviews={reviews} />
      <ReservationCTA />
    </>
  );
}

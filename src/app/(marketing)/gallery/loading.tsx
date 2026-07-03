import { GalleryPageSkeleton } from "@/components/ui/Skeletons";

/**
 * Next.js loading.tsx — automatically creates a Suspense boundary
 * for the /gallery route. Shows skeleton while the async page component
 * fetches gallery images from the database.
 */
export default function GalleryLoading() {
  return <GalleryPageSkeleton />;
}

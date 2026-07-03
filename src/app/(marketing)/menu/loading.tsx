import { MenuPageSkeleton } from "@/components/ui/Skeletons";

/**
 * Next.js loading.tsx — automatically creates a Suspense boundary
 * for the /menu route. Shows skeleton while the async page component
 * fetches menu categories from the database.
 */
export default function MenuLoading() {
  return <MenuPageSkeleton />;
}

import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-orange-50/50 p-6 rounded-full mb-8">
        <Search className="w-12 h-12 text-amber-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">
        Page Not Found
      </h1>
      <p className="text-lg text-stone-600 max-w-md mx-auto mb-8">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/menu"
          className="inline-flex items-center justify-center px-8 py-3 bg-stone-100 text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}

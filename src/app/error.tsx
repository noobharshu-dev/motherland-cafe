"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-serif text-stone-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-stone-500 mb-8">
          We encountered an unexpected error while loading this page. Our team
          has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

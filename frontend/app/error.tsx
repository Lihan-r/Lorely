"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const isNetworkError =
    error.message?.includes("fetch") ||
    error.message?.includes("NETWORK_ERROR") ||
    error.message?.includes("Unable to connect");

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-surface px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-serif font-semibold text-ink mb-4">
          Something went wrong
        </h2>
        <p className="text-ink/60 mb-6">
          {isNetworkError
            ? "Unable to connect to the server. Please check that the backend is running and try again."
            : "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}

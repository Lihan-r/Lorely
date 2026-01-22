"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { ApiException } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldError(null);

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setFieldError("password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setFieldError("confirmPassword");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password);
      router.push("/projects");
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.error.message);
        if (err.error.field) {
          setFieldError(err.error.field);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-serif font-semibold text-ink">
              Lorely
            </span>
          </Link>
          <p className="mt-2 text-ink/60">Start building your world</p>
        </div>

        {/* Form Card */}
        <div className="bg-paper rounded-xl shadow-sm border border-border-light p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-lg border bg-paper text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink transition-colors ${
                  fieldError === "email"
                    ? "border-red-500"
                    : "border-border-light"
                }`}
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg border bg-paper text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink transition-colors ${
                  fieldError === "password"
                    ? "border-red-500"
                    : "border-border-light"
                }`}
                placeholder="At least 8 characters"
              />
              <p className="mt-1 text-xs text-ink/50">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-ink mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg border bg-paper text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink transition-colors ${
                  fieldError === "confirmPassword"
                    ? "border-red-500"
                    : "border-border-light"
                }`}
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-ink/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-ink font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-ink/40">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

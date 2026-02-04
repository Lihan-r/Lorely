import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lorely.app"),
  title: {
    default: "Lorely - Plan your world. Write your story.",
    template: "%s | Lorely",
  },
  description:
    "The calm workspace for writers who build worlds. Connect your worldbuilding notes, write with context, and never lose your lore again.",
  keywords: [
    "worldbuilding",
    "writing",
    "creative writing",
    "fiction writing",
    "world building tool",
    "writing software",
    "lore management",
    "story planning",
    "character management",
    "fantasy writing",
  ],
  authors: [{ name: "Lorely" }],
  creator: "Lorely",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lorely.app",
    siteName: "Lorely",
    title: "Lorely - Plan your world. Write your story.",
    description:
      "The calm workspace for writers who build worlds. Connect your worldbuilding notes, write with context, and never lose your lore again.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lorely - The calm workspace for worldbuilders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorely - Plan your world. Write your story.",
    description:
      "The calm workspace for writers who build worlds. Connect your worldbuilding notes, write with context, and never lose your lore again.",
    images: ["/og-image.png"],
    creator: "@lorely",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

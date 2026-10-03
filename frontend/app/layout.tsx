import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneGo",
  description: "Make your first online portfolio in onego",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

// app/layout.tsx ← ClerkProvider(ClerkProvider ka sara code)
// app/layout.tsx
// Ye poori OneGo app ka root layout hai.
// Isme global CSS, fonts, metadata aur ClerkProvider setup hota hai.
// ClerkProvider ki wajah se poori app mein Clerk authentication available rehta hai.

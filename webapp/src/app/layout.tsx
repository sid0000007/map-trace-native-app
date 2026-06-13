import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Locations — Web Demo",
  description: "Locations map demo backed by a Cloudflare Worker API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-muted">
        <Providers>
          {/* Mobile-only UI: a phone-width column, centered on larger screens. */}
          <div className="mx-auto flex min-h-screen w-full max-w-[28rem] flex-col bg-background shadow-sm">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

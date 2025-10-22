import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { config } from "@/lib/config";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kepanduan Advent - Platform Digital Pembelajaran",
  description: "Platform digital interaktif untuk pembelajaran dan pelatihan Adventurer, Pathfinder, dan Master Guide. Bersama membangun generasi yang berkarakter, berintegritas, dan berpegang teguh pada iman.",
  keywords: ["Kepanduan Advent", "Adventurer", "Pathfinder", "Master Guide", "pembelajaran digital", "pendidikan karakter", "kepramukaan Advent"],
  authors: [{ name: "Kepanduan Advent Team" }],
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-152x152.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL(config.baseUrl),
  openGraph: {
    title: "Kepanduan Advent - Platform Digital Pembelajaran",
    description: "Platform digital interaktif untuk pembelajaran dan pelatihan Adventurer, Pathfinder, dan Master Guide",
    url: config.baseUrl,
    siteName: "Kepanduan Advent",
    type: "website",
    images: [
      {
        url: "/screenshots/desktop-1.png",
        width: 1280,
        height: 720,
        alt: "Kepanduan Advent Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kepanduan Advent - Platform Digital Pembelajaran",
    description: "Platform digital interaktif untuk pembelajaran dan pelatihan Adventurer, Pathfinder, dan Master Guide",
    images: ["/screenshots/desktop-1.png"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8E2DE2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id-ID" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Kepanduan Advent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kepanduan Advent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#8E2DE2" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${poppins.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

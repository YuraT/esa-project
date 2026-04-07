import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Merriweather_Sans } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ESA Project",
  description: "Project to help with Endangered Species Act compliance",
  applicationName: "EPA ESA",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      {
        url: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        url: "/favicon-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/favicon-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="EPA ESA" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${merriweatherSans.variable} ${geistMono.variable} min-h-screen w-full max-w-full overflow-x-hidden antialiased`}
      >
        <div className="min-h-screen w-full max-w-full overflow-x-hidden box-border">
          {children}
        </div>
      </body>
    </html>
  );
}

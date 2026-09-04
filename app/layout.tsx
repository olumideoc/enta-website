import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: {
    default: "Enta — Money that works everywhere you do",
    template: "%s | Enta",
  },
  description:
    "Send, buy and hold digital dollars, gold and Bitcoin with one secure Enta account.",
  openGraph: {
    siteName: "Enta",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // globals.css sets scroll-behavior: smooth on <html> for the in-page
    // anchors. data-scroll-behavior tells the router to suspend that while a
    // route transition runs, so following a nav link from far down one page
    // lands at the top of the next one instead of animating the whole way.
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

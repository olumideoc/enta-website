import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enta — Money that works everywhere you do",
  description:
    "Send, buy and hold digital dollars, gold and Bitcoin with one secure Enta account.",
  icons: {
    icon: [{ url: "/enta-website/enta-logomark.svg", type: "image/svg+xml" }],
    shortcut: "/enta-website/enta-logomark.svg",
  },
  openGraph: {
    title: "Enta — Money that works everywhere you do",
    description:
      "Send, buy and hold digital dollars, gold and Bitcoin with one secure Enta account.",
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enta — Money that works everywhere you do",
    description:
      "Send, buy and hold digital dollars, gold and Bitcoin with one secure Enta account.",
    images: ["/enta-website/enta-dashboard-snapshot.png"],
  },
};

export default function EntaWebsiteLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

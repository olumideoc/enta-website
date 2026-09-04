/**
 * Primary navigation. All three items are routes now that Business has a page
 * of its own, so the landing page and every other page point at the same set
 * and the old #business anchor into the landing page's audience card is gone.
 */
export const navigationItems = [
  { label: "Individual", href: "/enta-website/individual" },
  { label: "Business", href: "/enta-website/business" },
  { label: "Security", href: "/enta-website/security" },
] as const;

/** Alias kept for the shared header, which reads this name. */
export const siteNavigationItems = navigationItems;

export type LogoStripItem = {
  name: string;
  src: string;
  /** Intrinsic size of the asset, for next/image's aspect ratio. */
  width: number;
  height: number;
  /** Rendered height in the strip when the default 20px wordmark height is too small, e.g. for a stacked lockup. */
  displayHeight?: number;
};

export const logoStrip: readonly LogoStripItem[] = [
  { name: "FirstBank", src: "/enta-website/partner-firstbank.png", width: 96, height: 32 },
  { name: "Candide", src: "/enta-website/partner-candide.png", width: 135, height: 32 },
  { name: "Telegram", src: "/enta-website/partner-telegram.png", width: 124, height: 32 },
  { name: "Tether", src: "/enta-website/partner-tether.png", width: 100, height: 32 },
  { name: "Flashnet", src: "/enta-website/partner-flashnet.png", width: 152, height: 32 },
  {
    name: "Visa Accelerator Program",
    src: "/enta-website/partner-visa-accelerator-program.svg",
    width: 55,
    height: 28,
    displayHeight: 36,
  },
];

export const audienceCards = [
  {
    title: "Enterprises, companies, business accounts",
    label: "For businesses",
    tone: "business",
    background: "/enta-website/enta-landing/audience-business-bg.png",
    artwork: "/enta-website/enta-landing/audience-business-glass.png",
  },
  {
    title: "Diaspora individuals, freelancers, students, micro-entrepreneurs",
    label: "For individuals",
    tone: "individual",
    background: "/enta-website/enta-landing/audience-individual-bg.png",
    artwork: "/enta-website/enta-landing/audience-individual-glass.png",
  },
] as const;

export type FeatureItemMedia = {
  /** Path stem within the folder: `<basename>-light.{webm,mp4}` and `-light-poster.jpg`. */
  basename: string;
  /** One full pass of the loop, which is also the item's autoplay dwell. */
  durationMs: number;
  /** Folder under /enta-website/ holding the loop. */
  dir?: string;
};

export type FeatureItem = {
  id: string;
  label: string;
  /** Null until the copy is written; the item then renders as a plain label. */
  description: string | null;
  /** Absent until the loop for the item has been rendered. */
  media?: FeatureItemMedia;
};

export const featureItems: readonly FeatureItem[] = [
  {
    id: "send",
    label: "Send",
    description:
      "Across borders in minutes, at the rate you were shown — checked before it goes: the address, the amount, anything unusual.",
    media: { basename: "feature-send", durationMs: 7000 },
  },
  {
    id: "buy",
    label: "Buy",
    description:
      "Digital dollars, Bitcoin, and gold from your local currency, in a few taps — and it flags the day worth taking.",
    media: { basename: "feature-buy", durationMs: 19000 },
  },
  {
    id: "hold",
    label: "Hold",
    description:
      "In money that keeps its value — and it tells you the moment that matters. You decide, every time.",
    media: { basename: "feature-hold", durationMs: 12000 },
  },
];

/**
 * The send / buy / hold section's heading row. The landing page and the
 * individual page render one EntaFeaturesBand between them, so this copy is
 * written once here.
 *
 * The apostrophes in the description are the straight ones the landing page
 * has always rendered (it spelled them `&apos;`), kept as they were.
 */
export const featuresBand = {
  heading: "Send, buy and hold digital dollars, gold and Bitcoin",
  description:
    "One account for the money you're moving and the assets you're keeping.",
  ctaLabel: "Get started",
} as const;

export const faqQuestions = [
  "What documents do I need to register?",
  "How do you keep funds secure?",
  "How much does it cost to create an account?",
  "Can I access my money any time?",
] as const;

/**
 * The security band, shared by the landing page and the individual page. The
 * two differ only in where "Explore security" points, which is a prop.
 */
export const securityBand = {
  heading: "Security that protects you. Intelligence that helps you.",
  ctaLabel: "Explore security",
  points: [
    {
      icon: "/enta-website/enta-landing/security-fingerprint.svg",
      title: "Only you can get in",
      body: "Use your passkey to access your account. If you lose your phone, you can recover it securely—without giving anyone else access.",
    },
    {
      icon: "/enta-website/enta-landing/security-eyes.svg",
      title: "A second look before you pay",
      body: "We’ll highlight favourable rates and flag details worth checking, like an incorrect address or an unexpected fee. You always make the final call.",
    },
  ],
} as const;

/** Heading over the FAQ list. */
export const faqTitle = "FAQs";

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Individuals", href: "/enta-website/individual" },
      { label: "Business", href: "/enta-website/business" },
      {
        label: "Pulse (For Platforms)",
        href: "https://pulse-staging-seven.vercel.app/",
        external: true,
      },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Security", href: "/enta-website/security" },
      { label: "Changelog", href: "/enta-website/changelog" },
      { label: "Blog", href: null },
    ],
  },
] as const;

export const footerSocialLinks = [
  {
    label: "Twitter",
    href: "https://x.com/Entashiga",
    icon: "twitter",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/entashiga",
    icon: "instagram",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@entashiga",
    icon: "tiktok",
  },
] as const;

/*
  Real customer testimonials, supplied by the team on 2026-09-04 and reproduced
  word for word. Do not edit these to fit the site's copy voice: they are what
  the customers actually said.
*/
export const customerReviews = [
  {
    name: "Reni Abina",
    descriptor: "Founder and Creative Director, Rendoll",
    quote:
      "Managing FX used to be one of the things that constantly slowed us down. Since we started using Enta by Shiga, that entire process has become seamless. We convert Naira into foreign currencies for supplier payments regularly, and it has always been fast, transparent and reliable. I genuinely wish we had started sooner.",
  },
  {
    name: "Dipo O.",
    descriptor: "Tropical Naturals Limited",
    quote:
      "Enta by Shiga has been a breath of fresh air. Super-quick, reliable and traceable payments from a single legitimate source.",
  },
  {
    name: "Deji Awoniyi",
    descriptor: "Founder and CEO, MyPocketCounsel",
    quote:
      "Our hardest problem was never building product, it was moving our own money. Our US-raised investment had to fund Nigerian operations, and when our banking provider exited and closed our accounts, we were scrambling to pay local bills. Enta by Shiga gave us a reliable way to move funds in and consolidate revenue across the continent. It took a genuine operational risk off the table.",
  },
] as const;

export const logoStrip = [
  ["FirstBank", "/enta-website/partner-firstbank.png", 96, 32],
  ["Candide", "/enta-website/partner-candide.png", 135, 32],
  ["Telegram", "/enta-website/partner-telegram.png", 124, 32],
  ["Tether", "/enta-website/partner-tether.png", 100, 32],
  ["Flashnet", "/enta-website/partner-flashnet.png", 152, 32],
  ["Visa", "/enta-website/partner-visa.png", 84, 32],
] as const;

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
  /** Path stem under enta-landing: `<basename>-light.{webm,mp4}` and `-light-poster.jpg`. */
  basename: string;
  /** One full pass of the loop, which is also the item's autoplay dwell. */
  durationMs: number;
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

export const faqQuestions = [
  "What documents do I need to register?",
  "How do you keep funds secure?",
  "How much does it cost to create an account?",
  "Can I access my money any time?",
] as const;

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Individuals", href: "/enta-website#individual" },
      { label: "Business", href: "/enta-website#business" },
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
      { label: "Security", href: "/enta-website#security" },
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

export const customerReviews = [
  {
    name: "Abena Owusu",
    descriptor: "Freelance video editor, Kumasi",
    quote:
      "I edit for a studio in Austin and they pay me in US dollars. Most of it stays in Enta now and I change to cedis a bit at a time, as I need it.",
  },
  {
    name: "Tunde Adewale",
    descriptor: "Furniture importer, Lagos",
    quote:
      "I import furniture fittings from Guangzhou. Paying the supplier was always a week of back and forth with my bank. Last month I sent it from Enta on a Tuesday afternoon and he confirmed it that same evening.",
  },
  {
    name: "Brian Otieno",
    descriptor: "University student, Nairobi",
    quote:
      "My aunt in the UK sends money for my fees every semester. Once it reaches my Enta I text her so she knows, then I pay the school from there.",
  },
  {
    name: "Omar Mahmoud",
    descriptor: "Accountant, Cairo",
    quote:
      "When I get paid I put part of my salary into Enta and buy gold. I keep the rest of my savings there too, so I was glad it opens with a passkey and not a password someone could guess.",
  },
] as const;

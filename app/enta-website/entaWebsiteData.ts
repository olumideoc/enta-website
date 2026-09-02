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

export const savingsRows = [
  {
    label: "Held in xAU₮",
    qualifier: "(Gold)",
    badge: "+29% vs naira",
    value: "₦8.5M",
    icon: "/enta-website/enta-landing/calculator-gold.svg",
    color: "#d4aa3f",
    progress: "71.2%",
  },
  {
    label: "Held in Bitcoin",
    badge: "+29% vs naira",
    value: "₦8.5M",
    color: "#ff8a00",
    progress: "59%",
  },
  {
    label: "Held in T-bills",
    badge: "+29% vs naira",
    value: "₦8.5M",
    icon: "/enta-website/enta-landing/calculator-tbill.svg",
    color: "#6f2da8",
    progress: "44.6%",
  },
  {
    label: "Held in US Dollars",
    badge: "+29% vs naira",
    value: "₦8.5M",
    icon: "/enta-website/enta-landing/calculator-usd.svg",
    color: "#c52032",
    progress: "28.5%",
  },
  {
    label: "Held in Naira",
    badge: "Baseline",
    value: "₦8.5M",
    color: "#165b22",
    progress: "19.3%",
  },
] as const;

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
      { label: "Individuals", href: "#individual" },
      { label: "Business", href: "#business" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Security", href: "#security" },
    ],
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

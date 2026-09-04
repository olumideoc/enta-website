/**
 * Every string on the business page.
 *
 * The hero, the four section headings, the pill labels, the two form-factor
 * cards, the team rows and the four columns are taken from Figma frame 1:5530
 * and its state frames 1:5369, 1:5435, 1:5501, 1:6113 and 1:6139, exactly as
 * written. That includes every em dash the designer typed, the ampersand in
 * "Roles & teams", and the typewriter apostrophes the whole frame uses ("you
 * don't need", "the old way can't", "your business's reserves"). Please do not
 * swap those for typographic ones: the individual page's frames mix the two
 * forms and this one does not, and both are kept as drawn.
 *
 * Two strings in the frame keep spacing the designer typed and Figma renders as
 * typed: "A quick verification check  in minutes" (1:5594) and "Powered by
 * Pulse " with its trailing space before the dagger (1:5606). Both are left as
 * they are.
 *
 * Nothing in these frames is placeholder copy, so unlike the individual page
 * there is no PLACEHOLDER COPY marker anywhere in this file. The one string to
 * keep an eye on is `columnsDescription`: Figma 1:5666 repeats 1:5632 word for
 * word, and it is shipped as written rather than reworded.
 */

import type { FeatureItem } from "../entaWebsiteData";
import type { PillTab } from "../PillTabs";

/** Page description for the tab title and the social cards. */
export const businessDescription =
  "How Enta works for a business: collect at the storefront, pay suppliers abroad, give your team their own access, and hold reserves in digital dollars, gold and Bitcoin.";

export const heroHeading =
  "A business account built on money that holds its value";

export const heroBody =
  "Collect payments, pay suppliers, manage your team — like any bank. But your reserves sit in digital dollars, Bitcoin, and gold instead of a currency that loses value while you sleep.";

export const heroPrimaryLabel = "Get started";

export const heroSecondaryLabel = "Know more";

/** Anchor the hero's second button scrolls to. */
export const waysSectionId = "business-ways";

/** id of the heading the pill tab section is labelled by. */
export const waysHeadingId = "business-ways-title";

export const waysHeading =
  "The intelligence watches. You decide. The rails execute.";

/** Names the pill row for a screen reader; the pills themselves read as tabs. */
export const waysTabListLabel = "Ways a business uses Enta";

const signupUrl = "https://app.entashiga.io/signup";

/**
 * The four pill panels. Each one ends in a button rather than a check list,
 * which is the one way these panels differ from the individual page's.
 */
export const businessTabs: readonly PillTab[] = [
  {
    id: "commodities",
    label: "I trade commodities",
    icon: "/enta-website/business/tab-commodities.svg",
    iconActive: "/enta-website/business/tab-commodities-active.svg",
    heading: "Paid at delivery. Preserved by nightfall.",
    body: "Big lumpy payments land in naira; the exposure clock starts immediately. Set your target rate and the moment it hits, one tap moves the proceeds into digital dollars.",
    action: { label: "Get started", href: signupUrl },
  },
  {
    id: "import",
    label: "I import stock",
    icon: "/enta-website/business/tab-import.svg",
    iconActive: "/enta-website/business/tab-import-active.svg",
    heading: "The restock fund stops shrinking",
    body: "You sell in naira and buy in dollars — the gap between the two is where your margin dies. Hold working capital in digital dollars and pay the supplier invoice straight from it.",
    action: { label: "Get started", href: signupUrl },
  },
  {
    id: "invoice",
    label: "I invoice clients abroad",
    icon: "/enta-website/business/tab-invoice.svg",
    iconActive: "/enta-website/business/tab-invoice-active.svg",
    heading: "Invoice in dollars. Convert on your terms.",
    body: "Client money lands as digital dollars and sits there holding its value. Payroll and local costs convert on the days the rate favours you — not the days the bills are due.",
    action: { label: "Get started", href: signupUrl },
  },
  {
    id: "store",
    label: "I collect at my store",
    icon: "/enta-website/business/tab-store.svg",
    iconActive: "/enta-website/business/tab-store-active.svg",
    heading: "Collect all day. Preserve the float at close.",
    body: "Take payments at the storefront from day one. At close, sweep what you don't need for tomorrow into digital dollars — the float stops eroding overnight.",
    action: { label: "Get started", href: signupUrl },
  },
];

/** id of the heading the two form-factor cards are labelled by. */
export const formFactorsHeadingId = "business-form-factors-title";

export const formFactorsHeading = "Two form factors, powerful possibilities";

export type FormFactorCard = {
  id: string;
  /** The wash behind the card, drawn at 20% the way the frame draws it. */
  wash: string;
  eyebrow: string;
  title: string;
  body: string;
  points: readonly string[];
  /**
   * Set on the one bullet Figma prints with a dagger after it, so the marker
   * can be typeset a size smaller the way the frame draws it.
   */
  daggerPoint?: string;
  ctaLabel: string;
  ctaHref: string;
};

export const formFactorCards: readonly FormFactorCard[] = [
  {
    id: "smes",
    wash: "/enta-website/business/card-wash-smes.png",
    eyebrow: "FOR LOCAL SMES",
    title: "Collect at your storefront",
    body: "A quick verification check  in minutes then log in and start taking payments at your store the same day. Digital dollars or local currency, every sale visible live.",
    points: ["Quick verification", "Same-day collection"],
    daggerPoint: "Powered by Pulse ",
    ctaLabel: "Start collecting",
    ctaHref: signupUrl,
  },
  {
    id: "growing",
    wash: "/enta-website/business/card-wash-growing.png",
    eyebrow: "FOR GROWING BUSINESSES",
    title: "The full business account",
    body: "Bank normally — team, roles, payments, cross-border — while your reserves sit in digital dollars, Bitcoin, and gold.",
    points: ["Team and roles", "USDT, Digital gold and bitcoin"],
    ctaLabel: "Open full account",
    ctaHref: signupUrl,
  },
];

/** id of the heading the team section is labelled by. */
export const teamHeadingId = "business-team-title";

export const teamHeading =
  "Your whole team, one account and no one person moves the money";

export const teamBody =
  "Everyone gets their own access, money moves by the rule you set and the intelligence flags anything unusual before it reaches your signers.";

export const teamCtaLabel = "Get started";

/**
 * The three rows of the vertical list. Typed as the accordion's own item so
 * FeatureAccordion can render them, and declared here as a module constant
 * because the component memoises on the array identity.
 */
export const teamRows: readonly FeatureItem[] = [
  {
    id: "roles",
    label: "Roles & teams",
    description:
      "Owner, admin, member — invited by email. Each can prepare, sign off, or just view. Everyone acts with their own face or fingerprint.",
  },
  {
    id: "authorization",
    label: "Multi-level authorization",
    description:
      "Two of three owners, all three, or just you. Changed in seconds. Above an amount you set, one more person must agree — or the payment waits.",
  },
  {
    id: "activity",
    label: "Activity log",
    description:
      "Every payment shows who prepared it, who signed off, and when. Own keys — nothing anonymous.",
  },
];

/** id of the heading the four-column band is labelled by. */
export const columnsHeadingId = "business-columns-title";

export const columnsHeading = "What Enta gives that the old way can't";

/**
 * Figma 1:5666 repeats the team section's description word for word. Shipped
 * verbatim rather than reworded; flagged at the top of this file.
 */
export const columnsDescription =
  "Everyone gets their own access, money moves by the rule you set and the intelligence flags anything unusual before it reaches your signers.";

export type BusinessColumn = {
  id: string;
  icon: string;
  title: string;
  body: string;
};

export const businessColumns: readonly BusinessColumn[] = [
  {
    id: "ownership",
    icon: "/enta-website/business/column-ownership.svg",
    title: "It's yours, and only yours",
    body: "It belongs to your business outright. We hold no key that can spend it; nobody lends it out behind your back.",
  },
  {
    id: "reserves",
    icon: "/enta-website/business/column-reserves.svg",
    title: "Hold harder money",
    body: "Buy digital dollars, Bitcoin, and gold straight from your local currency — and hold your business's reserves in assets that don't erode.",
  },
  {
    id: "account",
    icon: "/enta-website/business/column-account.svg",
    title: "Bank like normal",
    body: "Collect at the storefront, pay suppliers, run your team with roles — and move money across Africa, Europe, and the Gulf at the rate you see.",
  },
  {
    id: "more",
    icon: "/enta-website/business/column-more.svg",
    title: "Your reserves, working harder",
    body: "What you hold today will soon do more for your business — without ever letting it go. Speak to our team to be briefed as it opens.",
  },
];

/*
 * A note on the two card washes.
 *
 * Figma fills each card with an image at 20% opacity, and the MCP export of
 * that fill comes back as an empty transparent raster, so there is no asset to
 * download. The two PNGs above are recovered from Figma's own render of the
 * cards instead: the render was un-blended back through the 20%, the text, the
 * checks and the button were masked out, and a cubic surface was fitted to
 * what remained, which is a smooth two-colour wash in both cards. The fit sits
 * within about 6/255 of the frame's own pixels. They are the designer's
 * artwork rather than anything drawn here, and they differ from each other, so
 * both are shipped.
 */

/** The caret after each form-factor card's label, already on the site. */
export const ctaCaretIcon = "/enta-website/enta-landing/button-caret-right.svg";

/** The green check beside a card bullet, already on the site. */
export const checkIcon = "/enta-website/security/do-check-circle.svg";

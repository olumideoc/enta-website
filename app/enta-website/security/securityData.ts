import type { FeatureItem } from "../entaWebsiteData";

/**
 * Every string on the security page, taken from the Figma frame as written.
 * The three deliberate departures from the frame are marked below.
 */

export const securityDescription =
  "What the passkey on your device does, what Enta cannot do, and how recovery works if you lose your phone.";

export const heroHeading = "Written to be checked, not believed.";

export const heroBody =
  "Only you can touch your money. This page explains exactly why that's true — how the key works, what we can and cannot do, and how recovery happens if you lose your phone. Check any of it.";

export const heroLinkLabel = "Know more";

export const passkeyHeading = "Your device passkey is the only key";

// The site's word for these is "bank apps"; Figma spells it out longer.
export const passkeyBody =
  "When you create your account, your phone generates a key inside the same secure chip that protects your bank apps. It never leaves that chip — not to us, not to anyone. Your face or fingerprint unlocks it; the key itself signs.";

export type PasskeyPoint = {
  id: string;
  title: string;
  body: string;
  icon: string;
};

export const passkeyPoints: readonly PasskeyPoint[] = [
  {
    id: "phish",
    title: "Nothing to phish",
    body: "There is no password to steal and no code to trick out of you. The key can't be typed, told, or copied.",
    icon: "/enta-website/security/passkey-nothing-to-phish.svg",
  },
  {
    id: "lose",
    title: "Nothing for us to lose",
    // Figma names the parent company here; the product on this page is Enta.
    body: "We never hold your key, so no breach of ours can expose it. A hack of Enta cannot move your money.",
    icon: "/enta-website/security/passkey-nothing-for-us-to-lose.svg",
  },
  {
    id: "standard",
    title: "An open standard",
    body: "Built on WebAuthn — the same passkey standard used by Google, Apple, and major banks. Not our invention; an industry standard you can read about anywhere.",
    icon: "/enta-website/security/passkey-open-standard.svg",
  },
];

export const boundariesHeading = "What we cannot do and what we do";

export const cannotTitle = "We cannot — by design, not policy";

export const cannotPoints = [
  "Move or access your digital assets.",
  "See or reconstruct your passkey.",
  "Approve a transaction for you.",
  "Change your recovery setup without your knowledge.",
] as const;

/** Two spaces after the asterisk, as in Figma; the rule keeps them. */
export const cannotFootnote =
  "*  These aren't promises we keep — they're things the architecture makes impossible for us.";

export const doTitle = "We do — and say so plainly";

export const doPoints = [
  "Run the infrastructure your transactions travel on.",
  "Watch market rates and inform you.",
  "Screen transactions for fraud and hold flagged flows for review.",
  "Verify identity where the law requires it",
] as const;

export const recoveryHeading = "Lose your device. Keep your money.";

export const recoveryBody =
  "No seed phrase. You verify your identity on a new device, and a recovery process replaces your old key with a new one — inside sealed hardware we cannot open, even if ordered to.";

/**
 * The rows beside the recovery panel. One opens at a time, the way the landing
 * page's list works; Figma draws each open state as its own frame (1:5954,
 * 1:6061, 1:6087).
 */
export const recoveryItems: readonly FeatureItem[] = [
  {
    id: "announced",
    label: "Announced, always",
    description:
      "Every recovery is announced to your registered contacts the moment it starts. A recovery you didn't ask for can be cancelled with one tap.",
  },
  {
    id: "waiting",
    label: "A deliberate waiting period",
    description:
      "Recovery completes after a waiting period that scales with your balance — 24 hours for small balances, up to 72 hours for large ones. Slow enough to stop a thief; fast enough to get you back in.",
  },
  {
    id: "cancellable",
    label: "Cancellable throughout",
    description:
      "At any point in the waiting period, the legitimate owner can cancel from any signed-in device. The waiting period exists so that you always win the race.",
  },
];

export const recoveryLinkLabel = "Get started";

export const resourcesHeading = "Resources";

export type ResourceItem = {
  id: string;
  title: string;
  body: string;
  icon: string;
  linkLabel: string;
  href: string | null;
  /** Figma capitalises the label in CSS rather than in the text layer. */
  capitalize?: boolean;
};

export const resourceItems: readonly ResourceItem[] = [
  {
    id: "verify",
    title: "Verify on-chain",
    body: "Your account is a smart account on a public blockchain. Look it up yourself — the ownership structure this page describes is visible on-chain.",
    icon: "/enta-website/security/resource-cube.svg",
    linkLabel: "Account verifier",
    href: null,
    capitalize: true,
  },
  {
    id: "status",
    title: "Live status",
    body: "Our systems' health, publicly visible — including incidents, not just uptime.",
    icon: "/enta-website/security/resource-activity.svg",
    linkLabel: "Status page",
    href: null,
    capitalize: true,
  },
  {
    id: "disclosure",
    title: "Found something?",
    body: "Security researchers: we want to hear from you. Responsible disclosure gets a response, not a lawyer.",
    icon: "/enta-website/security/resource-bug.svg",
    // Figma's label stops short of a real domain; this is the live address.
    linkLabel: "Email security@entashiga.io",
    href: "mailto:security@entashiga.io",
  },
];

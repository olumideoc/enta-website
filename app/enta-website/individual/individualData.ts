/**
 * Every string on the individual page.
 *
 * The hero, the section heading, the four pill labels and each panel's heading
 * and body are taken from Figma frame 1:5054 exactly as written, including the
 * em dashes and the apostrophes the designer typed.
 *
 * The apostrophes are deliberately mixed, because Figma's are. The pill labels
 * 1:5088 and 1:5091 carry the typographic apostrophe ("I’m paid from abroad"),
 * while the panel strings 1:5099, 1:5352 and 1:5418 carry the typewriter one
 * ("you don't send", "not payday's", "that's still there"). Checked twice: one
 * get_design_context call over the pill row returns the curly form as plain
 * text and the panel strings wrapped as template literals around a straight
 * quote, and a 6x crop of Figma's own render shows a comma-shaped mark in the
 * pill against a vertical bar in the heading. Verbatim beats consistency here,
 * so please do not normalise them.
 *
 * The check bullets are the exception. Every bullet in all four Figma panels is
 * filler text rather than real copy, so the nine lines below are written here to
 * stand in until the designer supplies the real ones. Search this file for
 * PLACEHOLDER COPY to find all nine: each one names the Figma node it replaces,
 * and each is short enough to sit on one line in Figma's 299px bullet column.
 */

/** Page description for the tab title and the social cards. */
export const individualDescription =
  "How Enta works if you send money home, get paid from abroad, save for something big, or buy stock from suppliers overseas.";

export const heroHeading = "Send it. Grow it. Keep it. One account.";

export const heroBody =
  "Most apps do one of these. Your money does all of them, every month — so Enta was built for the combination. Pick your situation and watch it work end to end.";

export const heroPrimaryLabel = "Get started";

export const heroSecondaryLabel = "Know more";

/** Anchor the hero's second button scrolls to. */
export const waysSectionId = "individual-ways";

/** id of the heading the tab section is labelled by. */
export const waysHeadingId = "individual-ways-title";

export const waysHeading = "One account for every move your money makes.";

/** Names the pill row for a screen reader; the pills themselves read as tabs. */
export const waysTabListLabel = "Ways to use Enta";

export type IndividualTab = {
  id: string;
  /** Pill label, verbatim from Figma. */
  label: string;
  /** Line version of the glyph, shown while the pill is not selected. */
  icon: string;
  /** Solid version of the glyph, shown while the pill is selected. */
  iconActive: string;
  heading: string;
  body: string;
  /** Check bullets. Placeholders: see the note at the top of this file. */
  points: readonly string[];
};

export const individualTabs: readonly IndividualTab[] = [
  {
    id: "send",
    label: "I send money home",
    icon: "/enta-website/individual/tab-send.svg",
    iconActive: "/enta-website/individual/tab-send-active.svg",
    heading: "Money home in minutes and what stays behind, holds",
    body: "The rate you see is the rate they get, locked before you tap. And the part of your pay you don't send stops melting the day you move it.",
    points: [
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5103.
      "See the rate and the fee up front",
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5106.
      "What you keep holds its value",
    ],
  },
  {
    id: "paid",
    label: "I’m paid from abroad",
    icon: "/enta-website/individual/tab-paid.svg",
    iconActive: "/enta-website/individual/tab-paid-active.svg",
    heading: "Invoice in dollars. Convert on your terms, not payday's",
    body: "Get paid into Enta in digital dollars and let it sit there holding its value. Convert to local currency only when you need to — at the rate the intelligence flagged, not the rate the deadline forced.",
    points: [
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5357.
      "Paid in dollars, held in dollars",
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5360.
      "Convert on a day that suits you",
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5363.
      "Send part of it home from here",
    ],
  },
  {
    id: "saving",
    label: "I’m saving for something big",
    icon: "/enta-website/individual/tab-saving.svg",
    iconActive: "/enta-website/individual/tab-saving-active.svg",
    heading: "Save in money that's still there when you arrive",
    body: "Set aside every month into digital dollars for stability, Bitcoin for the long term, gold for all time — from the same balance, in the same taps. The goal stops moving away from you.",
    points: [
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5423.
      "Save in dollars, gold or Bitcoin",
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5426.
      "See its worth in your own currency",
    ],
  },
  {
    id: "stock",
    label: "I buy stock from abroad",
    icon: "/enta-website/individual/tab-stock.svg",
    iconActive: "/enta-website/individual/tab-stock-active.svg",
    heading: "Sell in naira. Pay suppliers abroad from the same balance",
    body: "Collect your sales locally, hold your working capital in digital dollars, and pay the supplier invoice abroad without a bureau de change in between.",
    points: [
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5489.
      "Take payment in your own currency",
      // PLACEHOLDER COPY awaiting the designer, standing in for Figma 1:5492.
      "Pay suppliers abroad in dollars",
    ],
  },
];

/**
 * The green check beside each bullet. Byte-identical to the glyph the security
 * page already exports, so this page points at that file rather than shipping a
 * second copy of it.
 */
export const checkIcon = "/enta-website/security/do-check-circle.svg";

export type ChangelogMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ChangelogEntry = {
  type: "New feature" | "Improvement" | "Enhancement";
  title: string;
  description: string;
  media?: ChangelogMedia;
};

export type ChangelogRelease = {
  id: string;
  date: string;
  dateTime: string;
  entries: readonly ChangelogEntry[];
};

export const changelogReleases: readonly ChangelogRelease[] = [
  {
    id: "2026-09-02",
    date: "2 September 2026",
    dateTime: "2026-09-02",
    entries: [
      {
        type: "New feature",
        title: "The Enta account",
        description:
          "Enta brings local bank transfers, digital dollars, Bitcoin and gold into one secure account. You can receive money to your local bank account, send it across borders, move value in digital dollars, and hold Bitcoin or gold without selling or giving up control. Passkey access protects sign-in, and secure recovery helps you get back into your account if you lose your phone. Before a payment leaves, Enta highlights the address, amount, rate and any unexpected fee worth checking, so you remain the person making the final call.",
      },
    ],
  },
];

/** Responsive image helpers.
 *
 * Every photograph wider than 800px has 480, 768, 1024 and 1440px siblings
 * beside it, named `<file>-<width>.<ext>` (see the README in each directory
 * under `public/`). A phone was otherwise downloading the full 1920px plate —
 * around 400KB — to paint it 350px wide.
 *
 * The variants are generated with sharp; regenerate them when a photograph is
 * replaced, or the srcset will offer widths that no longer exist. */

const WIDTHS = [480, 768, 1024, 1440] as const;

/** The intrinsic width of each original, so the srcset never offers a variant
 *  that was not generated — sharp skips any width at or above the original. */
const INTRINSIC: Record<string, number> = {
  "/plates/ene-det-1.jpg": 1920,
  "/plates/ene-plate-hero.jpg": 1920,
  "/plates/fin-det-1.jpg": 1920,
  "/plates/fin-plate-hero.jpg": 1920,
  "/plates/hea-det-1.webp": 1920,
  "/plates/hea-plate-hero.jpg": 1031,
  "/plates/pub-det-1.jpg": 1920,
  "/plates/pub-plate-hero.jpg": 1024,
  "/plates/ret-det-1.webp": 1920,
  "/plates/ret-plate-hero.jpg": 1920,
  "/plates/sol-band.jpg": 1920,
  "/plates/tel-plate-city.jpg": 1920,
  "/plates/tel-plate-hero.jpg": 1920,
  "/plates/tel-plate-net.jpg": 1920,
  "/portraits/lead-3.jpg": 1273,
  "/udara/participants.webp": 1920,
  "/udara/speakers.webp": 1920,
  "/udara/the-build-flyer.webp": 1920,
  "/bootcamp/poster.webp": 1080,
  "/bootcamp/speakers.jpg": 1200,
};

/** The `srcset` for one photograph, or undefined when it has no variants —
 *  passing undefined leaves the plain `src` to do its job. */
export function srcSet(src: string): string | undefined {
  const intrinsic = INTRINSIC[src];
  if (!intrinsic) return undefined;

  const dot = src.lastIndexOf(".");
  const base = src.slice(0, dot);
  const ext = src.slice(dot);

  const entries = WIDTHS
    .filter((w) => w < intrinsic)
    .map((w) => `${base}-${w}${ext} ${w}w`);

  return [...entries, `${src} ${intrinsic}w`].join(", ");
}

/** How wide the image is actually drawn, so the browser picks the right
 *  variant before layout. The gutter is --page-x: 100px at the design width,
 *  48px below 1200px and 20px below 768px. */
export const SIZES = {
  /** Full page width inside the gutter — the solutions band, the posters. */
  full: "(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 96px), 1240px",
  /** The plate hero: a 520px rail on the design width, full width below it. */
  plateHero: "(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 96px), 520px",
  /** The plate detail: a 460px rail. */
  plateDetail: "(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 96px), 460px",
  /** Half the page, as the udara and bootcamp split figures are drawn. */
  half: "(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 96px), 620px",
  /** A portrait in the four-up leadership grid. */
  portrait: "(max-width: 767px) calc(50vw - 30px), (max-width: 1199px) calc(33vw - 40px), 290px",
} as const;

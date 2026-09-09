export type ContentMeta = {
  path: `/${string}`;
  lastmod: string;
  feed?: {
    title: string;
    description: string;
    published: string;
  };
};

/**
 * Manually maintained publication metadata for canonical, indexable pages.
 * Dates change only when a page is materially reviewed or updated; they are
 * deliberately independent of the build and deployment date.
 */
export const contentMeta: ContentMeta[] = [
  { path: '/', lastmod: '2026-09-06' },
  { path: '/about/', lastmod: '2026-09-08' },
  { path: '/after-a-hailstorm/', lastmod: '2026-09-08', feed: { title: 'What to Do After a Hailstorm', description: 'A practical sequence for safely checking, documenting, and inspecting possible vehicle hail damage.', published: '2026-09-05' } },
  { path: '/auto-hail-repair/', lastmod: '2026-09-08' },
  { path: '/contact/', lastmod: '2026-09-06' },
  { path: '/data-sources/', lastmod: '2026-09-08', feed: { title: 'Hail Data Sources and Methodology', description: 'How Peak Country uses and labels NWS, SPC, and NOAA/NCEI hail information.', published: '2026-09-05' } },
  { path: '/door-ding-repair/', lastmod: '2026-09-08' },
  { path: '/faq/', lastmod: '2026-09-08' },
  { path: '/free-hail-inspection/', lastmod: '2026-09-08' },
  { path: '/gallery/', lastmod: '2026-09-09' },
  { path: '/hail-damage-guide/', lastmod: '2026-09-05' },
  { path: '/hail-size-guide/', lastmod: '2026-09-08', feed: { title: 'Hail Size Guide for Vehicle Owners', description: 'Common hail-size comparisons and the factors that affect vehicle damage risk.', published: '2026-09-05' } },
  { path: '/hail-tracker/', lastmod: '2026-09-08' },
  { path: '/hail-tracker/greeley/', lastmod: '2026-09-08' },
  { path: '/hail-tracker/northern-colorado/', lastmod: '2026-09-08' },
  { path: '/hail-tracker/weld-county/', lastmod: '2026-09-08' },
  { path: '/insurance-claims/', lastmod: '2026-09-05' },
  { path: '/northern-colorado-hail-history/', lastmod: '2026-09-08', feed: { title: 'Northern Colorado Hail History: 2016–2025', description: 'A verified NOAA/NCEI archive of hail observations within 50 miles of Greeley.', published: '2026-09-05' } },
  { path: '/paintless-dent-repair/', lastmod: '2026-09-09' },
  { path: '/process/', lastmod: '2026-09-08' },
  { path: '/repair-standards/', lastmod: '2026-09-08' },
  { path: '/resources/', lastmod: '2026-09-05' },
  { path: '/service-area/', lastmod: '2026-09-08' },
  { path: '/why-pdr/', lastmod: '2026-09-05' },
];

export const contentByPath = new Map(contentMeta.map((entry) => [entry.path, entry]));

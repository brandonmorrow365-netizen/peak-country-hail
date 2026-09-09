export type CaseStudy = {
  slug: string;
  published: boolean;
  city: string;
  vehicle: { year: number | null; make: string; model: string };
  damageType: string;
  affectedPanels: string[];
  repairConsiderations: string[];
  repairMethod: string;
  outcome: string;
  images: { before: string; after: string; alt: string; caption: string }[];
  dateCompleted: string;
  technician: string;
};

// No real case study is published until every fact, image, right, and outcome is
// supplied and approved. This non-exported template is intentionally unreachable.
const unpublishedExample: CaseStudy = {
  slug: 'sample-do-not-publish',
  published: false,
  city: '[verified city]',
  vehicle: { year: null, make: '[verified make]', model: '[verified model]' },
  damageType: '[verified damage type]',
  affectedPanels: ['[verified affected panel]'],
  repairConsiderations: ['[document what made this repair technically useful to explain]'],
  repairMethod: '[verified repair method]',
  outcome: '[factual outcome approved by the owner]',
  images: [],
  dateCompleted: '[YYYY-MM-DD]',
  technician: '[verified public technician or Peak Country]',
};

void unpublishedExample;
export const publishedCaseStudies: CaseStudy[] = [];

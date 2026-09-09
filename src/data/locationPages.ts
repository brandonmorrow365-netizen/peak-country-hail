export type LocationPage = {
  slug: string;
  city: string;
  published: boolean;
  coverage: string;
  appointmentExpectations: string;
  localQuestions: { question: string; answer: string }[];
  caseStudySlugs: string[];
};

/** Priority markets awaiting verified, city-specific facts. None are published. */
export const locationPages: LocationPage[] = ['Greeley','Windsor','Evans','Loveland','Fort Collins'].map((city) => ({
  slug: city.toLowerCase().replaceAll(' ', '-'),
  city,
  published: false,
  coverage: '',
  appointmentExpectations: '',
  localQuestions: [],
  caseStudySlugs: [],
}));

/**
 * Typed access to the JSON content files. All copy lives in the .json files
 * next to this one; components never hard-code text.
 */
import issuesJson from "./issues.json";
import teamJson from "./team.json";
import siteJson from "./site.json";
import legalJson from "./legal.json";

export interface Issue {
  id: string;
  label: string;
  what: string;
  help: string;
}

export interface TeamImage {
  src: string;
  thumbnail: string;
  alt: string;
  width: number;
  height: number;
}

export interface Psychologist {
  id: string;
  firstName: string;
  name: string;
  title: string;
  hcpcNumber: string;
  image: TeamImage;
  focus: string;
  lead: string;
  tags: string[];
  about: string;
  qualifications: string[];
  specialisms: string[];
  offers: string[];
  worksWith: string;
  testimonial: { quote: string; client: string };
}

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPage {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export type SiteContent = typeof siteJson;
export type LegalSlug = keyof typeof legalJson.pages;

export const issues: Issue[] = issuesJson.issues;
export const team: Psychologist[] = teamJson.team;
export const site: SiteContent = siteJson;
export const legalPages: Record<LegalSlug, LegalPage> = legalJson.pages;
export const legalSlugs = Object.keys(legalJson.pages) as LegalSlug[];

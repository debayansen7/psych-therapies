# Psych-Therapies website

Animated, horizontally scrolling site for Psych-Therapies, a UK clinical psychology practice
(Loughborough, Nottingham and online).

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, built as a **static export**
- **anexui** for UI components (Button, Modal, Drawer, FormField, Input, Select, Textarea, Checkbox, Alert)
- **CSS Modules** with the anexui tokens re-themed in `src/app/globals.css`
- All copy in **JSON** (`src/content/*.json`); all images are **WebP** in `public/images`
- Enquiry form posts to a **Google Apps Script** web app — no server, database or paid service

## Getting started

```bash
npm install
cp .env.example .env.local   # then add the Apps Script URL
npm run dev                  # http://localhost:3000
```

| Script          | What it does                                          |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Local development server                              |
| `npm run build` | Static export to `out/` (upload this folder anywhere) |
| `npm run lint`  | ESLint                                                |

## Project structure

```
src/
  app/
    layout.tsx            <html lang="en-GB">, fonts, anexui styles, metadata
    page.tsx              Home (renders HomeExperience)
    [slug]/page.tsx       Privacy notice, Complaints, Accessibility, Terms (from legal.json)
    globals.css           Theme tokens, motion switches, base styles
  content/
    site.json             Practice details, section copy, form copy, crisis text, footer links
    team.json             Psychologists: bios, qualifications, HCPC numbers, image paths + alt text
    issues.json           The ten "orbit" topics: what it is / what can help
    legal.json            Legal page content
    index.ts              Typed access to the JSON (components import from "@/content")
  components/
    experience/           HomeExperience (track, revolve, wheel), Header, SectionRail
    hero/                 Brain (SVG + path data), Hero (issue orbit, desktop card, mobile drawer)
    sections/             HowItWorks, TeamSection, ProfileModal, HelpSection, StoriesSection,
                          StartSection, EnquiryForm
  hooks/useMediaQuery.ts
  lib/submitEnquiry.ts
public/images/team/       WebP photos (full size + thumbnail)
apps-script/Code.gs       Enquiry handler for Google Apps Script
```

## Editing content

Every word on the site comes from `src/content/*.json`. Edit the JSON, then rebuild. Components never
hard-code copy. Anything in `[square brackets]` is a placeholder that must be filled in before launch.

## Images

- Format: **WebP only**, served from `public/images/` (no runtime optimisation; the site is static).
- Naming: lowercase, hyphen-separated and descriptive, e.g.
  `dr-sheena-parmar-clinical-psychologist.webp` and `…-thumbnail.webp`.
- Sizes used: profile photos 900 × 1100 px (quality 80), thumbnails 240 px wide.
- Every image needs alt text in UK English, written in the JSON next to its path.
- To convert a new photo: `cwebp -q 80 -resize 900 0 input.jpg -o output.webp`
  (or any image editor that exports WebP).

## How the page works

- Six full-screen sections sit side by side in a horizontal scroll-snap track (`<main>`).
- Scroll progress is written to a CSS variable `--p` on the root (no React re-render per frame).
  CSS derives the 3D "revolve" and parallax from `--p` and each section's index `--i`.
- A vertical mouse wheel moves one section sideways, unless the section itself can still scroll.
- Off-screen sections are `inert` and `aria-hidden`, so keyboard and screen-reader users only meet
  the visible one.
- Motion is switched off for `prefers-reduced-motion` and by the header's pause button
  (`--revolve` and `--parallax` become 0; all animations jump to their end state).
- Profiles use anexui's `Modal` (native `<dialog>`): focus is trapped, Escape closes,
  focus returns to the card. On phones the issue details use anexui's bottom `Drawer`.
- CSS Modules scope `@keyframes` names, so each module declares the keyframes it uses.

## Enquiry form → Google Apps Script

1. Signed in as the practice's admin Google account, open <https://script.google.com>, create a project
   and paste `apps-script/Code.gs`.
2. Project Settings → Script properties → add `PRACTICE_EMAIL` (the inbox for enquiries).
3. Deploy → New deployment → **Web app**, execute as **Me**, access **Anyone**.
4. Put the web app URL in `.env.local` as `NEXT_PUBLIC_ENQUIRY_ENDPOINT` and rebuild.

Nothing is stored: each enquiry is emailed to the practice. The script has a honeypot, length limits,
a consent check and a simple per-contact rate limit. Calendar booking (one calendar per psychologist)
is the next phase.

## Deployment (moving off Wix)

Wix can only host Wix-built sites, so the static `out/` folder goes to a free static host:

1. Push the repo to GitHub.
2. Create a project on **Cloudflare Pages**, **Netlify** or **Vercel**:
   build command `npm run build`, output directory `out`, and add `NEXT_PUBLIC_ENQUIRY_ENDPOINT`
   as an environment variable.
3. Add `psych-therapies.com` and `www.psych-therapies.com` as custom domains on the host.
4. In Wix (Domains), update the DNS records to the ones the host gives you, or transfer the domain
   out of Wix. Keep the Wix site live until DNS has switched over, then cancel the Wix premium plan
   (keep any email the practice runs through the domain).

## Before launch — UK compliance checklist

- [ ] **HCPC**: add each psychologist's registration number (`team.json → hcpcNumber`) and check it
      on the HCPC register. "Clinical psychologist" is a protected title.
- [ ] **Health claims (ASA CAP Code, section 12)**: psychologists approve every line in
      `issues.json` and the bios; no claim of cure or guaranteed results.
- [ ] **Testimonials**: confirm each client's written consent to publish (and their first name).
- [ ] **UK GDPR / ICO**: add the ICO registration number, business details, retention period and
      the privacy notice date in `site.json` and `legal.json`.
- [ ] **Fees, addresses, phone number**: fill in the placeholders in `site.json`.
- [ ] **Insurers**: confirm the list (the old site listed six insurers on one page and three on another).
- [ ] **Crisis signposting**: the 999 / NHS 111 / Samaritans 116 123 wording is on the Get started
      section and every legal page. Keep it.
- [ ] **Accessibility**: automated axe scan passes WCAG 2.2 AA (home and legal pages, desktop and
      mobile). Still do a keyboard-only pass and test with VoiceOver and NVDA.
- [ ] **Cookies**: the site sets none. If analytics are added later, add a consent banner first.

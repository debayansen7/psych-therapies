import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { legalPages, legalSlugs, site, type LegalSlug } from "@/content";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "./legal.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

function getPage(slug: string) {
  return (legalSlugs as string[]).includes(slug) ? legalPages[slug as LegalSlug] : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  return page ? { title: page.title } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← Back to {site.practice.name}
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.updated}>Last updated: {page.updated}</p>
        {page.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2>{section.heading}</h2>
            {section.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </section>
        ))}
        <aside className={styles.crisis}>
          <strong>{site.crisis.title}</strong> {site.crisis.text}
        </aside>
      </main>
      <footer className={styles.footer}>
        <nav aria-label="Legal">
          {site.footer.links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={l.href === `/${slug}/` ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
      </footer>
      <SiteFooter />
    </div>
  );
}

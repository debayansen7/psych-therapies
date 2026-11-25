"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { site, team } from "@/content";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Header } from "./Header";
import { SectionRail } from "./SectionRail";
import { Hero } from "../hero/Hero";
import { HowItWorks } from "../sections/HowItWorks";
import { TeamSection } from "../sections/TeamSection";
import { HelpSection } from "../sections/HelpSection";
import { StoriesSection } from "../sections/StoriesSection";
import { StartSection } from "../sections/StartSection";
import { ProfileModal } from "../sections/ProfileModal";
import { SiteFooter } from "../SiteFooter";
import styles from "./Experience.module.css";

const START_INDEX = site.sections.findIndex((s) => s.id === "start");

/**
 * The home page: all sections stacked vertically on one scrolling page.
 * The current section (for the header and number rail) is tracked with an
 * IntersectionObserver; navigation scrolls the section into view.
 */
export function HomeExperience() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [still, setStill] = useState(false);
  const [openProfile, setOpenProfile] = useState<string | null>(null);
  const [preferredId, setPreferredId] = useState<string>("");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const motionOff = still || reducedMotion;

  const goTo = useCallback(
    (i: number) => {
      const k = Math.max(0, Math.min(sectionRefs.current.length - 1, i));
      sectionRefs.current[k]?.scrollIntoView({ behavior: motionOff ? "auto" : "smooth", block: "start" });
    },
    [motionOff],
  );

  // Current section = the one crossing a line 40% down the viewport.
  useEffect(() => {
    const sections = sectionRefs.current.filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIndex(sections.indexOf(entry.target as HTMLElement));
          }
        }
      },
      { rootMargin: "-40% 0px -60% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const bookWith = useCallback(
    (psychologistName?: string) => {
      setOpenProfile(null);
      setPreferredId(psychologistName ?? "");
      goTo(START_INDEX);
    },
    [goTo],
  );

  const profile = team.find((t) => t.id === openProfile) ?? null;

  const panels: { id: string; label: string; node: ReactNode }[] = [
    { id: "home", label: site.sections[0].label, node: <Hero onBook={() => bookWith()} /> },
    { id: "how", label: site.sections[1].label, node: <HowItWorks /> },
    { id: "team", label: site.sections[2].label, node: <TeamSection onOpen={setOpenProfile} /> },
    { id: "help", label: site.sections[3].label, node: <HelpSection /> },
    { id: "stories", label: site.sections[4].label, node: <StoriesSection /> },
    { id: "start", label: site.sections[5].label, node: <StartSection preferred={preferredId} /> },
  ];

  return (
    <div className={`${styles.root} ${motionOff ? "is-still" : ""}`}>
      <a className="skip-link" href="#start">
        Skip to enquiry form
      </a>

      <div className={styles.backdrop} aria-hidden="true">
        <span className={`${styles.glow} ${styles.glowPeach}`} style={{ left: "-6%", top: "-4%" }} />
        <span className={`${styles.glow} ${styles.glowAqua}`} style={{ left: "62%", top: "38%" }} />
        <span className={`${styles.glow} ${styles.glowMint}`} style={{ left: "20%", top: "70%" }} />
      </div>

      <Header
        index={index}
        still={still}
        onToggleStill={() => setStill((s) => !s)}
        onNavigate={goTo}
        onBook={() => bookWith()}
      />

      <main className={styles.page}>
        {panels.map((panel, i) => (
          <section
            key={panel.id}
            id={panel.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            aria-label={panel.label}
            className={`${styles.panel} ${i === 0 ? styles.first : ""}`}
          >
            <div className={styles.inner}>{panel.node}</div>
          </section>
        ))}
      </main>

      <SectionRail index={index} onNavigate={goTo} />

      <SiteFooter />

      <ProfileModal
        psychologist={profile}
        onClose={() => setOpenProfile(null)}
        onBook={(p) => bookWith(p.name)}
        onNext={() => {
          const at = team.findIndex((t) => t.id === openProfile);
          setOpenProfile(team[(at + 1) % team.length].id);
        }}
      />
    </div>
  );
}

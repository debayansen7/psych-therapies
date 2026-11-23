"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
import styles from "./Experience.module.css";

const SECTION_COUNT = site.sections.length;
const START_INDEX = site.sections.findIndex((s) => s.id === "start");

/**
 * The horizontal, "revolving" home page.
 *
 * Scroll position is written to the `--p` CSS variable on the root (no React
 * re-render per frame); CSS derives the 3D revolve and parallax from it.
 * React state only changes when the current section index changes.
 */
export function HomeExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [still, setStill] = useState(false);
  const [openProfile, setOpenProfile] = useState<string | null>(null);
  const [preferredId, setPreferredId] = useState<string>("");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const motionOff = still || reducedMotion;

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const k = Math.max(0, Math.min(SECTION_COUNT - 1, i));
      track.scrollTo({ left: k * track.clientWidth, behavior: motionOff ? "auto" : "smooth" });
    },
    [motionOff],
  );

  // Scroll → CSS variable + current index.
  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const w = track.clientWidth || 1;
      const p = track.scrollLeft / w;
      root.style.setProperty("--p", p.toFixed(4));
      setIndex(Math.round(p));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Vertical wheel → one section sideways, unless the section itself can still scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let locked = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      const panel = (e.target as Element | null)?.closest?.("[data-panel]") as HTMLElement | null;
      if (panel && panel.scrollHeight > panel.clientHeight + 2) {
        if (e.deltaY > 0 && panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2) return;
        if (e.deltaY < 0 && panel.scrollTop > 2) return;
      }
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 4) return;
      locked = true;
      timer = setTimeout(() => (locked = false), 800);
      const current = Math.round(track.scrollLeft / (track.clientWidth || 1));
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      track.removeEventListener("wheel", onWheel);
      if (timer) clearTimeout(timer);
    };
  }, [goTo]);

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
    <div ref={rootRef} className={`${styles.root} ${motionOff ? "is-still" : ""}`} style={{ "--p": 0 } as CSSProperties}>
      <a className="skip-link" href="#start" onClick={(e) => { e.preventDefault(); goTo(START_INDEX); }}>
        Skip to enquiry form
      </a>

      <div className={styles.farLayer} aria-hidden="true">
        <span className={`${styles.glow} ${styles.glowPink}`} style={{ left: "4%", top: "8%" }} />
        <span className={`${styles.glow} ${styles.glowLilac}`} style={{ left: "70%", top: "50%" }} />
        <span className={`${styles.glow} ${styles.glowMint}`} style={{ left: "150%", top: "10%" }} />
        <span className={`${styles.glow} ${styles.glowPeach}`} style={{ left: "260%", top: "40%" }} />
        <span className={`${styles.glow} ${styles.glowPink}`} style={{ left: "380%", top: "5%" }} />
      </div>

      <Header
        index={index}
        still={still}
        onToggleStill={() => setStill((s) => !s)}
        onNavigate={goTo}
        onBook={() => bookWith()}
      />

      <main
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        aria-label="Six sections, side by side. Use the arrow keys, swipe, or the section numbers to move between them."
      >
        {panels.map((panel, i) => (
          <section
            key={panel.id}
            id={panel.id}
            data-panel=""
            aria-label={panel.label}
            aria-hidden={i !== index || undefined}
            inert={i !== index}
            className={styles.panel}
            style={{ "--i": i } as CSSProperties}
          >
            <div className={styles.revolve}>{panel.node}</div>
          </section>
        ))}
      </main>

      <SectionRail index={index} onNavigate={goTo} />

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

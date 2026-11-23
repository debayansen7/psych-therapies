"use client";

import { site } from "@/content";
import styles from "./SectionRail.module.css";

interface SectionRailProps {
  index: number;
  onNavigate: (index: number) => void;
}

export function SectionRail({ index, onNavigate }: SectionRailProps) {
  return (
    <nav className={styles.rail} aria-label="Section numbers">
      {site.sections.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className={styles.num}
          aria-label={`Section ${i + 1}: ${s.label}`}
          aria-current={i === index ? "step" : undefined}
          onClick={() => onNavigate(i)}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
}

"use client";

import { useId, useState, type CSSProperties } from "react";
import { Button, Drawer } from "anexui";
import { issues, site } from "@/content";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Brain } from "./Brain";
import styles from "./Hero.module.css";

interface HeroProps {
  onBook: () => void;
}

const COUNT = issues.length;
const orbit = issues.map((issue, i) => {
  const angle = ((-90 + i * (360 / COUNT)) * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    issue,
    delay: 2 + i * 0.16,
    chip: { left: `${50 + 43 * cos}%`, top: `${50 + 44 * sin}%` },
    line: { x1: 50 + 19 * cos, y1: 50 + 30 * sin, x2: 50 + 36 * cos, y2: 50 + 37 * sin },
  };
});

export function Hero({ onBook }: HeroProps) {
  const isMobile = useMediaQuery("(max-width: 760px)");
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [activeId, setActiveId] = useState<string | null>(null);
  const cardId = useId();
  const active = issues.find((i) => i.id === activeId) ?? null;
  const { hero } = site;

  return (
    <div className={styles.hero}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.title}>
          {hero.titleLight} <strong>{hero.titleBold}</strong>
        </h1>
      </div>

      <div className={styles.ring}>
        <svg className={styles.lines} aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
          {orbit.map(({ issue, line, delay }) => (
            <line
              key={issue.id}
              {...line}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              className={issue.id === activeId ? styles.lineActive : styles.line}
              style={{ "--delay": `${delay - 0.15}s` } as CSSProperties}
            />
          ))}
        </svg>

        <div className={`${styles.brainWrap} ${active && !isMobile ? styles.brainDim : ""}`}>
          <Brain />
        </div>

        <ul className={styles.chips} aria-label="Common difficulties">
          {orbit.map(({ issue, chip, delay }, i) => (
            <li
              key={issue.id}
              className={styles.chip}
              style={{ ...chip, "--delay": `${delay}s`, "--bob": `${5 + (i % 3)}s` } as CSSProperties}
            >
              <button
                type="button"
                className={styles.chipButton}
                aria-expanded={issue.id === activeId}
                aria-controls={isMobile ? undefined : cardId}
                onMouseEnter={canHover ? () => setActiveId(issue.id) : undefined}
                onMouseLeave={canHover ? () => setActiveId((cur) => (cur === issue.id ? null : cur)) : undefined}
                onFocus={!isMobile ? () => setActiveId(issue.id) : undefined}
                onClick={() => setActiveId(issue.id)}
              >
                {issue.label}
              </button>
            </li>
          ))}
        </ul>

        {!isMobile && (
          <div id={cardId} className={styles.cardSlot} role="status" aria-live="polite">
            {active && (
              <div className={styles.card}>
                <p className={styles.cardTitle}>{active.label}</p>
                <p className={styles.kicker}>What is it?</p>
                <p className={styles.cardText}>{active.what}</p>
                <p className={`${styles.kicker} ${styles.kickerGreen}`}>What can help</p>
                <p className={styles.cardText}>{active.help}</p>
                <Button size="sm" className={styles.cardButton} onClick={onBook}>
                  Talk to us about this
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className={styles.hint}>{hero.hint}</p>

      {isMobile && (
        <Drawer isOpen={!!active} onClose={() => setActiveId(null)} side="bottom" title={active?.label ?? ""}>
          {active && (
            <div className={styles.sheet}>
              <p className={styles.kicker}>What is it?</p>
              <p className={styles.cardText}>{active.what}</p>
              <p className={`${styles.kicker} ${styles.kickerGreen}`}>What can help</p>
              <p className={styles.cardText}>{active.help}</p>
              <Button
                className={styles.sheetButton}
                onClick={() => {
                  setActiveId(null);
                  onBook();
                }}
              >
                Talk to us about this
              </Button>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
}

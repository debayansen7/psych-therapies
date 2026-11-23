"use client";

import { Fragment } from "react";
import { Button } from "anexui";
import { site } from "@/content";
import styles from "./Header.module.css";

interface HeaderProps {
  index: number;
  still: boolean;
  onToggleStill: () => void;
  onNavigate: (index: number) => void;
  onBook: () => void;
}

/** Sections shown as text links in the header (Home and Get started are reached via the logo and button). */
const NAV = site.sections.map((s, i) => ({ ...s, index: i })).slice(1, 5);

export function Header({ index, still, onToggleStill, onNavigate, onBook }: HeaderProps) {
  const motionLabel = still ? "Play animations" : "Pause animations";
  return (
    <header className={styles.header}>
      <button type="button" className={styles.brand} onClick={() => onNavigate(0)}>
        <span className={styles.logo} aria-hidden="true" />
        <span className={styles.brandName}>{site.practice.name}</span>
        <span className="visually-hidden">, go to the start</span>
      </button>

      <nav className={styles.nav} aria-label="Main">
        {NAV.map((item, n) => (
          <Fragment key={item.id}>
            {n > 0 && <span className={styles.dot} aria-hidden="true" />}
            <button
              type="button"
              className={styles.link}
              aria-current={index === item.index ? "true" : undefined}
              onClick={() => onNavigate(item.index)}
            >
              {item.label}
            </button>
          </Fragment>
        ))}
      </nav>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.motion}
          aria-pressed={still}
          aria-label={motionLabel}
          title={motionLabel}
          onClick={onToggleStill}
        >
          {still ? (
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 1.5v11a.8.8 0 0 0 1.2.7l8.6-5.5a.8.8 0 0 0 0-1.4L4.2.8A.8.8 0 0 0 3 1.5z" />
            </svg>
          ) : (
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="3.5" height="12" rx="1" />
              <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
            </svg>
          )}
        </button>
        <Button variant="primary" size="md" className={styles.book} onClick={onBook}>
          <span className={styles.bookLong}>Book assessment</span>
          <span className={styles.bookShort} aria-hidden="true">
            Book
          </span>
        </Button>
      </div>
    </header>
  );
}

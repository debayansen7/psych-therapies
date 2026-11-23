import type { CSSProperties } from "react";
import { site, team } from "@/content";
import s from "./Sections.module.css";

interface TeamSectionProps {
  onOpen: (id: string) => void;
}

export function TeamSection({ onOpen }: TeamSectionProps) {
  const { teamSection } = site;
  return (
    <div className={s.wrap}>
      <div className={s.teamHead}>
        <div>
          <p className={s.eyebrow}>{teamSection.eyebrow}</p>
          <h2 className={s.title}>
            {teamSection.titleLight} <strong>{teamSection.titleBold}</strong>
          </h2>
        </div>
        <p className={s.lead} style={{ fontSize: 15 }}>
          {teamSection.hint}
        </p>
      </div>
      <ul className={s.teamGrid}>
        {team.map((p, i) => (
          <li key={p.id} className={s.parallax} style={{ "--shift": `${40 + i * 60}px` } as CSSProperties}>
            <button type="button" className={s.docCard} onClick={() => onOpen(p.id)} aria-haspopup="dialog">
              <div className={s.docPhoto}>
                {/* Static export: images are pre-optimised WebP files in /public/images. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image.src} alt="" width={p.image.width} height={p.image.height} loading="lazy" decoding="async" />
              </div>
              <div className={s.docBody}>
                <h3 className={s.docName}>{p.name}</h3>
                <p className={s.docFocus}>{p.focus}</p>
                <p className={s.docMore}>
                  Read full profile
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { CSSProperties } from "react";
import { site } from "@/content";
import s from "./Sections.module.css";

const TINTS = ["var(--pt-pink)", "var(--pt-lilac)", "var(--pt-mint)", "var(--pt-peach)"];

export function HelpSection() {
  const { help } = site;
  return (
    <div className={s.wrap}>
      <p className={s.eyebrow}>{help.eyebrow}</p>
      <h2 className={s.title}>
        {help.titleLight} <strong>{help.titleBold}</strong>
      </h2>
      <div className={s.helpGrid}>
        {help.groups.map((g) => (
          <div key={g.title} className={s.card}>
            <h3 className={s.helpTitle}>{g.title}</h3>
            <p className={s.helpItems}>{g.items}</p>
          </div>
        ))}
      </div>
      <h3 className="visually-hidden">Therapeutic approaches we use</h3>
      <ul className={s.approaches}>
        {help.approaches.map((a, i) => (
          <li
            key={a}
            className={`${s.approach} ${s.parallax}`}
            style={{ background: TINTS[i % TINTS.length], "--shift": `${30 + (i % 5) * 40}px` } as CSSProperties}
          >
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { site } from "@/content";
import s from "./Sections.module.css";

const TINTS = ["var(--pt-peach)", "var(--pt-aqua)", "var(--pt-mint)", "var(--pt-butter)", "var(--pt-blush)"];

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
            className={s.approach}
            style={{ background: TINTS[i % TINTS.length] }}
          >
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

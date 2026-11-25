import { site } from "@/content";
import s from "./Sections.module.css";

const STEP_COLOURS = [
  { background: "var(--pt-blush)", color: "#7A3B2E" },
  { background: "var(--pt-butter)", color: "#6B5200" },
  { background: "var(--pt-mint)", color: "#1D5E45" },
];

export function HowItWorks() {
  const { how } = site;
  return (
    <div className={`${s.wrap} ${s.howGrid}`}>
      <div className={s.howIntro}>
        <p className={s.eyebrow}>{how.eyebrow}</p>
        <h2 className={s.howTitle}>
          {how.titleLight} <strong>{how.titleBold}</strong>
        </h2>
        <p className={s.lead}>{how.intro}</p>
        <dl className={s.stats}>
          {how.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="visually-hidden">{stat.label}</dt>
              <dd style={{ margin: 0 }}>
                <span className={s.statValue}>{stat.value}</span>
                <span className={s.statLabel} style={{ display: "block" }} aria-hidden="true">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <ol className={s.steps}>
        {how.steps.map((step, i) => (
          <li
            key={step.title}
            className={`${s.card} ${s.step}`}
          >
            <span className={s.stepNum} style={STEP_COLOURS[i % STEP_COLOURS.length]} aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3 className={s.stepTitle}>{step.title}</h3>
              <p className={s.stepText}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

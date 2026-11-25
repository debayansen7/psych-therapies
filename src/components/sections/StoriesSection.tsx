import { site, team } from "@/content";
import s from "./Sections.module.css";

export function StoriesSection() {
  const { stories } = site;
  return (
    <div className={s.wrap}>
      <p className={s.eyebrow}>{stories.eyebrow}</p>
      <h2 className={s.title}>
        {stories.titleLight} <strong>{stories.titleBold}</strong>
      </h2>
      <div className={s.storyGrid}>
        {team.map((p) => (
          <figure key={p.id} className={`${s.card} ${s.story}`}>
            <svg aria-hidden="true" width="34" height="26" viewBox="0 0 34 26" fill="#E4BF8F">
              <path d="M0 26V15C0 6 5 1 13 0l1 4c-5 1-7 4-7 8h6v14H0zm20 0V15c0-9 5-14 13-15l1 4c-5 1-7 4-7 8h6v14H20z" />
            </svg>
            <blockquote className={s.storyQuote}>
              <p style={{ margin: 0 }}>{p.testimonial.quote}</p>
            </blockquote>
            <figcaption className={s.storyBy}>
              <span>
                <strong>{p.testimonial.client}</strong> · with {p.firstName}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className={s.disclaimer}>{stories.disclaimer}</p>
    </div>
  );
}

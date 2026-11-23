import Link from "next/link";
import { site } from "@/content";
import { EnquiryForm } from "./EnquiryForm";
import s from "./Sections.module.css";

export function StartSection({ preferred }: { preferred: string }) {
  const { start, practice, crisis, footer } = site;
  return (
    <div className={`${s.wrap} ${s.startGrid}`}>
      <div className={s.startInfo}>
        <p className={s.eyebrow}>{start.eyebrow}</p>
        <h2 className={s.title} style={{ margin: 0 }}>
          {start.titleLight} <strong>{start.titleBold}</strong>
        </h2>
        <dl className={s.facts}>
          {practice.fees.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt> · <dd>{f.price}</dd>
            </div>
          ))}
          <div>
            <dt>Where</dt> · <dd>{practice.places}</dd>
          </div>
          <div>
            <dt>Insurers</dt> · <dd>{practice.insurers.join(", ")}</dd>
          </div>
        </dl>
        <p className={s.facts} style={{ fontSize: 14 }}>
          {practice.registration}
        </p>
        <div className={s.crisis} role="note">
          <strong>{crisis.title}</strong>
          {crisis.text}
        </div>
        <nav aria-label="Legal" className={s.legal}>
          {footer.links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <EnquiryForm key={preferred} preferred={preferred} />
    </div>
  );
}

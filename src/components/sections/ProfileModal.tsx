"use client";

import { Button, Modal } from "anexui";
import type { Psychologist } from "@/content";
import p from "./Profile.module.css";

interface ProfileModalProps {
  psychologist: Psychologist | null;
  onClose: () => void;
  onBook: (psychologist: Psychologist) => void;
  onNext: () => void;
}

/**
 * Full psychologist profile. anexui's Modal uses the native <dialog> element,
 * so focus is moved in and trapped, Escape closes it, and focus returns to the
 * card that opened it.
 */
export function ProfileModal({ psychologist, onClose, onBook, onNext }: ProfileModalProps) {
  const doc = psychologist;
  return (
    <Modal isOpen={!!doc} onClose={onClose} size="full" title={doc?.name ?? ""} className={p.modal}>
      {doc && (
        <div className={p.grid}>
          <div className={p.photoCol}>
            <div className={p.photo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.image.src} alt={doc.image.alt} width={doc.image.width} height={doc.image.height} />
              <p className={p.role}>
                {doc.title}
                <span className={p.hcpc}>HCPC registered · {doc.hcpcNumber}</span>
              </p>
            </div>
          </div>

          <div className={p.body}>
            <p className={p.lead}>{doc.lead}</p>

            <ul className={p.tags} aria-label="At a glance">
              {doc.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <section>
              <h3 className={p.kicker}>About</h3>
              <p className={p.text}>{doc.about}</p>
            </section>

            <div className={p.columns}>
              <section>
                <h3 className={p.kicker}>Qualifications</h3>
                <ul className={p.list}>
                  {doc.qualifications.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className={p.kicker}>Specialises in</h3>
                <ul className={p.list}>
                  {doc.specialisms.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className={p.kicker}>Offers</h3>
                <ul className={p.list}>
                  {doc.offers.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className={p.kicker}>Works with</h3>
                <p className={p.text}>{doc.worksWith}</p>
              </section>
            </div>

            <figure className={p.quote}>
              <blockquote>
                <p>“{doc.testimonial.quote}”</p>
              </blockquote>
              <figcaption>— {doc.testimonial.client}, client</figcaption>
            </figure>

            <div className={p.actions}>
              <Button size="lg" className={p.pill} onClick={() => onBook(doc)}>
                Book with {doc.firstName}
              </Button>
              <Button size="lg" variant="outline" className={p.pill} onClick={onNext}>
                Next psychologist →
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

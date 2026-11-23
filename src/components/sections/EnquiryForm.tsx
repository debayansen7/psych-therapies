"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert, Button, Checkbox, FormField, Input, Select, Textarea } from "anexui";
import { site, team } from "@/content";
import { submitEnquiry } from "@/lib/submitEnquiry";
import s from "./Form.module.css";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "contact" | "consent", string>>;

export function EnquiryForm({ preferred }: { preferred: string }) {
  const copy = site.start.form;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [who, setWho] = useState(preferred);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent" || status === "error") statusRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const consent = data.get("consent") === "on";
    const next: Errors = {};
    if (!name) next.name = copy.required;
    if (!contact) next.contact = copy.required;
    if (!consent) next.consent = copy.consentRequired;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitEnquiry({
        name,
        contact,
        preferred: who,
        message: String(data.get("message") ?? "").trim(),
        consent,
        website: String(data.get("website") ?? ""),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} className={s.form}>
        <Alert variant="success" title="Enquiry sent">
          {copy.success}
        </Alert>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-describedby="form-note">
      <FormField label={copy.name} required error={!!errors.name} errorText={errors.name}>
        <Input name="name" autoComplete="name" />
      </FormField>
      <FormField label={copy.contact} required error={!!errors.contact} errorText={errors.contact}>
        <Input name="contact" autoComplete="email" />
      </FormField>
      <FormField label={copy.who}>
        <Select name="preferred" value={who} onChange={(e) => setWho(e.target.value)}>
          <option value="">{copy.whoDefault}</option>
          {team.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label={copy.message} helperText={copy.messageHelp}>
        <Textarea name="message" rows={3} resize="vertical" />
      </FormField>

      {/* Honeypot for bots; hidden from people and assistive technology. */}
      <div className={s.honeypot} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <Checkbox
          name="consent"
          label={copy.consent}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        {errors.consent && (
          <p id="consent-error" role="alert" className={s.error}>
            {errors.consent}
          </p>
        )}
        <p className={s.small}>
          <Link href="/privacy-notice/">Read our privacy notice</Link>
        </p>
      </div>

      {status === "error" && (
        <div ref={statusRef} tabIndex={-1}>
          <Alert variant="error" title="Not sent">
            {copy.error} <a href={`mailto:${site.practice.email}`}>{site.practice.email}</a>
          </Alert>
        </div>
      )}

      <Button type="submit" size="lg" loading={status === "sending"} className={s.submit}>
        {status === "sending" ? copy.sending : copy.submit}
      </Button>
      <p id="form-note" className={s.small}>
        Confidential · <a href={`mailto:${site.practice.email}`}>{site.practice.email}</a>
      </p>
    </form>
  );
}

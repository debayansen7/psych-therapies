export interface Enquiry {
  name: string;
  contact: string;
  preferred: string;
  message: string;
  consent: boolean;
  /** Honeypot: must stay empty. */
  website: string;
}

/**
 * Sends an enquiry to the Google Apps Script web app (see /apps-script/Code.gs).
 * Apps Script web apps don't send CORS headers, so the request is "no-cors"
 * and the response is opaque: a resolved fetch means it was delivered.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT;
  if (!endpoint) {
    throw new Error("Enquiry endpoint is not configured (NEXT_PUBLIC_ENQUIRY_ENDPOINT).");
  }
  const body = new URLSearchParams({
    name: enquiry.name,
    contact: enquiry.contact,
    preferred: enquiry.preferred,
    message: enquiry.message,
    consent: enquiry.consent ? "yes" : "no",
    website: enquiry.website,
    sentAt: new Date().toISOString(),
  });
  await fetch(endpoint, { method: "POST", mode: "no-cors", body });
}

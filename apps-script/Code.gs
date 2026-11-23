/**
 * Psych-Therapies enquiry handler — Google Apps Script web app.
 *
 * Setup (once, signed in as the practice's admin Google account):
 *   1. Go to https://script.google.com → New project → paste this file.
 *   2. Project Settings → Script properties → add:
 *        PRACTICE_EMAIL   the inbox that should receive enquiries
 *   3. Deploy → New deployment → type "Web app"
 *        Execute as: Me
 *        Who has access: Anyone
 *   4. Copy the web app URL into the site's .env.local as NEXT_PUBLIC_ENQUIRY_ENDPOINT
 *      and rebuild.
 *
 * Nothing is stored: each enquiry is emailed to the practice and discarded.
 */

var MAX_LENGTH = { name: 120, contact: 160, preferred: 80, message: 2000 };

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Honeypot: real people never fill this in.
  if (p.website) return json_({ ok: true });

  var name = clean_(p.name, MAX_LENGTH.name);
  var contact = clean_(p.contact, MAX_LENGTH.contact);
  var preferred = clean_(p.preferred, MAX_LENGTH.preferred) || "No preference — please match me";
  var message = clean_(p.message, MAX_LENGTH.message);

  if (!name || !contact || p.consent !== "yes") {
    return json_({ ok: false, error: "missing-fields" });
  }

  // Simple rate limit: at most 5 enquiries per contact detail per hour.
  var cache = CacheService.getScriptCache();
  var key = "rl_" + Utilities.base64EncodeWebSafe(contact.toLowerCase());
  var count = Number(cache.get(key) || 0);
  if (count >= 5) return json_({ ok: false, error: "rate-limited" });
  cache.put(key, String(count + 1), 3600);

  var to = PropertiesService.getScriptProperties().getProperty("PRACTICE_EMAIL");
  if (!to) return json_({ ok: false, error: "not-configured" });

  var body =
    "New enquiry from the Psych-Therapies website\n\n" +
    "Name: " + name + "\n" +
    "Contact: " + contact + "\n" +
    "Would like to see: " + preferred + "\n" +
    "Consent to be contacted: yes\n" +
    "Sent: " + (p.sentAt || new Date().toISOString()) + "\n\n" +
    "Message:\n" + (message || "(none)") + "\n";

  var options = { name: "Psych-Therapies website" };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) options.replyTo = contact;

  MailApp.sendEmail(to, "New enquiry: " + name, body, options);
  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, service: "psych-therapies-enquiries" });
}

function clean_(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

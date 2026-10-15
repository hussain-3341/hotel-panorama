import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { BanquetEnquiry, ContactMessage, RoomEnquiry } from "./enquiry-schema";
import { hotel } from "@/content/site";

export type EnquiryKind = "room" | "banquet" | "contact";
type Payload = RoomEnquiry | BanquetEnquiry | ContactMessage;

export class NotConfiguredError extends Error {}

const LABEL: Record<EnquiryKind, string> = {
  room: "Room enquiry",
  banquet: "Banquet / event enquiry",
  contact: "Website message",
};

/* ─────────────────────────── Formatting ─────────────────────────── */

function rows(kind: EnquiryKind, d: Payload): [string, string][] {
  const base: [string, string][] = [
    ["Name", d.name],
    ["Phone", d.phone || "—"],
    ["Email", d.email],
  ];
  if (kind === "room") {
    const r = d as RoomEnquiry;
    return [...base, ["Check-in", r.checkIn], ["Check-out", r.checkOut], ["Guests", String(r.guests)], ["Room preference", r.roomPreference], ["Requirements", r.requirements || "—"]];
  }
  if (kind === "banquet") {
    const b = d as BanquetEnquiry;
    return [
      ...base,
      ["Organisation", b.organisation || "—"],
      ["Event type", b.eventType],
      ["Event date", b.eventDate],
      ["Expected guests", String(b.guests)],
      ["Preferred hall", b.venue],
      ["Arrangements", b.arrangements.length ? b.arrangements.join(", ") : "—"],
      ["Requirements", b.requirements || "—"],
    ];
  }
  const c = d as ContactMessage;
  return [...base, ["Subject", c.subject], ["Message", c.message]];
}

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

function emailHtml(kind: EnquiryKind, d: Payload) {
  const body = rows(kind, d)
    .map(([k, v]) => `<tr><td style="padding:8px 16px 8px 0;color:#6b665f;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;color:#292725;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  return `<div style="font-family:Arial,sans-serif;max-width:620px"><h2 style="font-family:Georgia,serif;color:#303D32">${LABEL[kind]}</h2><table style="border-collapse:collapse;font-size:14px">${body}</table><p style="color:#6b665f;font-size:12px;margin-top:24px">Sent from the Hotel Panorama website. Reply directly to respond to the guest.</p></div>`;
}

/* ─────────────────────────── Persistence ────────────────────────── */

async function saveToDatabase(kind: EnquiryKind, d: Payload, notified: boolean) {
  const { prisma } = await import("./prisma");
  await prisma.enquiry.create({
    data: {
      kind: kind.toUpperCase() as "ROOM" | "BANQUET" | "CONTACT",
      name: d.name,
      phone: d.phone || null,
      email: d.email,
      details: JSON.parse(JSON.stringify(d)),
      notified,
    },
  });
}

async function saveToLocalFile(kind: EnquiryKind, d: Payload) {
  const dir = path.join(process.cwd(), ".data");
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(path.join(dir, "enquiries.jsonl"), JSON.stringify({ kind, at: new Date().toISOString(), ...d }) + "\n");
}

/* ───────────────────────────── Email ────────────────────────────── */

async function sendEmails(kind: EnquiryKind, d: Payload) {
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  const from = process.env.SMTP_FROM ?? `Hotel Panorama Website <${process.env.SMTP_USER}>`;
  const to = process.env.ENQUIRY_TO_EMAIL ?? hotel.email;
  const subjectBits = kind === "room" ? `${(d as RoomEnquiry).checkIn} → ${(d as RoomEnquiry).checkOut}` : kind === "banquet" ? `${(d as BanquetEnquiry).eventType}, ${(d as BanquetEnquiry).eventDate}` : (d as ContactMessage).subject;

  await transport.sendMail({
    from,
    to,
    replyTo: d.email,
    subject: `${LABEL[kind]} — ${d.name} (${subjectBits})`,
    text: rows(kind, d).map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: emailHtml(kind, d),
  });

  if (process.env.ENQUIRY_SEND_ACKNOWLEDGEMENT === "true") {
    await transport.sendMail({
      from,
      to: d.email,
      replyTo: to,
      subject: "We’ve received your enquiry — Hotel Panorama",
      text: `Dear ${d.name},\n\nThank you for contacting Hotel Panorama. We have received your ${LABEL[kind].toLowerCase()} and our team will get back to you shortly.\n\nPlease note this is an acknowledgement only — it is not a booking or reservation confirmation.\n\nHotel Panorama\n${hotel.address.full}\n${hotel.phones.map((p) => p.label).join(" / ")}`,
    });
  }
}

/* ──────────────────────────── Public API ────────────────────────── */

export async function handleEnquiry(kind: EnquiryKind, data: Payload) {
  const hasDb = Boolean(process.env.DATABASE_URL);
  const hasMail = Boolean(process.env.SMTP_HOST);

  if (!hasDb && !hasMail) {
    if (process.env.NODE_ENV === "production") {
      throw new NotConfiguredError("Neither DATABASE_URL nor SMTP_HOST is configured");
    }
    // Local development: keep enquiries in .data/enquiries.jsonl.
    await saveToLocalFile(kind, data);
    console.info(`[enquiry] ${kind} from ${data.name} saved to .data/enquiries.jsonl (no DB/SMTP configured)`);
    return;
  }

  let notified = false;
  let mailError: unknown;
  if (hasMail) {
    try {
      await sendEmails(kind, data);
      notified = true;
    } catch (e) {
      mailError = e;
      console.error("[enquiry] email failed", e);
    }
  }
  if (hasDb) await saveToDatabase(kind, data, notified);
  // Without a database, a failed email means the enquiry would be lost.
  if (!hasDb && mailError) throw mailError;
}

import { z } from "zod";
import { eventTypes, roomPreferences } from "@/content/site";

/** Shared by the browser forms and the API routes. */

const name = z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long");
const phone = z
  .string()
  .trim()
  .min(1, "Please enter a phone number")
  .regex(/^\+?[\d\s()-]{8,20}$/, "Please enter a valid phone number")
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number");
const email = z.string().trim().min(1, "Please enter your email").email("Please enter a valid email address").max(160);
const optionalText = z.string().trim().max(1500, "Please keep this under 1,500 characters").optional().or(z.literal(""));
/** Honeypot: real visitors never see or fill this field. */
const website = z.string().max(500).optional();

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date");

function todayISO() {
  // Compare in India Standard Time — the hotel's local date.
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

export const roomEnquirySchema = z
  .object({
    name,
    phone,
    email,
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.coerce.number({ message: "Please enter number of guests" }).int().min(1, "At least 1 guest").max(50, "For more than 50 guests please call us"),
    roomPreference: z.enum(roomPreferences as unknown as [string, ...string[]], { message: "Please choose a room" }),
    requirements: optionalText,
    consent: z.literal(true, { message: "Please agree so we can contact you about your enquiry" }),
    website,
  })
  .refine((d) => d.checkIn >= todayISO(), { path: ["checkIn"], message: "Check-in can’t be in the past" })
  .refine((d) => d.checkOut > d.checkIn, { path: ["checkOut"], message: "Check-out must be after check-in" });

export const banquetEnquirySchema = z
  .object({
    name,
    phone,
    email,
    organisation: z.string().trim().max(120).optional().or(z.literal("")),
    eventType: z.enum(eventTypes as unknown as [string, ...string[]], { message: "Please choose an event type" }),
    eventDate: isoDate,
    guests: z.coerce.number({ message: "Please enter expected guests" }).int().min(1, "At least 1 guest").max(5000, "Please check the number"),
    venue: z.enum(["No preference", "Rivazz Hall", "Horizon Hall"]).default("No preference"),
    arrangements: z.array(z.string().max(60)).max(10).default([]),
    requirements: optionalText,
    consent: z.literal(true, { message: "Please agree so we can contact you about your enquiry" }),
    website,
  })
  .refine((d) => d.eventDate >= todayISO(), { path: ["eventDate"], message: "Event date can’t be in the past" });

export const contactSchema = z.object({
  name,
  phone: phone.optional().or(z.literal("")),
  email,
  subject: z.enum(["General enquiry", "Rooms", "Banquets & events", "Dining", "Feedback"]),
  message: z.string().trim().min(10, "Please write a little more (10+ characters)").max(2000),
  consent: z.literal(true, { message: "Please agree so we can reply to you" }),
  website,
});

export const arrangementOptions = [
  "Theatre-style seating",
  "Round-table banquet",
  "Meeting / classroom tables",
  "Buffet service",
  "Lectern",
  "Stage / décor (please describe)",
] as const;

export type RoomEnquiry = z.infer<typeof roomEnquirySchema>;
export type BanquetEnquiry = z.infer<typeof banquetEnquirySchema>;
export type ContactMessage = z.infer<typeof contactSchema>;

import { NextResponse, type NextRequest } from "next/server";
import { banquetEnquirySchema, contactSchema, roomEnquirySchema } from "@/lib/enquiry-schema";
import { handleEnquiry, NotConfiguredError, type EnquiryKind } from "@/lib/enquiry-service";
import { rateLimit } from "@/lib/rate-limit";
import { hotel } from "@/content/site";

export const runtime = "nodejs";

const SCHEMAS = { room: roomEnquirySchema, banquet: banquetEnquirySchema, contact: contactSchema } as const;

const fallback = `Please call us on ${hotel.phones[0].label} or email ${hotel.email}.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(`enquiry:${ip}`, 6, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, message: `Too many submissions. Please wait a few minutes or ${fallback.charAt(0).toLowerCase() + fallback.slice(1)}` }, { status: 429 });
  }

  let body: { kind?: string; data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const kind = body.kind as EnquiryKind;
  const schema = SCHEMAS[kind as keyof typeof SCHEMAS];
  if (!schema) return NextResponse.json({ ok: false, message: "Unknown enquiry type." }, { status: 400 });

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, message: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  // Honeypot filled → pretend success, store nothing.
  if ((parsed.data as { website?: string }).website) return NextResponse.json({ ok: true });

  try {
    await handleEnquiry(kind, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[enquiry] failed", e);
    const status = e instanceof NotConfiguredError ? 503 : 500;
    return NextResponse.json({ ok: false, message: `We couldn’t send your enquiry just now. ${fallback}` }, { status });
  }
}

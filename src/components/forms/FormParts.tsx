"use client";

import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { hotel } from "@/content/site";

export function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? <span aria-hidden className="text-gold-deep"> *</span> : <span className="ml-1 normal-case tracking-normal text-charcoal/50">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-charcoal/60">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props for an input tied to Field. */
export function a11y(id: string, error?: string, hint?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

export function Honeypot({ register }: { register: () => object }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" tabIndex={-1} autoComplete="off" {...register()} />
      </label>
    </div>
  );
}

export function Consent({ id, error, register }: { id: string; error?: string; register: () => object }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-charcoal/75">
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 accent-forest"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...register()}
        />
        <span>
          I agree that Hotel Panorama may use these details to respond to my enquiry, as described in the{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-forest">privacy policy</Link>.
        </span>
      </label>
      {error && <p id={`${id}-error`} role="alert" className="field-error">{error}</p>}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-80 sm:w-auto">
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {pending ? "Sending…" : children}
    </button>
  );
}

export function FormStatus({ status, message }: { status: "idle" | "success" | "error"; message?: string }) {
  if (status === "idle") return null;
  const ok = status === "success";
  return (
    <div
      role={ok ? "status" : "alert"}
      className={clsx(
        "flex gap-3 rounded-md border p-5 text-sm leading-relaxed",
        ok ? "border-forest/30 bg-forest/5 text-forest" : "border-[#a5382b]/30 bg-[#a5382b]/5 text-[#7d2a20]"
      )}
    >
      {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />}
      <div>{message}</div>
    </div>
  );
}

export function SuccessPanel({ title, onReset }: { title: string; onReset: () => void }) {
  return (
    <div role="status" className="rounded-md border border-forest/20 bg-white p-8 text-center sm:p-12">
      <CheckCircle2 className="mx-auto h-12 w-12 text-forest" strokeWidth={1.3} aria-hidden />
      <h3 className="mt-5 font-display text-3xl">{title}</h3>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-charcoal/75">
        Thank you — your enquiry has reached our team, and we’ll be in touch shortly to discuss availability.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-charcoal/60">
        Please note: this is not a booking confirmation. Your reservation is only confirmed once our team confirms it
        with you directly.
      </p>
      <p className="mt-6 text-sm text-charcoal/70">
        Need an answer sooner? Call <a href={hotel.phones[0].href} className="font-semibold text-forest underline underline-offset-2">{hotel.phones[0].label}</a>.
      </p>
      <button type="button" onClick={onReset} className="btn btn-ghost-dark mt-8">Send another enquiry</button>
    </div>
  );
}

export type ApiResult = { ok: boolean; message?: string; fieldErrors?: Record<string, string> };

export async function postEnquiry(kind: "room" | "banquet" | "contact", data: unknown): Promise<ApiResult> {
  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, data }),
    });
    const json = (await res.json().catch(() => ({}))) as ApiResult;
    return { ok: res.ok && json.ok, message: json.message, fieldErrors: json.fieldErrors };
  } catch {
    return { ok: false, message: `We couldn’t reach the server. Please check your connection, or call ${hotel.phones[0].label}.` };
  }
}

export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

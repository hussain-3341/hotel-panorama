"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { z } from "zod";
import { banquetEnquirySchema, arrangementOptions } from "@/lib/enquiry-schema";
import { eventTypes, venues } from "@/content/site";
import { Field, a11y, Honeypot, Consent, SubmitButton, FormStatus, SuccessPanel, postEnquiry, todayISO } from "./FormParts";

type Input = z.input<typeof banquetEnquirySchema>;
type Output = z.output<typeof banquetEnquirySchema>;

/** `variant` pre-selects a celebration or a corporate event. */
export function BanquetEnquiryForm({ variant: initial = "celebration", defaultVenue }: { variant?: "celebration" | "corporate"; defaultVenue?: string }) {
  const presetVenue = (venues.find((v) => v.slug === defaultVenue)?.name ?? "No preference") as Input["venue"];
  const [variant, setVariant] = useState(initial);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Input, unknown, Output>({
    resolver: zodResolver(banquetEnquirySchema),
    mode: "onTouched",
    defaultValues: {
      eventType: initial === "corporate" ? "Corporate meeting / conference" : "Wedding",
      venue: presetVenue,
      arrangements: [],
      requirements: "",
      organisation: "",
      website: "",
    },
  });

  const switchTo = (v: "celebration" | "corporate") => {
    setVariant(v);
    setValue("eventType", v === "corporate" ? "Corporate meeting / conference" : "Wedding");
  };

  const onSubmit = async (data: Output) => {
    setStatus("idle");
    const res = await postEnquiry("banquet", data);
    if (res.ok) return setStatus("success");
    if (res.fieldErrors) for (const [k, v] of Object.entries(res.fieldErrors)) setError(k as keyof Input, { message: v });
    setMessage(res.message ?? "Something went wrong. Please try again.");
    setStatus("error");
  };

  if (status === "success") {
    return <SuccessPanel title="Event enquiry received" onReset={() => { reset(); setStatus("idle"); }} />;
  }

  const e = errors;
  return (
    <div>
      <div role="radiogroup" aria-label="Type of event" className="mb-8 grid w-full grid-cols-2 rounded-full border border-charcoal/15 bg-white p-1 sm:inline-grid sm:w-auto">
        {(["celebration", "corporate"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={variant === v}
            onClick={() => switchTo(v)}
            className={clsx(
              "whitespace-nowrap rounded-full px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors sm:px-5 sm:text-xs",
              variant === v ? "bg-forest text-ivory" : "text-charcoal/70 hover:text-forest"
            )}
          >
            {v === "celebration" ? "Celebration" : "Corporate event"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-6 sm:grid-cols-2" aria-label="Banquet enquiry">
        <Field id="b-name" label="Full name" required error={e.name?.message}>
          <input className="field" autoComplete="name" {...a11y("b-name", e.name?.message)} {...register("name")} />
        </Field>
        {variant === "corporate" ? (
          <Field id="b-org" label="Company / organisation" error={e.organisation?.message}>
            <input className="field" autoComplete="organization" {...a11y("b-org", e.organisation?.message)} {...register("organisation")} />
          </Field>
        ) : (
          <div className="hidden sm:block" />
        )}
        <Field id="b-phone" label="Phone number" required error={e.phone?.message}>
          <input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" {...a11y("b-phone", e.phone?.message)} {...register("phone")} />
        </Field>
        <Field id="b-email" label="Email" required error={e.email?.message}>
          <input className="field" type="email" autoComplete="email" {...a11y("b-email", e.email?.message)} {...register("email")} />
        </Field>
        <Field id="b-type" label="Event type" required error={e.eventType?.message}>
          <select className="field" {...a11y("b-type", e.eventType?.message)} {...register("eventType")}>
            {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field id="b-date" label="Event date" required error={e.eventDate?.message}>
          <input className="field" type="date" min={todayISO()} {...a11y("b-date", e.eventDate?.message)} {...register("eventDate")} />
        </Field>
        <Field id="b-guests" label="Expected guests" required error={e.guests?.message}>
          <input className="field" type="number" inputMode="numeric" min={1} {...a11y("b-guests", e.guests?.message)} {...register("guests")} />
        </Field>
        <Field id="b-venue" label="Preferred hall" required error={e.venue?.message}>
          <select className="field" {...a11y("b-venue", e.venue?.message)} {...register("venue")}>
            <option value="No preference">No preference</option>
            {venues.map((v) => <option key={v.slug} value={v.name}>{v.name}</option>)}
          </select>
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="field-label">Preferred arrangements <span className="ml-1 normal-case tracking-normal text-charcoal/50">(optional)</span></legend>
          <div className="mt-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {arrangementOptions.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-md border border-charcoal/15 bg-white px-4 py-3 text-sm has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                <input type="checkbox" value={opt} className="h-4 w-4 accent-forest" {...register("arrangements")} />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>

        <Field id="b-req" label="Additional requirements" error={e.requirements?.message} className="sm:col-span-2" hint="Timings, catering preferences, décor, rooms for guests…">
          <textarea className="field min-h-32" rows={4} {...a11y("b-req", e.requirements?.message, "hint")} {...register("requirements")} />
        </Field>
        <Honeypot register={() => register("website")} />
        <div className="sm:col-span-2">
          <Consent id="b-consent" error={e.consent?.message} register={() => register("consent")} />
        </div>
        <div className="flex flex-col gap-4 sm:col-span-2">
          <FormStatus status={status} message={message} />
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <SubmitButton pending={isSubmitting}>Enquire About Banquets</SubmitButton>
            <p className="text-xs text-charcoal/60">Our events team will contact you — this is not a reservation.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

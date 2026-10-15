"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { roomEnquirySchema } from "@/lib/enquiry-schema";
import { roomPreferences, rooms } from "@/content/site";
import { Field, a11y, Honeypot, Consent, SubmitButton, FormStatus, SuccessPanel, postEnquiry, todayISO } from "./FormParts";

type Input = z.input<typeof roomEnquirySchema>;
type Output = z.output<typeof roomEnquirySchema>;

export function BookingEnquiryForm({ defaultRoom }: { defaultRoom?: string }) {
  const preset = rooms.find((r) => r.slug === defaultRoom)?.name ?? "No preference";
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Input, unknown, Output>({
    resolver: zodResolver(roomEnquirySchema),
    mode: "onTouched",
    defaultValues: { roomPreference: preset, guests: 2, requirements: "", website: "" },
  });

  const checkIn = watch("checkIn");

  const onSubmit = async (data: Output) => {
    setStatus("idle");
    const res = await postEnquiry("room", data);
    if (res.ok) {
      setStatus("success");
      return;
    }
    if (res.fieldErrors) {
      for (const [k, v] of Object.entries(res.fieldErrors)) setError(k as keyof Input, { message: v });
    }
    setMessage(res.message ?? "Something went wrong. Please try again.");
    setStatus("error");
  };

  if (status === "success") {
    return <SuccessPanel title="Room enquiry received" onReset={() => { reset(); setStatus("idle"); }} />;
  }

  const e = errors;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-6 sm:grid-cols-2" aria-label="Room enquiry">
      <Field id="r-name" label="Full name" required error={e.name?.message} className="sm:col-span-2">
        <input className="field" autoComplete="name" {...a11y("r-name", e.name?.message)} {...register("name")} />
      </Field>
      <Field id="r-phone" label="Phone number" required error={e.phone?.message}>
        <input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" {...a11y("r-phone", e.phone?.message)} {...register("phone")} />
      </Field>
      <Field id="r-email" label="Email" required error={e.email?.message}>
        <input className="field" type="email" autoComplete="email" {...a11y("r-email", e.email?.message)} {...register("email")} />
      </Field>
      <Field id="r-checkin" label="Check-in date" required error={e.checkIn?.message}>
        <input className="field" type="date" min={todayISO()} {...a11y("r-checkin", e.checkIn?.message)} {...register("checkIn")} />
      </Field>
      <Field id="r-checkout" label="Check-out date" required error={e.checkOut?.message}>
        <input className="field" type="date" min={checkIn || todayISO()} {...a11y("r-checkout", e.checkOut?.message)} {...register("checkOut")} />
      </Field>
      <Field id="r-guests" label="Number of guests" required error={e.guests?.message}>
        <input className="field" type="number" inputMode="numeric" min={1} max={50} {...a11y("r-guests", e.guests?.message)} {...register("guests")} />
      </Field>
      <Field id="r-room" label="Room preference" required error={e.roomPreference?.message}>
        <select className="field" {...a11y("r-room", e.roomPreference?.message)} {...register("roomPreference")}>
          {roomPreferences.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </Field>
      <Field id="r-req" label="Additional requirements" error={e.requirements?.message} className="sm:col-span-2" hint="Number of rooms, arrival time, extra bed, special occasions…">
        <textarea className="field min-h-32" rows={4} {...a11y("r-req", e.requirements?.message, "hint")} {...register("requirements")} />
      </Field>
      <Honeypot register={() => register("website")} />
      <div className="sm:col-span-2">
        <Consent id="r-consent" error={e.consent?.message} register={() => register("consent")} />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormStatus status={status} message={message} />
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <SubmitButton pending={isSubmitting}>Request Availability</SubmitButton>
          <p className="text-xs text-charcoal/60">This sends an enquiry — it does not confirm a booking.</p>
        </div>
      </div>
    </form>
  );
}

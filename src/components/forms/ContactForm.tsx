"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { contactSchema } from "@/lib/enquiry-schema";
import { Field, a11y, Honeypot, Consent, SubmitButton, FormStatus, postEnquiry } from "./FormParts";

type Input = z.input<typeof contactSchema>;
type Output = z.output<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors: e, isSubmitting },
  } = useForm<Input, unknown, Output>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { subject: "General enquiry", phone: "", website: "" },
  });

  const onSubmit = async (data: Output) => {
    setStatus("idle");
    const res = await postEnquiry("contact", data);
    if (res.ok) {
      reset();
      setMessage("Thank you — your message has been sent. We’ll reply as soon as we can.");
      return setStatus("success");
    }
    if (res.fieldErrors) for (const [k, v] of Object.entries(res.fieldErrors)) setError(k as keyof Input, { message: v });
    setMessage(res.message ?? "Something went wrong. Please try again.");
    setStatus("error");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-6 sm:grid-cols-2" aria-label="Contact Hotel Panorama">
      <Field id="c-name" label="Full name" required error={e.name?.message}>
        <input className="field" autoComplete="name" {...a11y("c-name", e.name?.message)} {...register("name")} />
      </Field>
      <Field id="c-email" label="Email" required error={e.email?.message}>
        <input className="field" type="email" autoComplete="email" {...a11y("c-email", e.email?.message)} {...register("email")} />
      </Field>
      <Field id="c-phone" label="Phone number" error={e.phone?.message}>
        <input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" {...a11y("c-phone", e.phone?.message)} {...register("phone")} />
      </Field>
      <Field id="c-subject" label="Subject" required error={e.subject?.message}>
        <select className="field" {...a11y("c-subject", e.subject?.message)} {...register("subject")}>
          {["General enquiry", "Rooms", "Banquets & events", "Dining", "Feedback"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field id="c-message" label="Message" required error={e.message?.message} className="sm:col-span-2">
        <textarea className="field min-h-36" rows={5} {...a11y("c-message", e.message?.message)} {...register("message")} />
      </Field>
      <Honeypot register={() => register("website")} />
      <div className="sm:col-span-2">
        <Consent id="c-consent" error={e.consent?.message} register={() => register("consent")} />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormStatus status={status} message={message} />
        <div><SubmitButton pending={isSubmitting}>Send message</SubmitButton></div>
      </div>
    </form>
  );
}

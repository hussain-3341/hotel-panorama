"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import clsx from "clsx";
import { BedDouble, Sparkles } from "lucide-react";
import { BookingEnquiryForm } from "@/components/forms/BookingEnquiryForm";
import { BanquetEnquiryForm } from "@/components/forms/BanquetEnquiryForm";

type Tab = "room" | "banquet";

export function EnquiryTabs({ initial, room, venue }: { initial: Tab; room?: string; venue?: string }) {
  const [tab, setTab] = useState<Tab>(initial);
  const refs = { room: useRef<HTMLButtonElement>(null), banquet: useRef<HTMLButtonElement>(null) };

  const select = (t: Tab) => {
    setTab(t);
    const url = new URL(window.location.href);
    url.searchParams.set("type", t);
    window.history.replaceState(null, "", url);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next: Tab = tab === "room" ? "banquet" : "room";
    select(next);
    refs[next].current?.focus();
  };

  const tabs: { key: Tab; label: string; icon: typeof BedDouble }[] = [
    { key: "room", label: "Room enquiry", icon: BedDouble },
    { key: "banquet", label: "Banquet enquiry", icon: Sparkles },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Enquiry type" className="mb-10 grid grid-cols-2 gap-2 rounded-full bg-white p-1.5" onKeyDown={onKey}>
        {tabs.map((t) => (
          <button
            key={t.key}
            ref={refs[t.key]}
            id={`tab-${t.key}`}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            tabIndex={tab === t.key ? 0 : -1}
            onClick={() => select(t.key)}
            className={clsx(
              "flex items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
              tab === t.key ? "bg-forest text-ivory" : "text-charcoal/70 hover:text-forest"
            )}
          >
            <t.icon className="h-4 w-4" aria-hidden /> {t.label}
          </button>
        ))}
      </div>
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "room" ? <BookingEnquiryForm defaultRoom={room} /> : <BanquetEnquiryForm defaultVenue={venue} />}
      </div>
    </div>
  );
}

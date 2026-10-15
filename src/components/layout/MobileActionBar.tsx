import Link from "next/link";
import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { hotel } from "@/content/site";

/** Thumb-reachable call / WhatsApp / enquire bar on small screens. */
export function MobileActionBar() {
  return (
    <>
      <div className="h-16 md:hidden" aria-hidden />
      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-gold/30 bg-forest/95 pb-[env(safe-area-inset-bottom)] text-ivory backdrop-blur md:hidden"
      >
        <a href={hotel.phones[0].href} className="flex h-16 flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]">
          <Phone className="h-5 w-5 text-gold" aria-hidden /> Call
        </a>
        <a href={hotel.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex h-16 flex-col items-center justify-center gap-1 border-x border-ivory/10 text-[0.68rem] font-semibold uppercase tracking-[0.14em]">
          <MessageCircle className="h-5 w-5 text-gold" aria-hidden /> WhatsApp
        </a>
        <Link href="/enquire" className="flex h-16 flex-col items-center justify-center gap-1 bg-gold text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-charcoal">
          <CalendarCheck className="h-5 w-5" aria-hidden /> Enquire
        </Link>
      </nav>
    </>
  );
}

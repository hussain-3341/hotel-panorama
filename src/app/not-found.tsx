import Link from "next/link";
import { Photo } from "@/components/ui/Photo";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[90svh] items-center overflow-hidden bg-charcoal text-ivory">
      <Photo id="lobby-corridor" className="absolute inset-0 -z-10 opacity-40" sizes="100vw" />
      <div className="container-luxe py-40">
        <p className="eyebrow text-gold">Page not found</p>
        <h1 className="display-lg mt-5 max-w-2xl">This door doesn’t seem to lead anywhere.</h1>
        <p className="lede mt-6 max-w-xl text-ivory/80">The page you’re looking for may have moved. Let us show you back to the lobby.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-gold">Return home</Link>
          <Link href="/contact" className="btn btn-ghost-light">Contact us</Link>
        </div>
      </div>
    </section>
  );
}

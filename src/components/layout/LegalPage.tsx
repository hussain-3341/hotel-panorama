import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <section className="bg-forest pb-16 pt-36 text-ivory lg:pt-44">
        <div className="container-luxe">
          <p className="eyebrow text-gold">Legal</p>
          <h1 className="display-lg mt-5">{title}</h1>
          <p className="mt-4 text-sm text-ivory/70">Last updated {updated}</p>
        </div>
      </section>
      <article className="container-luxe max-w-3xl py-16 lg:py-24 [&_a]:text-forest [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-charcoal/80 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-charcoal/80">
        {children}
      </article>
    </>
  );
}

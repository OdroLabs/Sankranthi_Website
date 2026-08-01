import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading
        eyebrow="Reach out"
        title="Messages, referrals & partnerships"
        intro="Whether you need support, want to refer someone, or want to partner with us, send a message. All messages are confidential."
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-sm uppercase tracking-wide text-coral">Community hotline</p>
            <a href={site.hotlineHref} className="mt-1 block font-display text-2xl text-plum">{site.hotline}</a>
            <p className="mt-2 text-sm text-muted">Medical clinic info, legal assistance and peer support.</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-sm uppercase tracking-wide text-coral">Find us</p>
            <p className="mt-1 text-ink">{site.location}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

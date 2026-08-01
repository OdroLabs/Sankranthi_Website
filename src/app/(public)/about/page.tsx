import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "About us" };

const partners = ["FPA Sri Lanka", "National Trans Network SL", "Trans Equality Trust", "SWASA South Asia", "IPPF"];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading
        eyebrow="Who we are"
        title="A trans-led organisation for health, rights and dignity"
        intro="The Sankranthi Foundation is a trans-led community-based organisation in Sri Lanka dedicated to the human rights, health and well-being of the LGBTQIA+ and trans female sex worker communities."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-ink/90">
          <p>
            We operate in conjunction with the National Transgender Network Sri Lanka and partner
            organisations to reach transgender women and sex workers in Colombo and Gampaha. Our
            approach centres the community: run by us, for us.
          </p>
          <p>
            We participate in key consortiums such as the IPPF Sex Work Policy Consortium alongside
            FPA Sri Lanka to provide legal assistance, reduce stigma and demand better work and
            living conditions for all.
          </p>
        </div>
        <div className="rounded-2xl bg-plum p-8 text-sand">
          <p className="text-sm uppercase tracking-widest text-coral">Our vision</p>
          <p className="mt-3 font-display text-2xl leading-snug">
            A society where transgender women and sex workers enjoy full health, dignity, safety and
            equal rights.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral">Partners & networks</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {partners.map((p) => (
            <span key={p} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-card p-8 text-center">
        <p className="font-display text-2xl text-ink">You are not alone</p>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          A safe, affirming space to access care, connect with peers and assert your rights, free
          from judgement.
        </p>
        <Link href="/contact" className="mt-4 inline-block"><Button>Find support</Button></Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { DonationForm } from "@/components/forms/donation-form";

export const metadata: Metadata = { title: "Donate" };

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionHeading
        eyebrow="Support us"
        title="Fund free clinics and community care"
        intro="Your donation pays for mobile health clinics, screenings and peer support for trans women and sex workers in Colombo and Gampaha."
      />
      <div className="mt-8 rounded-2xl border border-line bg-white p-6">
        <DonationForm />
      </div>
    </div>
  );
}

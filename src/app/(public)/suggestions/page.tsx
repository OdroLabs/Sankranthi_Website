import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { SuggestionForm } from "@/components/forms/suggestion-form";

export const metadata: Metadata = { title: "Suggestions" };

export default function SuggestionsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionHeading
        eyebrow="Your voice"
        title="Share a suggestion"
        intro="Tell us how we can improve our services, clinics or community programmes. You can stay anonymous."
      />
      <div className="mt-8 rounded-2xl border border-line bg-white p-6">
        <SuggestionForm />
      </div>
    </div>
  );
}

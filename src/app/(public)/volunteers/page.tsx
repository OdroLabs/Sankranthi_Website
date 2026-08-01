import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { getVolunteers } from "@/lib/actions/volunteer";

export const metadata: Metadata = { title: "Volunteers" };

export default async function VolunteersPage() {
  const volunteers = await getVolunteers({ onlyPublished: true });

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading
        eyebrow="Get involved"
        title="Our volunteers"
        intro="Community members and allies who make our work possible."
      />

      <div className="mt-6 flex gap-3">
        <Link href="/events"><Button variant="outline">Events</Button></Link>
        <Link href="/gallery"><Button variant="outline">Gallery</Button></Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {volunteers.map((v: (typeof volunteers)[number]) => (
          <div key={v.id} className="rounded-2xl border border-line bg-white p-5 text-center">
            {v.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v.photo} alt={v.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-plum/10 font-display text-2xl text-plum">
                {v.name.charAt(0)}
              </div>
            )}
            <h3 className="mt-4 font-display text-lg text-ink">{v.name}</h3>
            {v.role ? <p className="text-sm text-coral">{v.role}</p> : null}
            {v.bio ? <p className="mt-2 text-sm text-muted">{v.bio}</p> : null}
          </div>
        ))}
      </div>
      {volunteers.length === 0 && <p className="mt-10 text-muted">No volunteers listed yet.</p>}

      <div className="mt-12 rounded-2xl border border-line bg-card p-8 text-center">
        <p className="font-display text-2xl text-ink">Want to join our team?</p>
        <Link href="/contact" className="mt-4 inline-block"><Button>Get in touch</Button></Link>
      </div>
    </div>
  );
}

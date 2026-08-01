import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { getGallery } from "@/lib/actions/gallery";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading eyebrow="Volunteers & community" title="Gallery" intro="Moments from our clinics, events and community work." />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((g: (typeof images)[number]) => (
          <figure key={g.id} className="overflow-hidden rounded-xl border border-line bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.url} alt={g.caption ?? ""} className="aspect-square w-full object-cover" />
            {g.caption ? <figcaption className="px-3 py-2 text-xs text-muted">{g.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
      {images.length === 0 && <p className="mt-10 text-muted">No images yet.</p>}
    </div>
  );
}

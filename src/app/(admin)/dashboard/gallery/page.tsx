import Link from "next/link";
import { getGallery, deleteGalleryImage } from "@/lib/actions/gallery";
import { AsyncActionButton } from "@/components/admin/async-action-button";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Gallery · Admin" };

export default async function AdminGalleryPage() {
  const images = await getGallery();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Gallery</h1>
        <Link href="/dashboard/gallery/new"><Button size="sm">Add image</Button></Link>
      </div>

      {images.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center text-muted">
          No images yet. Use “Add image” to upload the first one.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((g: (typeof images)[number]) => (
            <div key={g.id} className="overflow-hidden rounded-xl border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.caption ?? ""} className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between p-2">
                <span className="truncate text-xs text-muted">{g.event?.title ?? g.caption ?? "—"}</span>
                <AsyncActionButton
                  action={deleteGalleryImage.bind(null, g.id)}
                  variant="danger"
                  confirmText="Delete this image?"
                >
                  Delete
                </AsyncActionButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

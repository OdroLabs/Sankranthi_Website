import { addGalleryImage } from "@/lib/actions/gallery";
import { CrudForm } from "@/components/admin/crud-form";
import { galleryFields } from "@/config/fields";

export const metadata = { title: "Add image · Gallery" };

export default function NewGalleryImagePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Add gallery image</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm fields={galleryFields} action={addGalleryImage} redirectTo="/dashboard/gallery" submitLabel="Add image" />
      </div>
    </div>
  );
}

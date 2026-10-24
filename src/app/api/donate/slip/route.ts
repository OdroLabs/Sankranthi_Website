import { NextRequest, NextResponse } from "next/server";
import { uploadToSpaces } from "@/lib/spaces";

/**
 * Public upload endpoint for bank-transfer deposit slips, used by the
 * donation form on /donate. Deliberately unauthenticated — it's filled in
 * by website visitors before they've signed in to anything — but kept
 * separate from /api/upload (the admin-only CMS uploader) so the public
 * surface stays narrow: images/PDF only, smaller size cap, its own
 * filename prefix so slips are easy to spot in the Space.
 */
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB — a phone photo or scanned receipt
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File is too large (max 8 MB)." }, { status: 400 });
  if (!ALLOWED.includes(file.type))
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WebP or PDF file." },
      { status: 400 }
    );

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `slip-${Date.now()}-${safeName}`;

  try {
    const url = await uploadToSpaces(bytes, filename, file.type);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Donation slip upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

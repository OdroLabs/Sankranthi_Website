import type { FieldDef } from "@/components/admin/crud-form";

export const projectFields: FieldDef[] = [
  { name: "title", label: "Title", placeholder: "Mobile Health Clinic Programme" },
  { name: "slug", label: "Slug", placeholder: "mobile-health-clinic", help: "Lowercase letters, numbers and dashes. Used in the URL." },
  { name: "summary", label: "Summary", type: "textarea", placeholder: "One or two sentences shown on cards." },
  { name: "content", label: "Full description", type: "textarea", placeholder: "The complete project write-up." },
  { name: "location", label: "Location", placeholder: "Colombo & Gampaha" },
  { name: "coverImage", label: "Cover image URL", type: "url", placeholder: "https://…" },
  { name: "published", label: "Published (visible on the public site)", type: "checkbox" },
];

export const serviceFields: FieldDef[] = [
  { name: "title", label: "Title", placeholder: "Mobile Health Clinics" },
  { name: "slug", label: "Slug", placeholder: "mobile-health-clinics" },
  { name: "icon", label: "Icon (emoji)", placeholder: "🏥" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "specialCase", label: "Special case note", placeholder: "e.g. Book via hotline only" },
  { name: "order", label: "Sort order", placeholder: "0" },
  { name: "published", label: "Published", type: "checkbox" },
];

export const publicationFields: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "slug", label: "Slug" },
  { name: "kind", label: "Kind", placeholder: "Report / Publication / Article" },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "coverImage", label: "Cover image URL", type: "url" },
  { name: "fileUrl", label: "PDF file URL", type: "url" },
  { name: "externalUrl", label: "External link", type: "url" },
  { name: "published", label: "Published", type: "checkbox" },
];

export const eventFields: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "slug", label: "Slug" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "coverImage", label: "Cover image URL", type: "url" },
  { name: "location", label: "Location" },
  { name: "startsAt", label: "Starts at", placeholder: "2026-08-15T09:00", help: "ISO date-time, e.g. 2026-08-15T09:00" },
  { name: "endsAt", label: "Ends at (optional)", placeholder: "2026-08-15T13:00" },
  { name: "published", label: "Published", type: "checkbox" },
];

export const volunteerFields: FieldDef[] = [
  { name: "name", label: "Name" },
  { name: "role", label: "Role", placeholder: "Peer support lead" },
  { name: "photo", label: "Photo URL", type: "url" },
  { name: "bio", label: "Short bio", type: "textarea" },
  { name: "order", label: "Sort order", placeholder: "0" },
  { name: "published", label: "Published", type: "checkbox" },
];

export const newsFields: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "slug", label: "Slug" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "content", label: "Content", type: "textarea" },
  { name: "coverImage", label: "Cover image URL", type: "url" },
  { name: "category", label: "Category", placeholder: "Health / Rights / Community" },
  { name: "published", label: "Published", type: "checkbox" },
];

export const spaServiceFields: FieldDef[] = [
  { name: "name", label: "Service name", placeholder: "Gel Nail Art" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "price", label: "Price (LKR)", placeholder: "4500" },
  { name: "durationMin", label: "Duration (minutes)", placeholder: "90" },
  { name: "active", label: "Active (bookable)", type: "checkbox" },
];

export const galleryFields: FieldDef[] = [
  { name: "url", label: "Image URL", type: "url", placeholder: "https://…" },
  { name: "caption", label: "Caption (optional)" },
  { name: "eventId", label: "Event ID (optional)", help: "Link this image to an event by its ID." },
  { name: "order", label: "Sort order", placeholder: "0" },
];

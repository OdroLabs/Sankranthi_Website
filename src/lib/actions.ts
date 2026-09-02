"use server";

import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { requireAdmin, requireOwner } from "./session";
import { toRole, type Role } from "./roles";
import { getEntity, type FieldDef } from "./admin-config";
import { getSettingPage, type SettingDef } from "./settings";
import { allLabelDefs } from "./labels";
import { sanitizeRichText } from "./sanitize";
import { slugify, uniqueSlug } from "./slug";

const SLUGGED_MODELS = ["project", "service", "news", "event"] as const;

/**
 * Every admin action resolves to one of these instead of throwing or
 * redirecting, so the caller can show a success or error toast and decide
 * whether to navigate.
 */
export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? { data?: undefined } : { data: T }))
  | { ok: false; error: string };

/** A message safe to show an admin, with the real error kept in the log. */
function toMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    // Prisma errors carry a `code`; surface the common, actionable ones.
    const code = (error as { code?: string }).code;
    if (code === "P2002") return "That value must be unique — something already uses it.";
    if (code === "P2025") return "That record no longer exists. It may have been deleted already.";
    if (error.message === "Unauthorized") return "Your session has expired. Please sign in again.";
    if (error.message === "Forbidden")
      return "Only an owner can do that. Ask an owner to make the change.";
    if (error.message.startsWith("Validation:")) return error.message.slice("Validation:".length).trim();
    console.error(error);
    return fallback;
  }
  console.error(error);
  return fallback;
}

function delegate(model: string) {
  return (prisma as any)[model];
}

function parseFieldValue(field: FieldDef, raw: FormDataEntryValue | null) {
  const value = typeof raw === "string" ? raw.trim() : "";
  switch (field.type) {
    case "number": {
      if (value === "") return field.name === "order" ? 0 : null;
      const n = Number(value);
      return isNaN(n) ? null : n;
    }
    case "date":
    case "datetime":
      return value === "" ? null : new Date(value);
    case "boolean":
      return raw === "on" || raw === "true";
    case "richtext": {
      // Strip anything outside the allowlist before it reaches the database,
      // and normalise an "empty" editor document to null so sections still hide.
      const clean = sanitizeRichText(value);
      return clean === "" ? null : clean;
    }
    default:
      return value === "" ? null : value;
  }
}

/**
 * Check required fields before touching the database.
 * Rich-text editors post through a hidden input, which the browser never
 * validates, so this is the only place emptiness is caught for those.
 */
function validateRequired(fields: FieldDef[], formData: FormData) {
  for (const field of fields) {
    if (!field.required) continue;
    const key = field.i18n ? `${field.name}En` : field.name;
    const raw = formData.get(key);
    const value = typeof raw === "string" ? raw.trim() : "";
    const empty = field.type === "richtext" ? sanitizeRichText(value) === "" : value === "";
    if (empty) {
      throw new Error(
        `Validation: ${field.label} is required${field.i18n ? " (English)" : ""}.`
      );
    }
  }
}

const notNullColumnCache = new Map<string, Set<string>>();

/**
 * Columns the schema declares non-nullable, e.g. `News.publishedAt`, which is
 * required but carries a database default. Writing an explicit `null` to one of
 * those is rejected by Prisma, so a blank optional field has to be left out of
 * the payload entirely rather than sent as null.
 */
function notNullColumns(model: string): Set<string> {
  const cached = notNullColumnCache.get(model);
  if (cached) return cached;
  const meta = Prisma.dmmf.datamodel.models.find(
    (m) => m.name.toLowerCase() === model.toLowerCase()
  );
  const names = new Set(
    (meta?.fields ?? []).filter((f) => f.isRequired).map((f) => f.name)
  );
  notNullColumnCache.set(model, names);
  return names;
}

function buildData(model: string, fields: FieldDef[], formData: FormData) {
  const notNull = notNullColumns(model);
  const data: Record<string, any> = {};

  /**
   * Omit rather than null a blank value whose column cannot hold null: on
   * create the schema default applies, on update the stored value is kept.
   */
  const set = (key: string, value: any) => {
    if (value === null && notNull.has(key)) return;
    data[key] = value;
  };

  for (const field of fields) {
    if (field.i18n) {
      for (const suffix of ["En", "Si", "Ta"]) {
        const key = `${field.name}${suffix}`;
        const parsed = parseFieldValue(field, formData.get(key));
        // English base field is required by schema for required fields
        set(key, field.required && suffix === "En" ? (parsed ?? "") : parsed);
      }
    } else {
      const parsed = parseFieldValue(field, formData.get(field.name));
      if (field.type === "boolean") set(field.name, parsed);
      else if (field.required) set(field.name, parsed ?? "");
      else set(field.name, parsed);
    }
  }
  return data;
}

export async function saveEntity(
  slug: string,
  id: number | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const entity = getEntity(slug);
    if (!entity || entity.readOnly) throw new Error("Unknown entity");
    validateRequired(entity.fields, formData);
    const data = buildData(entity.model, entity.fields, formData);

    // Auto-generate a unique URL slug from the English title when left empty
    if ((SLUGGED_MODELS as readonly string[]).includes(entity.model)) {
      const base = slugify((data.slug as string) || (data.titleEn as string) || "");
      data.slug = await uniqueSlug(entity.model as (typeof SLUGGED_MODELS)[number], base, id);
    }

    if (id) {
      await delegate(entity.model).update({ where: { id }, data });
    } else {
      await delegate(entity.model).create({ data });
    }
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not save. Please try again.") };
  }
}

export async function deleteEntity(slug: string, id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const entity = getEntity(slug);
    if (!entity) throw new Error("Unknown entity");
    await delegate(entity.model).delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath(`/admin/content/${slug}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not delete. Please try again.") };
  }
}

/* --------------------------------- Inbox ---------------------------------- */

/**
 * Mark an enquiry read or unread. Only entities that opt in via `inbox.readFlag`
 * are touched, so this can never be pointed at a content model.
 */
export async function setRecordRead(
  slug: string,
  id: number,
  read: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const entity = getEntity(slug);
    if (!entity?.inbox?.readFlag) throw new Error("Unknown entity");
    await delegate(entity.model).update({ where: { id }, data: { read } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not update that item.") };
  }
}

/** Move an enquiry through its workflow, e.g. a booking from new to confirmed. */
export async function setRecordStatus(
  slug: string,
  id: number,
  status: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const entity = getEntity(slug);
    const allowed = entity?.inbox?.statuses;
    if (!allowed) throw new Error("Unknown entity");
    if (!allowed.some((s) => s.value === status))
      throw new Error("Validation: That is not a status you can set.");
    await delegate(entity!.model).update({ where: { id }, data: { status } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not update that item.") };
  }
}

/* ---------------------------- Settings & labels --------------------------- */

function formString(formData: FormData, name: string): string {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw.trim() : "";
}

/**
 * Build (but don't run) an upsert for one Setting row.
 * `translated` decides whether the Sinhala and Tamil columns are written.
 */
function settingUpsert(
  key: string,
  formData: FormData,
  translated: boolean,
  richtext = false
) {
  const read = (name: string) => {
    const raw = formString(formData, name);
    return richtext ? sanitizeRichText(raw) : raw;
  };
  const valueEn = read(`${key}__en`);
  const values = translated
    ? {
        valueEn,
        valueSi: read(`${key}__si`),
        valueTa: read(`${key}__ta`),
      }
    : { valueEn };

  return prisma.setting.upsert({
    where: { key },
    update: values,
    create: { key, ...values },
  });
}

/**
 * Save one tab of the settings screen. Only the keys belonging to that tab are
 * touched, so tabs can never overwrite each other with blanks. All rows are
 * written in a single transaction, so a failure part-way leaves nothing half-saved.
 */
export async function saveSettingsPage(
  pageSlug: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireOwner();
    const page = getSettingPage(pageSlug);
    if (!page) throw new Error("Unknown settings page");

    const items: SettingDef[] = page.sections.flatMap((sec) => sec.items);
    await prisma.$transaction(
      items.map((item) => {
        // Images and uploads have a single value, never a per-language one.
        const translated = Boolean(item.i18n) && item.type !== "image" && item.type !== "file";
        return settingUpsert(item.key, formData, translated, item.type === "richtext");
      })
    );

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not save these settings.") };
  }
}

/** Save the interface label overrides. Blank values fall back to code defaults. */
export async function saveLabels(formData: FormData): Promise<ActionResult> {
  try {
    await requireOwner();
    await prisma.$transaction(allLabelDefs.map((def) => settingUpsert(def.key, formData, true)));
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not save the labels.") };
  }
}

/* ------------------------------ Admin users ------------------------------- */

const MIN_PASSWORD = 8;

function checkPassword(password: string | null, confirm?: string | null) {
  if (!password || password.length < MIN_PASSWORD)
    throw new Error(`Validation: The password must be at least ${MIN_PASSWORD} characters.`);
  if (confirm != null && confirm !== password)
    throw new Error("Validation: The two passwords do not match.");
}

function readEmail(formData: FormData): string {
  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Validation: Enter a valid email address.");
  return email;
}

function readName(formData: FormData): string {
  const name = ((formData.get("name") as string) ?? "").trim();
  if (!name) throw new Error("Validation: Enter a name.");
  return name;
}

function readRole(formData: FormData): Role {
  return toRole(formData.get("role"));
}

/** Count owners who can still sign in — used to protect the last one. */
async function activeOwnerCount(excludeId?: number): Promise<number> {
  return prisma.user.count({
    where: {
      role: "owner",
      active: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  try {
    await requireOwner();
    const name = readName(formData);
    const email = readEmail(formData);
    const role = readRole(formData);
    const password = formData.get("password") as string;
    checkPassword(password, formData.get("confirm") as string | null);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Validation: An account with that email already exists.");

    await prisma.user.create({
      data: { name, email, role, password: await hash(password, 10) },
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not create that user.") };
  }
}

/** Update someone's name, email or role. */
export async function updateUser(id: number, formData: FormData): Promise<ActionResult> {
  try {
    const admin = await requireOwner();
    const name = readName(formData);
    const email = readEmail(formData);
    const role = readRole(formData);

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new Error("Validation: That user no longer exists.");

    // Never allow the site to end up with no owner who can sign in.
    if (target.role === "owner" && role !== "owner" && (await activeOwnerCount(id)) === 0) {
      throw new Error(
        "Validation: This is the only owner. Promote someone else to owner first."
      );
    }
    if (target.id === admin.id && role !== "owner") {
      throw new Error("Validation: You cannot remove your own owner access.");
    }

    const clash = await prisma.user.findUnique({ where: { email } });
    if (clash && clash.id !== id)
      throw new Error("Validation: Another account already uses that email.");

    await prisma.user.update({ where: { id }, data: { name, email, role } });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not update that user.") };
  }
}

/** Set a new password for someone else. */
export async function resetUserPassword(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireOwner();
    const password = formData.get("password") as string;
    checkPassword(password, formData.get("confirm") as string | null);
    await prisma.user.update({
      where: { id },
      data: { password: await hash(password, 10) },
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not reset that password.") };
  }
}

/** Suspend or restore an account. Suspended users cannot sign in. */
export async function setUserActive(id: number, active: boolean): Promise<ActionResult> {
  try {
    const admin = await requireOwner();
    if (id === admin.id) throw new Error("Validation: You cannot deactivate your own account.");

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new Error("Validation: That user no longer exists.");
    if (!active && target.role === "owner" && (await activeOwnerCount(id)) === 0) {
      throw new Error("Validation: This is the only active owner and cannot be deactivated.");
    }

    await prisma.user.update({ where: { id }, data: { active } });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not change that account.") };
  }
}

export async function deleteUser(id: number): Promise<ActionResult> {
  try {
    const admin = await requireOwner();
    if (id === admin.id) throw new Error("Validation: You cannot delete your own account.");

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new Error("Validation: That user no longer exists.");
    if (target.role === "owner" && (await activeOwnerCount(id)) === 0) {
      throw new Error("Validation: This is the only owner and cannot be deleted.");
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error, "Could not delete that user.") };
  }
}

// ---------- Public form actions ----------

export async function submitContact(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  if (!name || !email || !message) return { ok: false };
  await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: ((formData.get("phone") as string) || "").trim() || null,
      subject: ((formData.get("subject") as string) || "").trim() || null,
      message,
    },
  });
  return { ok: true };
}

export async function submitSuggestion(formData: FormData) {
  const message = (formData.get("message") as string)?.trim();
  if (!message) return { ok: false };
  await prisma.suggestion.create({
    data: {
      name: ((formData.get("name") as string) || "").trim() || null,
      email: ((formData.get("email") as string) || "").trim() || null,
      message,
    },
  });
  return { ok: true };
}

export async function submitBooking(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim();
  const phone = ((formData.get("phone") as string) || "").trim();
  const serviceId = Number(formData.get("serviceId"));
  const date = ((formData.get("preferredDate") as string) || "").trim();
  const preferredTime = ((formData.get("preferredTime") as string) || "").trim();

  if (!name || !phone || !Number.isInteger(serviceId) || serviceId < 1 || !date || !preferredTime) {
    return { ok: false, error: "Please complete all required fields." };
  }

  const service = await prisma.product.findFirst({
    where: { id: serviceId, published: true, inStock: true },
    select: { nameEn: true },
  });
  if (!service) {
    return { ok: false, error: "That service is no longer available. Please choose another service." };
  }

  const preferredDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(preferredDate.getTime())) {
    return { ok: false, error: "Please choose a valid appointment date." };
  }

  await prisma.booking.create({
    data: {
      name,
      phone,
      service: service.nameEn,
      preferredDate,
      preferredTime,
      email: ((formData.get("email") as string) || "").trim() || null,
      notes: ((formData.get("notes") as string) || "").trim() || null,
    },
  });

  return { ok: true };
}

export async function subscribeNewsletter(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  if (!email || !email.includes("@")) return { ok: false };
  try {
    await prisma.subscriber.create({ data: { email } });
  } catch {
    // duplicate — treat as success
  }
  return { ok: true };
}

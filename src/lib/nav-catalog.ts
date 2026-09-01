/**
 * Everything about the reorderable "Menu items" list under Site Settings →
 * Header & Navigation lives here, in a module with zero imports, so it can
 * be shared by both `nav.ts` (server, reads Prisma-backed settings) and the
 * admin's drag-and-drop field (a client component) without pulling any
 * server-only code into the browser bundle.
 */

export interface NavCatalogItem {
  key: string;
  /** Admin-facing label — the site's own menu labels come from Labels & Translations. */
  label: string;
  /** Whether this item is on when nothing has ever been saved for it. */
  fallback: boolean;
}

/** Order here is only the starting order, before an admin has ever saved the list. */
export const NAV_ITEM_CATALOG: NavCatalogItem[] = [
  { key: "about", label: "About Us", fallback: true },
  { key: "projects", label: "Our Work", fallback: true },
  { key: "services", label: "Our Services", fallback: false },
  { key: "publications", label: "Publications", fallback: false },
  { key: "news", label: "News", fallback: false },
  { key: "events", label: "Events & Gallery", fallback: false },
  { key: "business", label: "Social Enterprise", fallback: true },
  { key: "suggestions", label: "Suggestions", fallback: false },
  { key: "contact", label: "Contact Us", fallback: true },
];

export interface NavItemState {
  key: string;
  on: boolean;
}

/**
 * Parses the stored/posted value for `nav_menu_items` — one `key:on` or
 * `key:off` line per item, in display order. Any catalog item missing from
 * `raw` (a brand new item added to the catalog after an admin already saved
 * this list) is appended at the end, on by its own fallback.
 */
export function parseNavItemStates(raw: string): NavItemState[] {
  const order: string[] = [];
  const on = new Map<string, boolean>();

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [rawKey, rawState] = trimmed.split(":");
    const key = rawKey?.trim();
    if (!key || !NAV_ITEM_CATALOG.some((item) => item.key === key)) continue;
    order.push(key);
    on.set(key, rawState?.trim() !== "off");
  }

  for (const item of NAV_ITEM_CATALOG) {
    if (!on.has(item.key)) {
      order.push(item.key);
      on.set(item.key, item.fallback);
    }
  }

  return order.map((key) => ({ key, on: on.get(key)! }));
}

export function serializeNavItemStates(states: NavItemState[]): string {
  return states.map((item) => `${item.key}:${item.on ? "on" : "off"}`).join("\n");
}

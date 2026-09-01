import type { Dictionary } from "./dictionaries";
import { s, sBool, type SettingsMap } from "./settings";
import { NAV_ITEM_CATALOG, parseNavItemStates, type NavItemState } from "./nav-catalog";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavConfig {
  primary: NavItem[];
  groups: NavGroup[];
  contact: NavItem | null;
  /** Flat list, used by the footer columns. */
  explore: NavItem[];
  involved: NavItem[];
}

export interface SocialLink {
  key: string;
  label: string;
  url: string;
}

/**
 * Resolves the current order + on/off state of every menu item. Reads the
 * single `nav_menu_items` setting (saved by the drag-and-drop list under
 * Site Settings -> Header & Navigation -> Menu items) once it exists; a site
 * that hasn't saved that list yet falls back to the legacy per-item
 * `nav_show_*` switches (or the catalog default) so nothing changes on
 * upgrade until an admin actually touches the new list.
 */
export function resolveNavItemStates(settings: SettingsMap): NavItemState[] {
  const raw = s(settings, "nav_menu_items");
  if (raw) return parseNavItemStates(raw);
  return NAV_ITEM_CATALOG.map((item) => ({
    key: item.key,
    on: sBool(settings, `nav_show_${item.key}`, item.fallback),
  }));
}

const ITEM_HREF: Record<string, string> = {
  about: "/about",
  projects: "/projects",
  services: "/services",
  publications: "/publications",
  news: "/news",
  events: "/events",
  business: "/business",
  suggestions: "/suggestions",
  contact: "/contact",
};

const ITEM_LABEL: Record<string, (dict: Dictionary) => string> = {
  about: (d) => d.nav.about,
  projects: (d) => d.nav.projects,
  services: (d) => d.nav.services,
  publications: (d) => d.nav.publications,
  news: (d) => d.nav.news,
  events: (d) => d.nav.events,
  business: (d) => d.nav.business,
  suggestions: (d) => d.nav.suggestions,
  contact: (d) => d.nav.contact,
};

/**
 * Build the menu from the admin's Menu items list. Anything switched off
 * disappears from the header, the mobile menu and the footer columns; the
 * order the admin dragged items into is followed everywhere that item
 * appears (within each existing group — Menu items doesn't change which
 * dropdown or footer column an item belongs to, only its position there).
 */
export function buildNav(settings: SettingsMap, dict: Dictionary): NavConfig {
  const states = resolveNavItemStates(settings);
  const enabledOrder = states.filter((state) => state.on).map((state) => state.key);
  const item = (key: string): NavItem => ({ href: ITEM_HREF[key], label: ITEM_LABEL[key](dict) });
  // Enabled items that belong to `keys`, kept in the admin's drag order.
  const pick = (keys: string[]) => enabledOrder.filter((key) => keys.includes(key)).map(item);

  const primary: NavItem[] = [
    { href: "", label: dict.nav.home },
    ...pick(["about", "projects", "business", "services"]),
  ];

  const resourceItems = pick(["publications", "news"]);
  const volunteerItems = pick(["events"]);
  const involvedItems = pick(["suggestions"]);

  const groups: NavGroup[] = [];
  if (resourceItems.length) groups.push({ label: "Resources", items: resourceItems });
  if (volunteerItems.length) groups.push({ label: "Volunteers", items: volunteerItems });
  if (involvedItems.length) groups.push({ label: dict.nav.getInvolved, items: involvedItems });

  const contact = enabledOrder.includes("contact") ? item("contact") : null;

  // Footer columns mirror the same visibility + order.
  const explore: NavItem[] = [
    ...pick(["about", "projects", "services", "publications", "news"]),
    // Legal pages always show under Explore — content is edited from
    // Site Settings -> Other Pages -> Privacy Policy / Terms & Conditions.
    { href: "/privacy", label: dict.nav.privacy },
    { href: "/terms", label: dict.nav.terms },
  ];

  const involved: NavItem[] = [
    ...pick(["business", "events"]),
    { href: "/donate", label: dict.nav.donate },
    ...(contact ? [contact] : []),
  ];

  return { primary, groups, contact, explore, involved };
}

const SOCIAL_KEYS = [
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "X" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
];

/** Social links that actually have a URL set. */
export function buildSocials(settings: SettingsMap): SocialLink[] {
  return SOCIAL_KEYS.map((item) => ({ ...item, url: s(settings, item.key) })).filter(
    (item) => item.url !== ""
  );
}

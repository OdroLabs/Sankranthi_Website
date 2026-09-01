import type { Dictionary } from "./dictionaries";
import { s, sBool, type SettingsMap } from "./settings";

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
 * Build the menu from the admin toggles. Anything switched off under
 * Site Settings → Header & Navigation disappears from the header, the mobile
 * menu and the footer columns.
 */
export function buildNav(settings: SettingsMap, dict: Dictionary): NavConfig {
  // Every item is controlled by a "nav_show_*" switch under
  // Site Settings -> Header & Navigation -> Menu items in the admin panel.
  // `fallback` is what a page does when the admin hasn't touched its switch
  // yet: About, Our Work (Projects), Social Enterprise (Business) and
  // Contact ship on by default; Services, Publications, News, Events and
  // Suggestions ship off by default and can be switched on from the admin
  // panel without a code change.
  const on = (key: string, fallback = true) => sBool(settings, key, fallback);

  const primary: NavItem[] = [{ href: "", label: dict.nav.home }];
  if (on("nav_show_about")) primary.push({ href: "/about", label: dict.nav.about });
  if (on("nav_show_projects")) primary.push({ href: "/projects", label: dict.nav.projects });
  if (on("nav_show_business")) primary.push({ href: "/business", label: dict.nav.business });
  if (on("nav_show_services", false)) primary.push({ href: "/services", label: dict.nav.services });

  const resourceItems: NavItem[] = [];
  if (on("nav_show_publications", false))
    resourceItems.push({ href: "/publications", label: dict.nav.publications });
  if (on("nav_show_news", false)) resourceItems.push({ href: "/news", label: dict.nav.news });

  const volunteerItems: NavItem[] = [];
  if (on("nav_show_events", false)) volunteerItems.push({ href: "/events", label: dict.nav.events });

  const involvedItems: NavItem[] = [];
  if (on("nav_show_suggestions", false))
    involvedItems.push({ href: "/suggestions", label: dict.nav.suggestions });

  const groups: NavGroup[] = [];
  if (resourceItems.length) groups.push({ label: "Resources", items: resourceItems });
  if (volunteerItems.length) groups.push({ label: "Volunteers", items: volunteerItems });
  if (involvedItems.length) groups.push({ label: dict.nav.getInvolved, items: involvedItems });

  const contact = on("nav_show_contact") ? { href: "/contact", label: dict.nav.contact } : null;

  // Footer columns mirror the same visibility rules.
  const explore: NavItem[] = [];
  if (on("nav_show_about")) explore.push({ href: "/about", label: dict.nav.about });
  if (on("nav_show_projects")) explore.push({ href: "/projects", label: dict.nav.projects });
  if (on("nav_show_services", false)) explore.push({ href: "/services", label: dict.nav.services });
  if (on("nav_show_publications", false))
    explore.push({ href: "/publications", label: dict.nav.publications });
  if (on("nav_show_news", false)) explore.push({ href: "/news", label: dict.nav.news });
  // Legal pages always show under Explore — content is edited from
  // Site Settings -> Other Pages -> Privacy Policy / Terms & Conditions.
  explore.push({ href: "/privacy", label: dict.nav.privacy });
  explore.push({ href: "/terms", label: dict.nav.terms });

  const involved: NavItem[] = [];
  if (on("nav_show_business")) involved.push({ href: "/business", label: dict.nav.business });
  if (on("nav_show_events", false)) involved.push({ href: "/events", label: dict.nav.events });
  involved.push({ href: "/donate", label: dict.nav.donate });
  if (on("nav_show_contact")) involved.push({ href: "/contact", label: dict.nav.contact });

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

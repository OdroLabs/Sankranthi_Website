import { prisma } from "./prisma";
import { loc } from "./i18n";

export type SettingsMap = Record<
  string,
  { valueEn: string | null; valueSi: string | null; valueTa: string | null }
>;

export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.setting.findMany();
  const map: SettingsMap = {};
  for (const r of rows) {
    map[r.key] = { valueEn: r.valueEn, valueSi: r.valueSi, valueTa: r.valueTa };
  }
  return map;
}

/* -------------------------------------------------------------------------- */
/* Readers                                                                     */
/* -------------------------------------------------------------------------- */

/** Localized setting value with English fallback. Returns "" when unset. */
export function s(map: SettingsMap, key: string, locale = "en"): string {
  const row = map[key];
  if (!row) return "";
  return (loc(row, "value", locale) ?? "").trim();
}

/*
 * There is deliberately no `sOr(key, hardcodedFallback)` helper. Page content
 * lives only in the database: if a value is blank the element or section is
 * hidden, never replaced with a string baked into the code. Run
 * `npm run db:seed` to populate every key.
 */

/** One item per line, blanks removed. */
export function sList(map: SettingsMap, key: string, locale = "en"): string[] {
  return s(map, key, locale)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Lines in the form "Left :: Right". `right` is "" when the separator is absent. */
export function sPairs(
  map: SettingsMap,
  key: string,
  locale = "en"
): { left: string; right: string }[] {
  return sList(map, key, locale).map((line) => {
    const [left, ...rest] = line.split("::");
    return { left: left.trim(), right: rest.join("::").trim() };
  });
}

/** Numeric setting with a fallback. */
export function sNum(map: SettingsMap, key: string, fallback: number): number {
  const raw = s(map, key);
  if (raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Boolean setting. Unset means `fallback` — visibility toggles default to on. */
export function sBool(map: SettingsMap, key: string, fallback = true): boolean {
  const raw = s(map, key).toLowerCase();
  if (raw === "") return fallback;
  return raw === "1" || raw === "true" || raw === "on" || raw === "yes";
}

/** True when a value counts as real content. */
function filled(value: unknown): boolean {
  if (value == null || value === false) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return true;
  return Boolean(value);
}

/**
 * Should a section render?
 * Shown when its admin toggle is on (default on) AND at least one of the
 * supplied content values is non-empty. Pass no content values to rely on the
 * toggle alone.
 */
export function show(map: SettingsMap, toggleKey: string, ...content: unknown[]): boolean {
  if (!sBool(map, toggleKey, true)) return false;
  if (content.length === 0) return true;
  return content.some(filled);
}

/* -------------------------------------------------------------------------- */
/* Registry                                                                    */
/* -------------------------------------------------------------------------- */

export type SettingType =
  | "text"
  | "textarea"
  | "image"
  | "file"
  | "boolean"
  | "number"
  /** Repeatable rows of "heading + text", stored as `Left :: Right` lines. */
  | "pairs"
  /** Repeatable single-value rows, stored one per line. */
  | "lines"
  /** Rich HTML, edited with the same block editor as News/Events/Projects/Services content. */
  | "richtext"
  /** The header/footer menu list — on/off plus drag-to-reorder. See nav-catalog.ts. */
  | "nav-items";

export interface SettingDef {
  key: string;
  label: string;
  type: SettingType;
  /** Translated per language (En/Si/Ta). */
  i18n?: boolean;
  help?: string;
  /** For "pairs": label of the first box. Default "Title". */
  leftLabel?: string;
  /** For "pairs": label of the second box. Default "Description". */
  rightLabel?: string;
  /** Noun used for each row, e.g. "Value", "Point". Default "Item". */
  itemLabel?: string;
  /** Text on the add button. */
  addLabel?: string;
}

/** Which part of the live site the admin preview panel should isolate. */
export interface PreviewTarget {
  /** Public path without the locale prefix, e.g. "/donate" or "" for home. */
  path: string;
  /**
   * Element id of the section on that page. The preview hides everything else,
   * so this must match an `id` in the page markup.
   */
  anchor?: string;
}

export interface SettingSection {
  /** Heading shown in the admin. */
  section: string;
  /** Note explaining when this section auto-hides on the public site. */
  hideNote?: string;
  /** Which part of the live site this section controls. */
  preview?: PreviewTarget;
  items: SettingDef[];
}

export interface SettingPage {
  slug: string;
  title: string;
  description: string;
  sections: SettingSection[];
}

/** Translated single-line text. */
const T = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "text",
  i18n: true,
  help,
});
/** Translated multi-line text. */
const TA = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "textarea",
  i18n: true,
  help,
});
/** Translated rich HTML, edited with the block editor. */
const RT = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "richtext",
  i18n: true,
  help,
});
/** Plain (untranslated) single-line text. */
const P = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "text",
  help,
});
/** Plain (untranslated) multi-line text. */
const PA = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "textarea",
  help,
});
const IMG = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "image",
  help,
});
const NUM = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "number",
  help,
});
const SW = (key: string, label: string, help?: string): SettingDef => ({
  key,
  label,
  type: "boolean",
  help,
});
/** Repeatable "heading + text" rows. */
const PAIRS = (
  key: string,
  label: string,
  opts: {
    leftLabel?: string;
    rightLabel?: string;
    itemLabel?: string;
    addLabel?: string;
    help?: string;
  } = {}
): SettingDef => ({ key, label, type: "pairs", i18n: true, ...opts });
/** Repeatable single-value rows. */
const LINES = (
  key: string,
  label: string,
  opts: { itemLabel?: string; addLabel?: string; help?: string; i18n?: boolean } = {}
): SettingDef => ({ key, label, type: "lines", i18n: true, ...opts });

const AUTO_HIDE = "Clear the text below and this section disappears from the site.";
const AUTO_HIDE_LIST = "Remove every item and this section disappears from the site.";

export const settingPages: SettingPage[] = [
  /* ---------------------------------------------------------------- General */
  {
    slug: "general",
    title: "General",
    description:
      "Organisation identity, contact details and social links used across the whole site.",
    sections: [
      {
        section: "Identity",
        preview: { path: "", anchor: "sec-header" },
        items: [
          T(
            "site_name",
            "Organisation name",
            "Full name, e.g. Community Strength Development Foundation."
          ),
          P("site_short_name", "Short name / abbreviation", "Shown in the logo, e.g. SF."),
          T("site_tagline", "Tagline", "One-line summary used in the footer and About header."),
          IMG("logo_image", "Logo image", "Optional. Replaces the letter mark in header and footer."),
          IMG(
            "logo_image_light",
            "Logo image for dark backgrounds",
            "Optional light version used in the footer. Falls back to the logo above."
          ),
          P("logo_letter", "Logo letter", "Used when no logo image is uploaded. Default: C"),
          IMG("favicon", "Favicon", "Small icon shown in the browser tab."),
        ],
      },
      {
        section: "Contact details",
        preview: { path: "/contact", anchor: "sec-details" },
        hideNote: "Any field left blank is hidden everywhere it would normally appear.",
        items: [
          TA("address", "Address"),
          P("phone", "Phone"),
          P("phone2", "Second phone", "Optional."),
          P("email", "Email"),
          P("email2", "Second email", "Optional."),
          P("whatsapp", "WhatsApp number", "International format without +, e.g. 94112534838."),
          T("office_hours", "Office hours"),
          PA("map_embed", "Google Maps embed URL", "The src URL from a Google Maps iframe."),
        ],
      },
      {
        section: "Social links",
        preview: { path: "", anchor: "sec-footer" },
        hideNote: "Blank links are hidden.",
        items: [
          P("facebook", "Facebook URL"),
          P("youtube", "YouTube URL"),
          P("instagram", "Instagram URL"),
          P("twitter", "X / Twitter URL"),
          P("linkedin", "LinkedIn URL"),
          P("tiktok", "TikTok URL"),
        ],
      },
      {
        section: "Search engines & sharing",
        items: [
          T("seo_title", "Default page title"),
          TA("seo_description", "Default meta description"),
          P("seo_keywords", "Meta keywords", "Comma separated. Optional."),
          IMG("og_image", "Social share image", "Shown when a page is shared on social media."),
          SW(
            "seo_allow_indexing",
            "Allow search engines to index this site",
            "Off adds a noindex tag to every page and blocks the site in robots.txt, so Google and other search engines drop it from results. On by default."
          ),
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- Header */
  {
    slug: "header",
    title: "Header & Navigation",
    description: "The top bar, logo, menu items and donate button.",
    sections: [
      {
        section: "Announcement bar",
        preview: { path: "", anchor: "sec-announce" },
        hideNote: "Leave the text blank to hide the announcement bar.",
        items: [
          T("announce_text", "Announcement text"),
          P("announce_link", "Announcement link", "Optional URL the announcement points to."),
        ],
      },
      {
        section: "Top utility strip",
        preview: { path: "", anchor: "sec-topbar" },
        items: [
          SW("show_header_topbar", "Show the dark strip with phone, email and language switcher"),
          SW("show_header_langs", "Show the language switcher"),
        ],
      },
      {
        section: "Menu items",
        preview: { path: "", anchor: "sec-header" },
        hideNote:
          "Turn an item off to remove it from both the desktop and mobile menus. Drag an item by its handle to reorder it — the same order is used in the header, the mobile menu and the footer.",
        items: [
          {
            key: "nav_menu_items",
            label: "Menu items",
            type: "nav-items",
          },
        ],
      },
      {
        section: "Donate button",
        preview: { path: "", anchor: "sec-header" },
        items: [
          SW("show_header_donate", "Show the donate button in the header"),
          SW("show_floating_donate", "Show the floating donate button on every page"),
          T("header_donate_label", "Donate button text", "Leave blank to use the standard label."),
        ],
      },
      {
        section: "Floating WhatsApp button",
        preview: { path: "", anchor: "sec-header" },
        hideNote: "Also needs the WhatsApp number set under General → Contact details.",
        items: [
          SW("show_floating_whatsapp", "Show a floating WhatsApp button on every page", "Uses the WhatsApp number set under General → Contact details."),
          TA("floating_whatsapp_message", "Pre-filled message", "Optional. Fills the chat's first message when someone taps the button."),
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- Footer */
  {
    slug: "footer",
    title: "Footer",
    description: "Everything in the site footer.",
    sections: [
      {
        section: "About column",
        preview: { path: "", anchor: "sec-footer" },
        hideNote: "Leave blank to fall back to the tagline; clear both to hide the text.",
        items: [TA("footer_about", "Text under the logo")],
      },
      {
        section: "Link columns",
        preview: { path: "", anchor: "sec-footer" },
        items: [
          SW("show_footer_explore", "Show the Explore column"),
          SW("show_footer_involved", "Show the Get Involved column"),
          SW("show_footer_social", "Show social media icons"),
        ],
      },
      {
        section: "Newsletter",
        preview: { path: "", anchor: "sec-footer" },
        hideNote: "Turn off, or clear the heading, to hide the newsletter sign-up.",
        items: [
          SW("show_footer_newsletter", "Show the newsletter sign-up"),
          T("footer_newsletter_title", "Newsletter heading"),
          TA("footer_newsletter_text", "Newsletter description", "Optional line above the email box."),
        ],
      },
      {
        section: "Bottom bar",
        preview: { path: "", anchor: "sec-footer-bottom" },
        items: [
          T("footer_copyright", "Copyright line", "The year is added automatically. Blank hides it."),
          T("footer_credit", "Extra credit line", "Optional second line."),
        ],
      },
    ],
  },

  /* -------------------------------------------------------------- Home page */
  {
    slug: "home",
    title: "Home Page",
    description:
      "Every section of the home page, top to bottom. Each one hides itself when its content is empty.",
    sections: [
      {
        section: "Hero",
        preview: { path: "", anchor: "sec-hero" },
        hideNote: "Clear the title to hide the whole hero.",
        items: [
          TA(
            "hero_title",
            "Title",
            "Shown as the large homepage headline. Recommended: Empowering Change, Inspiring Hope. Line breaks are preserved for other titles."
          ),
          TA("hero_subtitle", "Subtitle"),
          T("hero_scroll_label", "Scroll prompt", "Blank hides the scroll control."),
          IMG(
            "hero_image",
            "Gallery photograph 1",
            "Use a warm, authentic people-focused image."
          ),
          IMG(
            "hero_rights_image",
            "Gallery photograph 2",
            "Shown in the second vertical image strip."
          ),
          IMG(
            "hero_opportunity_image",
            "Gallery photograph 3",
            "Shown in the central vertical image strip."
          ),
          IMG(
            "hero_community_image",
            "Gallery photograph 4",
            "Shown in the fourth vertical image strip."
          ),
          IMG(
            "hero_dignity_image",
            "Gallery photograph 5",
            "Shown in the final vertical image strip."
          ),
          T("hero_cta1_label", "Primary button text", "Leave blank to hide the button."),
          P("hero_cta1_link", "Primary button link", "Relative path such as /contact, or a full URL."),
          T("hero_cta2_label", "Secondary button text", "Leave blank to hide the button."),
          P("hero_cta2_link", "Secondary button link"),
        ],
      },
      {
        section: "Who we are",
        preview: { path: "", anchor: "sec-about" },
        hideNote: AUTO_HIDE,
        items: [
          SW("show_home_about", "Show this section"),
          T("home_about_eyebrow", "Small label above the heading"),
          T("home_about_title", "Heading", "Leave blank to use the organisation name."),
          TA("home_about_text", "Body text", "Leave blank to use the About page overview."),
        ],
      },
      {
        section: "Impact numbers",
        preview: { path: "", anchor: "sec-stats" },
        hideNote: AUTO_HIDE_LIST + " Manage the numbers under Content → Impact Stats.",
        items: [
          SW("show_home_stats", "Show this section"),
          T("home_stats_eyebrow", "Small label above the heading"),
          T("home_stats_title", "Heading"),
          IMG("home_stats_image", "Background image"),
        ],
      },
      {
        section: "Services",
        preview: { path: "", anchor: "sec-services" },
        hideNote: AUTO_HIDE_LIST + " Manage them under Content → Services.",
        items: [
          SW("show_home_services", "Show this section"),
          T("home_services_eyebrow", "Small label above the heading"),
          T("home_services_title", "Heading"),
          TA("home_services_text", "Intro text", "Optional."),
          NUM("home_services_count", "How many to show", "Default 6."),
          T("home_services_link_label", "View-all button text", "Blank hides the button."),
        ],
      },
      {
        section: "Featured projects",
        preview: { path: "", anchor: "sec-projects" },
        hideNote: AUTO_HIDE_LIST + " Manage them under Content → Projects.",
        items: [
          SW("show_home_projects", "Show this section"),
          T("home_projects_eyebrow", "Small label above the heading"),
          T("home_projects_title", "Heading"),
          TA("home_projects_text", "Intro text", "Optional."),
          NUM("home_projects_count", "How many to show", "Default 4."),
          T("home_projects_link_label", "View-all button text", "Blank hides the button."),
        ],
      },
      {
        section: "Get in touch band",
        preview: { path: "", anchor: "sec-contact" },
        hideNote: AUTO_HIDE,
        items: [
          SW("show_home_contact", "Show this section"),
          T("home_contact_eyebrow", "Small label above the heading"),
          T("home_contact_title", "Heading"),
          TA("home_contact_text", "Body text"),
          T("home_contact_card_title", "Red card heading", "e.g. Call Us"),
        ],
      },
      {
        section: "Testimonials",
        preview: { path: "", anchor: "sec-testimonials" },
        hideNote: AUTO_HIDE_LIST + " Manage them under Content → Testimonials.",
        items: [
          SW("show_home_testimonials", "Show this section"),
          T("home_testimonials_eyebrow", "Small label above the heading"),
          T("home_testimonials_title", "Heading"),
        ],
      },
      {
        section: "Latest news",
        preview: { path: "", anchor: "sec-news" },
        hideNote: AUTO_HIDE_LIST + " Manage articles under Content → News.",
        items: [
          SW("show_home_news", "Show this section"),
          T("home_news_eyebrow", "Small label above the heading"),
          T("home_news_title", "Heading"),
          NUM("home_news_count", "How many to show", "Default 3."),
          T("home_news_facebook_label", "Facebook button text", "Blank hides the button. The Facebook URL is managed under General settings."),
        ],
      },
      {
        section: "Upcoming events",
        preview: { path: "", anchor: "sec-events" },
        hideNote: AUTO_HIDE_LIST + " Manage events under Content → Events.",
        items: [
          SW("show_home_events", "Show this section"),
          T("home_events_eyebrow", "Small label above the heading"),
          T("home_events_title", "Heading"),
          NUM("home_events_count", "How many to show", "Default 2."),
          T("home_events_link_label", "View-all button text", "Blank hides the button."),
        ],
      },
      {
        section: "Partners",
        preview: { path: "", anchor: "sec-partners" },
        hideNote: AUTO_HIDE_LIST + " Manage them under Content → Partners.",
        items: [
          SW("show_home_partners", "Show this section"),
          T("home_partners_eyebrow", "Small label above the heading"),
          T("home_partners_title", "Heading"),
        ],
      },
      {
        section: "Donate call to action",
        preview: { path: "", anchor: "sec-donate" },
        hideNote: AUTO_HIDE,
        items: [
          SW("show_home_donate", "Show this section"),
          T("home_donate_title", "Heading"),
          TA("home_donate_text", "Body text"),
          T("home_donate_button", "Donate button text"),
          T("home_donate_button2", "Second button text", "Blank hides it."),
        ],
      },
    ],
  },

  /* ------------------------------------------------------------- About page */
  {
    slug: "about",
    title: "About Page",
    description: "The About Us page. Every block hides itself when its text is blank.",
    sections: [
      {
        section: "Page header",
        preview: { path: "/about", anchor: "sec-page-header" },
        items: [
          T("about_hero_title", "Page title", "Leave blank to use the menu label."),
          TA("about_hero_intro", "Intro text", "Leave blank to use the tagline."),
          IMG("about_hero_image", "Header background image"),
        ],
      },
      {
        section: "Overview",
        preview: { path: "/about", anchor: "sec-overview" },
        hideNote: AUTO_HIDE,
        items: [
          T("about_overview_title", "Heading"),
          TA("about_overview", "Text"),
          IMG("about_overview_image", "Photo"),
        ],
      },
      {
        section: "Vision & Mission",
        preview: { path: "/about", anchor: "sec-visionmission" },
        hideNote: "Each card hides itself when its text is blank.",
        items: [
          T("about_vision_title", "Vision heading"),
          TA("about_vision", "Vision text"),
          T("about_mission_title", "Mission heading"),
          TA("about_mission", "Mission text"),
        ],
      },
      {
        section: "Our values",
        preview: { path: "/about", anchor: "sec-values" },
        hideNote: AUTO_HIDE,
        items: [
          T("about_values_title", "Heading"),
          PAIRS("about_values", "Values", {
            leftLabel: "Name",
            rightLabel: "What it means",
            itemLabel: "Value",
            addLabel: "Add a value",
            help: "Each one becomes a numbered card. The numbers follow this order automatically.",
          }),
        ],
      },
      {
        section: "Communities we serve",
        preview: { path: "/about", anchor: "sec-community" },
        hideNote: AUTO_HIDE,
        items: [T("about_community_title", "Heading"), TA("about_community", "Text")],
      },
      {
        section: "Our story",
        preview: { path: "/about", anchor: "sec-history" },
        hideNote: AUTO_HIDE,
        items: [
          T("about_history_title", "Heading"),
          TA("about_history", "Text"),
          IMG("about_history_image", "Photo"),
        ],
      },
      {
        section: "Extra closing section",
        preview: { path: "/about", anchor: "sec-extra" },
        hideNote: AUTO_HIDE,
        items: [T("about_extra_title", "Heading"), TA("about_extra_text", "Text")],
      },
    ],
  },

  /* ----------------------------------------------------------- Contact page */
  {
    slug: "contact",
    title: "Contact Page",
    description: "The Contact Us page.",
    sections: [
      {
        section: "Page header",
        preview: { path: "/contact", anchor: "sec-page-header" },
        items: [
          T("contact_hero_title", "Page title"),
          TA("contact_hero_intro", "Intro text"),
          IMG("contact_hero_image", "Header background image"),
        ],
      },
      {
        section: "Contact form",
        preview: { path: "/contact", anchor: "sec-form" },
        items: [
          SW("show_contact_form", "Show the contact form"),
          T("contact_form_title", "Form heading"),
          TA("contact_form_note", "Note above the form", "Optional."),
          T("contact_success_message", "Message shown after sending"),
        ],
      },
      {
        section: "Details panel",
        preview: { path: "/contact", anchor: "sec-details" },
        items: [
          SW("show_contact_details", "Show address, phone, email and office hours"),
          T("contact_details_title", "Panel heading"),
        ],
      },
      {
        section: "Map",
        preview: { path: "/contact", anchor: "sec-map" },
        hideNote: "Hidden automatically when no Google Maps embed URL is set under General.",
        items: [SW("show_contact_map", "Show the map")],
      },
    ],
  },

  /* ------------------------------------------------------------ Donate page */
  {
    slug: "donate",
    title: "Donation Page",
    description: "The Donation page and payment options.",
    sections: [
      {
        section: "Page header",
        preview: { path: "/donate", anchor: "sec-page-header" },
        items: [
          T("donate_hero_title", "Page title"),
          TA("donate_intro", "Intro text"),
          IMG("donate_hero_image", "Header background image"),
        ],
      },
      {
        section: "Online donation",
        preview: { path: "/donate", anchor: "sec-online" },
        items: [
          SW("show_donate_online", "Show the online donation form"),
          LINES("donate_amounts", "Suggested amounts", {
            i18n: false,
            itemLabel: "Amount",
            addLabel: "Add an amount",
            help: "Numbers only, in rupees. These become the quick-pick buttons on the form.",
          }),
          TA("donate_note", "Note below the form", "Optional."),
        ],
      },
      {
        section: "Bank transfer",
        preview: { path: "/donate", anchor: "sec-bank" },
        hideNote: AUTO_HIDE,
        items: [T("donate_bank_title", "Heading"), PA("bank_details", "Bank transfer details")],
      },
      {
        section: "Why donate",
        preview: { path: "/donate", anchor: "sec-impact" },
        hideNote: AUTO_HIDE,
        items: [
          T("donate_impact_title", "Heading"),
          PAIRS("donate_impact_items", "Points", {
            leftLabel: "Heading",
            rightLabel: "Explanation",
            itemLabel: "Point",
            addLabel: "Add a point",
          }),
        ],
      },
    ],
  },

  /* ----------------------------------------------------------- Projects page */
  {
    slug: "projects",
    title: "Projects Page",
    description:
      "The Projects page header and empty state. Manage project cards and detail content under Content → Projects.",
    sections: [
      {
        section: "Page header",
        preview: { path: "/projects", anchor: "sec-page-header" },
        items: [
          T("projects_hero_title", "Page title"),
          TA("projects_hero_intro", "Intro text"),
          IMG("projects_hero_image", "Header background image"),
          T("projects_empty_text", "Message when the list is empty"),
        ],
      },
    ],
  },

  /* ----------------------------------------------------- Other page headers */
  {
    slug: "pages",
    title: "Other Pages",
    description:
      "Headers and empty-state messages for the listing pages. Each list hides itself when nothing is published.",
    sections: [
      {
        section: "Services",
        preview: { path: "/services", anchor: "sec-page-header" },
        items: [
          T("services_hero_title", "Page title"),
          TA("services_hero_intro", "Intro text"),
          IMG("services_hero_image", "Header background image"),
          T("services_empty_text", "Message when the list is empty"),
        ],
      },
      {
        section: "Publications",
        preview: { path: "/publications", anchor: "sec-page-header" },
        items: [
          T("publications_hero_title", "Page title"),
          TA("publications_hero_intro", "Intro text"),
          IMG("publications_hero_image", "Header background image"),
          T("publications_empty_text", "Message when the list is empty"),
        ],
      },
      {
        section: "News",
        preview: { path: "/news", anchor: "sec-page-header" },
        items: [
          T("news_hero_title", "Page title"),
          TA("news_hero_intro", "Intro text"),
          IMG("news_hero_image", "Header background image"),
          T("news_empty_text", "Message when the list is empty"),
        ],
      },
      {
        section: "Events & Gallery",
        preview: { path: "/events", anchor: "sec-page-header" },
        items: [
          T("events_hero_title", "Page title"),
          TA("events_hero_intro", "Intro text"),
          IMG("events_hero_image", "Header background image"),
          T("events_empty_text", "Message when the list is empty"),
          SW("show_gallery", "Show the photo gallery"),
          T("gallery_title", "Gallery heading"),
        ],
      },
      {
        section: "Suggestions",
        preview: { path: "/suggestions", anchor: "sec-page-header" },
        items: [
          T("suggestions_hero_title", "Page title"),
          TA("suggestions_hero_intro", "Intro text"),
          IMG("suggestions_hero_image", "Header background image"),
          T("suggestions_success_message", "Message shown after sending"),
        ],
      },
      {
        section: "Privacy Policy",
        preview: { path: "/privacy", anchor: "sec-page-header" },
        hideNote: AUTO_HIDE,
        items: [
          T("privacy_title", "Page title"),
          RT("privacy_body", "Page content"),
        ],
      },
      {
        section: "Terms & Conditions",
        preview: { path: "/terms", anchor: "sec-page-header" },
        hideNote: AUTO_HIDE,
        items: [
          T("terms_title", "Page title"),
          RT("terms_body", "Page content"),
        ],
      },
    ],
  },

  /* ------------------------------------------------------ Social Enterprise */
  {
    slug: "business",
    title: "Social Enterprise",
    description:
      "Manage the NELUME page, its photography, impact story, services presentation and appointment booking copy.",
    sections: [
      {
        section: "Hero",
        preview: { path: "/business", anchor: "sec-page-header" },
        items: [
          T("business_hero_title", "Page title", "Large brand name in the hero, e.g. NELUME."),
          T("business_hero_tagline", "Hero tagline", "Shown under the title, e.g. Beauty, Wellness & Opportunity."),
          T("business_hero_eyebrow", "Hero eyebrow", "Small all-caps line above the page title."),
          TA("business_hero_intro", "Intro text"),
          IMG("business_hero_image", "Hero photo", "Full-height lifestyle photo on the right of the hero (spa / wellness)."),
        ],
      },
      {
        section: "Story",
        preview: { path: "/business", anchor: "sec-story" },
        items: [
          T("business_about_title", "About heading", "Use a new line to split into two lines. The second line renders in italic."),
          TA("business_about_body", "About body", "2–3 short paragraphs. Blank lines start a new paragraph."),
          IMG("business_about_image", "About collage — top", "Large top photo in the story collage."),
          IMG("business_about_image_2", "About collage — bottom left", "Bottom-left photo in the story collage."),
          IMG("business_about_image_3", "About collage — bottom right", "Optional bottom-right photo. Leave blank for a two-image collage."),
        ],
      },
      {
        section: "Impact",
        preview: { path: "/business", anchor: "sec-impact" },
        items: [
          T("business_impact_title", "Impact section heading", "Use a new line so “Social Impact” can sit on its own italic line."),
          TA("business_impact_body", "Impact section body", "Short explanation of the social-enterprise model."),
          LINES("business_impact_flow", "Impact journey labels", {
            itemLabel: "Stage",
            addLabel: "Add a stage",
            help: "Five labels shown in order across the impact journey: customer, business, revenue, employment and community impact.",
          }),
        ],
      },
      {
        section: "Opportunity",
        preview: { path: "/business", anchor: "sec-opportunity" },
        items: [
          T("business_opportunity_title", "Opportunity heading"),
          TA("business_opportunity_body", "Opportunity body"),
          IMG("business_opportunity_image", "Opportunity photo", "Hands holding a lotus, or similar botanical / human moment."),
          T("business_objectives_title", "Objectives heading"),
          PAIRS("business_objectives", "Objectives", {
            leftLabel: "Objective",
            rightLabel: "Description",
            itemLabel: "Objective",
            addLabel: "Add an objective",
          }),
        ],
      },
      {
        section: "Services & Booking",
        preview: { path: "/business", anchor: "sec-services" },
        items: [
          T("business_services_title", "Services heading", "Use a new line for a second italic line. Service cards are managed under Nail Spa Services."),
          T("business_services_cta_label", "Booking button text", "Opens the appointment drawer without preselecting a service. Leave blank to hide it."),
          SW("business_booking_show", "Show appointment booking", "Displays booking actions for published, in-stock Nail Spa Services."),
          T("business_booking_eyebrow", "Booking eyebrow"),
          T("business_booking_title", "Booking heading"),
          TA("business_booking_body", "Booking introduction"),
          T("business_location", "Location / service area", "Shown near the booking section, e.g. an address or the areas you serve. Leave blank to hide."),
          TA("business_hours", "Operating hours", "One line per row, e.g. \"Tuesday – Saturday: 9:00 AM – 6:00 PM\". Leave blank to hide."),
          T("business_booking_days", "Available booking days", "Short line shown next to the date field, e.g. \"Tuesday – Saturday\". Leave blank to hide."),
          LINES("business_booking_slots", "Available time slots", {
            itemLabel: "Time slot",
            addLabel: "Add a time slot",
            i18n: false,
            help: "Shown in the appointment form's time dropdown, in this order. Leave empty to use the default slots (9:00 AM – 5:00 PM).",
          }),
          P("business_booking_email", "Booking requests email", "Shown to visitors as a direct way to reach you, alongside the online form. Leave blank to hide."),
          P("business_booking_whatsapp", "Booking requests WhatsApp number", "Shown to visitors as a direct way to reach you, with a tap-to-chat link. Include the country code, e.g. +94771234567. Leave blank to hide."),
          T("business_booking_form_title", "Booking form heading"),
          T("business_booking_form_intro", "Booking form helper text"),
          T("business_booking_submit_label", "Booking submit button"),
          T("business_booking_success_title", "Booking success heading"),
          TA("business_booking_success_body", "Booking success message"),
        ],
      },
      {
        section: "Values & CTA",
        preview: { path: "/business", anchor: "sec-values" },
        items: [
          PAIRS("business_values", "Values", {
            leftLabel: "Value",
            rightLabel: "Caption",
            itemLabel: "Value",
            addLabel: "Add a value",
            help: "Three short values shown in the band near the bottom. Use the caption for words such as “Always”.",
          }),
          T("business_cta_title", "Final call-to-action heading"),
          TA("business_cta_body", "Final call-to-action body", "Use a new line to break the sentence elegantly."),
          IMG("business_cta_image", "Final call-to-action photo", "Warm spa interior shown on the left of the closing CTA."),
          T("business_cta_primary_label", "Final primary button"),
          T("business_cta_secondary_label", "Final secondary button"),
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ Coming Soon */
  {
    slug: "coming-soon",
    title: "Coming Soon Mode",
    description:
      "Show a single holding page to every visitor instead of the site. Turn this on before launch, or any time the site needs to come down for a while — you'll still be able to sign in here and manage everything as normal.",
    sections: [
      {
        section: "Coming Soon mode",
        preview: { path: "/coming-soon", anchor: "sec-coming-soon" },
        items: [
          SW(
            "show_coming_soon",
            "Enable Coming Soon mode",
            "When on, every visitor sees the page below instead of the site. Signed-in admins still see the real site so you can keep working and preview changes."
          ),
          T("coming_soon_eyebrow", "Small label above the heading"),
          T("coming_soon_title", "Heading", "Leave blank to use the organisation name."),
          TA("coming_soon_text", "Message"),
          IMG("coming_soon_image", "Background photo", "Optional. Shown faded behind the message."),
        ],
      },
    ],
  },
];

/** Every setting definition, flattened. */
export const allSettingDefs: SettingDef[] = settingPages.flatMap((p) =>
  p.sections.flatMap((sec) => sec.items)
);

export function getSettingPage(slug: string): SettingPage | undefined {
  return settingPages.find((p) => p.slug === slug);
}

export function getSettingDef(key: string): SettingDef | undefined {
  return allSettingDefs.find((d) => d.key === key);
}

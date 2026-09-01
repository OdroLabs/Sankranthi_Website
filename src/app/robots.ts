import type { MetadataRoute } from "next";
import { getSettings, sBool } from "@/lib/settings";

/**
 * Mirrors the per-page `robots` meta tag in `[locale]/layout.tsx`: indexing
 * is controlled from Settings → General → "Allow search engines to index
 * this site", and Coming Soon mode always blocks indexing on top of that.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const allowIndexing =
    sBool(settings, "seo_allow_indexing", true) && !sBool(settings, "show_coming_soon", false);

  if (!allowIndexing) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
  };
}

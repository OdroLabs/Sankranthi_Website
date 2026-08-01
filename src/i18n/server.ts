import { cookies } from "next/headers";
import { defaultLocale, locales, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value as Locale | undefined;
  return value && locales.includes(value) ? value : defaultLocale;
}

export async function getDict(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale];
}

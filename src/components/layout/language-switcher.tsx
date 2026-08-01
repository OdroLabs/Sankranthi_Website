"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, localeNames, LOCALE_COOKIE, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function choose(l: Locale) {
    if (l === current) return;
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000`;
    start(() => router.refresh());
  }

  return (
    <div className="language-switcher" aria-label="Language selector" data-pending={pending}>
      {locales.map((l) => (
        <a
          key={l}
          href="#"
          lang={l}
          className={l === current ? "lang-active" : undefined}
          onClick={(e) => {
            e.preventDefault();
            choose(l);
          }}
        >
          {localeNames[l]}
        </a>
      ))}
    </div>
  );
}

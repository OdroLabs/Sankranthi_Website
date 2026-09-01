"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = { en: "English", si: "සිංහල", ta: "தமிழ்" };

export function LocaleSwitcher({ current, dark }: { current: string; dark?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: string) {
    const parts = pathname.split("/");
    parts[1] = locale;
    router.push(parts.join("/") || `/${locale}`);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full p-0.5 text-xs",
        dark ? "bg-white/10" : "bg-muted"
      )}
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={current === l ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 font-semibold transition-colors",
            current === l
              ? dark
                ? "bg-white text-charcoal-900 shadow-sm"
                : "bg-white text-primary shadow-sm"
              : dark
                ? "text-white/70 hover:text-white"
                : "text-muted-foreground hover:text-primary"
          )}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}

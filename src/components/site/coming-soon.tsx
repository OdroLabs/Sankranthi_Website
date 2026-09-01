import { Facebook, Youtube, Instagram, Twitter, Linkedin, Music2, Mail, Heart } from "lucide-react";
import { s } from "@/lib/settings";
import type { SettingsMap } from "@/lib/settings";
import { buildSocials } from "@/lib/nav";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Music2,
};

const SOCIAL_HOVER_BG = [
  "hover:bg-pride-pink",
  "hover:bg-pride-orange",
  "hover:bg-pride-yellow",
  "hover:bg-teal-500",
  "hover:bg-pride-blue",
  "hover:bg-pride-violet",
];

/**
 * Full-page holding screen shown to every visitor while Coming Soon mode is
 * on (see Settings → Coming Soon Mode). Content is entirely settings-driven,
 * same as the rest of the site — nothing here is hardcoded copy.
 */
export function ComingSoon({ locale, settings }: { locale: string; settings: SettingsMap }) {
  const siteName = s(settings, "site_name", locale);
  const shortName = s(settings, "site_short_name");
  const logoImage = s(settings, "logo_image_light") || s(settings, "logo_image");
  const logoLetter = s(settings, "logo_letter");

  const eyebrow = s(settings, "coming_soon_eyebrow", locale);
  const title = s(settings, "coming_soon_title", locale) || siteName;
  const text = s(settings, "coming_soon_text", locale);
  const image = s(settings, "coming_soon_image");

  const email = s(settings, "email");
  const socials = buildSocials(settings);
  const year = new Date().getFullYear();

  return (
    <section
      id="sec-coming-soon"
      className="bg-grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-navy-950 px-4 py-20 text-center text-white md:px-6"
    >
      {/* Optional background photo, sitting under the gradient */}
      {image && (
        <div
          className="absolute -inset-y-[10%] inset-x-0 scale-110 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Background gradient — deep navy through violet, same treatment as PageHero */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-navy-950 via-brand-900 to-navy-800 ${image ? "opacity-85" : ""}`}
      />

      {/* Rainbow glow blooms */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-pride-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-pride-yellow/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
        <div className="mb-8 flex items-center gap-2.5">
          {logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoImage} alt={shortName || siteName} className="h-11 w-auto max-w-[190px] object-contain" />
          ) : (
            <>
              {logoLetter && (
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-spectrum text-lg font-bold shadow-glow">
                  {logoLetter}
                </span>
              )}
              {shortName && <span className="text-xl font-extrabold tracking-tight">{shortName}</span>}
            </>
          )}
        </div>

        {eyebrow && (
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em]">
            <span className="h-px w-8 bg-spectrum" />
            <span className="bg-spectrum bg-clip-text text-transparent">{eyebrow}</span>
            <span className="h-px w-8 bg-spectrum" />
          </p>
        )}

        {title && (
          <h1 className="text-display-hero font-serif font-medium tracking-tight">{title}</h1>
        )}

        <span className="mx-auto my-6 block h-1 w-20 rounded-full bg-pride-flag" />

        {text && (
          <p className="max-w-xl whitespace-pre-line text-base leading-relaxed text-white/70 md:text-lg">
            {text}
          </p>
        )}

        {(email || socials.length > 0) && (
          <div className="mt-10 flex flex-col items-center gap-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-accent" />
                {email}
              </a>
            )}
            {socials.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {socials.map((social, index) => {
                  const Icon = SOCIAL_ICONS[social.key] ?? Heart;
                  const hoverBg = SOCIAL_HOVER_BG[index % SOCIAL_HOVER_BG.length];
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:text-navy-950 ${hoverBg}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <p className="mt-14 text-xs text-white/40">
          © {year} {siteName || shortName}
        </p>
      </div>
    </section>
  );
}

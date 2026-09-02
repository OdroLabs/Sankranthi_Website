import Link from "next/link";
import { ArrowDown, ArrowRight, HandHeart, Heart, Users } from "lucide-react";
import styles from "./home-editorial-hero.module.css";

type HomeEditorialHeroProps = {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  galleryImages?: string[];
  supportText?: string;
  promiseLabel?: string;
  noteTitle?: string;
  noteText?: string;
  scrollLabel?: string;
  impactStats?: Array<{ value: string; label: string }>;
};

function highlightedTitle(title?: string) {
  if (!title) return null;
  const normalized = title.replace(/\s+/g, " ").trim();
  if (/^Empowering Change,? Inspiring Hope$/i.test(normalized)) {
    return (
      <>
        <span className={styles.titleLine}>Empowering</span>
        <span className={styles.titleLine}>Change,</span>
        <span className={styles.titleLine}>Inspiring Hope</span>
      </>
    );
  }

  const match = normalized.match(/transition,?/i);
  if (!match || match.index === undefined) return normalized;

  const before = normalized.slice(0, match.index);
  const after = normalized.slice(match.index + match[0].length);
  return <>{before}<em>{match[0]}</em>{after}</>;
}

export function HomeEditorialHero({
  badge,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  galleryImages = [],
  supportText,
  promiseLabel,
  noteTitle,
  noteText,
  scrollLabel,
  impactStats = [],
}: HomeEditorialHeroProps) {
  const supportingImages = galleryImages
    .filter((value): value is string => Boolean(value))
    .filter((value, index, items) => items.indexOf(value) === index);
  const stripImages = Array.from(
    { length: 5 },
    (_, index) => supportingImages[index % Math.max(supportingImages.length, 1)]
  ).filter((value): value is string => Boolean(value));

  return (
    <section id="sec-hero" className={styles.hero}>
      {promiseLabel && (
        <aside className={styles.promiseRail} aria-hidden>
          <Heart />
          <span>{promiseLabel}</span>
        </aside>
      )}

      <div className={styles.inner}>
        <div className={styles.copy}>
          {badge && <p className={styles.eyebrow}>{badge}</p>}
          {title && <h1 className={styles.title}>{highlightedTitle(title)}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {(primaryAction || secondaryAction) && (
            <div className={styles.actions}>
              {primaryAction && (
                <Link className={styles.primary} href={primaryAction.href}>
                  {primaryAction.label}
                  <ArrowRight aria-hidden />
                </Link>
              )}
              {secondaryAction && (
                <Link className={styles.secondary} href={secondaryAction.href}>
                  <span className={styles.secondaryIcon}><HandHeart aria-hidden /></span>
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
          {(supportText || supportingImages.length > 0) && (
            <div className={styles.support}>
              {supportingImages.length > 0 && (
                <span className={styles.avatars} aria-hidden>
                  {supportingImages.slice(0, 3).map((src) => <img key={src} src={src} alt="" />)}
                </span>
              )}
              {supportText && <span>{supportText}</span>}
            </div>
          )}
        </div>

        {stripImages.length > 0 && (
          <div className={styles.visual}>
            <span className={styles.visualRing} aria-hidden />
            <div className={styles.imageStrips}>
              {stripImages.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  className={styles.imageStrip}
                  aria-label={`Expand gallery image ${index + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={index === 2 ? title || badge || "Sankranthi Foundation" : ""}
                    aria-hidden={index !== 2}
                  />
                </button>
              ))}
            </div>
            {(noteTitle || noteText) && (
              <aside className={styles.note}>
                <span className={styles.noteIcon}><HandHeart aria-hidden /></span>
                <span>
                  {noteTitle && <strong>{noteTitle}</strong>}
                  {noteText}
                </span>
              </aside>
            )}
          </div>
        )}
      </div>

      {impactStats.length > 0 && (
        <aside className={styles.impactRail} aria-label="Community impact">
          {impactStats.slice(0, 2).map((stat, index) => (
            <div key={`${stat.label}-${index}`} className={styles.impactItem}>
              <span className={styles.impactIcon}>
                {index === 0 ? <Users aria-hidden /> : <HandHeart aria-hidden />}
              </span>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </aside>
      )}

      {scrollLabel && (
        <Link className={styles.scrollCue} href="#sec-about" aria-label={scrollLabel}>
          <span>{scrollLabel}</span>
          <span className={styles.scrollButton}><ArrowDown aria-hidden /></span>
        </Link>
      )}
    </section>
  );
}
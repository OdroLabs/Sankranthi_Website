import Link from "next/link";
import { ArrowDown, ArrowRight, HandHeart } from "lucide-react";
import styles from "./home-editorial-hero.module.css";

type HomeEditorialHeroProps = {
  title?: string;
  subtitle?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  galleryImages?: string[];
  scrollLabel?: string;
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
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  galleryImages = [],
  scrollLabel,
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
      <div className={styles.inner}>
        <div className={styles.copy}>
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
                    alt={index === 2 ? title || "Sankranthi Foundation" : ""}
                    aria-hidden={index !== 2}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {scrollLabel && (
        <Link className={styles.scrollCue} href="#sec-about" aria-label={scrollLabel}>
          <span>{scrollLabel}</span>
          <span className={styles.scrollButton}><ArrowDown aria-hidden /></span>
        </Link>
      )}
    </section>
  );
}
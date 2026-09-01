"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import styles from "./home-hero.module.css";

export type HeroChapter = {
  label?: string;
  title?: string;
  text?: string;
  image?: string;
  points?: string[];
};

type HomeHeroProps = {
  image?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  footnote?: string;
  supportImage?: string;
  chapters?: HeroChapter[];
};

/** Plateau opacity curve: fade in → hold to read → fade out. */
function usePlateauOpacity(
  progress: MotionValue<number>,
  fadeInStart: number,
  holdStart: number,
  holdEnd: number,
  fadeOutEnd: number
) {
  return useTransform(progress, (value) => {
    if (value <= fadeInStart) return 0;
    if (value < holdStart) {
      return (value - fadeInStart) / Math.max(holdStart - fadeInStart, 0.0001);
    }
    if (value <= holdEnd) return 1;
    if (value < fadeOutEnd) {
      return 1 - (value - holdEnd) / Math.max(fadeOutEnd - holdEnd, 0.0001);
    }
    return 0;
  });
}

function splitHeadline(title: string) {
  return title
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

function cleanLabel(label?: string, fallback = "") {
  if (!label) return fallback;
  return label.replace(/^\d+\s*[·.\-]\s*/u, "").trim() || fallback;
}

function ChapterCopy({
  index,
  chapter,
}: {
  index: number;
  chapter: HeroChapter;
}) {
  return (
    <div className={styles.copyBlock}>
      <p className={styles.chapterLabel}>
        <span>{pad(index)}</span>
        {cleanLabel(chapter.label, `Chapter ${index + 1}`)}
      </p>
      {chapter.title && <h2 className={styles.chapterTitle}>{chapter.title}</h2>}
      {chapter.text && <p className={styles.chapterBody}>{chapter.text}</p>}
      {chapter.points && chapter.points.length > 0 && (
        <ul className={styles.chapterPoints}>
          {chapter.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const CHAPTER_HOLDS = [0.3, 0.58, 0.84];

function ChapterBar({
  chapters,
  activeIndex,
  visible,
  onSelect,
}: {
  chapters: HeroChapter[];
  activeIndex: number;
  visible: boolean;
  onSelect: (index: number) => void;
}) {
  if (chapters.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className={styles.chapterBar}
          aria-label="Connection, Support, Empowerment"
          initial={{ opacity: 0, y: 12, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 8, x: "-50%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {chapters.map((chapter, index) => {
            const active = activeIndex === index;
            return (
              <button
                key={`bar-${chapter.title || chapter.label || index}`}
                type="button"
                className={active ? styles.chapterBarActive : undefined}
                aria-current={active ? "true" : undefined}
                onClick={() => onSelect(index)}
              >
                {active && (
                  <motion.span
                    layoutId="hero-chapter-bar-pill"
                    className={styles.chapterBarPill}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span>{cleanLabel(chapter.label, `Chapter ${index + 1}`)}</span>
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export function HomeHero({
  image,
  badge,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  footnote,
  supportImage,
  chapters = [],
}: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [adminPreview, setAdminPreview] = useState(false);
  const [canPin, setCanPin] = useState(false);
  const [activeScene, setActiveScene] = useState(0);

  const quiet = Boolean(reduceMotion) || adminPreview;
  const pin = canPin && !quiet && chapters.length > 0;
  const titleLines = title ? splitHeadline(title) : [];
  const collageSecondary = supportImage && supportImage !== image ? supportImage : undefined;
  const altBase = title || badge || "Sankranthi Foundation";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    restDelta: 0.001,
  });

  /**
   * Video-style timeline (3 chapters):
   * Intro hold → Ch1 hold → Ch2 hold → Ch3 hold → soft exit.
   * Long plateaus so people can actually read.
   */
  const introOpacity = usePlateauOpacity(progress, -0.01, 0, 0.14, 0.24);
  const chapterOps = [
    usePlateauOpacity(progress, 0.16, 0.24, 0.42, 0.52),
    usePlateauOpacity(progress, 0.44, 0.52, 0.7, 0.8),
    usePlateauOpacity(progress, 0.72, 0.8, 0.94, 1.01),
  ];

  const washA = useTransform(progress, [0, 0.35, 0.65, 1], ["#E5F5EF", "#FFF1E4", "#F3E9FF", "#F7FBFA"]);
  const washB = useTransform(progress, [0, 0.35, 0.65, 1], ["#EAF6FF", "#FFE8F0", "#E7F6F0", "#FFF9F5"]);
  const stageBackground = useMotionTemplate`linear-gradient(158deg, ${washA} 0%, ${washB} 100%)`;
  const cueOpacity = useTransform(progress, [0, 0.1, 0.18], [1, 0.85, 0]);
  const threadScale = useTransform(progress, [0, 1], [0.2, 1]);
  const sceneLift = useTransform(progress, [0.92, 1], [0, -24]);

  useMotionValueEvent(progress, "change", (value) => {
    if (!pin) return;
    if (value < 0.2) setActiveScene(0);
    else if (value < 0.48) setActiveScene(1);
    else if (value < 0.76) setActiveScene(2);
    else setActiveScene(3);
  });

  useEffect(() => {
    setAdminPreview(new URLSearchParams(window.location.search).has("adminPreview"));
    const desktop = window.matchMedia("(min-width: 900px)");
    const sync = () => setCanPin(desktop.matches);
    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);

  const scrubTo = useCallback(
    (ratio: number) => {
      const root = sectionRef.current;
      if (!root) return;
      const start = root.offsetTop;
      const travel = Math.max(root.offsetHeight - window.innerHeight, 0);
      window.scrollTo({
        top: start + travel * ratio,
        behavior: quiet ? "auto" : "smooth",
      });
    },
    [quiet]
  );

  const onCueClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (pin) {
        scrubTo(CHAPTER_HOLDS[0]);
        return;
      }
      document.getElementById("hero-chapter-1")?.scrollIntoView({
        behavior: quiet ? "auto" : "smooth",
        block: "start",
      });
    },
    [pin, quiet, scrubTo]
  );

  const onChapterSelect = useCallback(
    (index: number) => {
      if (pin) {
        scrubTo(CHAPTER_HOLDS[index] ?? CHAPTER_HOLDS[0]);
        return;
      }
      document.getElementById(`hero-chapter-${index + 1}`)?.scrollIntoView({
        behavior: quiet ? "auto" : "smooth",
        block: "start",
      });
    },
    [pin, quiet, scrubTo]
  );

  const sceneCount = chapters.length;
  const pinHeight = useMemo(() => {
    if (!pin) return undefined;
    // ~1 viewport per beat (intro + chapters) for a cinematic scrub.
    return `${Math.max(2.6, 1.15 + sceneCount * 0.95) * 100}vh`;
  }, [pin, sceneCount]);

  return (
    <section
      ref={sectionRef}
      id="sec-hero"
      className={`${styles.experience} ${pin ? styles.experiencePin : styles.experienceFlow}`}
      style={pinHeight ? { height: pinHeight } : undefined}
    >
      <motion.div
        className={`${styles.stage} ${pin ? styles.stageSticky : ""}`}
        style={pin ? { background: stageBackground } : undefined}
      >
        <div className={styles.blobs} aria-hidden>
          <span className={`${styles.blob} ${styles.blobPink}`} />
          <span className={`${styles.blob} ${styles.blobMint}`} />
          <span className={`${styles.blob} ${styles.blobLavender}`} />
          <span className={`${styles.blob} ${styles.blobYellow}`} />
        </div>

        <ChapterBar
          chapters={chapters}
          activeIndex={pin ? activeScene - 1 : -1}
          visible={pin && activeScene >= 1}
          onSelect={onChapterSelect}
        />

        {/* -------- Desktop / pinned cinematic stack -------- */}
        {pin ? (
          <motion.div className={styles.sceneStack} style={{ y: sceneLift }}>
            <motion.div
              className={`${styles.scene} ${styles.sceneIntro}`}
              style={{ opacity: introOpacity }}
              aria-hidden={activeScene !== 0}
            >
              <div className={styles.sceneGrid}>
                <div className={styles.slotCopy}>
                  {badge && (
                    <p className={styles.eyebrow}>
                      <span aria-hidden />
                      {badge}
                    </p>
                  )}
                  {titleLines.length > 0 && (
                    <h1 className={styles.headline}>
                      {titleLines.map((line, index) => (
                        <span key={`${line}-${index}`} className={styles.headlineLine}>
                          {line}
                        </span>
                      ))}
                    </h1>
                  )}
                  {subtitle && <p className={styles.lede}>{subtitle}</p>}
                  {(primaryAction || secondaryAction) && (
                    <div className={styles.actions}>
                      {primaryAction && (
                        <Link className={styles.ctaPrimary} href={primaryAction.href}>
                          <span>{primaryAction.label}</span>
                          <ArrowRight aria-hidden />
                        </Link>
                      )}
                      {secondaryAction && (
                        <Link className={styles.ctaSecondary} href={secondaryAction.href}>
                          <span>{secondaryAction.label}</span>
                          <ArrowRight aria-hidden />
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {image && (
                  <div className={styles.slotVisual}>
                    <div className={styles.collage}>
                      <figure className={styles.framePrimary}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={altBase} />
                      </figure>
                      {collageSecondary && (
                        <figure className={styles.frameSmall} aria-hidden>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={collageSecondary} alt="" />
                        </figure>
                      )}
                      <aside className={styles.peopleCard}>
                        <span>People before programmes.</span>
                        {footnote && <strong>{footnote}</strong>}
                      </aside>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {chapters.map((chapter, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.div
                  key={`scene-${chapter.title || chapter.label || index}`}
                  className={`${styles.scene} ${reverse ? styles.sceneReverse : ""}`}
                  style={{ opacity: chapterOps[index] }}
                  aria-hidden={activeScene !== index + 1}
                >
                  <div className={styles.sceneGrid}>
                    <div className={styles.slotCopy}>
                      <ChapterCopy index={index} chapter={chapter} />
                    </div>
                    {chapter.image && (
                      <div className={styles.slotVisual}>
                        <figure className={styles.chapterFigure}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={chapter.image}
                            alt={chapter.title || cleanLabel(chapter.label, altBase)}
                          />
                        </figure>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* -------- Mobile / reduced-motion readable flow -------- */
          <div className={styles.flowStack}>
            <div className={styles.sceneGrid}>
              <div className={styles.slotCopy}>
                {badge && (
                  <p className={styles.eyebrow}>
                    <span aria-hidden />
                    {badge}
                  </p>
                )}
                {titleLines.length > 0 && (
                  <h1 className={styles.headline}>
                    {titleLines.map((line, index) => (
                      <span key={`${line}-${index}`} className={styles.headlineLine}>
                        {line}
                      </span>
                    ))}
                  </h1>
                )}
                {subtitle && <p className={styles.lede}>{subtitle}</p>}
                {(primaryAction || secondaryAction) && (
                  <div className={styles.actions}>
                    {primaryAction && (
                      <Link className={styles.ctaPrimary} href={primaryAction.href}>
                        <span>{primaryAction.label}</span>
                        <ArrowRight aria-hidden />
                      </Link>
                    )}
                    {secondaryAction && (
                      <Link className={styles.ctaSecondary} href={secondaryAction.href}>
                        <span>{secondaryAction.label}</span>
                        <ArrowRight aria-hidden />
                      </Link>
                    )}
                  </div>
                )}
              </div>
              {image && (
                <div className={styles.slotVisual}>
                  <div className={styles.collage}>
                    <figure className={styles.framePrimary}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt={altBase} />
                    </figure>
                    {collageSecondary && (
                      <figure className={styles.frameSmall} aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={collageSecondary} alt="" />
                      </figure>
                    )}
                    <aside className={styles.peopleCard}>
                      <span>People before programmes.</span>
                      {footnote && <strong>{footnote}</strong>}
                    </aside>
                  </div>
                </div>
              )}
            </div>

            {chapters.map((chapter, index) => {
              const reverse = index % 2 === 1;
              return (
                <article
                  key={`flow-${chapter.title || chapter.label || index}`}
                  id={`hero-chapter-${index + 1}`}
                  className={`${styles.flowChapter} ${reverse ? styles.sceneReverse : ""}`}
                >
                  <div className={styles.sceneGrid}>
                    <div className={styles.slotCopy}>
                      <ChapterCopy index={index} chapter={chapter} />
                    </div>
                    {chapter.image && (
                      <div className={styles.slotVisual}>
                        <figure className={styles.chapterFigure}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={chapter.image}
                            alt={chapter.title || cleanLabel(chapter.label, altBase)}
                            loading="lazy"
                          />
                        </figure>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {chapters.length > 0 && (
          <motion.a
            href="#hero-chapter-1"
            className={styles.scrollCue}
            style={pin ? { opacity: cueOpacity } : undefined}
            onClick={onCueClick}
          >
            <span>Follow the living thread</span>
            <i aria-hidden />
            <ArrowDown aria-hidden />
          </motion.a>
        )}

        <div className={styles.thread} aria-hidden>
          <motion.span style={pin ? { scaleX: threadScale } : undefined} />
        </div>
      </motion.div>

      <div className={styles.exitBlend} aria-hidden />
    </section>
  );
}

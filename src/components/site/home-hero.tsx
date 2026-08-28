"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, HandHeart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./home-hero.module.css";

gsap.registerPlugin(ScrollTrigger);

type Point = { x: number; y: number };

type HomeHeroProps = {
  locale: string;
  image?: string;
  exploreHref: string;
  storyImages?: Array<string | undefined>;
};

const story = [
  {
    number: "01",
    label: "Rights & wellbeing",
    title: "Dignity begins with being heard and cared for.",
    text: "We listen without judgement, stand beside people, and connect communities with respectful advocacy, health and wellbeing support.",
    accent: "#e86f61",
    themes: [
      { name: "Rights", line: "Everyone deserves to live with dignity." },
      { name: "Health & wellbeing", line: "Care that sees the whole person." },
    ],
  },
  {
    number: "02",
    label: "Opportunity & community",
    title: "Access to opportunity helps communities grow stronger.",
    text: "Skills, livelihoods and inclusive opportunities help people build independent futures—and turn individual progress into lasting community change.",
    accent: "#2f8b72",
    themes: [
      { name: "Economic opportunity", line: "Opportunity creates independence." },
      { name: "Community & dignity", line: "Stronger people. Stronger communities." },
    ],
  },
] as const;

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
}

function buildThreadPoints(width: number, height: number): Point[] {
  const curves: [Point, Point, Point, Point][] = [
    [
      { x: width * 0.13, y: height * 0.78 },
      { x: width * 0.28, y: height * 0.69 },
      { x: width * 0.42, y: height * 0.8 },
      { x: width * 0.54, y: height * 0.68 },
    ],
    [
      { x: width * 0.54, y: height * 0.68 },
      { x: width * 0.65, y: height * 0.5 },
      { x: width * 0.82, y: height * 0.39 },
      { x: width * 0.89, y: height * 0.54 },
    ],
    [
      { x: width * 0.89, y: height * 0.49 },
      { x: width * 0.94, y: height * 0.67 },
      { x: width * 0.75, y: height * 0.76 },
      { x: width * 0.62, y: height * 0.67 },
    ],
    [
      { x: width * 0.62, y: height * 0.67 },
      { x: width * 0.46, y: height * 0.56 },
      { x: width * 0.34, y: height * 0.29 },
      { x: width * 0.18, y: height * 0.36 },
    ],
  ];

  return curves.flatMap((curve, curveIndex) =>
    Array.from({ length: 72 }, (_, index) => {
      if (curveIndex > 0 && index === 0) return null;
      return cubicPoint(curve[0], curve[1], curve[2], curve[3], index / 71);
    }).filter((point): point is Point => point !== null)
  );
}

export function HomeHero({ locale, image, exploreHref, storyImages = [] }: HomeHeroProps) {
  const experienceRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threadProgress = useRef(0);

  const drawThread = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const stage = experienceRef.current?.querySelector<HTMLElement>("[data-stage]");
    if (!canvas || !stage) return;

    const bounds = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const points = buildThreadPoints(width, height);
    const visible = Math.max(2, Math.floor(points.length * Math.min(Math.max(progress, 0), 1)));
    const gradient = context.createLinearGradient(width * 0.1, 0, width * 0.92, 0);
    gradient.addColorStop(0, "#e86f61");
    gradient.addColorStop(0.28, "#ee9c45");
    gradient.addColorStop(0.52, "#c94f83");
    gradient.addColorStop(0.76, "#2f8b72");
    gradient.addColorStop(1, "#e4b33f");

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < visible; index += 1) {
      context.lineTo(points[index].x, points[index].y);
    }
    context.strokeStyle = gradient;
    context.lineWidth = 2.2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalAlpha = 0.92;
    context.stroke();

    const end = points[visible - 1];
    context.beginPath();
    context.arc(end.x, end.y, 3.5, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.globalAlpha = 1;
    context.fill();
  }, []);

  useLayoutEffect(() => {
    const root = experienceRef.current;
    if (!root || new URLSearchParams(window.location.search).has("adminPreview")) return;

    const media = gsap.matchMedia();
    const onResize = () => drawThread(threadProgress.current);
    window.addEventListener("resize", onResize, { passive: true });

    media.add(
      {
        desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { desktop, mobile } = context.conditions as {
          desktop: boolean;
          mobile: boolean;
        };

        const heroImage = root.querySelector<HTMLElement>("[data-hero-image]");
        const label = root.querySelector<HTMLElement>("[data-hero-label]");
        const headlineLines = root.querySelectorAll<HTMLElement>("[data-headline-line]");
        const copy = root.querySelector<HTMLElement>("[data-hero-copy]");
        const actions = root.querySelector<HTMLElement>("[data-hero-actions]");
        const scrollCue = root.querySelector<HTMLElement>("[data-scroll-cue]");
        const progress = { value: 0 };

        const entrance = gsap.timeline({ defaults: { ease: "power4.out" } });
        entrance
          .fromTo(
            heroImage,
            { clipPath: "inset(0 0 100% 0 round 2.5rem)", scale: 1.04 },
            { clipPath: "inset(0 0 0% 0 round 2.5rem)", scale: 1, duration: 1.35 },
            0.08
          )
          .fromTo(label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.18)
          .fromTo(
            headlineLines,
            { yPercent: 112 },
            { yPercent: 0, duration: 0.92, stagger: 0.12 },
            0.24
          )
          .fromTo(copy, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.6)
          .fromTo(actions, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.74)
          .fromTo(scrollCue, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 1.02)
          .to(
            progress,
            {
              value: 0.23,
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: () => {
                threadProgress.current = progress.value;
                drawThread(progress.value);
              },
            },
            0.65
          );

        if (desktop) {
          const hero = root.querySelector<HTMLElement>("[data-hero-scene]");
          const storyIntro = root.querySelector<HTMLElement>("[data-story-intro]");
          const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-story-chapter]"));
          const accents = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter-accent]"));
          const threadState = { value: 0.23 };

          gsap.set(chapters, { autoAlpha: 0 });
          gsap.set(storyIntro, { autoAlpha: 0, y: 12 });
          gsap.set(accents, { autoAlpha: 0, scale: 0.8 });

          const timeline = gsap.timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.72,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(hero, { autoAlpha: 0, y: -28, duration: 0.62 }, 0.18)
            .to(storyIntro, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.42)
            .to(
              threadState,
              {
                value: 1,
                duration: 2.7,
                ease: "none",
                onUpdate: () => {
                  threadProgress.current = Math.max(threadProgress.current, threadState.value);
                  drawThread(threadState.value);
                },
              },
              0.24
            );

          chapters.forEach((chapter, index) => {
            const at = 0.56 + index * 1.08;
            const chapterImage = chapter.querySelector<HTMLElement>("[data-chapter-image]");
            const chapterText = chapter.querySelector<HTMLElement>("[data-chapter-text]");

            timeline
              .to(chapter, { autoAlpha: 1, duration: 0.38 }, at)
              .fromTo(
                chapterText,
                { autoAlpha: 0, y: 34 },
                { autoAlpha: 1, y: 0, duration: 0.58 },
                at + 0.03
              )
              .fromTo(
                chapterImage,
                {
                  clipPath:
                    index % 2 === 0
                      ? "inset(0 100% 0 0 round 2.25rem)"
                      : "inset(0 0 0 100% round 2.25rem)",
                  scale: 1,
                },
                {
                  clipPath: "inset(0 0% 0 0 round 2.25rem)",
                  scale: 1.04,
                  duration: 0.92,
                },
                at + 0.02
              )
              .to(accents[index], { autoAlpha: 0.72, scale: 1, duration: 0.55 }, at)
              .to(accents[index], { autoAlpha: 0, scale: 1.14, duration: 0.45 }, at + 0.84);

            if (index < chapters.length - 1) {
              timeline.to(chapter, { autoAlpha: 0, y: -22, duration: 0.42 }, at + 0.88);
            }
          });
        }

        if (mobile) {
          gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-story-chapter]")).forEach(
            (chapter) => {
              const imageElement = chapter.querySelector<HTMLElement>("[data-chapter-image]");
              const textElement = chapter.querySelector<HTMLElement>("[data-chapter-text]");
              gsap.fromTo(
                textElement,
                { autoAlpha: 0, y: 26 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power4.out",
                  scrollTrigger: { trigger: chapter, start: "top 82%", once: true },
                }
              );
              gsap.fromTo(
                imageElement,
                { clipPath: "inset(0 0 100% 0 round 1.75rem)", scale: 1 },
                {
                  clipPath: "inset(0 0 0% 0 round 1.75rem)",
                  scale: 1.04,
                  duration: 1,
                  ease: "power4.out",
                  scrollTrigger: { trigger: chapter, start: "top 78%", once: true },
                }
              );
            }
          );
        }
      }
    );

    return () => {
      window.removeEventListener("resize", onResize);
      media.revert();
    };
  }, [drawThread]);

  const images = story.map((_, index) => storyImages[index] || image).filter(Boolean) as string[];

  return (
    <section ref={experienceRef} id="sec-hero" className={styles.experience}>
      <div className={styles.stage} data-stage>
        <div className={styles.paperTexture} aria-hidden />
        <div className={styles.accentField} aria-hidden>
          {story.map((item) => (
            <span key={item.number} data-chapter-accent style={{ background: item.accent }} />
          ))}
        </div>

        <canvas ref={canvasRef} className={styles.threadCanvas} aria-hidden />

        <div className={styles.heroScene} data-hero-scene>
          <div className={styles.heroCopy}>
            <p className={styles.missionLabel} data-hero-label>
              <span aria-hidden />
              Sankranthi Foundation · Sri Lanka
            </p>
            <h1>
              <span className={styles.headlineMask}>
                <span data-headline-line>Dignity. Rights.</span>
              </span>
              <span className={styles.headlineMask}>
                <span data-headline-line>Opportunity.</span>
              </span>
              <span className={styles.headlineMask}>
                <span data-headline-line>For everyone.</span>
              </span>
            </h1>
            <p className={styles.heroDescription} data-hero-copy>
              We work alongside LGBTQIA+ and marginalized communities in Sri Lanka to advance
              rights, health, wellbeing and economic opportunity.
            </p>
            <div className={styles.heroActions} data-hero-actions>
              <Link className={styles.supportAction} href={`/${locale}/donate`}>
                <span className={styles.buttonThread} aria-hidden />
                <HandHeart className={styles.supportIcon} aria-hidden />
                <span>Support Our Work</span>
                <ArrowRight className={styles.actionArrow} aria-hidden />
              </Link>
              <Link className={styles.exploreAction} href={exploreHref}>
                Explore What We Do
                <ArrowRight aria-hidden />
              </Link>
            </div>
          </div>

          <figure className={styles.heroFigure}>
            <div className={styles.heroImage} data-hero-image>
              {image && <img src={image} alt="Sankranthi Foundation community members together" />}
            </div>
            <figcaption>
              <span>People before programmes.</span>
              <strong>Dignity in every connection.</strong>
            </figcaption>
          </figure>

          <div className={styles.scrollCue} data-scroll-cue aria-hidden>
            <span>Follow the living thread</span>
            <ArrowDown />
          </div>
        </div>

        <div className={styles.storyStage}>
          <div className={styles.storyIntro} data-story-intro aria-hidden>
            <span>The living thread</span>
            <small>Connection → Support → Empowerment → Dignity</small>
          </div>

          {story.map((item, index) => (
            <article
              key={item.number}
              className={`${styles.chapter} ${index % 2 ? styles.chapterReverse : ""} ${
                index === story.length - 1 ? styles.finalChapter : ""
              }`}
              data-story-chapter
            >
              <div className={styles.chapterText} data-chapter-text>
                <p className={styles.chapterMeta} style={{ color: item.accent }}>
                  <span>{item.number}</span>
                  {item.label}
                </p>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                <div className={styles.chapterThemes}>
                  {item.themes.map((theme) => (
                    <div key={theme.name}>
                      <strong>{theme.name}</strong>
                      <span>{theme.line}</span>
                    </div>
                  ))}
                </div>
                <span className={styles.chapterPrinciple}>
                  {index === 0 && "We listen"}
                  {index === 1 && "We create access · Communities grow stronger"}
                </span>
              </div>

              {index < story.length - 1 ? (
                <figure className={styles.chapterFigure} data-chapter-image>
                  {images[index] && <img src={images[index]} alt="" />}
                  <span className={styles.imageNumber}>{item.number}</span>
                </figure>
              ) : (
                <div className={styles.mosaic} data-chapter-image>
                  {[
                    storyImages[1] || images[1] || image,
                    storyImages[2] || storyImages[0] || image,
                    storyImages[3] || storyImages[0] || image,
                  ].map(
                    (mosaicImage, mosaicIndex) =>
                      mosaicImage && (
                        <figure key={`${mosaicImage}-${mosaicIndex}`}>
                          <img src={mosaicImage} alt="" />
                        </figure>
                      )
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className={styles.mobileThread} aria-hidden />
        <div className={styles.exitFade} aria-hidden />
      </div>
    </section>
  );
}

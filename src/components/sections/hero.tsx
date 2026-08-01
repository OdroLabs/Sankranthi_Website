import Link from "next/link";
import { getNews } from "@/lib/actions/news";
import { getDict } from "@/i18n/server";

export async function Hero() {
  const [latest, dict] = await Promise.all([
    getNews({ onlyPublished: true, take: 1 }).then((n) => n[0]),
    getDict(),
  ]);
  const t = dict.hero;

  return (
    <section className="hero-reference" aria-labelledby="hero-title">
      <div className="hero-reference__visual">
        <div className="hero-reference__shade" />
        <div className="hero-reference__content">
          <h1 id="hero-title">{t.title}</h1>
          <div className="hero-reference__buttons">
            <Link className="hero-reference__button" href="/services">{dict.btn.ourServices}</Link>
            <Link className="hero-reference__button is-orange" href="/donate">♥ {dict.btn.supportUs}</Link>
          </div>
        </div>
      </div>

      <svg className="hero-reference__divider" viewBox="0 0 320 1000" preserveAspectRatio="none" aria-hidden="true">
        <path className="divider-shadow" d="M72 0 C260 185 250 350 143 505 C30 670 22 830 108 1000" />
        <path className="divider-yellow" d="M72 0 C260 185 250 350 143 505 C30 670 22 830 108 1000" />
        <path className="divider-white" d="M72 0 C260 185 250 350 143 505 C30 670 22 830 108 1000 L320 1000 L320 0 Z" />
      </svg>

      <aside className="hero-reference__news" aria-label="Featured news">
        <h2>{t.latestUpdate}</h2>
        <Link className="featured-news" href={latest ? `/news/${latest.slug}` : "/news"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={latest?.coverImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85"}
            alt={latest?.title ?? "Latest news"}
          />
          <span className="featured-news__overlay">
            <strong>{latest?.title ?? t.featured}</strong>
            <small>{dict.btn.readMore}</small>
          </span>
        </Link>
      </aside>

      <Link className="hero-reference__donate" href="/donate" aria-label="Support us">
        <span aria-hidden="true">♥</span> {dict.btn.supportUs}
      </Link>
    </section>
  );
}

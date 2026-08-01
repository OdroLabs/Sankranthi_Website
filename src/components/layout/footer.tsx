import Link from "next/link";
import { site } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";

export function Footer({ dict }: { dict: Dictionary }) {
  const f = dict.footer;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">SF</span>
            <span className="brand-copy">
              <strong>{site.name}</strong>
              <small>{site.tagline}</small>
            </span>
          </Link>
          <p>{f.blurb}</p>
          <div className="socials">
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href={site.hotlineHref} aria-label="Phone">☏</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>{f.navigate}</h4>
          <Link href="/about">{f.aboutUs}</Link>
          <Link href="/services">{f.ourServices}</Link>
          <Link href="/publications">{f.resources}</Link>
          <Link href="/news">{f.news}</Link>
        </div>
        <div className="footer-col">
          <h4>{f.getInvolved}</h4>
          <Link href="/volunteers">{dict.nav.volunteers}</Link>
          <Link href="/spa">{dict.nav.spa}</Link>
          <Link href="/donate">{dict.nav.donate}</Link>
          <Link href="/suggestions">{dict.nav.suggestions}</Link>
        </div>
        <div className="footer-col">
          <h4>{f.contactUs}</h4>
          <p>{site.location}</p>
          <a href={site.hotlineHref}>{site.hotline}</a>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer">{f.messageFb}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} {site.name}. {f.rights} | {f.tagline}
        </div>
      </div>
    </footer>
  );
}

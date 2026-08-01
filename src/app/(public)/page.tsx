import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { ContactForm } from "@/components/forms/contact-form";
import { getServices } from "@/lib/actions/service";
import { getPublications } from "@/lib/actions/publication";
import { getNews } from "@/lib/actions/news";
import { getUpcomingEvents } from "@/lib/actions/event";
import { formatDate } from "@/lib/utils";
import { site } from "@/config/site";
import { getDict } from "@/i18n/server";

export default async function HomePage() {
  const [services, publications, news, upcoming, dict] = await Promise.all([
    getServices({ onlyPublished: true }),
    getPublications({ onlyPublished: true }),
    getNews({ onlyPublished: true, take: 3 }),
    getUpcomingEvents(),
    getDict(),
  ]);
  const nextEvent = upcoming[0];
  const d = dict;

  return (
    <>
      <Hero />

      {/* Services */}
      <section className="section facts" id="services">
        <div className="container">
          <div className="section-heading centered">
            <span>{d.services.eyebrow}</span>
            <h2>{d.services.title}</h2>
            <p>{d.services.intro}</p>
          </div>
          <div className="fact-grid">
            {services.slice(0, 8).map((s: (typeof services)[number]) => (
              <article className="fact-card" key={s.id}>
                <div className="icon">{s.icon || "🫂"}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <Link href={`/contact?service=${s.slug}`}>{d.btn.learnMore}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="community-section">
        <div className="community-top-wave" aria-hidden="true" />
        <div className="community-overlay" />
        <div className="container community-content">
          <div className="section-heading centered light">
            <span>{d.community.eyebrow}</span>
            <h2>{d.community.title}</h2>
          </div>
          <div className="community-grid">
            {[
              { t: d.community.clinics, href: "/services", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=720&q=80" },
              { t: d.community.psychosocial, href: "/services", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=720&q=80" },
              { t: d.community.advocacy, href: "/publications", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=720&q=80" },
              { t: d.community.outreach, href: "/events", img: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=720&q=80" },
            ].map((c) => (
              <Link className="community-card" href={c.href} key={c.t}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.t} />
                <span>{c.t}</span>
              </Link>
            ))}
          </div>
          <Link className="btn btn-primary section-button" href="/contact">{d.btn.reachOut}</Link>
        </div>
      </section>

      {/* About */}
      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="about-copy">
            <div className="section-heading">
              <span>{d.about.eyebrow}</span>
              <h2>{d.about.title}</h2>
            </div>
            <p>{d.about.p1}</p>
            <p>{d.about.p2}</p>
            <Link className="btn btn-primary" href="/about">{d.btn.getInTouch}</Link>
          </div>
          <div className="vision-card">
            <span>{d.about.visionLabel}</span>
            <h3>{d.about.vision}</h3>
            <div className="vision-dots"><i /><i /><i /></div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="section resources-section" id="resources">
        <div className="container">
          <div className="section-heading centered">
            <span>{d.resources.eyebrow}</span>
            <h2>{d.resources.title}</h2>
          </div>
          <div className="resource-grid">
            {publications.slice(0, 2).map((p: (typeof publications)[number]) => (
              <article className="resource-card" key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.coverImage || "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=700&q=85"} alt={p.title} />
                <div className="resource-body">
                  <span>{p.kind}</span>
                  <h3>{p.title}</h3>
                  <a href={p.externalUrl || p.fileUrl || "/publications"} target={p.externalUrl || p.fileUrl ? "_blank" : undefined} rel="noreferrer">{d.btn.readMore} →</a>
                </div>
              </article>
            ))}
            {publications.length === 0 && <p style={{ color: "var(--muted)" }}>{d.resources.empty}</p>}
          </div>
        </div>
      </section>

      {/* You are not alone */}
      <section className="happy-life">
        <div className="happy-image" role="img" aria-label="Community members in solidarity" />
        <div className="happy-copy">
          <div>
            <span className="eyebrow orange">{d.notAlone.eyebrow}</span>
            <h2>{d.notAlone.title}</h2>
            <p>{d.notAlone.text}</p>
            <Link className="btn btn-primary" href="/contact">{d.btn.findSupport}</Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="section news-section" id="news">
        <div className="container">
          <div className="section-heading centered">
            <span>{d.newsSec.eyebrow}</span>
            <h2>{d.newsSec.title}</h2>
          </div>
          <div className="news-grid">
            {news.map((n: (typeof news)[number]) => (
              <Link className="news-card" href={`/news/${n.slug}`} key={n.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.coverImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85"} alt={n.title} />
                <div className="news-body">
                  <time dateTime={new Date(n.publishedAt).toISOString()}>{formatDate(n.publishedAt)}</time>
                  <h3>{n.title}</h3>
                  <span style={{ display: "block", marginTop: 6 }}>{d.btn.readMore} →</span>
                </div>
              </Link>
            ))}
            {news.length === 0 && <p style={{ color: "var(--muted)" }}>{d.newsSec.empty}</p>}
          </div>
          <div className="center-action">
            <a className="btn btn-primary" href={site.facebook} target="_blank" rel="noopener noreferrer">{d.btn.followFacebook}</a>
          </div>
        </div>
      </section>

      {/* Upcoming event band */}
      <section className="conference-section">
        <div className="container conference-inner">
          <div className="conference-copy">
            <span>{d.eventSec.eyebrow}</span>
            <h2>{nextEvent ? nextEvent.title : d.eventSec.fallbackTitle}</h2>
            <p>{nextEvent ? `${formatDate(nextEvent.startsAt)}${nextEvent.location ? " · " + nextEvent.location : ""}` : d.eventSec.fallbackText}</p>
          </div>
          <div className="conference-logo">Sankranthi<br /><strong>Clinic</strong></div>
          <a className="btn btn-primary" href={site.hotlineHref}>{d.btn.callToRegister}</a>
        </div>
      </section>

      {/* Partners */}
      <section className="section partners-section">
        <div className="container">
          <div className="section-heading centered"><span>{d.partners.eyebrow}</span><h2>{d.partners.title}</h2></div>
          <div className="partner-row">
            {["FPA Sri Lanka", "National Trans Network SL", "Trans Equality Trust", "SWASA South Asia", "IPPF"].map((p) => (
              <div className="partner-logo" key={p}>{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Get involved */}
      <section className="section products-section" id="get-involved">
        <div className="container">
          <div className="section-heading centered">
            <span>{d.getInvolved.eyebrow}</span>
            <h2>{d.getInvolved.title}</h2>
            <p>{d.getInvolved.intro}</p>
          </div>
          <div className="product-grid">
            {[
              { t: d.getInvolved.volunteer, s: d.getInvolved.volunteerSub, href: "/volunteers", cta: d.btn.getInTouch, img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=520&q=85" },
              { t: d.getInvolved.donate, s: d.getInvolved.donateSub, href: "/donate", cta: d.btn.supportUs, img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=520&q=85" },
              { t: d.getInvolved.partner, s: d.getInvolved.partnerSub, href: "/contact", cta: d.btn.collaborate, img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=520&q=85" },
            ].map((p) => (
              <article className="product-card" key={p.t}>
                <div className="product-art">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.t} />
                </div>
                <h3>{p.t}</h3>
                <span>{p.s}</span>
                <Link href={p.href}>{p.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section testimonial-section">
        <div className="container testimonial-card">
          <div className="quote-mark">“</div>
          <blockquote>“{d.testimonial.quote}”</blockquote>
          <div className="testimonial-person">
            <div className="avatar">T</div>
            <div><strong>{d.testimonial.person}</strong><span>{d.testimonial.place}</span></div>
          </div>
        </div>
      </section>

      {/* Contact map */}
      <section className="contact-map" id="contact">
        <div className="map-panel">
          <iframe title="Colombo and Gampaha, Sri Lanka" src="https://www.openstreetmap.org/export/embed.html?bbox=79.814%2C6.886%2C79.900%2C6.960&layer=mapnik" loading="lazy" />
        </div>
        <div className="contact-panel navy">
          <h3>{d.contactBlock.find}</h3>
          <p>{site.location}</p>
          <p><strong>{d.contactBlock.hotlineTitle}</strong><br />{d.contactBlock.hotlineNote}</p>
          <a href={site.hotlineHref}>{site.hotline}</a>
        </div>
        <div className="contact-panel orange-panel">
          <h3>{d.contactBlock.howTitle}</h3>
          <ul>
            <li>{d.contactBlock.h1}</li>
            <li>{d.contactBlock.h2}</li>
            <li>{d.contactBlock.h3}</li>
            <li>{d.contactBlock.h4}</li>
            <li>{d.contactBlock.h5}</li>
          </ul>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer">{d.btn.followFacebook}</a>
        </div>
      </section>

      {/* Message form */}
      <section className="section message-section">
        <div className="container form-grid">
          <div>
            <div className="section-heading"><span>{d.message.eyebrow}</span><h2>{d.message.title}</h2></div>
            <p style={{ color: "var(--muted)" }}>{d.message.intro}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-wrap">
        <div className="newsletter-wave" aria-hidden="true" />
        <div className="container newsletter-card">
          <div>
            <span>{d.newsletter.label}</span>
            <h3>{d.newsletter.title}</h3>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder={d.newsletter.placeholder} aria-label="Email address" />
            <a className="btn btn-light" href={site.facebook} target="_blank" rel="noopener noreferrer">{d.btn.subscribe}</a>
          </div>
        </div>
      </section>
    </>
  );
}

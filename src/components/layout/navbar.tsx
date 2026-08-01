"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/config/site";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = dict.nav;

  const mainNav = [
    { label: t.about, href: "/about" },
    { label: t.services, href: "/services" },
    { label: t.projects, href: "/projects" },
    { label: t.publications, href: "/publications" },
    { label: t.news, href: "/news" },
    { label: t.spa, href: "/spa" },
    { label: t.contact, href: "/contact" },
  ];
  const mobileExtra = [
    { label: t.events, href: "/events" },
    { label: t.gallery, href: "/gallery" },
    { label: t.volunteers, href: "/volunteers" },
    { label: t.suggestions, href: "/suggestions" },
    { label: t.donate, href: "/donate" },
  ];

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <a href={site.hotlineHref} className="topbar-hotline">
              <span>{dict.topbar.hotline}</span>
              <strong>{site.hotline}</strong>
            </a>
            <span className="topbar-sep-v" aria-hidden="true" />
            <span className="topbar-hotline">
              <span>{dict.topbar.safeSpaces}</span>
              <strong>{site.location}</strong>
            </span>
          </div>
          <div className="topbar-right">
            <Link href="/contact" className="topbar-link">{dict.topbar.contactUs}</Link>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="topbar-chat">
              {dict.topbar.chatNow}
            </a>
            <span className="topbar-sep-bar" aria-hidden="true" />
            <LanguageSwitcher current={locale} />
          </div>
        </div>
      </div>

      <div className="nav-shell">
        <div className="container nav-inner">
          <Link className="brand" href="/" aria-label="Home">
            <span className="brand-mark">SF</span>
            <span className="brand-copy">
              <strong>{site.name}</strong>
              <small>{site.tagline}</small>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            {mainNav.map((i) => (
              <Link key={i.href} href={i.href}>{i.label}</Link>
            ))}
          </nav>

          <a className="nav-cta" href={site.hotlineHref}>{t.getHelp}</a>
          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="container" style={{ paddingBottom: 18 }}>
            <nav style={{ display: "grid", gap: 10 }}>
              {[...mainNav, ...mobileExtra].map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  onClick={() => setOpen(false)}
                  style={{ fontWeight: 600, color: "var(--navy)" }}
                >
                  {i.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

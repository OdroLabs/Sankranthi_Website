"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Heart, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";
import type { NavConfig, NavGroup, NavItem } from "@/lib/nav";

export interface HeaderProps {
  locale: string;
  dict: Dictionary;
  nav: NavConfig;
  /** Full organisation name, shown small under the wordmark. */
  siteName: string;
  /** Abbreviation used as the wordmark, e.g. SF. */
  shortName: string;
  logoImage?: string;
  logoLetter: string;
  phones: string[];
  emails: string[];
  donateLabel: string;
  announceText?: string;
  announceLink?: string;
  showTopbar: boolean;
  showLangs: boolean;
  showDonate: boolean;
}

const menuOverlay = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.4, ease: [0.6, 0, 0.4, 1] as const },
  },
};

const menuList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const menuItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.25 } },
};

export function SiteHeader({
  locale,
  dict,
  nav,
  siteName,
  shortName,
  logoImage,
  logoLetter,
  phones,
  emails,
  donateLabel,
  announceText,
  announceLink,
  showTopbar,
  showLangs,
  showDonate,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () => {
      document.documentElement.style.setProperty("--site-nav-h", `${el.offsetHeight}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--site-nav-h");
    };
  }, [scrolled, open]);

  // Close the menu on route change and lock body scroll while open
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const { primary, groups, contact } = nav;
  const hasContactStrip = phones.length > 0 || emails.length > 0;

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return href === "" ? pathname === `/${locale}` : pathname.startsWith(full);
  };
  const isGroupActive = (group: NavGroup) => group.items.some((i) => isActive(i.href));

  const pillClass = (active: boolean) =>
    cn(
      "group/pill relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors duration-200",
      active
        ? "bg-[#FFF0F4] text-[#C94F72]"
        : "text-[#202B33]/70 hover:bg-[#FFF0F4] hover:text-[#C94F72]"
    );

  const pillUnderline = (active: boolean) => (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-3 -bottom-px h-0.5 origin-center scale-x-0 rounded-full bg-[#FF6F91] transition-transform duration-300 ease-out group-hover/pill:scale-x-100",
        active && "scale-x-100"
      )}
    />
  );

  const mobileItems = contact ? [...primary, contact] : primary;

  return (
    <>
      {/* Utility strip — hidden when switched off, or when there is nothing to show */}
      {showTopbar && (hasContactStrip || showLangs) && (
        <div id="sec-topbar" className="hidden bg-[#202B33] text-[#F8F5F2] md:block">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-2 text-xs md:px-8">
            <div className="flex items-center gap-6 text-[#F8F5F2]/80">
              {phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-[#F8F5F2]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#FF8A72]" /> {phone}
                </a>
              ))}
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-[#F8F5F2]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#FF6F91]" /> {email}
                </a>
              ))}
            </div>
            {showLangs && <LocaleSwitcher current={locale} dark />}
          </div>
        </div>
      )}

      {/* Sticky glass nav */}
      <header
        ref={headerRef}
        id="sec-header"
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-[rgba(32,43,51,0.06)] bg-[rgba(255,253,249,0.90)] shadow-[0_10px_30px_rgba(32,43,51,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(255,253,249,0.82)]"
            : isHome
              ? "border-transparent bg-[rgba(255,253,249,0.28)] backdrop-blur-[10px] supports-[backdrop-filter]:bg-[rgba(255,253,249,0.18)]"
              : "border-transparent bg-[#FFFDF9]"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1280px] items-center justify-between gap-5 px-5 transition-[padding] duration-300 md:px-8",
            scrolled ? "py-2.5" : "py-3.5"
          )}
        >
          <Link href={`/${locale}`} className="group relative z-[60] flex shrink-0 items-center gap-2.5">
            {logoImage ? (
              /* An uploaded logo usually carries the name already, so the
                 text wordmark beside it would only repeat it. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoImage}
                alt={siteName || shortName}
                className="h-12 w-auto max-w-[210px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <>
                {logoLetter && (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-lg font-bold text-white shadow-[0_8px_18px_rgba(255,97,127,0.22)] transition-transform duration-300 group-hover:scale-105">
                    {logoLetter}
                  </span>
                )}
                {(shortName || siteName) && (
                  <span className="leading-tight">
                    {shortName && (
                      <span className="block text-lg font-extrabold tracking-tight text-[#202B33]">
                        {shortName}
                      </span>
                    )}
                    {siteName && (
                      <span className="block max-w-[220px] truncate text-[10px] text-muted-foreground">
                        {siteName}
                      </span>
                    )}
                  </span>
                )}
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 min-[1360px]:flex" aria-label="Main">
            {primary.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  aria-current={active ? "page" : undefined}
                  className={pillClass(active)}
                >
                  {link.label}
                  {pillUnderline(active)}
                </Link>
              );
            })}

            {/* Dropdown groups */}
            {groups.map((group) => {
              const active = isGroupActive(group);
              return (
                <div key={group.label} className="group/nav relative">
                  <button type="button" aria-haspopup="true" className={pillClass(active)}>
                    {group.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover/nav:rotate-180" />
                    {pillUnderline(active)}
                  </button>
                  {/* pt-2 bridges the hover gap between pill and panel */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                    <div className="min-w-[230px] overflow-hidden rounded-2xl border border-[rgba(32,43,51,0.07)] bg-[#FFFDF9]/95 p-2 shadow-[0_15px_45px_rgba(31,41,51,0.08)] backdrop-blur-xl">
                      {group.items.map((item) => {
                        const itemActive = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={`/${locale}${item.href}`}
                            aria-current={itemActive ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
                              itemActive
                                ? "bg-[#FFF0F4] text-[#C94F72]"
                                : "text-[#202B33]/75 hover:bg-[#FFF0F4] hover:text-[#C94F72]"
                            )}
                          >
                            {item.label}
                            {itemActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {contact && (
              <Link
                href={`/${locale}${contact.href}`}
                aria-current={isActive(contact.href) ? "page" : undefined}
                className={pillClass(isActive(contact.href))}
              >
                {contact.label}
                {pillUnderline(isActive(contact.href))}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {showDonate && donateLabel && (
              <Button
                asChild
                size="sm"
                className="hidden rounded-full bg-gradient-to-r from-[#FF6178] to-[#FF826F] px-5 font-bold text-white shadow-[0_10px_28px_rgba(255,97,127,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:from-[#ff7388] hover:to-[#ff967f] md:inline-flex"
              >
                <Link href={`/${locale}/donate`}>
                  <Heart className="h-4 w-4 fill-current" /> {donateLabel}
                </Link>
              </Button>
            )}
            <button
              className="relative z-[60] grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[#FFF0F4] lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={dict.nav.menu}
              aria-expanded={open}
            >
              <span className="relative block h-4 w-5">
                <motion.span
                  className="absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-charcoal-900"
                  animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-charcoal-900"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 block h-0.5 w-5 rounded-full bg-charcoal-900"
                  animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu — premium fullscreen overlay */}
        <AnimatePresence>
          {open && (
            <motion.nav
              key="mobile-menu"
              aria-label="Mobile"
              variants={menuOverlay}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 overflow-y-auto bg-[#202B33] text-[#F8F5F2] lg:hidden"
            >
              <div className="mx-auto flex min-h-full max-w-[560px] flex-col px-6 pb-10 pt-24">
                <motion.div variants={menuList} initial="hidden" animate="visible" exit="exit" className="flex-1">
                  <div className="grid gap-1">
                    {mobileItems.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <motion.div key={link.href} variants={menuItem}>
                          <Link
                            href={`/${locale}${link.href}`}
                            onClick={() => setOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between border-b border-white/10 py-4 text-3xl font-extrabold tracking-tight transition-colors",
                              active ? "text-accent" : "text-white/90 hover:text-accent"
                            )}
                          >
                            {link.label}
                            {active && <span className="h-2 w-2 rounded-full bg-accent" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {groups.map((group) => (
                    <motion.div key={group.label} variants={menuItem} className="mt-2">
                      <p className="pb-1 pt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                        {group.label}
                      </p>
                      <div className="grid gap-1">
                        {group.items.map((item) => {
                          const itemActive = isActive(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={`/${locale}${item.href}`}
                              onClick={() => setOpen(false)}
                              aria-current={itemActive ? "page" : undefined}
                              className={cn(
                                "flex items-center justify-between border-b border-white/10 py-3 text-lg font-semibold transition-colors",
                                itemActive ? "text-accent" : "text-white/80 hover:text-accent"
                              )}
                            >
                              {item.label}
                              {itemActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}

                  {(showLangs || (showDonate && donateLabel)) && (
                    <motion.div
                      variants={menuItem}
                      className="mt-6 flex flex-wrap items-center justify-between gap-3"
                    >
                      {showLangs && <LocaleSwitcher current={locale} dark />}
                      {showDonate && donateLabel && (
                        <Button
                          asChild
                          size="sm"
                          className="rounded-full bg-gradient-to-r from-[#FF6178] to-[#FF826F] px-6 font-bold text-white shadow-[0_10px_28px_rgba(255,97,127,0.22)] hover:from-[#ff7388] hover:to-[#ff967f]"
                        >
                          <Link href={`/${locale}/donate`} onClick={() => setOpen(false)}>
                            <Heart className="h-4 w-4 fill-current" /> {donateLabel}
                          </Link>
                        </Button>
                      )}
                    </motion.div>
                  )}

                  {hasContactStrip && (
                    <motion.div
                      variants={menuItem}
                      className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-white/60"
                    >
                      {phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-1.5 hover:text-accent"
                        >
                          <Phone className="h-3.5 w-3.5 text-accent" /> {phone}
                        </a>
                      ))}
                      {emails.map((email) => (
                        <a
                          key={email}
                          href={`mailto:${email}`}
                          className="flex items-center gap-1.5 hover:text-accent"
                        >
                          <Mail className="h-3.5 w-3.5 text-accent" /> {email}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

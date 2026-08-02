"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Settings,
  FolderKanban,
  HandHeart,
  FileText,
  CalendarDays,
  Images,
  Sparkles,
  CalendarCheck,
  Quote,
  Handshake,
  BarChart3,
  Heart,
  Lightbulb,
  Mail,
  Users,
  LogOut,
  ExternalLink,
  Globe,
  PanelTop,
  PanelBottom,
  Home,
  Info,
  Phone,
  Languages,
  Files,
  UsersRound,
  Inbox,
  LayoutList,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminLogo } from "./brand";

interface NavLinkDef {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  /** Omitted for the top-level group, which needs no heading. */
  label?: string;
  icon?: LucideIcon;
  /** Site settings and user accounts are owner-only. */
  ownerOnly?: boolean;
  links: NavLinkDef[];
}

const navSections: NavSection[] = [
  {
    links: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Site Settings",
    icon: Settings,
    ownerOnly: true,
    links: [
      { href: "/admin/settings/general", label: "General", icon: Globe },
      { href: "/admin/settings/header", label: "Header & Menu", icon: PanelTop },
      { href: "/admin/settings/footer", label: "Footer", icon: PanelBottom },
      { href: "/admin/settings/home", label: "Home Page", icon: Home },
      { href: "/admin/settings/about", label: "About Page", icon: Info },
      { href: "/admin/settings/contact", label: "Contact Page", icon: Phone },
      { href: "/admin/settings/donate", label: "Donation Page", icon: Heart },
      { href: "/admin/settings/pages", label: "Other Pages", icon: Files },
      { href: "/admin/settings/labels", label: "Labels & Translations", icon: Languages },
    ],
  },
  {
    label: "Content",
    icon: LayoutList,
    links: [
      { href: "/admin/content/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/content/services", label: "Services", icon: HandHeart },
      { href: "/admin/content/publications", label: "Publications", icon: FileText },
      { href: "/admin/content/events", label: "Events", icon: CalendarDays },
      { href: "/admin/content/gallery", label: "Gallery", icon: Images },
      { href: "/admin/content/products", label: "Nail Spa Services", icon: Sparkles },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/content/partners", label: "Partners", icon: Handshake },
      { href: "/admin/content/stats", label: "Impact Stats", icon: BarChart3 },
    ],
  },
  {
    label: "Inbox",
    icon: Inbox,
    links: [
      { href: "/admin/content/bookings", label: "Spa Bookings", icon: CalendarCheck },
      { href: "/admin/content/donations", label: "Donations", icon: Heart },
      { href: "/admin/content/suggestions", label: "Suggestions", icon: Lightbulb },
      { href: "/admin/content/messages", label: "Messages", icon: Mail },
      { href: "/admin/content/subscribers", label: "Subscribers", icon: Users },
    ],
  },
  {
    label: "Accounts",
    icon: UsersRound,
    ownerOnly: true,
    links: [{ href: "/admin/users", label: "Admin Users", icon: UsersRound }],
  },
];

const footerAction =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900";

export function AdminSidebar({ role, logo }: { role: string; logo?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isOwner = role === "owner";

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const NavLink = ({ href, label, icon: Icon }: NavLinkDef) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          active
            ? "bg-spectrum font-semibold text-white shadow-sm shadow-fuchsia-500/30"
            : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
          )}
        />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  const sections = navSections.filter((s) => isOwner || !s.ownerOnly);

  return (
    <>
      {/* Mobile trigger, parked over the panel header's reserved space */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed left-3 top-3.5 z-30 grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4">
          <Link href="/admin/dashboard" className="flex min-w-0 items-center">
            <AdminLogo src={logo} className="h-10" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="scrollbar-slim flex-1 space-y-6 overflow-y-auto p-3">
          {sections.map((section, i) => (
            <div key={section.label ?? `top-${i}`}>
              {section.label && (
                <p className="mb-1.5 flex items-center gap-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {section.icon && <section.icon className="h-3 w-3" />}
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <NavLink key={link.href} {...link} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-0.5 border-t border-slate-200 p-3">
          <a href="/en" target="_blank" rel="noreferrer" className={footerAction}>
            <ExternalLink className="h-4 w-4 text-slate-400" /> View Site
          </a>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className={footerAction}>
            <LogOut className="h-4 w-4 text-slate-400" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

async function stats() {
  const [
    projects, services, publications, events, news, volunteers, gallery,
    spaServices, bookings, donations, messages, suggestions, paid,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.publication.count(),
    prisma.event.count(),
    prisma.newsPost.count(),
    prisma.volunteer.count(),
    prisma.galleryImage.count(),
    prisma.spaService.count(),
    prisma.booking.count(),
    prisma.donation.count(),
    prisma.contactMessage.count(),
    prisma.suggestion.count(),
    prisma.donation.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
  ]);
  return {
    projects, services, publications, events, news, volunteers, gallery,
    spaServices, bookings, donations, messages, suggestions,
    raised: paid._sum.amountCents ?? 0,
  };
}

export default async function DashboardPage() {
  const s = await stats();
  const isAdmin = (await getRole()) === "ADMIN";
  const cards = [
    { label: "Projects", value: s.projects, href: "/dashboard/projects" },
    { label: "Services", value: s.services, href: "/dashboard/services" },
    { label: "Publications", value: s.publications, href: "/dashboard/publications" },
    { label: "Events", value: s.events, href: "/dashboard/events" },
    { label: "News", value: s.news, href: "/dashboard/news" },
    { label: "Volunteers", value: s.volunteers, href: "/dashboard/volunteers" },
    { label: "Gallery", value: s.gallery, href: "/dashboard/gallery" },
    { label: "SPA services", value: s.spaServices, href: "/dashboard/spa-services" },
    { label: "SPA bookings", value: s.bookings, href: "/dashboard/bookings" },
    { label: "Messages", value: s.messages, href: "/dashboard/messages" },
    { label: "Suggestions", value: s.suggestions, href: "/dashboard/suggestions" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Overview</h1>
        <Link href="/dashboard/projects/new"><Button size="sm">New project</Button></Link>
      </div>

      {isAdmin && (
        <div className="mt-6 rounded-2xl bg-plum p-6 text-sand">
          <p className="text-sm uppercase tracking-widest text-coral">Total raised (paid)</p>
          <p className="mt-1 font-display text-4xl">{formatMoney(s.raised)}</p>
          <Link href="/dashboard/donations" className="mt-2 inline-block text-sm text-sand/80 underline">
            View {s.donations} donation records
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-line bg-white p-5 transition hover:shadow-sm">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 font-display text-3xl text-plum">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

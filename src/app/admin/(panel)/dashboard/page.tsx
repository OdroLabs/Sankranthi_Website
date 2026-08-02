import Link from "next/link";
import {
  FolderKanban,
  CalendarDays,
  Heart,
  Lightbulb,
  Mail,
  Sparkles,
  CalendarCheck,
  FileText,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";

/** Icon tints, walking the logo's spectrum from violet through to green. */
const TONES = {
  violet: "bg-violet-50 text-violet-600",
  fuchsia: "bg-fuchsia-50 text-fuchsia-600",
  rose: "bg-rose-50 text-rose-600",
  orange: "bg-orange-50 text-orange-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  teal: "bg-teal-50 text-teal-600",
  sky: "bg-sky-50 text-sky-600",
} as const;

export default async function DashboardPage() {
  const [projects, events, publications, products, bookings, donations, suggestions, messages, totalDonated] =
    await Promise.all([
      prisma.project.count(),
      prisma.event.count(),
      prisma.publication.count(),
      prisma.product.count(),
      prisma.booking.count({ where: { status: "new" } }),
      prisma.donation.count({ where: { status: "success" } }),
      prisma.suggestion.count({ where: { read: false } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.donation.aggregate({ where: { status: "success" }, _sum: { amount: true } }),
    ]);

  const cards = [
    { label: "Projects", value: projects, icon: FolderKanban, href: "/admin/content/projects", tone: "violet" },
    { label: "Events", value: events, icon: CalendarDays, href: "/admin/content/events", tone: "fuchsia" },
    { label: "Publications", value: publications, icon: FileText, href: "/admin/content/publications", tone: "rose" },
    { label: "Nail Spa Services", value: products, icon: Sparkles, href: "/admin/content/products", tone: "orange" },
    { label: "New Spa Bookings", value: bookings, icon: CalendarCheck, href: "/admin/content/bookings", tone: "amber" },
    { label: "Successful Donations", value: donations, icon: Heart, href: "/admin/content/donations", tone: "emerald" },
    { label: "New Suggestions", value: suggestions, icon: Lightbulb, href: "/admin/content/suggestions", tone: "teal" },
    { label: "New Messages", value: messages, icon: Mail, href: "/admin/content/messages", tone: "sky" },
  ] satisfies { label: string; value: number; icon: typeof Heart; href: string; tone: keyof typeof TONES }[];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-spectrum p-6 text-white shadow-lg shadow-fuchsia-500/20">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-white/80">Everything on the website, in one place.</p>
        <div className="mt-5 inline-flex flex-col rounded-xl bg-white/15 px-4 py-3 backdrop-blur-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">
            Total donations received
          </span>
          <span className="font-number text-2xl font-extrabold">
            {formatMoney(totalDonated._sum.amount?.toString() ?? "0")}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="group">
            <Card className="h-full border-slate-200 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[card.tone]}`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-number text-2xl font-bold leading-none text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-1.5 truncate text-xs font-medium text-slate-500">{card.label}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

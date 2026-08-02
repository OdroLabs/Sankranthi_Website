import Image from "next/image";
import { Sparkles, Clock3, HeartHandshake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { BookingForm } from "@/components/site/booking-form";

export default async function BusinessPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [products, settings] = await Promise.all([
    prisma.product.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    getSettings(),
  ]);
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "business_hero_title", locale)}
        intro={s(settings, "business_hero_intro", locale)}
        image={s(settings, "business_hero_image") || undefined}
      />
      <section className="container py-14 md:py-20">
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            [Sparkles, "Beautiful care", "Professional nail care in a warm, welcoming space."],
            [Clock3, "Easy booking", "Choose a preferred appointment time online in minutes."],
            [HeartHandshake, "Community impact", "Every appointment supports skills and livelihoods for local women."],
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-extrabold text-navy-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Our treatment menu</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy-900">Care for your hands, confidence for our community</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {products.map((product) => {
          const name = loc(product, "name", locale);
          return (
            <Card key={product.id} className="flex flex-col overflow-hidden rounded-3xl border-brand-100">
              {product.image ? (
                <div className="relative h-52 w-full">
                  <Image src={product.image} alt={name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-50 to-orange-50">
                  <Sparkles className="h-10 w-10 text-primary/40" />
                </div>
              )}
              <CardContent className="flex flex-1 flex-col pt-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="font-bold leading-snug">{name}</h2>
                </div>
                {product.price != null && (
                  <p className="mb-2 font-bold text-primary">
                    {formatMoney(product.price.toString())}
                  </p>
                )}
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {loc(product, "description", locale)}
                </p>
              </CardContent>
            </Card>
          );
        })}
        {products.length === 0 && (
          <EmptyState
            message={s(settings, "business_empty_text", locale)}
          />
        )}
            </div>
          </div>
          <BookingForm services={products.map((product) => ({ id: product.id, name: loc(product, "name", locale) }))} />
        </div>
      </section>
    </>
  );
}

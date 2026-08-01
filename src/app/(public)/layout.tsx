import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getDict, getLocale } from "@/i18n/server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [dict, locale] = await Promise.all([getDict(), getLocale()]);
  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer dict={dict} />
    </>
  );
}

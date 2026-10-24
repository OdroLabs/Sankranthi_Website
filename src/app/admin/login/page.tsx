import { prisma } from "@/lib/prisma";
import { AdminLogo } from "@/components/admin/brand";
import { PrideStripe } from "@/components/pride-stripe";
import { AdminLoginForm } from "./login-form";

export default async function AdminLoginPage() {
  // Same lookup the panel layout uses — keeps the sign-in screen in sync
  // with whatever logo/name is uploaded under Site Settings → General,
  // instead of a bundled fallback image baked into the build.
  const [logo, siteName] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "logo_image" } }),
    prisma.setting.findUnique({ where: { key: "site_name" } }),
  ]);
  const logoUrl = logo?.valueEn?.trim() || undefined;
  const orgName = siteName?.valueEn?.trim() || "Sankranthi Foundation";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4">
      {/* Soft spectrum wash, echoing the swirl in the logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-400/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <PrideStripe className="h-1.5" />
        <div className="p-8">
          <div className="mb-7 text-center">
            <AdminLogo
              src={logoUrl}
              alt={orgName}
              className="mx-auto h-11 max-w-none object-center"
            />
            <h1 className="mt-5 text-lg font-bold text-slate-900">Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to manage the website.</p>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}

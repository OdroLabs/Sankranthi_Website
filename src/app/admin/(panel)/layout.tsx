import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/roles";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ToastProvider } from "@/components/admin/toast";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  // Keep the panel branded with whatever logo the live site is using.
  const logo = await prisma.setting.findUnique({ where: { key: "logo_image" } });
  const logoUrl = logo?.valueEn?.trim() || undefined;

  const initial = (admin.name || admin.email).trim().charAt(0).toUpperCase();

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-white text-foreground">
        <AdminSidebar role={admin.role} logo={logoUrl} />
        <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/85 pl-16 pr-4 backdrop-blur lg:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-spectrum text-sm font-bold text-white">
                {initial}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {admin.name || admin.email}
                </span>
                <span className="block truncate text-xs text-slate-500">{admin.email}</span>
              </span>
            </div>
            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              {ROLE_LABELS[admin.role]}
            </span>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}

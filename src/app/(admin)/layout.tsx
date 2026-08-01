import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { adminNav, site } from "@/config/site";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  const isAdmin = role === "ADMIN";
  const nav = adminNav.filter((item) => isAdmin || !item.adminOnly);

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="flex min-h-screen bg-sand">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white p-5 md:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-plum text-xs font-bold text-sand">
            SF
          </span>
          <span className="font-display font-semibold text-ink">{site.name}</span>
        </Link>
        <p className="mb-4 text-xs uppercase tracking-wide text-muted">Signed in as {role === "ADMIN" ? "Administrator" : "Editor"}</p>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-card hover:text-plum"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="pt-4">
          <Button variant="outline" size="sm" className="w-full" type="submit">
            Sign out
          </Button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-line bg-white px-4 md:hidden">
          <span className="font-display font-semibold text-ink">Admin</span>
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

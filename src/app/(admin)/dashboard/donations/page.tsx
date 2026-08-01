import { redirect } from "next/navigation";
import { getRole } from "@/lib/auth";
import { getDonations, deleteDonation } from "@/lib/actions/donation";
import { AsyncActionButton } from "@/components/admin/async-action-button";
import { formatMoney, formatDate } from "@/lib/utils";

export const metadata = { title: "Donations · Admin" };

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-sage/15 text-sage",
  FAILED: "bg-red-100 text-red-700",
};

export default async function AdminDonationsPage() {
  if ((await getRole()) !== "ADMIN") redirect("/dashboard");
  const donations = await getDonations();
  type Row = (typeof donations)[number];
  const total = donations
    .filter((d: Row) => d.status === "PAID")
    .reduce((sum: number, d: Row) => sum + d.amountCents, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Donations</h1>
        <div className="rounded-xl border border-line bg-white px-4 py-2 text-sm">
          Raised: <span className="font-display text-lg text-plum">{formatMoney(total)}</span>
        </div>
      </div>

      {donations.length === 0 ? (
        <p className="mt-6 text-muted">No donations yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-card/50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d: Row) => (
                <tr key={d.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">
                    {d.donorName ?? "Anonymous"}
                    {d.email ? <span className="block text-xs text-muted">{d.email}</span> : null}
                  </td>
                  <td className="px-4 py-3 text-ink">{formatMoney(d.amountCents, d.currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[d.status]}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(d.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <AsyncActionButton action={deleteDonation.bind(null, d.id)} variant="danger" confirmText="Delete this donation record?">
                        Delete
                      </AsyncActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

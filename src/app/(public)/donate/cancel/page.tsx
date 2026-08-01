import Link from "next/link";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Donation cancelled" };
export default function DonateCancel() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="font-display text-3xl text-ink">Donation cancelled</p>
        <p className="mt-3 text-muted">No payment was taken. You can try again any time.</p>
        <Link href="/donate" className="mt-6 inline-block"><Button variant="accent">Try again</Button></Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Thank you" };
export default function DonateSuccess() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="font-display text-4xl text-plum">Thank you ♥</p>
        <p className="mt-3 text-muted">Your donation supports free health care and advocacy for our community. A receipt will be sent to your email.</p>
        <Link href="/" className="mt-6 inline-block"><Button>Back to home</Button></Link>
      </div>
    </div>
  );
}

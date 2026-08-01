"use client";
import { useState, useTransition } from "react";
import { createMessage } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [v, setV] = useState({ name: "", contact: "", subject: "", message: "" });
  const set = (k: string, val: string) => setV((s) => ({ ...s, [k]: val }));

  if (done) {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/10 p-8 text-center">
        <p className="font-display text-xl text-ink">Message sent</p>
        <p className="mt-2 text-muted">Our team will respond as soon as possible. All messages are confidential.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="name">Name</Label><Input id="name" value={v.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><Label htmlFor="contact">Phone / Email</Label><Input id="contact" value={v.contact} onChange={(e) => set("contact", e.target.value)} /></div>
      </div>
      <div><Label htmlFor="subject">Subject</Label><Input id="subject" value={v.subject} onChange={(e) => set("subject", e.target.value)} /></div>
      <div><Label htmlFor="message">Message</Label><Textarea id="message" rows={5} value={v.message} onChange={(e) => set("message", e.target.value)} /></div>
      <Button
        disabled={pending}
        onClick={() => {
          setError(null);
          start(async () => {
            const res = await createMessage(v);
            if (res.ok) setDone(true);
            else setError(res.error);
          });
        }}
      >
        {pending ? "Sending…" : "Send message"}
      </Button>
    </div>
  );
}

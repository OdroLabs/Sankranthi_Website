"use client";

import { useRef, useState } from "react";
import { Heart, Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitBankDonation } from "@/lib/actions";
import type { Dictionary } from "@/lib/dictionaries";

const DEFAULT_PRESETS = [1000, 2500, 5000, 10000, 25000];

export function BankDonationForm({
  dict,
  /** Suggested amounts from Site Settings → Donation Page. */
  presets,
}: {
  dict: Dictionary;
  presets?: number[];
}) {
  const d = dict.donate;
  const PRESETS = presets && presets.length > 0 ? presets : DEFAULT_PRESETS;

  const [amount, setAmount] = useState<string>(String(PRESETS[Math.min(1, PRESETS.length - 1)]));
  const [slipUrl, setSlipUrl] = useState("");
  const [slipName, setSlipName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const purposes = [
    { value: "general", label: d.purposeGeneral },
    { value: "health", label: d.purposeHealth },
    { value: "education", label: d.purposeEducation },
    { value: "community", label: d.purposeCommunity },
  ];

  async function handleFile(file: File) {
    setUploadError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/donate/slip", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setSlipUrl(data.url);
      setSlipName(file.name);
    } catch (e: any) {
      setUploadError(e?.message ?? "Upload failed");
      setSlipUrl("");
      setSlipName("");
    } finally {
      setUploading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-teal-500/30 bg-teal-50 p-8 text-center">
        <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#83D8B6] text-white shadow-[0_10px_24px_rgba(131,216,182,0.28)]">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <p className="font-semibold text-teal-800">{d.bankSuccessTitle}</p>
        <p className="mt-1.5 text-sm text-teal-700">{d.bankSuccessText}</p>
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        setError("");
        if (!slipUrl) {
          setError(d.slipRequired);
          return;
        }
        setSubmitting(true);
        fd.set("bankSlipUrl", slipUrl);
        const res = await submitBankDonation(fd);
        setSubmitting(false);
        if (res.ok) setDone(true);
        else setError(res.error || "Something went wrong. Please try again.");
      }}
      className="space-y-6"
    >
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Amount */}
      <div className="space-y-2.5">
        <Label className="text-sm font-bold text-[#202B33]">{d.chooseAmount} *</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              aria-pressed={amount === String(p)}
              className={cn(
                "rounded-2xl border-2 px-2 py-3 text-center text-sm font-bold transition-all duration-200 motion-safe:active:scale-95",
                amount === String(p)
                  ? "border-transparent bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-white shadow-[0_10px_24px_rgba(255,97,127,0.22)]"
                  : "border-[rgba(32,43,51,0.07)] bg-white text-[#202B33] hover:border-[rgba(255,111,145,0.25)] hover:text-[#C94F72]"
              )}
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bd-amount" className="text-xs text-muted-foreground">
            {d.customAmount} ({d.amount})
          </Label>
          <Input
            id="bd-amount"
            name="amount"
            type="number"
            min="100"
            step="50"
            required
            placeholder="2500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 rounded-xl bg-white text-base font-semibold"
          />
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-1.5">
        <Label htmlFor="bd-purpose" className="text-sm font-bold text-[#202B33]">
          {d.purpose}
        </Label>
        <select
          id="bd-purpose"
          name="purpose"
          defaultValue="general"
          className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {purposes.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Donor details */}
      <div className="space-y-4">
        <p className="text-sm font-bold text-[#202B33]">{d.yourDetails}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="bd-name">{dict.common.name} *</Label>
            <Input id="bd-name" name="name" required className="h-11 rounded-xl bg-white" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bd-email">{dict.common.email} *</Label>
            <Input
              id="bd-email"
              name="email"
              type="email"
              required
              className="h-11 rounded-xl bg-white"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bd-phone">
            {dict.common.phone}{" "}
            <span className="font-normal text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="bd-phone" name="phone" className="h-11 rounded-xl bg-white" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bd-message">
            {dict.common.message}{" "}
            <span className="font-normal text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Textarea id="bd-message" name="message" rows={3} className="rounded-xl bg-white" />
        </div>
      </div>

      {/* Deposit slip upload */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-[#202B33]">{d.uploadSlip} *</Label>
        <p className="text-xs text-muted-foreground">{d.uploadSlipHelp}</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {slipUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-teal-300 bg-teal-50 px-4 py-3">
            <FileText className="h-5 w-5 shrink-0 text-teal-700" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-teal-800">
              {slipName}
            </span>
            <button
              type="button"
              onClick={() => {
                setSlipUrl("");
                setSlipName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              aria-label="Remove file"
              className="shrink-0 rounded-md p-1 text-teal-700 opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            disabled={uploading}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-sm font-semibold transition-colors disabled:opacity-60",
              dragOver
                ? "border-[#FF6F91]/60 bg-[#FFF3ED] text-[#C94F72]"
                : "border-[rgba(32,43,51,0.15)] bg-white text-muted-foreground hover:border-[#FF6F91]/40 hover:text-[#C94F72]"
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> {d.uploading}
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>{d.chooseFile}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  or drag a file here
                </span>
              </>
            )}
          </button>
        )}

        {uploadError && <p className="text-sm text-red-700">{uploadError}</p>}
      </div>

      <div className="space-y-2">
        <Button
          type="submit"
          size="lg"
          disabled={submitting || uploading || !slipUrl}
          className="h-13 w-full rounded-full bg-gradient-to-br from-[#FF6178] to-[#FF826F] py-6 text-base font-bold text-white shadow-[0_10px_28px_rgba(255,97,127,0.22)] transition-transform duration-300 hover:-translate-y-0.5 hover:from-[#ff7388] hover:to-[#ff967f] disabled:opacity-50"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5 fill-current" />}
          {d.submitDonation}
          {amount && Number(amount) > 0 && (
            <span className="font-number">(Rs. {Number(amount).toLocaleString()})</span>
          )}
        </Button>
        {!slipUrl && !uploading && (
          <p className="text-center text-xs text-muted-foreground">{d.slipRequired}</p>
        )}
      </div>
    </form>
  );
}

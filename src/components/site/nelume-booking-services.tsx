"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, CalendarCheck, X } from "lucide-react";
import { BookingForm, type BookableService } from "./booking-form";
import { NelumeIcon } from "./nelume-watermark";

type NelumeBookingServicesProps = {
  services: BookableService[];
  bookingEnabled: boolean;
  bookingLabel?: string;
  bookingEyebrow?: string;
  bookingTitle?: string;
  bookingBody?: string;
  formTitle?: string;
  formIntro?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
};

export function NelumeBookingServices({
  services,
  bookingEnabled,
  bookingLabel,
  bookingEyebrow,
  bookingTitle,
  bookingBody,
  formTitle,
  formIntro,
  submitLabel,
  successTitle,
  successBody,
}: NelumeBookingServicesProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BookableService | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const openBooking = (service?: BookableService) => {
    setSelectedService(service ?? null);
    setOpen(true);
  };

  return (
    <>
      {services.length > 0 ? (
        <div className="mx-auto grid max-w-[1050px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => openBooking(service)}
              className="group flex min-w-0 flex-col border-b border-[#DFD2C5] pb-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6590] focus-visible:ring-offset-4"
              aria-label={`Book ${service.name}`}
            >
              <span className="relative h-[180px] w-full overflow-hidden rounded-b-[28px] rounded-t-[90px] bg-[#EAF3F8]">
                {service.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center">
                    <NelumeIcon variant="lotus" size={38} color="#2F6590" />
                  </span>
                )}
              </span>
              <span className="mt-4 flex w-full items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-serif text-xl leading-tight text-[#293845]">{service.name}</span>
                  {service.description && (
                    <span className="mt-1 line-clamp-2 block text-[13px] leading-[1.55] text-[#5F7380]">
                      {service.description}
                    </span>
                  )}
                  {service.price && (
                    <span className="mt-2 block text-xs font-bold text-[#2F6590]">LKR {service.price}</span>
                  )}
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#2F6590] transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mx-auto max-w-xl border-y border-[#DFD2C5] py-5 text-center text-sm text-[#5F7380]">
          No services are currently available for online booking.
        </p>
      )}

      {bookingEnabled && bookingLabel && services.length > 0 && (
        <button
          type="button"
          onClick={() => openBooking()}
          className="mt-8 inline-flex min-w-[180px] items-center justify-center gap-2 rounded-[8px] border border-[#2F6590]/40 px-6 py-3 text-[12px] font-semibold text-[#2F5F84] transition-colors hover:bg-[#EAF3F8]"
        >
          <CalendarCheck className="h-4 w-4" />
          {bookingLabel}
        </button>
      )}

      {mounted && open && bookingEnabled && createPortal(
        <div className="fixed inset-0 z-[100]" role="presentation">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[#18242C]/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close appointment panel"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="nelume-booking-title"
            className="absolute inset-y-0 right-0 w-full max-w-[620px] overflow-y-auto bg-[#F8F5EF] shadow-[-24px_0_60px_rgba(24,36,44,0.18)]"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-[#DFD2C5] bg-[#F8F5EF]/95 px-6 py-5 backdrop-blur md:px-8">
              <div>
                {bookingEyebrow && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2F6590]">{bookingEyebrow}</p>
                )}
                <h2 id="nelume-booking-title" className="mt-1 font-serif text-3xl leading-none text-[#293845]">
                  {bookingTitle || "Book your NELUME visit"}
                </h2>
                {selectedService && (
                  <p className="mt-2 text-sm font-semibold text-[#2F6590]">{selectedService.name}</p>
                )}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#DFD2C5] text-[#34434C] transition-colors hover:bg-white"
                aria-label="Close appointment panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-6 md:px-8">
              {bookingBody && <p className="mb-5 text-sm leading-[1.65] text-[#5F7380]">{bookingBody}</p>}
              <BookingForm
                key={selectedService?.id ?? "unselected"}
                services={services}
                initialServiceId={selectedService?.id}
                formTitle={formTitle}
                formIntro={formIntro}
                submitLabel={submitLabel || "Request appointment"}
                successTitle={successTitle}
                successBody={successBody}
              />
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
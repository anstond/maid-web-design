"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Home, MapPin, ShieldCheck } from "lucide-react";

type ServiceType = "standard" | "deep" | "move";

const TABS: { id: ServiceType; label: string; helper: string }[] = [
  { id: "standard", label: "Standard", helper: "Recurring upkeep" },
  { id: "deep", label: "Deep", helper: "First visit or reset" },
  { id: "move", label: "Move", helper: "Empty-home clean" },
];

export default function HeroBookingCard() {
  const router = useRouter();
  const [service, setService] = useState<ServiceType>("standard");
  const [zip, setZip] = useState("");
  const [timing, setTiming] = useState("This week");

  function handleBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ service });
    if (zip.length === 5) params.set("zip", zip);
    router.push(`/booking?${params.toString()}`);
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_56px_rgba(21,94,99,0.14)]">
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-normal text-text-primary">Price your cleaning</h2>
            <p className="mt-1 text-sm leading-5 text-text-secondary">
              Start with the home. The full booking asks for access notes before payment.
            </p>
          </div>
          <span className="hidden rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-primary sm:inline-flex">
            No charge yet
          </span>
        </div>
      </div>

      <form onSubmit={handleBook} className="space-y-4 p-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-text-primary">Cleaning type</legend>
          <div className="grid grid-cols-3 gap-2">
            {TABS.map((tab) => {
              const active = tab.id === service;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setService(tab.id)}
                  className={`min-h-20 rounded-xl border p-3 text-left transition active:translate-y-px ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface-muted text-text-primary hover:border-primary/40"
                  }`}
                >
                  <span className="block text-sm font-bold">{tab.label}</span>
                  <span className={`mt-1 block text-xs leading-4 ${active ? "text-primary-foreground/80" : "text-text-secondary"}`}>
                    {tab.helper}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-3">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              ZIP code
            </span>
            <input
              value={zip}
              onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              autoComplete="postal-code"
              className="booking-input"
              placeholder="10001"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              Preferred timing
            </span>
            <select value={timing} onChange={(event) => setTiming(event.target.value)} className="booking-input">
              <option>This week</option>
              <option>Tomorrow</option>
              <option>Weekend</option>
              <option>Next week</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_rgba(21,94,99,0.20)] transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
        >
          Build my estimate
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>

        <div className="grid gap-2 rounded-2xl bg-surface-muted p-4 text-sm leading-5 text-text-secondary">
          <span className="flex items-center gap-2 font-semibold text-text-primary">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            What happens next
          </span>
          <span className="flex gap-2">
            <Home className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Choose rooms, extras, access details, and arrival window before checkout.
          </span>
        </div>
      </form>
    </div>
  );
}

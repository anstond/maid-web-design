"use client";

import { useState } from "react";
import type { SubscriptionScheduleSlot } from "@/lib/mock-account-data";

const DAYS = [
  { label: "Mon", dayOfWeek: 1 },
  { label: "Tue", dayOfWeek: 2 },
  { label: "Wed", dayOfWeek: 3 },
  { label: "Thu", dayOfWeek: 4 },
  { label: "Fri", dayOfWeek: 5 },
  { label: "Sat", dayOfWeek: 6 },
  { label: "Sun", dayOfWeek: 0 },
] as const;

const TIME_SLOTS = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM",
];

const PRODUCTS = ["Standard clean", "Deep clean", "Premium clean"];

const DEFAULT_TIME = "10:00 AM";
const DEFAULT_PRODUCT = "Standard clean";

type SlotConfig = { dayOfWeek: number; time: string; product: string };

type Props = {
  value?: SubscriptionScheduleSlot[];
  onChange?: (schedules: SubscriptionScheduleSlot[]) => void;
};

export function WeeklyScheduleBuilder({ value, onChange }: Props) {
  const [internalSlots, setInternalSlots] = useState<SlotConfig[]>(
    value?.map((s) => ({ dayOfWeek: s.dayOfWeek, time: s.time, product: s.product })) ?? []
  );

  const slots = value
    ? value.map((s) => ({ dayOfWeek: s.dayOfWeek, time: s.time, product: s.product }))
    : internalSlots;

  function updateSlots(next: SlotConfig[]) {
    setInternalSlots(next);
    onChange?.(next);
  }

  function toggleDay(dayOfWeek: number) {
    const exists = slots.find((s) => s.dayOfWeek === dayOfWeek);
    if (exists) {
      updateSlots(slots.filter((s) => s.dayOfWeek !== dayOfWeek));
    } else {
      updateSlots(
        [...slots, { dayOfWeek, time: DEFAULT_TIME, product: DEFAULT_PRODUCT }].sort((a, b) => {
          const aD = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
          const bD = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
          return aD - bD;
        })
      );
    }
  }

  function updateSlot(dayOfWeek: number, field: "time" | "product", val: string) {
    updateSlots(slots.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, [field]: val } : s)));
  }

  const selectedDays = new Set(slots.map((s) => s.dayOfWeek));

  const productGroups = slots.reduce<Record<string, string[]>>((acc, slot) => {
    const label = DAYS.find((d) => d.dayOfWeek === slot.dayOfWeek)?.label ?? "";
    acc[slot.product] = [...(acc[slot.product] ?? []), label];
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Day selector */}
      <div>
        <p className="mb-3 text-sm font-bold text-text-primary">Pick your cleaning days</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select recurring days of the week">
          {DAYS.map((day) => {
            const isSelected = selectedDays.has(day.dayOfWeek);
            return (
              <button
                key={day.dayOfWeek}
                type="button"
                onClick={() => toggleDay(day.dayOfWeek)}
                aria-pressed={isSelected}
                aria-label={`${day.label} — ${isSelected ? "selected, click to remove" : "click to add"}`}
                className={[
                  "flex min-h-11 min-w-[3.25rem] items-center justify-center rounded-full px-4 text-sm font-bold transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-95",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(21,94,99,0.24)]"
                    : "bg-surface-muted text-text-secondary hover:bg-canvas-softer hover:text-text-primary",
                ].join(" ")}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Per-slot configuration */}
      {slots.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-text-primary">Set time and service per day</p>
          <div className="space-y-2">
            {slots.map((slot) => {
              const dayLabel = DAYS.find((d) => d.dayOfWeek === slot.dayOfWeek)?.label ?? "";
              return (
                <div key={slot.dayOfWeek} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface-muted px-4 py-3">
                  <span className="w-10 shrink-0 text-sm font-bold text-primary">{dayLabel}</span>

                  <label className="sr-only" htmlFor={`time-${slot.dayOfWeek}`}>Arrival time for {dayLabel}</label>
                  <select
                    id={`time-${slot.dayOfWeek}`}
                    value={slot.time}
                    onChange={(e) => updateSlot(slot.dayOfWeek, "time", e.target.value)}
                    className="min-h-10 flex-1 rounded-lg bg-surface px-3 py-2 text-sm font-bold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
                  >
                    {TIME_SLOTS.map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>

                  <label className="sr-only" htmlFor={`product-${slot.dayOfWeek}`}>Cleaning type for {dayLabel}</label>
                  <select
                    id={`product-${slot.dayOfWeek}`}
                    value={slot.product}
                    onChange={(e) => updateSlot(slot.dayOfWeek, "product", e.target.value)}
                    className="min-h-10 flex-1 rounded-lg bg-surface px-3 py-2 text-sm font-bold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
                  >
                    {PRODUCTS.map((p) => (<option key={p} value={p}>{p}</option>))}
                  </select>

                  <button
                    type="button"
                    onClick={() => toggleDay(slot.dayOfWeek)}
                    aria-label={`Remove ${dayLabel}`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30"
                  >
                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {slots.length > 0 ? (
        <div className="rounded-xl border border-border bg-primary/5 px-4 py-3">
          <p className="text-xs font-bold text-primary mb-2">
            YOUR SCHEDULE — {slots.length} {slots.length === 1 ? "cleaning" : "cleanings"} per week
          </p>
          <div className="space-y-1">
            {Object.entries(productGroups).map(([product, days]) => (
              <p key={product} className="text-sm text-text-secondary">
                <span className="font-bold text-text-primary">{days.join(", ")}</span>
                {" — "}{product}
              </p>
            ))}
          </div>
          {Object.keys(productGroups).length > 1 && (
            <p className="mt-2 text-xs text-text-secondary border-t border-border/50 pt-2">
              Multiple services selected — we will create separate plans per service type.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-5 text-center">
          <p className="text-sm font-bold text-text-secondary">No days selected yet</p>
          <p className="mt-1 text-xs text-text-secondary">Pick the days above to build your schedule.</p>
        </div>
      )}
    </div>
  );
}

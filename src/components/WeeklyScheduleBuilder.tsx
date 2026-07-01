"use client";

import { X } from "lucide-react";
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
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
  "9:00 PM",
];

const SERVICES = ["Standard clean", "Deep clean", "Move clean", "Small office"];
const HOURS = ["1 hr", "2 hr", "3 hr", "4 hr", "5 hr", "6 hr", "7 hr", "8 hr"];

const DEFAULT_TIME = "10:00 AM";
const DEFAULT_SERVICE = "Standard clean";
const DEFAULT_HOURS = "3 hr";
const DEFAULT_PRODUCT = `${DEFAULT_SERVICE} (${DEFAULT_HOURS})`;

function parseProduct(productStr: string) {
  if (!productStr) {
    return { service: DEFAULT_SERVICE, hours: DEFAULT_HOURS };
  }
  const match = productStr.match(/^(.*?)\s*\((\d+(?:\.\d+)?\s*hrs?)\)$/) || productStr.match(/^(.*?)\s*-\s*(\d+(?:\.\d+)?\s*hrs?)$/);
  if (match) {
    return { service: match[1].trim(), hours: match[2].trim() };
  }
  return { service: productStr, hours: DEFAULT_HOURS };
}

type SlotConfig = { dayOfWeek: number; time: string; product: string };

type Props = {
  value?: SubscriptionScheduleSlot[];
  onChange?: (schedules: SubscriptionScheduleSlot[]) => void;
};

export function WeeklyScheduleBuilder({ value, onChange }: Props) {
  const [internalSlots, setInternalSlots] = useState<SlotConfig[]>(
    value?.map((s) => ({ dayOfWeek: s.dayOfWeek, time: s.time, product: s.product })) ?? []
  );
  const [highlightKey, setHighlightKey] = useState(0);

  const slots = value
    ? value.map((s) => ({ dayOfWeek: s.dayOfWeek, time: s.time, product: s.product }))
    : internalSlots;

  function updateSlots(next: SlotConfig[]) {
    setInternalSlots(next);
    onChange?.(next);
    setHighlightKey((prev) => prev + 1);
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

  function updateSlot(dayOfWeek: number, field: "time" | "service" | "hours", val: string) {
    updateSlots(
      slots.map((s) => {
        if (s.dayOfWeek === dayOfWeek) {
          if (field === "time") {
            return { ...s, time: val };
          }
          const { service, hours } = parseProduct(s.product);
          const nextService = field === "service" ? val : service;
          const nextHours = field === "hours" ? val : hours;
          return { ...s, product: `${nextService} (${nextHours})` };
        }
        return s;
      })
    );
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
        <p className="mb-3 text-sm font-medium text-text-primary">Pick your cleaning days</p>
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
                  "flex min-h-11 min-w-[3.25rem] items-center justify-center rounded-full px-4 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(21,94,99,0.24)] ring-2 ring-primary/20 scale-105"
                    : "bg-surface-muted text-text-secondary hover:bg-accent-soft hover:text-text-primary hover:shadow-sm",
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
          <p className="text-sm font-medium text-text-primary">Set time and service per day</p>
          <div className="space-y-2">
            {slots.map((slot) => {
              const dayLabel = DAYS.find((d) => d.dayOfWeek === slot.dayOfWeek)?.label ?? "";
              return (
                <div 
                  key={slot.dayOfWeek} 
                  className="animate-slot-entry grid gap-3 rounded-xl bg-surface-muted px-4 py-3 sm:grid-cols-[2.5rem_1fr_2fr_1fr_2.75rem] sm:items-center border border-transparent hover:border-border hover:bg-surface-muted/80 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-primary sm:w-10">{dayLabel}</span>

                  <label className="sr-only" htmlFor={`time-${slot.dayOfWeek}`}>Arrival time for {dayLabel}</label>
                  <select
                    id={`time-${slot.dayOfWeek}`}
                    value={slot.time}
                    onChange={(e) => updateSlot(slot.dayOfWeek, "time", e.target.value)}
                    className="min-h-11 w-full rounded-lg bg-surface px-3 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
                  >
                    {TIME_SLOTS.map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>

                  {(() => {
                    const { service, hours } = parseProduct(slot.product);
                    return (
                      <>
                        <label className="sr-only" htmlFor={`service-${slot.dayOfWeek}`}>Cleaning type for {dayLabel}</label>
                        <select
                          id={`service-${slot.dayOfWeek}`}
                          value={service}
                          onChange={(e) => updateSlot(slot.dayOfWeek, "service", e.target.value)}
                          className="min-h-11 w-full rounded-lg bg-surface px-3 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
                        >
                          {SERVICES.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>

                        <label className="sr-only" htmlFor={`hours-${slot.dayOfWeek}`}>Duration for {dayLabel}</label>
                        <select
                          id={`hours-${slot.dayOfWeek}`}
                          value={hours}
                          onChange={(e) => updateSlot(slot.dayOfWeek, "hours", e.target.value)}
                          className="min-h-11 w-full rounded-lg bg-surface px-3 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
                        >
                          {HOURS.map((h) => (<option key={h} value={h}>{h}</option>))}
                        </select>
                      </>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => toggleDay(slot.dayOfWeek)}
                    aria-label={`Remove ${dayLabel}`}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-secondary transition-all duration-300 hover:rotate-90 hover:scale-110 hover:bg-surface hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30 active:scale-95"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {slots.length > 0 ? (
        <div key={highlightKey} className="animate-update-highlight rounded-xl border border-border bg-primary/5 px-4 py-3 transition-all duration-300">
          <p className="text-xs font-medium text-primary mb-2">
            YOUR SCHEDULE — {slots.length} {slots.length === 1 ? "cleaning" : "cleanings"} per week
          </p>
          <div className="space-y-1">
            {Object.entries(productGroups).map(([product, days]) => (
              <p key={product} className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{days.join(", ")}</span>
                {" — "}{product}
              </p>
            ))}
          </div>
          {Object.keys(productGroups).length > 1 && (
            <p className="mt-2 text-xs text-text-secondary border-t border-border/50 pt-2">
              Multiple services selected - we will create separate plans per service type.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-5 text-center">
          <p className="text-sm font-medium text-text-secondary">No days selected yet</p>
          <p className="mt-1 text-xs text-text-secondary">Pick the days above to build your schedule.</p>
        </div>
      )}
    </div>
  );
}

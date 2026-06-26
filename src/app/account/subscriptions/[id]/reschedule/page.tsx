"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { PageHeader } from "@/components/account/AccountPrimitives";
import { getSubscription, formatAccountDate } from "@/lib/mock-account-data";

const PAYMENT_LEAD_DAYS = 3; // Payment collects 3 days before a visit

export default function ReschedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const subscription = getSubscription(id);

  const [rescheduleType, setRescheduleType] = useState<"subscription" | "booking" | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Plan not found</p>
      </div>
    );
  }

  // ── Eligibility: check if the next visit is within the payment window ────────
  const nextVisitDate = new Date(subscription.nextVisit + "T12:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilNextVisit = Math.ceil((nextVisitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const paymentAlreadyStarted = daysUntilNextVisit <= PAYMENT_LEAD_DAYS;
  const nextVisitPaymentStatus = subscription.upcomingVisits[0]?.paymentStatus;
  const isIneligibleForSubscriptionReschedule =
    paymentAlreadyStarted ||
    nextVisitPaymentStatus === "retrying" ||
    nextVisitPaymentStatus === "confirmed";

  // ── Calendar helpers ─────────────────────────────────────────────────────────
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    // Subscription reschedule: must be at least 7 days from now and not within 3 days of next visit payment
    const minDays = rescheduleType === "subscription" ? Math.max(7, daysUntilNextVisit + 1) : 1;
    for (let i = minDays; i <= 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.add(date.toISOString().split("T")[0]);
    }
    return dates;
  }, [rescheduleType, daysUntilNextVisit]);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (string | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  }, [currentMonth]);

  // ── Skipped occurrences preview (for subscription reschedule) ────────────────
  const skippedOccurrences = useMemo(() => {
    if (rescheduleType !== "subscription" || !selectedDate) return [];
    // For non-custom: generate recurrence between now and the new date
    // Simplified: flag nextVisit as skipped if it falls before the new date
    const newDate = new Date(selectedDate + "T12:00:00");
    const skipped: string[] = [];
    subscription.upcomingVisits.forEach((visit) => {
      const visitDate = new Date(visit.date + "T12:00:00");
      if (visitDate < newDate && visitDate > today) {
        skipped.push(visit.date);
      }
    });
    return skipped;
  }, [rescheduleType, selectedDate, subscription.upcomingVisits]);

  // ── New recurrence preview (after selected date) ─────────────────────────────
  const recurrencePreview = useMemo(() => {
    if (rescheduleType !== "subscription" || !selectedDate || subscription.type === "custom") return [];
    const cadenceWeeks = subscription.type === "biweekly" ? 2 : subscription.type === "weekly" ? 1 : 4;
    const dates: string[] = [];
    const base = new Date(selectedDate + "T12:00:00");
    for (let i = 1; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + cadenceWeeks * 7 * i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }, [rescheduleType, selectedDate, subscription.type]);

  const formatFullDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(
      new Date(dateStr + "T12:00:00")
    );

  const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentMonth);

  const handleConfirm = () => {
    if (!selectedDate) return;
    console.log(`${rescheduleType} reschedule to ${selectedDate}${selectedTime ? " at " + selectedTime : ""}`);
    router.push(`/account/subscriptions/${subscription.id}?rescheduled=true`);
  };

  // ── Step 1: Pick reschedule type ─────────────────────────────────────────────
  if (!rescheduleType) {
    return (
      <>
        <Link
          href={`/account/subscriptions/${subscription.id}`}
          className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to plan
        </Link>

        <PageHeader
          title="Reschedule cleaning"
          description="Choose what you would like to reschedule — just one visit, or your whole subscription schedule."
        />

        <div className="mt-2 grid gap-4 sm:grid-cols-2 max-w-2xl">
          {/* Subscription-level reschedule */}
          <button
            onClick={() => !isIneligibleForSubscriptionReschedule && setRescheduleType("subscription")}
            disabled={isIneligibleForSubscriptionReschedule}
            className={[
              "relative rounded-2xl border p-5 text-left transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
              isIneligibleForSubscriptionReschedule
                ? "border-border bg-surface-muted opacity-60 cursor-not-allowed"
                : "border-border bg-surface hover:border-primary/40 hover:bg-surface-muted active:translate-y-px cursor-pointer",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarDays className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-text-primary">Move the whole schedule</p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Shift your subscription to a new start date. All future visits move forward.
                </p>
              </div>
            </div>
            {isIneligibleForSubscriptionReschedule && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/25 bg-warning/10 px-3 py-2 text-xs">
                <AlertCircle className="size-3.5 shrink-0 text-warning mt-0.5" />
                <span className="text-text-secondary">
                  {paymentAlreadyStarted
                    ? `Payment for the next visit is within ${PAYMENT_LEAD_DAYS} days. Reschedule the individual booking instead.`
                    : "Payment has already started for the next visit."}
                </span>
              </div>
            )}
          </button>

          {/* Booking-level reschedule */}
          <button
            onClick={() => setRescheduleType("booking")}
            className="rounded-2xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:border-primary/40 hover:bg-surface-muted active:translate-y-px cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-secondary">
                <CalendarDays className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-text-primary">Move just one visit</p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Pick a new date for your next cleaning only. Your subscription schedule stays the same.
                </p>
              </div>
            </div>
            {isIneligibleForSubscriptionReschedule && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
                <Info className="size-3.5 shrink-0 text-primary mt-0.5" />
                <span className="text-text-secondary font-bold text-primary">Recommended for your next visit.</span>
              </div>
            )}
          </button>
        </div>

        {/* Explanation of the difference */}
        <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-surface-muted p-5">
          <p className="text-xs font-bold text-text-secondary mb-3">HOW RESCHEDULING WORKS</p>
          <div className="space-y-3 text-sm text-text-secondary leading-6">
            <p>
              <span className="font-bold text-text-primary">Moving the schedule</span> changes the subscription anchor date.
              Any visits between now and the new date are skipped — no bookings, no charges for those occurrences.
            </p>
            <p>
              <span className="font-bold text-text-primary">Moving one visit</span> only affects your next booking.
              Your subscription keeps its original rhythm — the visit after will follow the normal schedule.
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Step 2: Calendar ─────────────────────────────────────────────────────────
  return (
    <>
      <button
        onClick={() => { setRescheduleType(null); setSelectedDate(null); setSelectedTime(null); }}
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </button>

      <PageHeader
        title={rescheduleType === "subscription" ? "Move your schedule" : "Change this visit"}
        description={
          rescheduleType === "subscription"
            ? "Pick a new anchor date for your subscription. Visits between now and this date will be skipped."
            : "Choose a new date for your next cleaning. Your subscription schedule stays the same."
        }
      />

      {/* Mobile: selected date preview */}
      {selectedDate && selectedTime && (
        <div className="lg:hidden rounded-xl bg-surface border border-border p-4 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wide">New date selected</p>
              <p className="mt-1.5 text-base font-bold text-text-primary">{formatFullDate(selectedDate)}</p>
              <p className="text-sm text-text-secondary">{selectedTime}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar section */}
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">{monthYear}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-text-primary hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-text-primary hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Next month"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-text-secondary py-1">{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {calendarDays.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="h-10 w-full" />;
              const isAvailable = availableDates.has(date);
              const isSelected = selectedDate === date;
              const dayNum = new Date(date + "T12:00:00").getDate();
              return (
                <button
                  key={date}
                  onClick={() => { isAvailable && setSelectedDate(date); setSelectedTime(null); }}
                  disabled={!isAvailable}
                  aria-label={`${formatFullDate(date)}${isAvailable ? "" : ", unavailable"}`}
                  aria-pressed={isSelected}
                  className={[
                    "h-10 w-full rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(21,94,99,0.24)]"
                      : isAvailable
                        ? "bg-surface-muted text-text-primary hover:bg-background hover:shadow-[0_2px_8px_rgba(21,94,99,0.12)] cursor-pointer"
                        : "text-text-secondary/40 cursor-not-allowed",
                  ].join(" ")}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Time slot selection */}
          {selectedDate && (
            <div className="mb-6">
              <p className="text-sm font-bold text-text-primary mb-3">Select arrival window</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    aria-pressed={selectedTime === slot}
                    className={[
                      "px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      selectedTime === slot
                        ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(21,94,99,0.24)]"
                        : "bg-surface-muted text-text-primary hover:bg-background cursor-pointer",
                    ].join(" ")}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subscription reschedule: skipped visits preview */}
          {rescheduleType === "subscription" && selectedDate && skippedOccurrences.length > 0 && (
            <div className="mb-6 rounded-xl border border-warning/25 bg-warning/10 p-4">
              <p className="text-xs font-bold text-warning mb-2">
                {skippedOccurrences.length} VISIT{skippedOccurrences.length > 1 ? "S" : ""} WILL BE SKIPPED
              </p>
              <div className="space-y-1">
                {skippedOccurrences.map((date) => (
                  <p key={date} className="text-sm text-text-secondary">
                    ✕ {formatAccountDate(date)} — no booking, no charge
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Subscription reschedule: new recurrence preview */}
          {rescheduleType === "subscription" && selectedDate && recurrencePreview.length > 0 && (
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-bold text-primary mb-2">UPCOMING AFTER NEW DATE</p>
              <div className="space-y-1">
                {recurrencePreview.map((date) => (
                  <p key={date} className="text-sm text-text-secondary">
                    → {formatAccountDate(date)}
                  </p>
                ))}
              </div>
              <p className="mt-2 text-xs text-text-secondary">Payment for each visit collects 3 days before.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="w-full flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
            >
              {rescheduleType === "subscription" ? "Confirm new schedule date" : "Confirm new visit date"}
            </button>
            <Link
              href={`/account/subscriptions/${subscription.id}`}
              className="w-full flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-bold text-text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
            >
              Cancel
            </Link>
          </div>
        </section>

        {/* Sidebar: current visit details */}
        <aside className="rounded-2xl border border-border bg-surface-muted p-5">
          <h3 className="text-base font-bold text-text-primary">
            {rescheduleType === "subscription" ? "Current schedule" : "Current visit"}
          </h3>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Service</p>
              <p className="mt-1.5 text-base font-bold text-text-primary">{subscription.service}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">
                {rescheduleType === "subscription" ? "Next scheduled visit" : "Current date"}
              </p>
              <p className="mt-1.5 text-base font-bold text-text-primary">{formatAccountDate(subscription.nextVisit)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Time window</p>
              <p className="mt-1.5 text-base font-bold text-text-primary">{subscription.arrivalWindow}</p>
            </div>
            {rescheduleType === "subscription" && (
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">How often</p>
                <p className="mt-1.5 text-base font-bold text-text-primary">{subscription.cadence}</p>
              </div>
            )}

            {/* Desktop: selected date preview */}
            {selectedDate && selectedTime && (
              <div className="hidden lg:block pt-4 border-t border-border">
                <div className="rounded-xl bg-surface border border-border p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wide">New date selected</p>
                      <p className="mt-1.5 text-base font-bold text-text-primary">{formatFullDate(selectedDate)}</p>
                      <p className="text-sm text-text-secondary">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

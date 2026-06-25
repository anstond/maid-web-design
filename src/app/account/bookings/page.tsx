"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { ActionLink, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { bookings, formatAccountDate } from "@/lib/mock-account-data";

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past">("all");
  const upcoming = bookings.filter((booking) => booking.status !== "completed" && booking.status !== "cancelled");
  const past = bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled");
  const needsAttention = bookings.find((booking) => booking.status === "needs_attention");
  const nextVisit = upcoming[0];

  const showUpcoming = activeFilter === "all" || activeFilter === "upcoming";
  const showPast = activeFilter === "all" || activeFilter === "past";

  return (
    <>
      <PageHeader
        title="Your cleaning visits"
        description="See what's scheduled, completed visits, and view receipts and photos."
        action={<ActionLink href="/booking">Book a cleaning</ActionLink>}
      />

      {nextVisit && (
        <section className="mb-6 sm:mb-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">✓ Your next visit</span>
              </div>

              <div className="mt-4 sm:mt-5 rounded-2xl bg-primary p-4 sm:p-6 text-primary-foreground">
                <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-primary-foreground/72">{formatAccountDate(nextVisit.date).replace(/, \d{4}$/, "")}</p>
                      <p className="mt-2 text-4xl sm:text-5xl font-bold leading-tight tracking-normal">{formatAccountDate(nextVisit.date).split(" ")[1].replace(",", "")}</p>
                    </div>
                    <p className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-primary-foreground/80">{nextVisit.arrivalWindow}</p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-normal text-primary-foreground">{nextVisit.service}</h2>
                      <p className="mt-2 text-xs sm:text-sm text-primary-foreground/80 leading-5">
                        {nextVisit.cleaner} • {nextVisit.home}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-primary-foreground/20 sm:border-t-0">
                      <StatusPill status={nextVisit.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex flex-col gap-2">
                <Link
                  href={`/account/bookings/${nextVisit.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover active:translate-y-px"
                >
                  View details
                  <ArrowRight className="ml-2 size-3" />
                </Link>
              </div>
            </div>

            <aside className="border-t border-border bg-surface-muted px-4 py-5 sm:p-6 lg:border-l lg:border-t-0">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary">Ready when you are</h2>
              <div className="mt-4 grid gap-2 sm:gap-3">
                {[nextVisit].map((visit) => (
                  <div key={visit.id} className="rounded-2xl bg-surface p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-bold text-text-primary">{formatAccountDate(visit.date)}</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-text-secondary">{visit.arrivalWindow}</p>
                    <p className="mt-1 sm:mt-2 text-xs font-bold text-primary">{visit.status}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      )}

      {needsAttention && (
        <div className="mb-6 sm:mb-8 rounded-2xl border border-error/25 bg-error/5 px-4 py-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-error" />
            <div className="flex-1">
              <p className="text-sm sm:text-base font-bold text-error">We need some details</p>
              <p className="mt-1 text-xs sm:text-sm leading-6 text-text-secondary">{needsAttention.notes}</p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/account/bookings/${needsAttention.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-error px-4 text-sm font-bold text-white transition hover:bg-error/90 active:scale-95"
                >
                  Complete booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`inline-flex min-h-10 items-center rounded-full px-4 text-xs sm:text-sm font-bold transition ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-surface text-text-primary hover:bg-surface-muted"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("upcoming")}
          className={`inline-flex min-h-10 items-center rounded-full px-4 text-xs sm:text-sm font-bold transition ${
            activeFilter === "upcoming"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-surface text-text-primary hover:bg-surface-muted"
          }`}
        >
          Scheduled {upcoming.length > 0 && <span className="ml-2 text-[11px]">({upcoming.length})</span>}
        </button>
        <button
          onClick={() => setActiveFilter("past")}
          className={`inline-flex min-h-10 items-center rounded-full px-4 text-xs sm:text-sm font-bold transition ${
            activeFilter === "past"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-surface text-text-primary hover:bg-surface-muted"
          }`}
        >
          History {past.length > 0 && <span className="ml-2 text-[11px]">({past.length})</span>}
        </button>
      </div>

      {showUpcoming && upcoming.length > 0 && (
        <SummaryCard title={`Scheduled cleanings (${upcoming.length})`}>
          <div className="grid gap-3">
            {upcoming.map((booking) => (
              <UpcomingBookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </SummaryCard>
      )}

      {showPast && past.length > 0 && (
        <SummaryCard title={`Your cleaning history (${past.length})`}>
          <div className="grid gap-3">
            {past.map((booking) => (
              <PastBookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </SummaryCard>
      )}

      {showUpcoming && upcoming.length === 0 && showPast && past.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8 text-center">
          <p className="text-base sm:text-lg font-bold text-text-primary">No cleanings scheduled yet</p>
          <p className="mt-2 text-sm text-text-secondary">Book your first cleaning to get started.</p>
          <Link href="/booking" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-hover transition">
            Book a cleaning
          </Link>
        </div>
      )}
    </>
  );
}

function UpcomingBookingRow({ booking }: { booking: (typeof bookings)[number] }) {
  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      className="group grid gap-2 sm:gap-3 rounded-2xl bg-surface-muted p-3 sm:p-4 transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <div>
        <span className="flex text-sm sm:text-base font-bold text-text-primary">{formatAccountDate(booking.date)}</span>
        <span className="mt-0.5 sm:mt-1 block text-xs sm:text-sm text-text-secondary">{booking.arrivalWindow} • {booking.service}</span>
        <span className="mt-0.5 block text-xs text-text-secondary">{booking.cleaner}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <StatusPill status={booking.status} />
        <ArrowRight className="size-3.5 sm:size-4 text-primary opacity-0 transition group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function PastBookingRow({ booking }: { booking: (typeof bookings)[number] }) {
  const arrivalTime = booking.timeline.find((item) => item.label.toLowerCase().includes("arrived"))?.time || "N/A";
  const completionTime = booking.timeline.find((item) => item.label.toLowerCase().includes("complete"))?.time || "N/A";

  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      className="group grid gap-2 sm:gap-3 rounded-2xl bg-surface-muted p-3 sm:p-4 transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <div>
        <span className="flex text-sm sm:text-base font-bold text-text-primary">✓ {formatAccountDate(booking.date)}</span>
        <span className="mt-0.5 sm:mt-1 block text-xs sm:text-sm text-text-secondary">{arrivalTime} – {completionTime}</span>
        <span className="mt-0.5 block text-xs sm:text-sm text-text-secondary">{booking.service} with {booking.cleaner}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <StatusPill status={booking.status} />
        <ArrowRight className="size-3.5 sm:size-4 text-primary opacity-0 transition group-hover:opacity-100" />
      </div>
    </Link>
  );
}

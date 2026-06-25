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
        title="Bookings"
        description="Your cleaning visits and history in one place."
        action={<ActionLink href="/booking">Book cleaning</ActionLink>}
      />

      {nextVisit && (
        <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Next cleaning</span>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-[128px_minmax(0,1fr)]">
                <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
                  <p className="text-sm font-bold text-primary-foreground/72">{formatAccountDate(nextVisit.date).replace(/, \d{4}$/, "")}</p>
                  <p className="mt-3 text-4xl font-bold leading-none tracking-normal">{formatAccountDate(nextVisit.date).split(" ")[1].replace(",", "")}</p>
                  <p className="mt-3 text-sm font-bold text-primary-foreground/80">{nextVisit.arrivalWindow}</p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold tracking-normal text-text-primary md:text-4xl">{nextVisit.service}</h2>
                  <p className="mt-3 max-w-[58ch] text-base leading-7 text-text-secondary">
                    {nextVisit.cleaner}. Your {nextVisit.home.toLowerCase()}.
                  </p>
                  <div className="mt-5">
                    <StatusPill status={nextVisit.status} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/account/bookings/${nextVisit.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover active:translate-y-px"
                >
                  View details
                  <ArrowRight className="ml-2 size-3" />
                </Link>
              </div>
            </div>

            <aside className="border-t border-border bg-surface-muted p-5 sm:p-6 lg:border-l lg:border-t-0">
              <h2 className="text-xl font-bold text-text-primary">What happens next</h2>
              <div className="mt-4 grid gap-3">
                {[nextVisit].map((visit) => (
                  <div key={visit.id} className="rounded-2xl bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-text-primary">{formatAccountDate(visit.date)}</p>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{visit.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{visit.arrivalWindow}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      )}

      {needsAttention && (
        <div className="mb-8 rounded-2xl border border-error/25 bg-error/5 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-error" />
            <div className="flex-1">
              <p className="font-bold text-error">Action needed</p>
              <p className="mt-1 text-sm text-text-secondary">{needsAttention.notes}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/account/bookings/${needsAttention.id}`}
                  className="inline-flex min-h-9 items-center rounded-full bg-error px-4 text-xs font-bold text-white transition hover:bg-error/90 active:scale-95"
                >
                  Add details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-bold transition ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-surface text-text-primary hover:bg-surface-muted"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("upcoming")}
          className={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-bold transition ${
            activeFilter === "upcoming"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-surface text-text-primary hover:bg-surface-muted"
          }`}
        >
          Upcoming {upcoming.length > 0 && <span className="ml-2 text-[10px]">({upcoming.length})</span>}
        </button>
        <button
          onClick={() => setActiveFilter("past")}
          className={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-bold transition ${
            activeFilter === "past"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-surface text-text-primary hover:bg-surface-muted"
          }`}
        >
          Past {past.length > 0 && <span className="ml-2 text-[10px]">({past.length})</span>}
        </button>
      </div>

      {showUpcoming && upcoming.length > 0 && (
        <SummaryCard title={`Upcoming (${upcoming.length})`}>
          <div className="grid gap-3">
            {upcoming.map((booking) => (
              <UpcomingBookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </SummaryCard>
      )}

      {showPast && past.length > 0 && (
        <SummaryCard title={`Past (${past.length})`}>
          <div className="grid gap-3">
            {past.map((booking) => (
              <PastBookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </SummaryCard>
      )}

      {showUpcoming && upcoming.length === 0 && showPast && past.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface-muted p-8 text-center">
          <p className="text-sm text-text-secondary">No bookings found.</p>
        </div>
      )}
    </>
  );
}

function UpcomingBookingRow({ booking }: { booking: (typeof bookings)[number] }) {
  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      className="group grid gap-3 rounded-2xl bg-surface-muted p-4 transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <div>
        <span className="flex font-bold text-text-primary">{formatAccountDate(booking.date)}</span>
        <span className="mt-1 block text-sm text-text-secondary">{booking.arrivalWindow}. {booking.service}. {booking.cleaner}.</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusPill status={booking.status} />
        <ArrowRight className="size-4 text-primary opacity-0 transition group-hover:opacity-100" />
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
      className="group grid gap-3 rounded-2xl bg-surface-muted p-4 transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <div>
        <span className="flex font-bold text-text-primary">{formatAccountDate(booking.date)}</span>
        <span className="mt-1 block text-sm text-text-secondary">{arrivalTime} – {completionTime}. {booking.service}. {booking.cleaner}.</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusPill status={booking.status} />
        <ArrowRight className="size-4 text-primary opacity-0 transition group-hover:opacity-100" />
      </div>
    </Link>
  );
}

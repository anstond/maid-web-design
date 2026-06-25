import Link from "next/link";
import type { ReactNode } from "react";
import { AlertCircle, ArrowRight, CalendarDays, Clock3, CreditCard, KeyRound, MapPin, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { ActionLink, Money, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { bookings, formatAccountDate } from "@/lib/mock-account-data";

export default function BookingsPage() {
  const upcoming = bookings.filter((booking) => booking.status !== "completed" && booking.status !== "cancelled");
  const past = bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled");
  const needsAttention = bookings.find((booking) => booking.status === "needs_attention");
  const nextVisit = upcoming[0];
  const scheduledCount = upcoming.filter((booking) => booking.status === "scheduled").length;

  return (
    <>
      <PageHeader
        title="Bookings"
        description="A cleaner visit calendar with the next arrival, open prep items, and receipts kept in one place."
        action={<ActionLink href="/booking">Book cleaning</ActionLink>}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_58px_rgba(21,94,99,0.18)]">
          {nextVisit ? (
            <div className="grid gap-0 md:grid-cols-[168px_minmax(0,1fr)]">
              <div className="flex flex-col justify-between bg-primary-hover p-5 sm:p-6">
                <div>
                  <p className="text-sm font-bold text-primary-foreground/70">Next visit</p>
                  <p className="mt-3 text-4xl font-bold leading-none tracking-normal">{formatAccountDate(nextVisit.date).split(" ")[1].replace(",", "")}</p>
                  <p className="mt-2 text-sm font-bold text-primary-foreground/72">{formatAccountDate(nextVisit.date).replace(/, \d{4}$/, "")}</p>
                </div>
                <p className="mt-8 text-sm font-bold text-primary-foreground/80">{nextVisit.arrivalWindow}</p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary-foreground px-3 py-1 text-xs font-bold capitalize text-primary">{nextVisit.status.replaceAll("_", " ")}</span>
                  <span className="rounded-full bg-primary-foreground/12 px-3 py-1 text-xs font-bold text-primary-foreground/80">{nextVisit.frequency}</span>
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-normal md:text-4xl">{nextVisit.service}</h2>
                <p className="mt-3 max-w-[58ch] text-base leading-7 text-primary-foreground/78">
                  {nextVisit.cleaner} for {nextVisit.home.toLowerCase()} at {nextVisit.address}.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <HeroFact icon={<UsersRound className="size-4" />} label="Team" value={nextVisit.team} />
                  <HeroFact icon={<Sparkles className="size-4" />} label="Supplies" value={nextVisit.supplies} />
                  <HeroFact icon={<CreditCard className="size-4" />} label="Payment" value={nextVisit.paymentStatus} />
                </div>
                <Link
                  href={`/account/bookings/${nextVisit.id}`}
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-foreground px-5 text-sm font-bold text-primary transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/30 active:translate-y-px"
                >
                  View visit
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              <h2 className="text-3xl font-bold tracking-normal">No upcoming visits</h2>
              <p className="mt-3 max-w-[58ch] text-base leading-7 text-primary-foreground/78">Book a cleaning when you are ready. Your past visits stay available below.</p>
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
          {needsAttention ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="flex size-11 items-center justify-center rounded-full bg-error/10 text-error">
                  <AlertCircle className="size-5" aria-hidden="true" />
                </div>
                <StatusPill status={needsAttention.status} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-text-primary">Finish access before assignment</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{needsAttention.notes}</p>
              <div className="mt-4 grid gap-2 text-sm">
                <PrepLine icon={<KeyRound className="size-4" />} label="Access" value={needsAttention.access} />
                <PrepLine icon={<Clock3 className="size-4" />} label="Visit" value={`${formatAccountDate(needsAttention.date)}, ${needsAttention.arrivalWindow}`} />
              </div>
              <Link
                href={`/account/bookings/${needsAttention.id}`}
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-error px-5 text-sm font-bold text-white transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-error/30 active:translate-y-px"
              >
                Add details
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">Ready</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-text-primary">Ready for the next visit</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Your upcoming bookings have the details needed for assignment.
              </p>
            </>
          )}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <MiniStat label="Upcoming" value={String(upcoming.length)} />
            <MiniStat label="Scheduled" value={String(scheduledCount)} />
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-6">
        <SummaryCard title="Upcoming visits">
          <div className="grid gap-3">
            {upcoming.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} featured={booking.id === nextVisit?.id} />
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Past visits">
          <div className="grid gap-3">
            {past.map((booking) => (
              <PastBookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </SummaryCard>
      </div>
    </>
  );
}

function BookingListCard({ booking, featured = false }: { booking: (typeof bookings)[number]; featured?: boolean }) {
  const [startTime] = booking.arrivalWindow.split(" - ");

  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      className="group grid overflow-hidden rounded-2xl border border-border bg-surface-muted transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 lg:grid-cols-[136px_minmax(0,1fr)_184px]"
    >
      <div className={featured ? "bg-primary p-4 text-primary-foreground" : "bg-surface p-4 text-text-primary"}>
        <p className={featured ? "text-xs font-bold text-primary-foreground/70" : "text-xs font-bold text-text-secondary"}>{formatAccountDate(booking.date).split(",")[0]}</p>
        <p className="mt-2 text-2xl font-bold tracking-normal">{startTime}</p>
        <p className={featured ? "mt-2 text-sm text-primary-foreground/75" : "mt-2 text-sm text-text-secondary"}>{booking.arrivalWindow.split(" - ")[1]}</p>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={booking.status} />
          <span className="text-sm font-bold text-text-secondary">{booking.frequency}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-text-primary">{booking.service}</h2>
        <div className="mt-4 grid gap-3 text-sm text-text-secondary md:grid-cols-2">
          <span className="flex gap-2">
            <MapPin className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {booking.address}
          </span>
          <span className="flex gap-2">
            <UsersRound className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {booking.team}
          </span>
          <span className="flex gap-2">
            <Sparkles className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {booking.cleaner}
          </span>
          <span className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {booking.paymentStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border p-4 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0">
        <span className="text-sm font-semibold text-text-secondary">Total</span>
        <span className="text-2xl font-bold text-primary">
          <Money value={booking.total} />
        </span>
        <span className="text-sm font-bold text-primary opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">View details</span>
      </div>
    </Link>
  );
}

function HeroFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary-foreground/10 p-3">
      <div className="flex items-center gap-2 text-primary-foreground/70">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <p className="mt-2 text-sm font-bold leading-5 text-primary-foreground">{value}</p>
    </div>
  );
}

function PrepLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-surface-muted p-3">
      <span className="mt-0.5 text-error">{icon}</span>
      <span>
        <span className="block text-xs font-bold text-text-secondary">{label}</span>
        <span className="mt-1 block font-bold leading-5 text-text-primary">{value}</span>
      </span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-muted p-3">
      <p className="text-xs font-bold text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

function PastBookingRow({ booking }: { booking: (typeof bookings)[number] }) {
  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      className="grid gap-3 rounded-2xl bg-surface-muted p-4 transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-bold text-text-primary">{booking.service}</h3>
          <StatusPill status={booking.status} />
        </div>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {formatAccountDate(booking.date)} from {booking.arrivalWindow}. {booking.cleaner}.
        </p>
      </div>
      <span className="text-sm font-bold text-primary">Receipt</span>
    </Link>
  );
}

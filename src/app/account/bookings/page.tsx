import Link from "next/link";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, MapPin, Sparkles, UsersRound } from "lucide-react";
import { ActionLink, HeroPanel, MetricCard, MetricGrid, Money, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { bookings, formatAccountDate } from "@/lib/mock-account-data";

export default function BookingsPage() {
  const upcoming = bookings.filter((booking) => booking.status !== "completed" && booking.status !== "cancelled");
  const past = bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled");
  const needsAttention = bookings.find((booking) => booking.status === "needs_attention");
  const nextVisit = upcoming[0];
  const upcomingTotal = upcoming.reduce((sum, booking) => sum + booking.total, 0);

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Bookings"
        description="A cleaner view of every appointment: what is scheduled, what needs action, who is assigned, and what you are paying."
        action={<ActionLink href="/booking">Book cleaning</ActionLink>}
      />

      <MetricGrid>
        <MetricCard label="Next visit" value={nextVisit ? formatAccountDate(nextVisit.date) : "None"} helper={nextVisit ? nextVisit.arrivalWindow : "No upcoming booking"} icon={<CalendarDays className="size-5" aria-hidden="true" />} tone="strong" />
        <MetricCard label="Open bookings" value={String(upcoming.length)} helper="Scheduled or waiting on details" icon={<Clock3 className="size-5" aria-hidden="true" />} />
        <MetricCard label="Needs attention" value={needsAttention ? "1" : "0"} helper={needsAttention ? needsAttention.paymentStatus : "No blocked bookings"} icon={<AlertCircle className="size-5" aria-hidden="true" />} tone={needsAttention ? "attention" : "default"} />
        <MetricCard label="Upcoming total" value={`$${upcomingTotal.toFixed(0)}`} helper="Authorized or expected charges" icon={<CheckCircle2 className="size-5" aria-hidden="true" />} />
      </MetricGrid>

      {needsAttention ? (
        <HeroPanel
          title="One booking needs access details"
          description={`${needsAttention.id} cannot be assigned until the lockbox or smart-lock instructions are complete.`}
          action={<ActionLink href={`/account/bookings/${needsAttention.id}`}>Resolve</ActionLink>}
        />
      ) : null}

      <div className="grid gap-6">
        <SummaryCard title="Upcoming">
          <div className="grid gap-4">
            {upcoming.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} featured={booking.id === nextVisit?.id} />
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Completed">
          <div className="grid gap-4">
            {past.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} />
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
      className="group grid overflow-hidden rounded-2xl border border-border bg-surface-muted transition hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 lg:grid-cols-[124px_minmax(0,1fr)_190px]"
    >
      <div className={featured ? "bg-primary p-4 text-primary-foreground" : "bg-surface p-4 text-text-primary"}>
        <p className={featured ? "text-xs font-bold text-primary-foreground/70" : "text-xs font-bold text-text-secondary"}>{formatAccountDate(booking.date).split(",")[0]}</p>
        <p className="mt-2 text-2xl font-bold tracking-normal">{startTime}</p>
        <p className={featured ? "mt-2 text-sm text-primary-foreground/75" : "mt-2 text-sm text-text-secondary"}>{booking.id}</p>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={booking.status} />
          <span className="text-sm font-bold text-text-secondary">{booking.paymentStatus}</span>
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
            {booking.arrivalWindow}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border p-4 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0">
        <span className="text-sm font-semibold text-text-secondary">{booking.frequency}</span>
        <span className="text-2xl font-bold text-primary">
          <Money value={booking.total} />
        </span>
        <span className="text-sm font-bold text-primary opacity-0 transition group-hover:opacity-100">View details</span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { CalendarDays, MapPin, Sparkles, UsersRound } from "lucide-react";
import { ActionLink, Money, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { bookings, formatAccountDate } from "@/lib/mock-account-data";

export default function BookingsPage() {
  const upcoming = bookings.filter((booking) => booking.status !== "completed" && booking.status !== "cancelled");
  const past = bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled");

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Bookings"
        description="Track upcoming cleanings, review completed visits, and open the full operational detail for each appointment."
        action={<ActionLink href="/booking">Book another cleaning</ActionLink>}
      />

      <div className="grid gap-6">
        <SummaryCard title="Upcoming bookings">
          <div className="grid gap-4">
            {upcoming.map((booking) => (
              <BookingListCard key={booking.id} booking={booking} />
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Past bookings">
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

function BookingListCard({ booking }: { booking: (typeof bookings)[number] }) {
  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      className="grid gap-4 rounded-2xl border border-border bg-surface-muted p-4 transition hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 lg:grid-cols-[minmax(0,1fr)_180px]"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={booking.status} />
          <span className="text-sm font-bold text-text-secondary">{booking.id}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-text-primary">{booking.service}</h2>
        <div className="mt-4 grid gap-3 text-sm text-text-secondary sm:grid-cols-2">
          <span className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {formatAccountDate(booking.date)}, {booking.arrivalWindow}
          </span>
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
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-border pt-4 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
        <span className="text-sm font-semibold text-text-secondary">{booking.paymentStatus}</span>
        <span className="text-2xl font-bold text-primary">
          <Money value={booking.total} />
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CreditCard, MessageCircle } from "lucide-react";
import { DetailRow, Money, PageHeader, SecondaryButton, StatusPill, SummaryCard, Timeline } from "@/components/account/AccountPrimitives";
import { bookings, formatAccountDate, getBooking } from "@/lib/mock-account-data";

export function generateStaticParams() {
  return bookings.map((booking) => ({ id: booking.id }));
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = getBooking(id);

  if (!booking) notFound();

  return (
    <>
      <Link href="/account/bookings" className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to bookings
      </Link>

      <PageHeader
        eyebrow={booking.id}
        title={booking.service}
        description={`${formatAccountDate(booking.date)} between ${booking.arrivalWindow} at ${booking.address}.`}
        action={<StatusPill status={booking.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <SummaryCard title="Appointment">
            <dl>
              <DetailRow label="Date and time" value={`${formatAccountDate(booking.date)}, ${booking.arrivalWindow}`} />
              <DetailRow label="Home" value={`${booking.address} · ${booking.home}`} />
              <DetailRow label="Team" value={booking.team} />
              <DetailRow label="Cleaner" value={booking.cleaner} />
              <DetailRow label="Frequency" value={booking.frequency} />
            </dl>
          </SummaryCard>

          <SummaryCard title="Service scope">
            <div className="grid gap-3">
              {booking.addons.map((addon) => (
                <div key={addon.label} className="flex items-center justify-between rounded-xl bg-surface-muted p-3 text-sm">
                  <span className="font-bold text-text-primary">{addon.label}</span>
                  <span className="font-bold text-primary">
                    <Money value={addon.price} />
                  </span>
                </div>
              ))}
              {booking.addons.length === 0 ? <p className="text-sm text-text-secondary">No extra tasks added.</p> : null}
            </div>
          </SummaryCard>

          <SummaryCard title="Arrival notes">
            <dl>
              <DetailRow label="Access" value={booking.access} />
              <DetailRow label="Parking" value={booking.parking} />
              <DetailRow label="Pets" value={booking.pets} />
              <DetailRow label="Supplies" value={booking.supplies} />
              <DetailRow label="Priority notes" value={booking.notes} />
            </dl>
          </SummaryCard>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <SummaryCard title="Status timeline">
            <Timeline items={booking.timeline} />
          </SummaryCard>

          <SummaryCard title="Payment">
            <dl>
              <DetailRow label="Status" value={booking.paymentStatus} />
              <DetailRow label="Total" value={<Money value={booking.total} />} />
            </dl>
          </SummaryCard>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
            <h2 className="text-lg font-bold text-text-primary">Actions</h2>
            <div className="mt-4 grid gap-3">
              <SecondaryButton>
                <CalendarDays className="mr-2 size-4" aria-hidden="true" />
                Reschedule
              </SecondaryButton>
              <SecondaryButton>
                <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                Message support
              </SecondaryButton>
              <SecondaryButton>
                <CreditCard className="mr-2 size-4" aria-hidden="true" />
                Receipt
              </SecondaryButton>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CreditCard, KeyRound, MapPin, MessageCircle, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { CommandCard, DetailRow, HeroPanel, Money, SecondaryButton, StatusPill, SummaryCard, Timeline } from "@/components/account/AccountPrimitives";
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

      <HeroPanel
        title={`${booking.service} is ${booking.status.replaceAll("_", " ")}`}
        description={`${formatAccountDate(booking.date)} between ${booking.arrivalWindow}. ${booking.cleaner} for ${booking.home}.`}
        action={<StatusPill status={booking.status} />}
      >
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <HeroFact icon={<CalendarDays className="size-4" />} label="Window" value={booking.arrivalWindow} />
          <HeroFact icon={<UsersRound className="size-4" />} label="Team" value={booking.team} />
          <HeroFact icon={<CreditCard className="size-4" />} label="Total" value={`$${booking.total.toFixed(2)}`} />
        </div>
      </HeroPanel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div className="grid gap-6">
          <SummaryCard title="Operational timeline">
            <Timeline items={booking.timeline} />
          </SummaryCard>

          <SummaryCard title="Appointment">
            <dl>
              <DetailRow label="Date and time" value={`${formatAccountDate(booking.date)}, ${booking.arrivalWindow}`} />
              <DetailRow label="Address" value={booking.address} />
              <DetailRow label="Home" value={booking.home} />
              <DetailRow label="Cleaner" value={booking.cleaner} />
              <DetailRow label="Frequency" value={booking.frequency} />
            </dl>
          </SummaryCard>

          <SummaryCard title="Scope and add-ons">
            <div className="grid gap-3 sm:grid-cols-2">
              <ScopeTile icon={<Sparkles className="size-4" />} label="Core service" value={booking.service} />
              <ScopeTile icon={<UsersRound className="size-4" />} label="Team" value={booking.team} />
              {booking.addons.map((addon) => (
                <ScopeTile key={addon.label} icon={<ShieldCheck className="size-4" />} label={addon.label} value={`$${addon.price.toFixed(2)}`} />
              ))}
            </div>
          </SummaryCard>

          <SummaryCard title="Arrival intelligence">
            <div className="grid gap-4 md:grid-cols-2">
              <NoteBlock icon={<KeyRound className="size-4" />} label="Access" value={booking.access} />
              <NoteBlock icon={<MapPin className="size-4" />} label="Parking" value={booking.parking} />
              <NoteBlock icon={<ShieldCheck className="size-4" />} label="Pets" value={booking.pets} />
              <NoteBlock icon={<Sparkles className="size-4" />} label="Priority notes" value={booking.notes} />
            </div>
          </SummaryCard>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <CommandCard title="Command panel" description="Manage timing, support, and payment artifacts for this appointment.">
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
              View receipt
            </SecondaryButton>
          </CommandCard>

          <SummaryCard title="Payment summary">
            <dl>
              <DetailRow label="Status" value={booking.paymentStatus} />
              <DetailRow label="Total" value={<Money value={booking.total} />} />
              <DetailRow label="Supplies" value={booking.supplies} />
            </dl>
          </SummaryCard>

          {booking.status === "needs_attention" ? (
            <div className="rounded-2xl border border-error/25 bg-error/10 p-5">
              <p className="text-sm font-bold text-error">Action needed</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{booking.notes}</p>
              <button className="mt-4 min-h-11 rounded-full bg-error px-5 text-sm font-bold text-white">
                Add access details
              </button>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}

function HeroFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary-foreground/10 p-3">
      <div className="flex items-center gap-2 text-primary-foreground/70">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <p className="mt-2 font-bold text-primary-foreground">{value}</p>
    </div>
  );
}

function ScopeTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-muted p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-bold text-text-primary">{value}</p>
    </div>
  );
}

function NoteBlock({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{value}</p>
    </div>
  );
}

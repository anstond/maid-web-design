"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, CreditCard, KeyRound, MapPin, MessageCircle, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { CommandCard, DetailRow, HeroPanel, Money, SecondaryButton, StatusPill, SummaryCard, Timeline } from "@/components/account/AccountPrimitives";
import { InlineNotificationCard } from "@/components/account/InlineNotificationCard";
import { getBooking, formatAccountDate } from "@/lib/mock-account-data";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const booking = getBooking(id);

  if (!booking) notFound();

  return (
    <>
      <Link href="/account/bookings" className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to bookings
      </Link>

      <HeroPanel
        title={`${booking.service}`}
        description={`${formatAccountDate(booking.date)}, ${booking.arrivalWindow} with ${booking.cleaner} for your ${booking.home}.`}
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
          {booking.status === "completed" && (
            <SummaryCard title="Completed">
              <dl>
                <DetailRow label="Started" value={booking.timeline.find((item) => item.label.toLowerCase().includes("arrived"))?.time || booking.timeline[0]?.time || "N/A"} />
                <DetailRow label="Finished" value={booking.timeline.find((item) => item.label.toLowerCase().includes("complete"))?.time || booking.timeline[booking.timeline.length - 1]?.time || "N/A"} />
                <DetailRow label="Cleaner" value={booking.cleaner} />
              </dl>
              {booking.notes && (
                <div className="mt-5 rounded-2xl border border-border bg-surface-muted p-4">
                  <p className="text-xs font-bold text-text-secondary">Notes from your cleaner</p>
                  <p className="mt-2 text-sm leading-6 text-text-primary">{booking.notes}</p>
                </div>
              )}
              <button className="mt-5 min-h-11 rounded-full border border-border bg-surface px-5 text-sm font-bold text-text-primary transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
                Leave a review
              </button>
            </SummaryCard>
          )}

          <SummaryCard title="Timeline">
            <Timeline items={booking.timeline} />
          </SummaryCard>

          <SummaryCard title="Booking details">
            <dl>
              <DetailRow label="Date and time" value={`${formatAccountDate(booking.date)}, ${booking.arrivalWindow}`} />
              <DetailRow label="Address" value={booking.address} />
              <DetailRow label="Home type" value={booking.home} />
              <DetailRow label="Cleaner" value={booking.cleaner} />
              <DetailRow label="How often" value={booking.frequency} />
            </dl>
          </SummaryCard>

          <SummaryCard title="What's included">
            <div className="grid gap-3 sm:grid-cols-2">
              <ScopeTile icon={<Sparkles className="size-4" />} label="Service" value={booking.service} />
              <ScopeTile icon={<UsersRound className="size-4" />} label="Team" value={booking.team} />
              {booking.addons.map((addon) => (
                <ScopeTile key={addon.label} icon={<ShieldCheck className="size-4" />} label={addon.label} value={`$${addon.price.toFixed(2)}`} />
              ))}
            </div>
          </SummaryCard>

          <SummaryCard title="Arrival details">
            <div className="grid gap-4 md:grid-cols-2">
              <NoteBlock icon={<KeyRound className="size-4" />} label="How to access" value={booking.access} />
              <NoteBlock icon={<MapPin className="size-4" />} label="Parking" value={booking.parking} />
              <NoteBlock icon={<ShieldCheck className="size-4" />} label="Pets at home" value={booking.pets} />
              <NoteBlock icon={<Sparkles className="size-4" />} label="Special requests" value={booking.notes} />
            </div>
          </SummaryCard>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <CommandCard title="Actions" description="Manage or get help with this cleaning.">
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

          <SummaryCard title="Payment">
            <dl>
              <DetailRow label="Status" value={booking.paymentStatus} />
              <DetailRow label="Amount" value={<Money value={booking.total} />} />
              <DetailRow label="Supplies" value={booking.supplies} />
            </dl>
          </SummaryCard>

          {booking.status === "needs_attention" ? (
            <InlineNotificationCard
              tone="error"
              title="Action needed"
              message={booking.notes}
              action={
                <button className="min-h-11 rounded-full bg-error px-5 text-sm font-bold text-white transition hover:bg-error/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-95">
                  Add access details
                </button>
              }
            />
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

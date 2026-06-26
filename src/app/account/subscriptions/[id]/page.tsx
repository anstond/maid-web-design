"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { notFound, useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MessageCircle,
  Pause,
  Play,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UsersRound,
} from "lucide-react";
import {
  CommandCard,
  DetailRow,
  HeroPanel,
  Money,
  SecondaryButton,
  StatusPill,
  SummaryCard,
} from "@/components/account/AccountPrimitives";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatAccountDate, getSubscription, subscriptions, type VisitPaymentStatus } from "@/lib/mock-account-data";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// This page now uses client-side rendering since we need `useParams`
export default function SubscriptionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const subscription = getSubscription(id);
  const [cancelSheetOpen, setCancelSheetOpen] = useState(false);
  const [pauseSheetOpen, setPauseSheetOpen] = useState(false);

  if (!subscription) notFound();

  const isCustom = subscription.type === "custom";
  const isStarted = new Date(subscription.startDate) <= new Date();
  const hasPaymentIssue = subscription.upcomingVisits.some(
    (v) => v.paymentStatus === "retrying" || v.paymentStatus === "failed"
  );

  return (
    <>
      <Link
        href="/account/subscriptions"
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to subscriptions
      </Link>

      {/* Payment issue banner */}
      {hasPaymentIssue && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-error/25 bg-error/5 px-4 py-4">
          <AlertCircle className="size-5 shrink-0 text-error mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-bold text-error">Payment issue — action needed</p>
            <p className="mt-1 text-sm text-text-secondary leading-6">
              One or more upcoming visits have a payment issue. Update your payment method to keep your schedule on track.
            </p>
            <Link
              href="/account/settings"
              className="mt-2 inline-flex min-h-9 items-center rounded-full bg-error px-4 text-sm font-bold text-white transition hover:bg-error/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-error/30"
            >
              Update payment method
            </Link>
          </div>
        </div>
      )}

      <HeroPanel
        title={isCustom
          ? "Custom cleaning plan"
          : `${subscription.cadence} ${subscription.service.toLowerCase()}`}
        description={isStarted
          ? `Next visit is ${formatAccountDate(subscription.nextVisit)} between ${subscription.arrivalWindow}. This plan controls default scope, how often you clean, payment, and cleaner preference.`
          : `This plan starts on ${formatAccountDate(subscription.startDate)}. Your first visit will be ${formatAccountDate(subscription.nextVisit)}.`}
        action={<StatusPill status={subscription.status} />}
      >
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <HeroFact
            icon={<RefreshCw className="size-4" />}
            label="Frequency"
            value={isCustom ? `${subscription.schedules.length}× per week` : subscription.cadence}
          />
          <HeroFact
            icon={<CalendarDays className="size-4" />}
            label={isStarted ? "Next visit" : "Starts on"}
            value={isStarted ? formatAccountDate(subscription.nextVisit) : formatAccountDate(subscription.startDate)}
          />
          <HeroFact
            icon={<CreditCard className="size-4" />}
            label="Monthly estimate"
            value={`$${subscription.monthlyEstimate.toFixed(2)}`}
          />
        </div>
      </HeroPanel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div className="grid gap-6">
          {/* Plan health / custom schedule */}
          {isCustom ? (
            <SummaryCard title="Weekly schedule">
              {subscription.schedules.length > 0 ? (
                <div className="grid gap-2">
                  {subscription.schedules.map((slot) => (
                    <div
                      key={slot.dayOfWeek}
                      className="flex items-center justify-between gap-4 rounded-xl bg-surface-muted px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {DAY_SHORT[slot.dayOfWeek]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{DAY_NAMES[slot.dayOfWeek]}</p>
                          <p className="text-xs text-text-secondary">{slot.time}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-text-secondary">
                        {slot.product}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">No schedule configured.</p>
              )}
              {subscription.rescheduleHistory && subscription.rescheduleHistory.length > 0 && (
                <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
                  <p className="text-xs font-bold text-text-secondary mb-2">RESCHEDULE HISTORY</p>
                  {subscription.rescheduleHistory.map((h, i) => (
                    <div key={i} className="text-xs text-text-secondary">
                      <span className="font-bold text-text-primary">{formatAccountDate(h.originalDate)}</span>
                      {" → "}
                      <span className="font-bold text-text-primary">{formatAccountDate(h.newDate)}</span>
                      {h.skippedDates.length > 0 && (
                        <span className="ml-1 text-text-secondary">
                          ({h.skippedDates.length} visit{h.skippedDates.length > 1 ? "s" : ""} skipped)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SummaryCard>
          ) : (
            <SummaryCard title="Plan health">
              <div className="grid gap-4 md:grid-cols-3">
                <PlanHealth label="Status" value={subscription.status.replaceAll("_", " ")} />
                <PlanHealth label="Cleaner preference" value={subscription.cleanerPreference} />
                <PlanHealth label="Payment" value={subscription.paymentMethod} />
              </div>
              {subscription.pausedUntil && (
                <div className="mt-4 rounded-2xl border border-warning/25 bg-warning/10 p-4 text-sm leading-6 text-text-secondary">
                  This plan is paused until {formatAccountDate(subscription.pausedUntil)}. Visits after that date remain visible below.
                </div>
              )}
            </SummaryCard>
          )}

          {/* Plan settings */}
          <SummaryCard title="Plan settings">
            <dl>
              <DetailRow label="Service" value={subscription.service} />
              <DetailRow label="Home" value={`${subscription.address} · ${subscription.home}`} />
              <DetailRow label="Team" value={subscription.team} />
              <DetailRow
                label={isStarted ? "Started" : "Start date"}
                value={
                  <span className={!isStarted ? "inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2 py-0.5 text-xs font-bold text-info" : ""}>
                    {!isStarted && <Clock3 className="size-3" />}
                    {formatAccountDate(subscription.startDate)}
                    {!isStarted && " — not started yet"}
                  </span>
                }
              />
              <DetailRow label="Notes" value={subscription.notes} />
            </dl>
          </SummaryCard>

          {/* Default scope — only for non-custom */}
          {!isCustom && (
            <SummaryCard title="Default scope">
              <div className="grid gap-3 sm:grid-cols-2">
                {subscription.scope.map((item) => (
                  <div key={item} className="rounded-2xl bg-surface-muted p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      <ShieldCheck className="size-4" aria-hidden="true" />
                      Included
                    </div>
                    <p className="mt-2 text-sm font-bold text-text-primary">{item}</p>
                  </div>
                ))}
              </div>
            </SummaryCard>
          )}

          {/* Upcoming visits */}
          <SummaryCard title="Upcoming visits">
            <div className="grid gap-3">
              {subscription.upcomingVisits.length > 0 ? (
                subscription.upcomingVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="grid gap-3 rounded-2xl border border-border bg-surface-muted p-4 sm:grid-cols-[1fr_auto] sm:items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                        {formatAccountDate(visit.date)}, {visit.arrivalWindow}
                      </div>
                      {visit.product && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                          <Sparkles className="size-3 text-primary" aria-hidden="true" />
                          {visit.product}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-text-secondary">{visit.id}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={visit.status} />
                      <VisitPaymentBadge paymentStatus={visit.paymentStatus} attempt={visit.paymentRetryAttempt} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-secondary">No upcoming visits. Activate your plan to generate a schedule.</p>
              )}
            </div>
          </SummaryCard>
        </div>

        {/* Sidebar */}
        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <CommandCard title="Plan actions" description="Changes apply to future visits. Already-confirmed visits stay as scheduled.">
            <Link
              href={`/account/subscriptions/${subscription.id}/reschedule`}
              className="inline-flex min-h-11 w-full items-center justify-start rounded-full border border-border bg-surface px-5 text-sm font-bold text-text-primary transition hover:border-primary/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
            >
              <CalendarDays className="mr-2 size-4" aria-hidden="true" />
              Change next visit
            </Link>
            <SecondaryButton onClick={() => console.log("Edit scope")}>
              <Settings className="mr-2 size-4" aria-hidden="true" />
              Edit default scope
            </SecondaryButton>
            <SecondaryButton onClick={() => setPauseSheetOpen(true)}>
              {subscription.status === "paused" ? (
                <><Play className="mr-2 size-4" aria-hidden="true" />Resume plan</>
              ) : (
                <><Pause className="mr-2 size-4" aria-hidden="true" />Pause plan</>
              )}
            </SecondaryButton>
            <SecondaryButton onClick={() => console.log("Message support")}>
              <MessageCircle className="mr-2 size-4" aria-hidden="true" />
              Message support
            </SecondaryButton>
            <Link
              href="/account/settings"
              className="inline-flex min-h-11 w-full items-center justify-start rounded-full border border-border bg-surface px-5 text-sm font-bold text-text-primary transition hover:border-primary/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
            >
              <CreditCard className="mr-2 size-4" aria-hidden="true" />
              Update payment
            </Link>

            {/* Cancel — destructive, visually separated */}
            <div className="mt-2 border-t border-border pt-3">
              <SecondaryButton
                onClick={() => setCancelSheetOpen(true)}
                className="w-full border-error/20 text-error hover:border-error/40 hover:bg-error/5"
              >
                <Trash2 className="mr-2 size-4" aria-hidden="true" />
                Cancel this plan
              </SecondaryButton>
            </div>
          </CommandCard>

          {/* Billing */}
          <SummaryCard title="Billing">
            <dl>
              <DetailRow label="Monthly estimate" value={<Money value={subscription.monthlyEstimate} />} />
              <DetailRow label="Payment method" value={subscription.paymentMethod} />
              <DetailRow label="Payment timing" value="3 days before each visit" />
            </dl>
          </SummaryCard>

          {/* Cleaner continuity */}
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-2 text-sm font-bold">
              <UsersRound className="size-4" aria-hidden="true" />
              Cleaner continuity
            </div>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
              {subscription.cleanerPreference}. We match you with the same cleaner when available.
            </p>
          </div>
        </aside>
      </div>

      {/* Pause/Resume sheet */}
      <Sheet open={pauseSheetOpen} onOpenChange={setPauseSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{subscription.status === "paused" ? "Resume your plan" : "Pause your plan"}</SheetTitle>
            <SheetDescription>
              {subscription.status === "paused"
                ? `Resuming will restart your ${subscription.cadence.toLowerCase()} schedule from the next planned visit.`
                : "Pausing stops new bookings from being generated. Already-confirmed visits stay as scheduled."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 rounded-2xl bg-primary/10 p-4">
            <p className="text-xs font-bold text-primary mb-2">WHAT HAPPENS</p>
            <p className="text-sm text-text-secondary">
              {subscription.status === "paused"
                ? "New visits will be generated from the resume date. No charge for the paused period."
                : "No new bookings will be created and no payments collected while paused. You can resume any time."}
            </p>
          </div>
          <SheetFooter className="mt-6">
            <button
              onClick={() => setPauseSheetOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-bold text-text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
            >
              Cancel
            </button>
            <button
              onClick={() => { console.log("Toggle pause"); setPauseSheetOpen(false); }}
              className="flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
            >
              {subscription.status === "paused" ? "Yes, resume plan" : "Yes, pause plan"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Cancel sheet */}
      <Sheet open={cancelSheetOpen} onOpenChange={setCancelSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Cancel this plan?</SheetTitle>
            <SheetDescription>
              This will stop all future bookings for your {subscription.service.toLowerCase()} at {subscription.address}.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-error/20 bg-error/5 p-4">
              <p className="text-xs font-bold text-error mb-2">WHAT HAPPENS WHEN YOU CANCEL</p>
              <ul className="space-y-1.5 text-sm text-text-secondary">
                <li>• No new bookings will be generated after today.</li>
                <li>• Already-confirmed bookings will proceed as scheduled.</li>
                <li>• Payments for confirmed visits will still be collected.</li>
                <li>• You can start a new plan anytime.</li>
              </ul>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <button
              onClick={() => setCancelSheetOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-bold text-text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
            >
              Keep plan
            </button>
            <button
              onClick={() => { console.log("Cancel subscription"); setCancelSheetOpen(false); }}
              className="flex min-h-11 items-center justify-center rounded-full bg-error px-5 text-sm font-bold text-white transition hover:bg-error/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-error/30"
            >
              Yes, cancel plan
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

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

function PlanHealth({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-muted p-4">
      <p className="text-xs font-bold text-text-secondary">{label}</p>
      <p className="mt-2 text-sm font-bold capitalize text-text-primary">{value}</p>
    </div>
  );
}

function VisitPaymentBadge({ paymentStatus, attempt }: { paymentStatus: VisitPaymentStatus; attempt?: number }) {
  if (paymentStatus === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-bold text-success whitespace-nowrap">
        <CheckCircle2 className="size-3" /> Payment confirmed
      </span>
    );
  }
  if (paymentStatus === "retrying") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs font-bold text-warning whitespace-nowrap">
        <AlertCircle className="size-3" /> Payment retry {attempt ?? ""}/3
      </span>
    );
  }
  if (paymentStatus === "failed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-2 py-1 text-xs font-bold text-error whitespace-nowrap">
        <AlertCircle className="size-3" /> Payment failed
      </span>
    );
  }
  if (paymentStatus === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-text-secondary/10 px-2 py-1 text-xs font-bold text-text-secondary whitespace-nowrap">
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-xs font-bold text-text-secondary whitespace-nowrap border border-border">
      <Clock3 className="size-3" /> Payment pending
    </span>
  );
}

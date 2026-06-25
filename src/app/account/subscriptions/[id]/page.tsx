import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CreditCard, MessageCircle, Pause, RefreshCw, Settings, ShieldCheck, UsersRound } from "lucide-react";
import { CommandCard, DetailRow, HeroPanel, Money, SecondaryButton, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { formatAccountDate, getSubscription, subscriptions } from "@/lib/mock-account-data";

export function generateStaticParams() {
  return subscriptions.map((subscription) => ({ id: subscription.id }));
}

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subscription = getSubscription(id);

  if (!subscription) notFound();

  return (
    <>
      <Link href="/account/subscriptions" className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to subscriptions
      </Link>

      <HeroPanel
        title={`${subscription.cadence} ${subscription.service.toLowerCase()}`}
        description={`Next visit is ${formatAccountDate(subscription.nextVisit)} between ${subscription.arrivalWindow}. This plan controls default scope, cadence, payment, and cleaner preference.`}
        action={<StatusPill status={subscription.status} />}
      >
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <HeroFact icon={<RefreshCw className="size-4" />} label="Cadence" value={subscription.cadence} />
          <HeroFact icon={<CalendarDays className="size-4" />} label="Next visit" value={formatAccountDate(subscription.nextVisit)} />
          <HeroFact icon={<CreditCard className="size-4" />} label="Monthly estimate" value={`$${subscription.monthlyEstimate.toFixed(2)}`} />
        </div>
      </HeroPanel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div className="grid gap-6">
          <SummaryCard title="Cadence health">
            <div className="grid gap-4 md:grid-cols-3">
              <PlanHealth label="Status" value={subscription.status.replaceAll("_", " ")} />
              <PlanHealth label="Cleaner preference" value={subscription.cleanerPreference} />
              <PlanHealth label="Payment" value={subscription.paymentMethod} />
            </div>
            {subscription.pausedUntil ? (
              <div className="mt-4 rounded-2xl border border-warning/25 bg-warning/10 p-4 text-sm leading-6 text-text-secondary">
                This plan is paused until {formatAccountDate(subscription.pausedUntil)}. Planned visits after that date remain visible below.
              </div>
            ) : null}
          </SummaryCard>

          <SummaryCard title="Plan settings">
            <dl>
              <DetailRow label="Service" value={subscription.service} />
              <DetailRow label="Home" value={`${subscription.address} · ${subscription.home}`} />
              <DetailRow label="Team" value={subscription.team} />
              <DetailRow label="Started" value={formatAccountDate(subscription.startedAt)} />
              <DetailRow label="Notes" value={subscription.notes} />
            </dl>
          </SummaryCard>

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

          <SummaryCard title="Upcoming visits">
            <div className="grid gap-3">
              {subscription.upcomingVisits.map((visit) => (
                <div key={visit.id} className="grid gap-3 rounded-2xl border border-border bg-surface-muted p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                      <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                      {formatAccountDate(visit.date)}, {visit.arrivalWindow}
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">{visit.id}</p>
                  </div>
                  <StatusPill status={visit.status} />
                </div>
              ))}
            </div>
          </SummaryCard>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <CommandCard title="Plan actions" description="Changes apply to future planned visits. Existing scheduled visits stay visible.">
            <SecondaryButton>
              <CalendarDays className="mr-2 size-4" aria-hidden="true" />
              Change next visit
            </SecondaryButton>
            <SecondaryButton>
              <Settings className="mr-2 size-4" aria-hidden="true" />
              Edit default scope
            </SecondaryButton>
            <SecondaryButton>
              <Pause className="mr-2 size-4" aria-hidden="true" />
              Pause cadence
            </SecondaryButton>
            <SecondaryButton>
              <MessageCircle className="mr-2 size-4" aria-hidden="true" />
              Message support
            </SecondaryButton>
            <SecondaryButton>
              <CreditCard className="mr-2 size-4" aria-hidden="true" />
              Update payment
            </SecondaryButton>
          </CommandCard>

          <SummaryCard title="Billing">
            <dl>
              <DetailRow label="Monthly estimate" value={<Money value={subscription.monthlyEstimate} />} />
              <DetailRow label="Payment method" value={subscription.paymentMethod} />
            </dl>
          </SummaryCard>

          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-2 text-sm font-bold">
              <UsersRound className="size-4" aria-hidden="true" />
              Cleaner continuity
            </div>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
              Cleaner preference is used for recurring assignments when availability allows.
            </p>
          </div>
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

function PlanHealth({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-muted p-4">
      <p className="text-xs font-bold text-text-secondary">{label}</p>
      <p className="mt-2 text-sm font-bold capitalize text-text-primary">{value}</p>
    </div>
  );
}

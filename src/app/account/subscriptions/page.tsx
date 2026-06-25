import Link from "next/link";
import { CalendarDays, CreditCard, PauseCircle, RefreshCw, ShieldCheck, UsersRound } from "lucide-react";
import { ActionLink, HeroPanel, MetricCard, MetricGrid, Money, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { formatAccountDate, subscriptions } from "@/lib/mock-account-data";

export default function SubscriptionsPage() {
  const activePlans = subscriptions.filter((subscription) => subscription.status === "active");
  const pausedPlans = subscriptions.filter((subscription) => subscription.status === "paused");
  const monthlyTotal = subscriptions.reduce((sum, subscription) => sum + subscription.monthlyEstimate, 0);
  const nextPlan = subscriptions[0];

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Subscriptions"
        description="Recurring cleanings with clear cadence, default scope, upcoming visits, billing, and pause controls."
        action={<ActionLink href="/booking">Start recurring plan</ActionLink>}
      />

      <MetricGrid>
        <MetricCard label="Active plans" value={String(activePlans.length)} helper="Currently generating visits" icon={<RefreshCw className="size-5" aria-hidden="true" />} tone="strong" />
        <MetricCard label="Paused plans" value={String(pausedPlans.length)} helper={pausedPlans.length ? "One cadence is temporarily paused" : "No paused cadence"} icon={<PauseCircle className="size-5" aria-hidden="true" />} tone={pausedPlans.length ? "attention" : "default"} />
        <MetricCard label="Next recurring visit" value={formatAccountDate(nextPlan.nextVisit)} helper={nextPlan.arrivalWindow} icon={<CalendarDays className="size-5" aria-hidden="true" />} />
        <MetricCard label="Monthly estimate" value={`$${monthlyTotal.toFixed(0)}`} helper="Across all recurring plans" icon={<CreditCard className="size-5" aria-hidden="true" />} />
      </MetricGrid>

      <HeroPanel
        title="Recurring service without subscription pressure"
        description="Cadence is treated as scheduling, not an upsell. Each plan keeps its own scope, payment method, visit rhythm, and cleaner preference."
      >
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <span className="rounded-xl bg-primary-foreground/10 p-3 font-bold">Editable cadence</span>
          <span className="rounded-xl bg-primary-foreground/10 p-3 font-bold">Visible upcoming visits</span>
          <span className="rounded-xl bg-primary-foreground/10 p-3 font-bold">Plan-level notes</span>
        </div>
      </HeroPanel>

      <SummaryCard title="Recurring plans">
        <div className="grid gap-4">
          {subscriptions.map((subscription) => (
            <SubscriptionListCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      </SummaryCard>
    </>
  );
}

function SubscriptionListCard({ subscription }: { subscription: (typeof subscriptions)[number] }) {
  return (
    <Link
      href={`/account/subscriptions/${subscription.id}`}
      className="group grid overflow-hidden rounded-2xl border border-border bg-surface-muted transition hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 lg:grid-cols-[minmax(0,1fr)_220px]"
    >
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={subscription.status} />
          <span className="text-sm font-bold text-text-secondary">{subscription.id}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-text-primary">{subscription.cadence} {subscription.service.toLowerCase()}</h2>
        <div className="mt-4 grid gap-3 text-sm text-text-secondary md:grid-cols-2">
          <span className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            Next visit {formatAccountDate(subscription.nextVisit)}, {subscription.arrivalWindow}
          </span>
          <span className="flex gap-2">
            <UsersRound className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {subscription.team}
          </span>
          <span className="flex gap-2">
            <ShieldCheck className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {subscription.cleanerPreference}
          </span>
          <span className="flex gap-2">
            <RefreshCw className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {subscription.upcomingVisits.length} upcoming visits
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border bg-surface p-4 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0">
        <span className="text-sm font-semibold text-text-secondary">Monthly estimate</span>
        <span className="text-2xl font-bold text-primary">
          <Money value={subscription.monthlyEstimate} />
        </span>
        <span className="text-sm font-bold text-primary opacity-0 transition group-hover:opacity-100">Manage plan</span>
      </div>
    </Link>
  );
}

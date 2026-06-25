import Link from "next/link";
import { CalendarDays, PauseCircle, RefreshCw, ShieldCheck, UsersRound } from "lucide-react";
import { ActionLink, Money, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { formatAccountDate, subscriptions } from "@/lib/mock-account-data";

export default function SubscriptionsPage() {
  const activePlans = subscriptions.filter((subscription) => subscription.status === "active");
  const pausedPlans = subscriptions.filter((subscription) => subscription.status === "paused");
  const nextPlan = subscriptions[0];

  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Keep recurring cleaning simple: next visit first, cadence controls close by, billing details one level deeper."
        action={<ActionLink href="/booking">Start recurring plan</ActionLink>}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[0_18px_58px_rgba(21,94,99,0.18)] sm:p-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="text-sm font-bold text-primary-foreground/72">Next recurring visit</p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">{nextPlan.cadence} cleaning</h2>
              <p className="mt-3 max-w-[58ch] text-base leading-7 text-primary-foreground/78">
                {formatAccountDate(nextPlan.nextVisit)} from {nextPlan.arrivalWindow}. {nextPlan.cleanerPreference}.
              </p>
            </div>
            <Link
              href={`/account/subscriptions/${nextPlan.id}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary-foreground px-5 text-sm font-bold text-primary transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/30 active:translate-y-px"
            >
              Manage plan
            </Link>
          </div>
        </section>

        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <RefreshCw className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-text-primary">Your routine</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <RoutineLine label="Active" value={`${activePlans.length} plan${activePlans.length === 1 ? "" : "s"}`} />
            <RoutineLine label="Paused" value={`${pausedPlans.length} plan${pausedPlans.length === 1 ? "" : "s"}`} />
            <RoutineLine label="Change window" value="Any future visit" />
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-6">
        <SummaryCard title="Recurring plans">
          <div className="grid gap-3">
            {activePlans.map((subscription) => (
              <SubscriptionListCard key={subscription.id} subscription={subscription} />
            ))}
            {pausedPlans.map((subscription) => (
              <SubscriptionListCard key={subscription.id} subscription={subscription} />
            ))}
          </div>
        </SummaryCard>

        <section className="grid gap-4 rounded-2xl bg-surface-muted p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Need a one-time cleaning instead?</h2>
            <p className="mt-2 max-w-[62ch] text-sm leading-6 text-text-secondary">
              Keep your recurring plan as-is and add a deep clean, move clean, or extra visit only when needed.
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-surface px-5 text-sm font-bold text-primary transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
          >
            Add visit
          </Link>
        </section>
      </div>
    </>
  );
}

function SubscriptionListCard({ subscription }: { subscription: (typeof subscriptions)[number] }) {
  return (
    <Link
      href={`/account/subscriptions/${subscription.id}`}
      className="group grid overflow-hidden rounded-2xl border border-border bg-surface-muted transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 lg:grid-cols-[minmax(0,1fr)_190px]"
    >
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={subscription.status} />
          <span className="text-sm font-bold text-text-secondary">{subscription.cadence}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-text-primary">{subscription.service}</h2>
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
            {subscription.status === "paused" ? <PauseCircle className="mt-0.5 size-4 text-warning" aria-hidden="true" /> : <RefreshCw className="mt-0.5 size-4 text-primary" aria-hidden="true" />}
            {subscription.upcomingVisits.length} upcoming visits
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border bg-surface p-4 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0">
        <span className="text-sm font-semibold text-text-secondary">Estimate</span>
        <span className="text-2xl font-bold text-primary">
          <Money value={subscription.monthlyEstimate} />
        </span>
        <span className="text-sm font-bold text-primary opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">Manage</span>
      </div>
    </Link>
  );
}

function RoutineLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-muted px-4 py-3">
      <span className="font-bold text-text-secondary">{label}</span>
      <span className="font-bold text-text-primary">{value}</span>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, CreditCard, PauseCircle, RefreshCw, ShieldCheck, UsersRound } from "lucide-react";
import { ActionLink, Money, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { formatAccountDate, subscriptions } from "@/lib/mock-account-data";

export default function SubscriptionsPage() {
  const activePlans = subscriptions.filter((subscription) => subscription.status === "active");
  const pausedPlans = subscriptions.filter((subscription) => subscription.status === "paused");
  const nextPlan = subscriptions[0];

  return (
    <>
      <PageHeader
        title="Cleaning plans"
        description="See your regular cleanings, what is included, what you pay each month, and when the next visit happens."
        action={<ActionLink href="/booking">Start a cleaning plan</ActionLink>}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_58px_rgba(21,94,99,0.18)]">
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary-foreground px-3 py-1 text-xs font-bold capitalize text-primary">{nextPlan.status.replaceAll("_", " ")}</span>
                <span className="rounded-full bg-primary-foreground/12 px-3 py-1 text-xs font-bold text-primary-foreground/80">{nextPlan.cadence}</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-normal md:text-4xl">{nextPlan.service} plan</h2>
              <p className="mt-3 max-w-[58ch] text-base leading-7 text-primary-foreground/78">
                Your next cleaning is {formatAccountDate(nextPlan.nextVisit)} from {nextPlan.arrivalWindow}. {nextPlan.cleanerPreference}.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <HeroFact icon={<CalendarDays className="size-4" />} label="Next visit" value={formatAccountDate(nextPlan.nextVisit)} />
                <HeroFact icon={<UsersRound className="size-4" />} label="Cleaners" value={formatTeam(nextPlan.team)} />
                <HeroFact icon={<CreditCard className="size-4" />} label="Monthly cost" value={`$${nextPlan.monthlyEstimate.toFixed(2)}`} />
              </div>
              <Link
                href={`/account/subscriptions/${nextPlan.id}`}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-foreground px-5 text-sm font-bold text-primary transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/30 active:translate-y-px"
              >
                View plan
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid content-between gap-4 bg-primary-hover p-5 sm:p-6">
              <div>
                <p className="text-sm font-bold text-primary-foreground/72">Included each visit</p>
                <div className="mt-4 grid gap-2">
                  {nextPlan.scope.slice(0, 4).map((item) => (
                    <span key={item} className="rounded-xl bg-primary-foreground/10 px-3 py-2 text-sm font-bold text-primary-foreground/86">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm leading-6 text-primary-foreground/72">{nextPlan.notes}</p>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RefreshCw className="size-5" aria-hidden="true" />
            </div>
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">Easy to change</span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-text-primary">Plan options</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">You can skip, pause, or move a future cleaning without canceling your plan.</p>
          <div className="mt-4 grid gap-3 text-sm">
            <RoutineLine label="Current plans" value={`${activePlans.length} active`} />
            <RoutineLine label="Paused plans" value={`${pausedPlans.length} paused`} />
            <RoutineLine label="Can change" value="Any future visit" />
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-6">
        <SummaryCard title="Your cleaning plans">
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
            <h2 className="text-xl font-bold text-text-primary">Need an extra cleaning?</h2>
            <p className="mt-2 max-w-[62ch] text-sm leading-6 text-text-secondary">
              Keep your regular plan as-is and book a deep clean, move clean, or extra visit only when needed.
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
      className="group grid overflow-hidden rounded-2xl border border-border bg-surface-muted transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 lg:grid-cols-[minmax(0,1fr)_204px]"
    >
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={subscription.status} />
          <span className="text-sm font-bold text-text-secondary">{subscription.cadence}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-text-primary">{subscription.service} plan</h2>
        <div className="mt-4 grid gap-3 text-sm text-text-secondary md:grid-cols-2">
          <span className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            Next visit {formatAccountDate(subscription.nextVisit)}, {subscription.arrivalWindow}
          </span>
          <span className="flex gap-2">
            <UsersRound className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {formatTeam(subscription.team)}
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
        <div className="mt-4 flex flex-wrap gap-2">
          {subscription.scope.slice(0, 3).map((item) => (
            <span key={item} className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-text-secondary">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border bg-surface p-4 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0">
        <span className="text-sm font-semibold text-text-secondary">Monthly cost</span>
        <span className="text-2xl font-bold text-primary">
          <Money value={subscription.monthlyEstimate} />
        </span>
        <span className="text-sm font-bold text-primary opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">Open plan</span>
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

function formatTeam(team: string) {
  const match = team.match(/^(.+?) x (\d+) (cleaners?)$/);

  if (!match) return team;

  const [, hours, cleanerCount, cleanerLabel] = match;
  return `${cleanerCount} ${cleanerLabel} for ${hours}`;
}

function RoutineLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-muted px-4 py-3">
      <span className="font-bold text-text-secondary">{label}</span>
      <span className="font-bold text-text-primary">{value}</span>
    </div>
  );
}

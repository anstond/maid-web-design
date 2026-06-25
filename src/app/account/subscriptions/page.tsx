import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, CheckCircle2, Clock3, CreditCard, History, PauseCircle, RefreshCw, Sparkles, UsersRound } from "lucide-react";
import { ActionLink, Money, PageHeader } from "@/components/account/AccountPrimitives";
import { bookings, formatAccountDate, subscriptions } from "@/lib/mock-account-data";

export default function SubscriptionsPage() {
  const activePlans = subscriptions.filter((subscription) => subscription.status === "active");
  const pausedPlans = subscriptions.filter((subscription) => subscription.status === "paused");
  const nextPlan = subscriptions[0];
  const nextPlanPastCleanings = getPastCleaningsForPlan(nextPlan);

  return (
    <>
      <PageHeader
        title="Regular cleanings"
        description="See your next cleaning, what is included, and the cleanings already completed under each plan."
        action={<ActionLink href="/booking">Start a cleaning plan</ActionLink>}
      />

      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Next cleaning</span>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-text-secondary">{nextPlan.cadence}</span>
            </div>

            <div className="mt-5 grid gap-4 sm:gap-5 sm:grid-cols-[128px_minmax(0,1fr)]">
              <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
                <p className="text-xs font-bold text-primary-foreground/72">{formatAccountDate(nextPlan.nextVisit).replace(/, \d{4}$/, "")}</p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold leading-tight tracking-normal">{formatAccountDate(nextPlan.nextVisit).split(" ")[1].replace(",", "")}</p>
                <p className="mt-2 text-xs sm:text-sm font-bold text-primary-foreground/80">{nextPlan.arrivalWindow}</p>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-normal text-text-primary">{nextPlan.service}</h2>
                <p className="mt-2 sm:mt-3 max-w-[58ch] text-sm sm:text-base leading-6 sm:leading-7 text-text-secondary">
                  {formatTeam(nextPlan.team)}. {nextPlan.cleanerPreference}. {nextPlan.notes}
                </p>
                <div className="mt-4 sm:mt-5 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                  <SimpleFact icon={<Sparkles className="size-4" />} label="Included" value={nextPlan.scope.slice(0, 2).join(", ")} />
                  <SimpleFact icon={<CreditCard className="size-4" />} label="Monthly cost" value={`$${nextPlan.monthlyEstimate.toFixed(2)}`} />
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <ActionPill href={`/account/subscriptions/${nextPlan.id}`} variant="primary">
                Change next visit
              </ActionPill>
              <ActionPill href={`/account/subscriptions/${nextPlan.id}`}>
                Skip next cleaning
              </ActionPill>
              {nextPlanPastCleanings[0] ? (
                <ActionPill href={`/account/bookings/${nextPlanPastCleanings[0].id}`}>
                  Last cleaning
                </ActionPill>
              ) : null}
            </div>
          </div>

          <aside className="border-t border-border bg-surface-muted px-4 py-5 sm:p-6 lg:border-l lg:border-t-0">
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">What happens next</h2>
            <div className="mt-4 grid gap-2 sm:gap-3">
              {nextPlan.upcomingVisits.slice(0, 3).map((visit) => (
                <div key={visit.id} className="rounded-2xl bg-surface p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <p className="text-sm sm:text-base font-bold text-text-primary">{formatAccountDate(visit.date)}</p>
                    <span className="rounded-full bg-primary/10 px-2 sm:px-3 py-1 text-xs font-bold text-primary whitespace-nowrap">{visit.status}</span>
                  </div>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-text-secondary">{visit.arrivalWindow}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div className="mt-6 grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-border bg-surface px-4 py-5 sm:p-6 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">Your plans</h2>
            <Link href="/account/bookings" className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-bold text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
              See all bookings
            </Link>
          </div>

          <div className="mt-4 grid gap-4">
            {activePlans.map((subscription) => (
              <PlanCard key={subscription.id} subscription={subscription} />
            ))}
            {pausedPlans.map((subscription) => (
              <PlanCard key={subscription.id} subscription={subscription} />
            ))}
          </div>
        </section>

        <aside className="grid gap-4 lg:self-start">
          <section className="rounded-2xl border border-border bg-surface px-4 py-5 sm:p-6 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
            <div className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RefreshCw className="size-4 sm:size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-text-primary">Easy changes</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-text-secondary">Move, skip, or pause a future cleaning without canceling your regular plan.</p>
            <div className="mt-4 grid gap-2 sm:gap-3">
              <ActionPill href={`/account/subscriptions/${nextPlan.id}`}>Move a cleaning</ActionPill>
              <ActionPill href={`/account/subscriptions/${nextPlan.id}`}>Pause plan</ActionPill>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface-muted px-4 py-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">Need an extra cleaning?</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-text-secondary">Book a deep clean, move clean, or extra visit without changing your regular plan.</p>
            <Link
              href="/booking"
              className="mt-4 inline-flex w-full sm:w-auto min-h-11 items-center justify-center rounded-full bg-surface px-5 text-sm font-bold text-primary transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
            >
              Add visit
            </Link>
          </section>
        </aside>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-surface px-4 py-5 sm:p-6 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">Past cleanings from your plans</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-text-secondary">Open a completed cleaning to see the receipt, cleaner, notes, and timeline.</p>
          </div>
          <Link href="/account/bookings" className="inline-flex min-h-11 items-center rounded-full bg-surface-muted px-4 text-sm font-bold text-primary hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
            All bookings
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
          {subscriptions.map((subscription) => {
            const pastCleanings = getPastCleaningsForPlan(subscription);

            return (
              <div key={subscription.id} className="rounded-2xl bg-surface-muted p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-text-primary">{subscription.service}</h3>
                  <span className="text-xs sm:text-sm font-bold text-text-secondary whitespace-nowrap">{subscription.cadence}</span>
                </div>

                <div className="mt-3 grid gap-2">
                  {pastCleanings.length > 0 ? (
                    pastCleanings.map((booking) => <PastCleaningRow key={booking.id} booking={booking} />)
                  ) : (
                    <p className="rounded-xl bg-surface p-3 sm:p-4 text-xs sm:text-sm leading-6 text-text-secondary">No completed cleanings have been added to this plan yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function PlanCard({ subscription }: { subscription: (typeof subscriptions)[number] }) {
  const pastCleanings = getPastCleaningsForPlan(subscription);
  const nextVisit = subscription.upcomingVisits[0];

  return (
    <article className="rounded-2xl bg-surface-muted p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-text-secondary">{subscription.cadence}</span>
            <PlanState status={subscription.status} />
          </div>
          <h3 className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-text-primary">{subscription.service}</h3>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-text-secondary">{subscription.home} at {subscription.address}</p>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <p className="text-xs font-bold text-text-secondary">Monthly cost</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-primary"><Money value={subscription.monthlyEstimate} /></p>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
        <SimpleFact icon={<CalendarDays className="size-4" />} label="Next" value={nextVisit ? `${formatAccountDate(nextVisit.date)}, ${nextVisit.arrivalWindow}` : "No visit scheduled"} />
        <SimpleFact icon={<UsersRound className="size-4" />} label="Cleaners" value={formatTeam(subscription.team)} />
        <SimpleFact icon={<History className="size-4" />} label="Past cleanings" value={`${pastCleanings.length}`} />
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
        {subscription.scope.slice(0, 4).map((item) => (
          <span key={item} className="rounded-full bg-surface px-2 sm:px-3 py-1 text-xs font-bold text-text-secondary">{item}</span>
        ))}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 border-t border-border pt-3 sm:pt-4">
        <ActionPill href={`/account/subscriptions/${subscription.id}`} variant="primary">View plan</ActionPill>
        {pastCleanings[0] ? <ActionPill href={`/account/bookings/${pastCleanings[0].id}`}>Last cleaning</ActionPill> : null}
        <ActionPill href="/account/bookings">All bookings</ActionPill>
      </div>
    </article>
  );
}

function SimpleFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-2 sm:p-3">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-bold leading-5 text-text-primary">{value}</p>
    </div>
  );
}

function formatTeam(team: string) {
  const match = team.match(/^(.+?) x (\d+) (cleaners?)$/);

  if (!match) return team;

  const [, hours, cleanerCount, cleanerLabel] = match;
  return `${cleanerCount} ${cleanerLabel} for ${hours}`;
}

function PlanState({ status }: { status: (typeof subscriptions)[number]["status"] }) {
  const isPaused = status === "paused";

  return (
    <span className={isPaused ? "inline-flex min-h-8 items-center gap-1 rounded-full bg-warning/10 px-3 text-xs font-bold text-warning" : "inline-flex min-h-8 items-center gap-1 rounded-full bg-success/10 px-3 text-xs font-bold text-success"}>
      {isPaused ? <PauseCircle className="size-3.5" aria-hidden="true" /> : <CheckCircle2 className="size-3.5" aria-hidden="true" />}
      {isPaused ? "Paused" : "Active"}
    </span>
  );
}

function ActionPill({ href, children, variant = "secondary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link
      href={href}
      className={variant === "primary"
        ? "flex min-h-11 items-center justify-center rounded-full bg-primary px-4 sm:px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
        : "flex min-h-11 items-center justify-center rounded-full bg-surface px-4 sm:px-5 text-sm font-bold text-primary transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"}
    >
      {children}
    </Link>
  );
}

function PastCleaningRow({ booking }: { booking: (typeof bookings)[number] }) {
  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      className="grid gap-2 sm:gap-3 rounded-xl bg-surface p-3 sm:p-4 transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <span>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-text-primary">
          <Clock3 className="size-3 sm:size-4 text-primary flex-shrink-0" aria-hidden="true" />
          {formatAccountDate(booking.date)}
        </span>
        <span className="mt-0.5 sm:mt-1 block text-xs sm:text-sm text-text-secondary">{booking.arrivalWindow}. {booking.cleaner}.</span>
      </span>
      <span className="text-xs sm:text-sm font-bold text-primary">View receipt</span>
    </Link>
  );
}

function getPastCleaningsForPlan(subscription: (typeof subscriptions)[number]) {
  return bookings.filter(
    (booking) =>
      (booking.status === "completed" || booking.status === "cancelled") &&
      booking.service === subscription.service &&
      booking.address === subscription.address
  );
}

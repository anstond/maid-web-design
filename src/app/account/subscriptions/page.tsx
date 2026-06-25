import Link from "next/link";
import { CalendarDays, CreditCard, MapPin, RefreshCw, UsersRound } from "lucide-react";
import { ActionLink, Money, PageHeader, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
import { formatAccountDate, subscriptions } from "@/lib/mock-account-data";

export default function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Subscriptions"
        description="Manage recurring cleanings, cadence, default service scope, upcoming visits, and plan-level notes."
        action={<ActionLink href="/booking">Start a recurring plan</ActionLink>}
      />

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
      className="grid gap-4 rounded-2xl border border-border bg-surface-muted p-4 transition hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 lg:grid-cols-[minmax(0,1fr)_190px]"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={subscription.status} />
          <span className="text-sm font-bold text-text-secondary">{subscription.id}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-text-primary">{subscription.service}</h2>
        <div className="mt-4 grid gap-3 text-sm text-text-secondary sm:grid-cols-2">
          <span className="flex gap-2">
            <RefreshCw className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {subscription.cadence}
          </span>
          <span className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            Next visit {formatAccountDate(subscription.nextVisit)}, {subscription.arrivalWindow}
          </span>
          <span className="flex gap-2">
            <MapPin className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {subscription.address}
          </span>
          <span className="flex gap-2">
            <UsersRound className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            {subscription.team}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-border pt-4 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
          <CreditCard className="size-4 text-primary" aria-hidden="true" />
          Monthly estimate
        </span>
        <span className="text-2xl font-bold text-primary">
          <Money value={subscription.monthlyEstimate} />
        </span>
      </div>
    </Link>
  );
}

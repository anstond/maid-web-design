import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CreditCard, MessageCircle, Pause, RefreshCw, Settings } from "lucide-react";
import { DetailRow, Money, PageHeader, SecondaryButton, StatusPill, SummaryCard } from "@/components/account/AccountPrimitives";
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

      <PageHeader
        eyebrow={subscription.id}
        title={`${subscription.cadence} ${subscription.service.toLowerCase()}`}
        description={`Next visit is ${formatAccountDate(subscription.nextVisit)} between ${subscription.arrivalWindow} at ${subscription.address}.`}
        action={<StatusPill status={subscription.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <SummaryCard title="Plan settings">
            <dl>
              <DetailRow label="Cadence" value={subscription.cadence} />
              <DetailRow label="Service" value={subscription.service} />
              <DetailRow label="Home" value={`${subscription.address} · ${subscription.home}`} />
              <DetailRow label="Team" value={subscription.team} />
              <DetailRow label="Cleaner preference" value={subscription.cleanerPreference} />
              <DetailRow label="Started" value={formatAccountDate(subscription.startedAt)} />
              {subscription.pausedUntil ? <DetailRow label="Paused until" value={formatAccountDate(subscription.pausedUntil)} /> : null}
            </dl>
          </SummaryCard>

          <SummaryCard title="Default scope">
            <div className="grid gap-3 sm:grid-cols-2">
              {subscription.scope.map((item) => (
                <div key={item} className="rounded-xl bg-surface-muted p-3 text-sm font-bold text-text-primary">
                  {item}
                </div>
              ))}
            </div>
          </SummaryCard>

          <SummaryCard title="Upcoming visits">
            <div className="grid gap-3">
              {subscription.upcomingVisits.map((visit) => (
                <div key={visit.id} className="grid gap-2 rounded-2xl border border-border bg-surface-muted p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-sm font-bold text-text-primary">{formatAccountDate(visit.date)}, {visit.arrivalWindow}</p>
                    <p className="mt-1 text-sm text-text-secondary">{visit.id}</p>
                  </div>
                  <StatusPill status={visit.status} />
                </div>
              ))}
            </div>
          </SummaryCard>

          <SummaryCard title="Plan notes">
            <p className="text-sm leading-6 text-text-secondary">{subscription.notes}</p>
          </SummaryCard>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <SummaryCard title="Billing">
            <dl>
              <DetailRow label="Monthly estimate" value={<Money value={subscription.monthlyEstimate} />} />
              <DetailRow label="Payment method" value={subscription.paymentMethod} />
            </dl>
          </SummaryCard>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
            <h2 className="text-lg font-bold text-text-primary">Plan actions</h2>
            <div className="mt-4 grid gap-3">
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
            </div>
          </div>

          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-2 text-sm font-bold">
              <RefreshCw className="size-4" aria-hidden="true" />
              Recurring plan
            </div>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
              Cadence changes apply to future planned visits. Existing scheduled visits stay visible here.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

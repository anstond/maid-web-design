import { CalendarDays, Home, KeyRound, Mail, MapPin, Phone, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { DetailRow, HeroPanel, MetricCard, MetricGrid, PageHeader, SecondaryButton, SummaryCard } from "@/components/account/AccountPrimitives";
import { accountProfile, bookings, formatAccountDate, subscriptions } from "@/lib/mock-account-data";

export default function ProfilePage() {
  const nextBooking = bookings.find((booking) => booking.status === "scheduled" || booking.status === "needs_attention");
  const activePlan = subscriptions.find((subscription) => subscription.status === "active");

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your personal info, home details, and preferences."
        action={<SecondaryButton>Edit profile</SecondaryButton>}
      />

      <HeroPanel
        title={accountProfile.name}
        description={`${accountProfile.neighborhood}. A member since ${formatAccountDate(accountProfile.memberSince)}.`}
        action={<span className="inline-flex min-h-11 items-center rounded-full bg-primary-foreground px-5 text-sm font-bold text-primary">Verified</span>}
      >
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <HeroFact icon={<Mail className="size-4" />} label="Email" value={accountProfile.email} />
          <HeroFact icon={<Phone className="size-4" />} label="Phone" value={accountProfile.phone} />
          <HeroFact icon={<MapPin className="size-4" />} label="Neighborhood" value={accountProfile.neighborhood} />
        </div>
      </HeroPanel>

      <MetricGrid>
        <MetricCard label="Next booking" value={nextBooking ? formatAccountDate(nextBooking.date) : "None"} helper={nextBooking ? nextBooking.arrivalWindow : "No upcoming appointment"} icon={<CalendarDays className="size-5" aria-hidden="true" />} tone="strong" />
        <MetricCard label="Active plan" value={activePlan ? activePlan.cadence : "None"} helper={activePlan ? activePlan.service : "No recurring cadence"} icon={<Sparkles className="size-5" aria-hidden="true" />} />
        <MetricCard label="Home profile" value={`${accountProfile.bedrooms} bed`} helper={`${accountProfile.bathrooms} bath, ${accountProfile.pets.toLowerCase()}`} icon={<Home className="size-5" aria-hidden="true" />} />
        <MetricCard label="Account standing" value="Clear" helper="Payments current, no quality cases" icon={<ShieldCheck className="size-5" aria-hidden="true" />} />
      </MetricGrid>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <SummaryCard title="Contact info">
            <dl>
              <DetailRow label="Name" value={accountProfile.name} />
              <DetailRow label="Email" value={accountProfile.email} />
              <DetailRow label="Phone" value={accountProfile.phone} />
              <DetailRow label="Neighborhood" value={accountProfile.neighborhood} />
            </dl>
          </SummaryCard>

          <SummaryCard title="Your home">
            <dl>
              <DetailRow label="Address" value={accountProfile.defaultAddress} />
              <DetailRow label="Home type" value={accountProfile.homeType} />
              <DetailRow label="Pets" value={accountProfile.pets} />
              <DetailRow label="Supplies to use" value={accountProfile.suppliesPreference} />
            </dl>
          </SummaryCard>

          <SummaryCard title="How to reach your home">
            <div className="grid gap-4 md:grid-cols-2">
              <PreferenceBlock icon={<KeyRound className="size-4" />} label="Getting in" value={accountProfile.accessPreference} />
              <PreferenceBlock icon={<MapPin className="size-4" />} label="Where to park" value={accountProfile.parkingNotes} />
              <PreferenceBlock icon={<UserRound className="size-4" />} label="Cleaner preference" value={accountProfile.cleanerPreference} />
              <PreferenceBlock icon={<Sparkles className="size-4" />} label="House notes" value={accountProfile.householdNotes} />
            </div>
          </SummaryCard>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <SummaryCard title="Quick actions">
            <div className="grid gap-3">
              <SecondaryButton>Edit contact info</SecondaryButton>
              <SecondaryButton>Change home details</SecondaryButton>
              <SecondaryButton>Update preferences</SecondaryButton>
            </div>
          </SummaryCard>

          <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[0_18px_58px_rgba(21,94,99,0.18)]">
            <div className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Privacy
            </div>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
              Your home address, access details, and special requests are only shared with your assigned cleaner.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function HeroFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function PreferenceBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

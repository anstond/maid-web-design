"use client";

import { Bell, CreditCard, Lock, Zap, AlertCircle, Check } from "lucide-react";
import { PageHeader, SummaryCard, SecondaryButton } from "@/components/account/AccountPrimitives";
import { accountSettings } from "@/lib/mock-account-data";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Notifications, payment methods, security, and service preferences."
      />

      <div className="grid gap-6">
        <SummaryCard title="Notification preferences">
          <div className="space-y-4">
            {accountSettings.notifications.map((notification) => (
              <NotificationToggle key={notification.label} notification={notification} />
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Payment methods">
          <div className="space-y-4">
            {accountSettings.paymentMethods.map((method, idx) => (
              <div key={idx} className="flex items-start justify-between rounded-lg border border-border bg-surface-muted p-4">
                <div>
                  <p className="font-bold text-text-primary">{method.label}</p>
                  <p className="mt-1 text-sm text-text-secondary">{method.detail}</p>
                </div>
                <div className="flex items-center gap-2">
                  {method.default && <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">Default</span>}
                  <SecondaryButton>Edit</SecondaryButton>
                </div>
              </div>
            ))}
            <SecondaryButton>Add payment method</SecondaryButton>
          </div>
        </SummaryCard>

        <SummaryCard title="Security">
          <div className="space-y-4">
            {accountSettings.security.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-start justify-between rounded-lg border p-4",
                  item.state === "good" ? "border-success/25 bg-success/5" : "border-error/25 bg-error/5"
                )}
              >
                <div className="flex items-start gap-3">
                  {item.state === "good" ? (
                    <Check className="mt-0.5 size-4 flex-shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-error" aria-hidden="true" />
                  )}
                  <div>
                    <p className={cn("font-bold", item.state === "good" ? "text-text-primary" : "text-text-primary")}>
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">{item.value}</p>
                  </div>
                </div>
                {item.label !== "Active sessions" && <SecondaryButton>Update</SecondaryButton>}
              </div>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Service preferences">
          <div className="space-y-4">
            {accountSettings.communication.map((pref) => (
              <div key={pref.label} className="border-b border-border py-4 last:border-b-0 last:py-0">
                <p className="text-sm font-bold text-text-secondary">{pref.label}</p>
                <p className="mt-2 text-sm text-text-primary">{pref.value}</p>
              </div>
            ))}
            <SecondaryButton>Edit service preferences</SecondaryButton>
          </div>
        </SummaryCard>

        <div className="rounded-2xl border-2 border-error/25 bg-error/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-error" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="font-bold text-text-primary">Deactivate account</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Deactivating your account will cancel all active bookings and recurring plans. You can reactivate later with the same email.
              </p>
              <button className="mt-4 inline-flex min-h-11 items-center rounded-full border border-error/50 bg-error/10 px-5 text-sm font-bold text-error transition hover:bg-error/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-error/30 active:translate-y-px">
                Deactivate account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NotificationToggle({ notification }: { notification: { label: string; description: string; enabled: boolean } }) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-surface-muted p-4">
      <label className="flex cursor-pointer items-center gap-3 flex-1">
        <input
          type="checkbox"
          defaultChecked={notification.enabled}
          className="size-5 cursor-pointer rounded border border-border bg-surface accent-primary"
          aria-label={notification.label}
        />
        <div>
          <p className="font-bold text-text-primary">{notification.label}</p>
          <p className="mt-1 text-sm text-text-secondary">{notification.description}</p>
        </div>
      </label>
    </div>
  );
}

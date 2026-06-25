"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Plus, BadgeCheck } from "lucide-react";
import { PageHeader, SecondaryButton, SummaryCard } from "@/components/account/AccountPrimitives";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { accountProfile, accountSettings, bookings, subscriptions } from "@/lib/mock-account-data";

type ProfileSheet = "address" | "card" | "phone" | "name" | "close" | null;

export default function AccountPage() {
  const [activeSheet, setActiveSheet] = useState<ProfileSheet>(null);
  const [addresses, setAddresses] = useState([accountProfile.defaultAddress]);
  const [defaultPaymentId, setDefaultPaymentId] = useState(0);
  const [newAddress, setNewAddress] = useState({ street: "", unit: "", postalCode: "", phone: "" });
  const [phone, setPhone] = useState(accountProfile.phone);
  const [editingPhone, setEditingPhone] = useState(accountProfile.phone);
  const [name, setName] = useState(accountProfile.name);
  const [editingName, setEditingName] = useState(accountProfile.name);
  const [loadingAction, setLoadingAction] = useState<ProfileSheet>(null);

  const nextBooking = bookings.find((booking) => booking.status === "scheduled" || booking.status === "needs_attention");
  const activePlan = subscriptions.find((subscription) => subscription.status === "active");

  const handleAddAddress = async () => {
    const { street, unit, postalCode, phone } = newAddress;
    if (street.trim() && postalCode.trim() && phone.trim()) {
      setLoadingAction("address");
      await new Promise((resolve) => setTimeout(resolve, 800));
      const formattedAddress = `${street}${unit ? ` ${unit}` : ""}, ${postalCode}`;
      setAddresses([...addresses, formattedAddress]);
      setNewAddress({ street: "", unit: "", postalCode: "", phone: "" });
      setLoadingAction(null);
      setActiveSheet(null);
    }
  };

  const handleUpdatePhone = async () => {
    if (editingPhone.trim()) {
      setLoadingAction("phone");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPhone(editingPhone);
      setLoadingAction(null);
      setActiveSheet(null);
    }
  };

  const handleUpdateName = async () => {
    if (editingName.trim()) {
      setLoadingAction("name");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setName(editingName);
      setLoadingAction(null);
      setActiveSheet(null);
    }
  };

  const handleSetDefaultPayment = async (idx: number) => {
    setLoadingAction("card");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDefaultPaymentId(idx);
    setLoadingAction(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile & Settings"
        description="Your personal information, home details, preferences, and security."
      />

      <section className="mb-8 overflow-hidden rounded-2xl border border-primary bg-primary p-6 sm:p-8 text-primary-foreground shadow-[rgba(0,0,0,0.16)_0px_4px_16px_0px]">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <Image
              src={accountProfile.picture}
              alt={accountProfile.name}
              width={96}
              height={96}
              className="rounded-full object-cover ring-4 ring-primary-foreground/20 shadow-lg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground">{name}</h2>
            <p className="mt-2 text-sm sm:text-base text-primary-foreground/80">{accountProfile.neighborhood} · Member since {accountProfile.memberSince.split("T")[0]}</p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-4 py-2 text-xs font-bold text-primary shadow-lg">
                <BadgeCheck className="size-4" />
                Verified account
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <aside className="order-first grid gap-6 lg:order-last lg:sticky lg:top-6 lg:self-start">
          {nextBooking && (
            <SummaryCard title="Next booking">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-bold text-text-secondary">Date</p>
                  <p className="mt-1 text-sm font-bold text-text-primary">{nextBooking.date}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary">Service</p>
                  <p className="mt-1 text-sm font-bold text-text-primary">{nextBooking.service}</p>
                </div>
                <Link
                  href={`/account/bookings/${nextBooking.id}`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
                >
                  View booking
                </Link>
              </div>
            </SummaryCard>
          )}

          <SummaryCard title="Account overview">
            <dl className="flex flex-col gap-4">
              <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                <p className="text-xs font-bold text-text-secondary">Active plan</p>
                <p className="mt-2 text-sm font-bold text-text-primary">{activePlan ? activePlan.cadence : "No active plan"}</p>
              </div>
              <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                <p className="text-xs font-bold text-text-secondary">Account standing</p>
                <p className="mt-2 text-sm font-bold text-text-primary">Clear</p>
              </div>
            </dl>
          </SummaryCard>

          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Privacy
            </div>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
              Your home address and access details are only shared with your assigned cleaner.
            </p>
          </div>
        </aside>

        <div className="grid gap-6">
          <SummaryCard title="Contact information">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-xs font-bold text-text-secondary">Full name</p>
                  <p className="mt-2 text-sm font-bold text-text-primary">{name}</p>
                </div>
                <button
                  onClick={() => setActiveSheet("name")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-bold text-text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-xs font-bold text-text-secondary">Email</p>
                  <p className="mt-2 text-sm font-bold text-text-primary">{accountProfile.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-text-secondary">Phone</p>
                  <p className="mt-2 text-sm font-bold text-text-primary">{phone}</p>
                </div>
                <button
                  onClick={() => setActiveSheet("phone")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-bold text-text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
                >
                  Edit
                </button>
              </div>
            </div>
          </SummaryCard>

          <SummaryCard title="Addresses">
            {addresses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-text-secondary">No addresses yet. Add one to get started.</p>
                <button
                  onClick={() => setActiveSheet("address")}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
                >
                  <Plus className="size-4" />
                  Add address
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.map((address, idx) => (
                  <div key={idx} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-text-primary">{address}</p>
                        {idx === 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">Primary</span>}
                      </div>
                    </div>
                    <SecondaryButton className="w-full sm:w-auto" onClick={() => setActiveSheet("address")}>Edit</SecondaryButton>
                  </div>
                ))}
                <button
                  onClick={() => setActiveSheet("address")}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-muted border border-border px-5 text-sm font-bold text-text-primary transition hover:bg-background"
                >
                  <Plus className="size-4" />
                  Add address
                </button>
              </div>
            )}
          </SummaryCard>

          <SummaryCard title="Payment methods">
            {accountSettings.paymentMethods.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-text-secondary">No payment methods saved yet.</p>
                <button
                  onClick={() => setActiveSheet("card")}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
                >
                  <Plus className="size-4" />
                  Add card
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {accountSettings.paymentMethods.map((method, idx) => (
                  <div key={idx} className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-start sm:justify-between ${
                    defaultPaymentId === idx ? "border-primary bg-primary/5" : "border-border bg-surface-muted"
                  }`}>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-text-primary">{method.label}</p>
                        {defaultPaymentId === idx && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">Default</span>}
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">{method.detail}</p>
                    </div>
                    {defaultPaymentId !== idx && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-11 rounded-full px-5 w-full sm:w-auto"
                        onClick={() => handleSetDefaultPayment(idx)}
                        loading={loadingAction === "card"}
                      >
                        Make default
                      </Button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setActiveSheet("card")}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-muted border border-border px-5 text-sm font-bold text-text-primary transition hover:bg-background"
                >
                  <Plus className="size-4" />
                  Add card
                </button>
              </div>
            )}
          </SummaryCard>

          <div className="rounded-2xl border-2 border-error/40 bg-error/8 p-6">
            <h3 className="font-bold text-error">Close account</h3>
            <p className="mt-3 text-sm text-text-secondary">
              Your data will be retained for 90 days. You can sign back in anytime to reactivate.
            </p>
            <button
              onClick={() => setActiveSheet("close")}
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-error/40 bg-error/10 px-5 text-sm font-bold text-error transition hover:bg-error/15"
            >
              Close account
            </button>
          </div>
        </div>
      </div>

      <AccountActionSheet
        open={activeSheet === "address"}
        onOpenChange={(open) => setActiveSheet(open ? "address" : null)}
        title="Add new address"
        description="Save the address and contact number cleaners should use for visits."
      >
        <div className="mt-5 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Street address"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            className="booking-input"
          />
          <input
            type="text"
            placeholder="Unit / Apartment (optional)"
            value={newAddress.unit}
            onChange={(e) => setNewAddress({ ...newAddress, unit: e.target.value })}
            className="booking-input"
          />
          <input
            type="text"
            placeholder="Postal code"
            value={newAddress.postalCode}
            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
            className="booking-input"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            className="booking-input"
          />
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" size="lg" className="h-11 rounded-full px-5" onClick={() => setActiveSheet(null)} disabled={loadingAction === "address"}>
            Cancel
          </Button>
          <Button type="button" size="lg" className="h-11 rounded-full px-5 font-bold" onClick={handleAddAddress} loading={loadingAction === "address"}>
            Add
          </Button>
        </SheetFooter>
      </AccountActionSheet>

      <AccountActionSheet
        open={activeSheet === "card"}
        onOpenChange={(open) => setActiveSheet(open ? "card" : null)}
        title="Add new card"
        description="Add a payment method for upcoming bookings and subscription renewals."
      >
        <div className="mt-5 flex flex-col gap-3">
          <input type="text" placeholder="Cardholder name" className="booking-input" />
          <input type="text" inputMode="numeric" placeholder="Card number" className="booking-input" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" inputMode="numeric" placeholder="MM/YY" className="booking-input" />
            <input type="text" inputMode="numeric" placeholder="CVC" className="booking-input" />
          </div>
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" size="lg" className="h-11 rounded-full px-5" onClick={() => setActiveSheet(null)} disabled={loadingAction === "card"}>
            Cancel
          </Button>
          <Button type="button" size="lg" className="h-11 rounded-full px-5 font-bold" onClick={() => setActiveSheet(null)} loading={loadingAction === "card"}>
            Add card
          </Button>
        </SheetFooter>
      </AccountActionSheet>

      <AccountActionSheet
        open={activeSheet === "phone"}
        onOpenChange={(open) => setActiveSheet(open ? "phone" : null)}
        title="Update phone number"
        description="Use a number where your cleaner can reach you on service day."
      >
        <input
          type="tel"
          placeholder="Phone number"
          value={editingPhone}
          onChange={(e) => setEditingPhone(e.target.value)}
          className="booking-input mt-5"
        />
        <SheetFooter>
          <Button type="button" variant="outline" size="lg" className="h-11 rounded-full px-5" onClick={() => setActiveSheet(null)} disabled={loadingAction === "phone"}>
            Cancel
          </Button>
          <Button type="button" size="lg" className="h-11 rounded-full px-5 font-bold" onClick={handleUpdatePhone} loading={loadingAction === "phone"}>
            Save
          </Button>
        </SheetFooter>
      </AccountActionSheet>

      <AccountActionSheet
        open={activeSheet === "name"}
        onOpenChange={(open) => setActiveSheet(open ? "name" : null)}
        title="Update name"
        description="This is the name shown on your account and booking records."
      >
        <input
          type="text"
          placeholder="Full name"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          className="booking-input mt-5"
        />
        <SheetFooter>
          <Button type="button" variant="outline" size="lg" className="h-11 rounded-full px-5" onClick={() => setActiveSheet(null)} disabled={loadingAction === "name"}>
            Cancel
          </Button>
          <Button type="button" size="lg" className="h-11 rounded-full px-5 font-bold" onClick={handleUpdateName} loading={loadingAction === "name"}>
            Save
          </Button>
        </SheetFooter>
      </AccountActionSheet>

      <AccountActionSheet
        open={activeSheet === "close"}
        onOpenChange={(open) => setActiveSheet(open ? "close" : null)}
        title="Close account?"
        description="Bookings and plans will be paused. Your data will be retained for 90 days and you can reactivate anytime."
      >
        <SheetFooter>
          <Button type="button" variant="outline" size="lg" className="h-11 rounded-full px-5" onClick={() => setActiveSheet(null)} disabled={loadingAction === "close"}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" size="lg" className="h-11 rounded-full px-5 font-bold" onClick={() => setActiveSheet(null)} loading={loadingAction === "close"}>
            Close account
          </Button>
        </SheetFooter>
      </AccountActionSheet>
    </>
  );
}

function AccountActionSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

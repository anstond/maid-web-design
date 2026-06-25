"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, AlertCircle, Plus, X } from "lucide-react";
import { DetailRow, PageHeader, SecondaryButton, SummaryCard } from "@/components/account/AccountPrimitives";
import { accountProfile, accountSettings, bookings, subscriptions } from "@/lib/mock-account-data";

export default function AccountPage() {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [addresses, setAddresses] = useState([accountProfile.defaultAddress]);
  const [defaultPaymentId, setDefaultPaymentId] = useState(0);
  const [newAddress, setNewAddress] = useState({ street: "", unit: "", postalCode: "", phone: "" });
  const [phone, setPhone] = useState(accountProfile.phone);
  const [editingPhone, setEditingPhone] = useState(accountProfile.phone);
  const [name, setName] = useState(accountProfile.name);
  const [editingName, setEditingName] = useState(accountProfile.name);

  const nextBooking = bookings.find((booking) => booking.status === "scheduled" || booking.status === "needs_attention");
  const activePlan = subscriptions.find((subscription) => subscription.status === "active");

  const handleAddAddress = () => {
    const { street, unit, postalCode, phone } = newAddress;
    if (street.trim() && postalCode.trim() && phone.trim()) {
      const formattedAddress = `${street}${unit ? ` ${unit}` : ""}, ${postalCode}`;
      setAddresses([...addresses, formattedAddress]);
      setNewAddress({ street: "", unit: "", postalCode: "", phone: "" });
      setShowAddressModal(false);
    }
  };

  const handleUpdatePhone = () => {
    if (editingPhone.trim()) {
      setPhone(editingPhone);
      setShowPhoneModal(false);
    }
  };

  const handleUpdateName = () => {
    if (editingName.trim()) {
      setName(editingName);
      setShowNameModal(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile & Settings"
        description="Your personal information, home details, preferences, and security."
      />

      <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <Image
                src={accountProfile.picture}
                alt={accountProfile.name}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold tracking-tight text-text-primary">{name}</h2>
              <p className="mt-2 text-base text-text-secondary">{accountProfile.neighborhood}. Member since {accountProfile.memberSince.split("T")[0]}.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex min-h-9 items-center rounded-full bg-success/10 px-4 text-xs font-bold text-success">Verified account</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs font-bold text-text-secondary">Email</p>
              <p className="mt-2 text-sm font-bold text-text-primary">{accountProfile.email}</p>
            </div>
            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs font-bold text-text-secondary">Phone</p>
              <p className="mt-2 text-sm font-bold text-text-primary">{accountProfile.phone}</p>
            </div>
            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs font-bold text-text-secondary">Location</p>
              <p className="mt-2 text-sm font-bold text-text-primary">{accountProfile.neighborhood}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <SummaryCard title="Contact information">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-xs font-bold text-text-secondary">Full name</p>
                  <p className="mt-2 text-sm font-bold text-text-primary">{name}</p>
                </div>
                <button
                  onClick={() => setShowNameModal(true)}
                  className="px-4 py-2 text-xs font-bold rounded-full border border-border bg-surface text-text-primary transition hover:bg-surface-muted"
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
                  onClick={() => setShowPhoneModal(true)}
                  className="px-4 py-2 text-xs font-bold rounded-full border border-border bg-surface text-text-primary transition hover:bg-surface-muted"
                >
                  Edit
                </button>
              </div>
            </div>
          </SummaryCard>

          <SummaryCard title="Addresses">
            <div className="space-y-3">
              {addresses.map((address, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface-muted p-4">
                  <div>
                    <p className="font-bold text-text-primary">{address}</p>
                    {idx === 0 && <p className="mt-1 text-xs font-bold text-success">Primary address</p>}
                  </div>
                  <SecondaryButton>Edit</SecondaryButton>
                </div>
              ))}
              <button
                onClick={() => setShowAddressModal(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-muted border border-border px-5 text-sm font-bold text-text-primary transition hover:bg-background"
              >
                <Plus className="size-4" />
                Add address
              </button>
            </div>
          </SummaryCard>

          <SummaryCard title="Payment methods">
            <div className="space-y-3">
              {accountSettings.paymentMethods.map((method, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface-muted p-4">
                  <div>
                    <p className="font-bold text-text-primary">{method.label}</p>
                    <p className="mt-1 text-sm text-text-secondary">{method.detail}</p>
                  </div>
                  <button
                    onClick={() => setDefaultPaymentId(idx)}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition ${
                      defaultPaymentId === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface border border-border text-text-primary hover:bg-surface-muted"
                    }`}
                  >
                    {defaultPaymentId === idx ? "Default" : "Make default"}
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowCardModal(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-muted border border-border px-5 text-sm font-bold text-text-primary transition hover:bg-background"
              >
                <Plus className="size-4" />
                Add card
              </button>
            </div>
          </SummaryCard>

          <SummaryCard title="Close account">
            <p className="text-sm text-text-secondary mb-4">
              Your data will be retained for 90 days. You can sign back in anytime to reactivate.
            </p>
            <button
              onClick={() => setShowCloseModal(true)}
              className="inline-flex min-h-11 items-center rounded-full border border-error/30 bg-error/5 px-5 text-sm font-bold text-error transition hover:bg-error/10"
            >
              Close account
            </button>
          </SummaryCard>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          {nextBooking && (
            <SummaryCard title="Next booking">
              <div className="space-y-3">
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
            <dl className="space-y-4">
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

          <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[0_18px_58px_rgba(21,94,99,0.18)]">
            <div className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Privacy
            </div>
            <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
              Your home address and access details are only shared with your assigned cleaner.
            </p>
          </div>
        </aside>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 border border-border">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-text-primary">Add new address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 hover:bg-surface-muted rounded-full"
              >
                <X className="size-5 text-text-secondary" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street address"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Unit / Apartment (optional)"
                value={newAddress.unit}
                onChange={(e) => setNewAddress({ ...newAddress, unit: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Postal code"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-4 py-2 rounded-full border border-border bg-surface text-text-primary font-bold transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                className="flex-1 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold transition hover:bg-primary-hover"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 border border-border">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-text-primary">Add new card</h3>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-1 hover:bg-surface-muted rounded-full"
              >
                <X className="size-5 text-text-secondary" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Cardholder name"
                className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Card number"
                className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCardModal(false)}
                className="flex-1 px-4 py-2 rounded-full border border-border bg-surface text-text-primary font-bold transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCardModal(false)}
                className="flex-1 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold transition hover:bg-primary-hover"
              >
                Add card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 border border-border">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-text-primary">Update phone number</h3>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="p-1 hover:bg-surface-muted rounded-full"
              >
                <X className="size-5 text-text-secondary" />
              </button>
            </div>
            <input
              type="tel"
              placeholder="Phone number"
              value={editingPhone}
              onChange={(e) => setEditingPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 px-4 py-2 rounded-full border border-border bg-surface text-text-primary font-bold transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePhone}
                className="flex-1 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold transition hover:bg-primary-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 border border-border">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-text-primary">Update name</h3>
              <button
                onClick={() => setShowNameModal(false)}
                className="p-1 hover:bg-surface-muted rounded-full"
              >
                <X className="size-5 text-text-secondary" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Full name"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-muted p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 px-4 py-2 rounded-full border border-border bg-surface text-text-primary font-bold transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateName}
                className="flex-1 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold transition hover:bg-primary-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Account Confirmation Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 border border-border">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-text-primary">Close account?</h3>
              <button
                onClick={() => setShowCloseModal(false)}
                className="p-1 hover:bg-surface-muted rounded-full"
              >
                <X className="size-5 text-text-secondary" />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Bookings and plans will be paused. Your data will be retained for 90 days and you can reactivate anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 px-4 py-2 rounded-full border border-border bg-surface text-text-primary font-bold transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 px-4 py-2 rounded-full border border-error/30 bg-error/5 text-error font-bold transition hover:bg-error/10"
              >
                Close account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

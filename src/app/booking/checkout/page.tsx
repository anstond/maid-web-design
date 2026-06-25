"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Lock, ShieldCheck } from "lucide-react";

type BookingData = {
  address: string;
  unit: string;
  city: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  serviceName: string;
  frequencyName: string;
  arrivalWindowLabel: string;
  date: string;
  access: string;
  parking: string;
  pets: string;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  estimate: {
    estimatedHours: number;
    visitHours: number;
    laborHours: number;
    cleanerCount: number;
    labor: number;
    addonTotal: number;
    suppliesFee: number;
    arrivalFee: number;
    serviceFee: number;
    total: number;
  };
};

type PaymentState = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  billingZip: string;
  saveCard: boolean;
};

const INITIAL_PAYMENT: PaymentState = {
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  billingZip: "",
  saveCard: true,
};

function formatDate(date: string) {
  if (!date) return "Date not selected";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CheckoutPage() {
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [payment, setPayment] = useState<PaymentState>(INITIAL_PAYMENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      const raw = sessionStorage.getItem("apartmentmaid_booking");
      if (raw) {
        setBooking(JSON.parse(raw));
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const formValid = useMemo(() => {
    return (
      payment.cardName.trim().length > 2 &&
      payment.cardNumber.replace(/\D/g, "").length >= 15 &&
      payment.expiry.length === 5 &&
      payment.cvc.length >= 3 &&
      payment.billingZip.length === 5
    );
  }, [payment]);

  function update<K extends keyof PaymentState>(key: K, value: PaymentState[K]) {
    setPayment((previous) => ({ ...previous, [key]: value }));
  }

  function handleCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    update("cardNumber", digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  }

  function handleExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    update("expiry", digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!formValid) {
      setError("Check the payment fields before confirming.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setConfirmed(true);
    setIsSubmitting(false);
    sessionStorage.removeItem("apartmentmaid_booking");
  }

  if (isLoading) {
    return <div className="min-h-[100dvh] bg-background" />;
  }

  if (!booking) {
    return (
      <main className="min-h-[100dvh] bg-background px-4 py-12 text-text-primary">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 text-center">
          <h1 className="text-2xl font-bold">No booking found</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Start the booking flow again so we can price the visit and collect arrival notes.
          </p>
          <Link href="/booking" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground">
            Start booking
          </Link>
        </div>
      </main>
    );
  }

  if (confirmed) {
    return (
      <main className="min-h-[100dvh] bg-background px-4 py-12 text-text-primary">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-6 text-center shadow-[0_12px_40px_rgba(21,94,99,0.08)] sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Your cleaning is booked.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
            Confirmation was sent to {booking.email}. Your cleaner assignment and arrival instructions will arrive before the visit.
          </p>

          <div className="mt-8 grid gap-3 rounded-2xl bg-surface-muted p-4 text-left text-sm sm:grid-cols-2">
            <SummaryLine label="Service" value={booking.serviceName} />
            <SummaryLine label="When" value={`${formatDate(booking.date)}, ${booking.arrivalWindowLabel}`} />
            <SummaryLine label="Home" value={`${booking.address}${booking.unit ? `, ${booking.unit}` : ""}`} />
            <SummaryLine label="Total paid" value={`$${booking.estimate.total.toFixed(2)}`} />
          </div>

          <Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-background text-text-primary">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/booking" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Edit booking
          </Link>
          <div className="hidden items-center gap-2 text-sm font-medium text-text-secondary sm:flex">
            <Lock className="size-4 text-primary" aria-hidden="true" />
            Secure checkout
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-12">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)] sm:p-7" aria-labelledby="checkout-title">
          <p className="mb-3 text-sm font-semibold text-primary">Payment</p>
          <h1 id="checkout-title" className="text-3xl font-bold tracking-normal text-text-primary md:text-4xl">
            Confirm your appointment.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Your card is charged after confirmation. If the cleaner finds the job needs more time, we ask before changing the price.
          </p>

          <div className="mt-8 grid gap-4 rounded-2xl bg-surface-muted p-4 sm:grid-cols-2">
            <SummaryLine label="Customer" value={`${booking.firstName} ${booking.lastName}`} />
            <SummaryLine label="Contact" value={`${booking.email}, ${booking.phone}`} />
            <SummaryLine label="Service" value={`${booking.serviceName}, ${booking.frequencyName}`} />
            <SummaryLine label="Team" value={`${booking.estimate.visitHours} hr × ${booking.estimate.cleanerCount} ${booking.estimate.cleanerCount === 1 ? "cleaner" : "cleaners"}`} />
            <SummaryLine label="Schedule" value={`${formatDate(booking.date)}, ${booking.arrivalWindowLabel}`} />
            <SummaryLine label="Address" value={`${booking.address}${booking.unit ? `, ${booking.unit}` : ""}, ${booking.city} ${booking.zip}`} />
            <SummaryLine label="Access" value={booking.access} />
            <SummaryLine label="Parking" value={booking.parking} />
            <SummaryLine label="Pets" value={booking.pets} />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-base font-bold text-text-primary">
              <CreditCard className="size-5 text-primary" aria-hidden="true" />
              Card details
            </div>

            <Field label="Name on card" htmlFor="cardName">
              <input id="cardName" value={payment.cardName} onChange={(event) => update("cardName", event.target.value)} autoComplete="cc-name" className="booking-input" />
            </Field>

            <Field label="Card number" htmlFor="cardNumber">
              <input id="cardNumber" value={payment.cardNumber} onChange={(event) => handleCardNumber(event.target.value)} autoComplete="cc-number" inputMode="numeric" className="booking-input font-mono tabular-nums" placeholder="4242 4242 4242 4242" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr]">
              <Field label="Expiry" htmlFor="expiry">
                <input id="expiry" value={payment.expiry} onChange={(event) => handleExpiry(event.target.value)} autoComplete="cc-exp" inputMode="numeric" className="booking-input font-mono tabular-nums" placeholder="MM/YY" />
              </Field>
              <Field label="CVC" htmlFor="cvc">
                <input id="cvc" value={payment.cvc} onChange={(event) => update("cvc", event.target.value.replace(/\D/g, "").slice(0, 4))} autoComplete="cc-csc" inputMode="numeric" className="booking-input font-mono tabular-nums" />
              </Field>
              <Field label="Billing ZIP" htmlFor="billingZip">
                <input id="billingZip" value={payment.billingZip} onChange={(event) => update("billingZip", event.target.value.replace(/\D/g, "").slice(0, 5))} autoComplete="postal-code" inputMode="numeric" className="booking-input font-mono tabular-nums" />
              </Field>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface-muted p-4 text-sm leading-6 text-text-secondary">
              <input
                type="checkbox"
                checked={payment.saveCard}
                onChange={(event) => update("saveCard", event.target.checked)}
                className="mt-1 size-4 accent-primary"
              />
              Keep this payment method on file for future appointments.
            </label>

            {error ? (
              <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-sm font-medium text-error" role="alert">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_rgba(21,94,99,0.20)] transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px",
                isSubmitting ? "cursor-not-allowed bg-primary/60" : "bg-primary hover:bg-primary-hover"
              )}
            >
              {isSubmitting ? "Confirming booking..." : `Pay $${booking.estimate.total.toFixed(2)}`}
            </button>
          </form>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Payment summary">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
            <div className="bg-primary p-5 text-primary-foreground">
              <p className="text-sm font-semibold text-primary-foreground/80">Due today</p>
              <p className="mt-2 text-4xl font-bold tracking-normal">${booking.estimate.total.toFixed(2)}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{booking.estimate.visitHours} visit hr × {booking.estimate.cleanerCount} {booking.estimate.cleanerCount === 1 ? "cleaner" : "cleaners"}</p>
            </div>
            <div className="space-y-4 p-5">
              <EstimateRow label="Labor" value={`$${booking.estimate.labor.toFixed(0)}`} />
              <EstimateRow label="Labor hours" value={`${booking.estimate.laborHours.toFixed(1).replace(".0", "")} hr`} />
              {booking.estimate.addonTotal > 0 ? <EstimateRow label="Extra tasks" value={`$${booking.estimate.addonTotal.toFixed(0)}`} /> : null}
              {booking.estimate.arrivalFee > 0 ? <EstimateRow label="Arrival window" value={`$${booking.estimate.arrivalFee.toFixed(0)}`} /> : null}
              <EstimateRow label="Supplies" value={booking.estimate.suppliesFee > 0 ? `$${booking.estimate.suppliesFee}` : "Provided"} />
              <EstimateRow label="Service fee" value={`$${booking.estimate.serviceFee}`} />

              <div className="rounded-2xl bg-surface-muted p-4 text-sm leading-6 text-text-secondary">
                <div className="mb-2 flex items-center gap-2 font-bold text-text-primary">
                  <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                  Quality guarantee
                </div>
                Report a missed area within 24 hours and we schedule a re-clean for that area.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-text-primary">{value}</p>
    </div>
  );
}

function EstimateRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 text-sm", strong ? "font-bold text-text-primary" : "text-text-secondary")}>
      <span>{label}</span>
      <span className="text-right tabular-nums">{value}</span>
    </div>
  );
}

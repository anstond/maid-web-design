"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  User,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { getOrder, getSavedBookings, saveBooking, saveOrder, type BookingOrder, type BookingRecord } from "@/lib/mock-account-data";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateStr}T12:00:00`));
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<BookingOrder | null>(null);
  const [orderBookings, setOrderBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  function loadOrderDetails() {
    setLoading(true);
    const ord = getOrder(orderId);
    if (ord) {
      setOrder(ord);
      const allBookings = getSavedBookings();
      const filtered = allBookings.filter((b) => b.orderId === ord.id);
      setOrderBookings(filtered);
    }
    setLoading(false);
  }

  function cancelBookingRow(bookingId: string) {
    if (!confirm("Are you sure you want to cancel this visit?")) return;
    setActionLoading(true);
    const allBookings = getSavedBookings();
    const target = allBookings.find((b) => b.id === bookingId);
    if (target) {
      target.status = "cancelled";
      saveBooking(target);
      
      // Store in refund review under mock storage
      const existingReviews = JSON.parse(localStorage.getItem("apartmentmaid_refund_reviews") || "[]");
      existingReviews.push({
        id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: orderId,
        bookingId: bookingId,
        refundAmountCents: Math.round(target.total * 100),
        reason: "user_requested",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("apartmentmaid_refund_reviews", JSON.stringify(existingReviews));
    }
    loadOrderDetails();
    setActionLoading(false);
  }

  function cancelFullOrder() {
    if (!confirm("Are you sure you want to cancel this entire order and all scheduled visits?")) return;
    setActionLoading(true);
    if (order) {
      const updatedOrder = { ...order, status: "cancelled" as const };
      saveOrder(updatedOrder);

      const allBookings = getSavedBookings();
      allBookings.forEach((b) => {
        if (b.orderId === order.id) {
          b.status = "cancelled";
          saveBooking(b);
        }
      });

      // Add to refund reviews
      const existingReviews = JSON.parse(localStorage.getItem("apartmentmaid_refund_reviews") || "[]");
      existingReviews.push({
        id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: order.id,
        refundAmountCents: order.totalAmountCents,
        reason: "full_order_cancellation",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("apartmentmaid_refund_reviews", JSON.stringify(existingReviews));
    }
    loadOrderDetails();
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[100dvh] bg-background px-4 py-12 text-text-primary">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 text-center">
          <AlertCircle className="mx-auto size-12 text-error" />
          <h1 className="mt-4 text-2xl font-bold">Order not found</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            The order ID you requested does not exist or has expired.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground"
            >
              Back to home
            </Link>
            <Link
              href="/account/bookings"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-6 text-sm font-bold text-text-primary"
            >
              Go to bookings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isCancelled = order.status === "cancelled";
  const activeBookings = orderBookings.filter((b) => b.status !== "cancelled");

  return (
    <main className="min-h-[100dvh] bg-background text-text-primary">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/account/bookings"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            My Bookings
          </Link>
          <div className="text-sm font-bold text-text-secondary font-mono bg-surface-muted rounded-full px-3 py-1">
            Order Reference: {order.id}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Order Header / Hero Card */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-[0_12px_40px_rgba(21,94,99,0.06)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Multi-Visit Booking</p>
              <h1 className="mt-1 text-3xl font-bold tracking-normal text-text-primary sm:text-4xl">
                Order Summary
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  isCancelled
                    ? "bg-error/10 text-error border border-error/20"
                    : "bg-success/10 text-success border border-success/20"
                }`}
              >
                {isCancelled ? "Cancelled" : "Paid & Confirmed"}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-muted p-4 text-center">
              <span className="block text-xs font-bold text-text-secondary uppercase">Total Charged</span>
              <span className="mt-2 block text-3xl font-black text-text-primary">
                ${(order.totalAmountCents / 100).toFixed(2)}
              </span>
            </div>
            <div className="rounded-xl bg-surface-muted p-4 text-center">
              <span className="block text-xs font-bold text-text-secondary uppercase">Total Visits</span>
              <span className="mt-2 block text-3xl font-black text-text-primary">
                {orderBookings.length}
              </span>
            </div>
            <div className="rounded-xl bg-surface-muted p-4 text-center">
              <span className="block text-xs font-bold text-text-secondary uppercase">Active Visits</span>
              <span className="mt-2 block text-3xl font-black text-text-primary text-primary">
                {activeBookings.length}
              </span>
            </div>
          </div>

          {!isCancelled && activeBookings.length > 0 && (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={cancelFullOrder}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-error bg-surface px-5 text-sm font-bold text-error transition hover:bg-error/5"
              >
                Cancel Entire Order
              </button>
            </div>
          )}
        </section>

        {/* Scheduled Visits checklist */}
        <section className="mt-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            Visits in this Order
          </h2>

          <div className="grid gap-6">
            {orderBookings.map((booking, index) => {
              const visitCancelled = booking.status === "cancelled";
              return (
                <div
                  key={booking.id}
                  className={`overflow-hidden rounded-2xl border transition ${
                    visitCancelled
                      ? "border-border bg-surface-muted/50 opacity-70"
                      : "border-border bg-surface shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-primary/30"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-border/50 bg-surface-muted p-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-sm font-black text-text-primary">
                          {formatDate(booking.date)}
                        </span>
                        <span className="ml-3 text-xs font-bold text-text-secondary font-mono bg-surface border border-border/50 rounded px-1.5 py-0.5">
                          {booking.id}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold border ${
                          visitCancelled
                            ? "bg-error/10 text-error border-error/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        {visitCancelled ? "Cancelled" : booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-text-secondary uppercase">Arrival Time</span>
                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-primary">
                          <Clock className="size-4 text-primary" />
                          {booking.arrivalWindow}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text-secondary uppercase">Service Scope</span>
                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-primary">
                          <Sparkles className="size-4 text-primary" />
                          {booking.service} · {booking.team}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text-secondary uppercase">Location Address</span>
                        <div className="mt-1 flex items-start gap-2 text-sm font-semibold text-text-primary">
                          <MapPin className="size-4 text-primary mt-0.5" />
                          <span>{booking.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 sm:border-l sm:border-border/50 sm:pl-6">
                      <div>
                        <span className="text-xs font-bold text-text-secondary uppercase">Team Preference</span>
                        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-primary">
                          <User className="size-4 text-primary" />
                          {booking.cleaner}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text-secondary uppercase">Price Breakdown</span>
                        <div className="mt-1.5 space-y-1 text-xs text-text-secondary">
                          <div className="flex justify-between">
                            <span>Visit cost (Base + Supplies + Service fee)</span>
                            <span className="font-semibold text-text-primary">${booking.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {!visitCancelled && !isCancelled && (
                        <div className="pt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => cancelBookingRow(booking.id)}
                            className="inline-flex min-h-9 items-center justify-center rounded-full border border-error/55 bg-surface px-4 text-xs font-bold text-error transition hover:bg-error/5"
                          >
                            Cancel this visit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

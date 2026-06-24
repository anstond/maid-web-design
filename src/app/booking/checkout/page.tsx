"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

const T = {
  primary: "#155E63",
  primaryH: "#124A54",
  accentW: "#D9C7A3",
  accentS: "#EFE6D3",
  ink: "#1F2937",
  body: "#6B7280",
  muted: "#B8C0C2",
  canvas: "#FCFBF8",
  surface: "#FFFFFF",
  soft: "#F7F5F1",
  border: "#E5DFD3",
  onPrimary: "#FFFFFF",
  success: "#16A34A",
};

const SERVICES: Record<string, string> = {
  "regular-cleaning": "Regular Cleaning",
  "deep-cleaning": "Deep Cleaning",
  "kitchen-cleaning": "Kitchen Deep Clean",
  "commercial-cleaning": "Commercial Cleaning",
  "move-cleaning": "Move-In / Move-Out",
  "post-construction": "Post-Construction Cleaning",
};

const ADDON_NAMES: Record<string, string> = {
  deep_clean: "Deep cleaning upgrade",
  fridge: "Inside fridge",
  oven: "Inside oven",
  cabinets: "Inside cabinets",
  windows: "Windows (inside)",
  pets: "Pet friendly care",
};

const ADDON_PRICES: Record<string, number> = {
  deep_clean: 50,
  fridge: 25,
  oven: 25,
  cabinets: 35,
  windows: 40,
  pets: 20,
};

const SUBSCRIPTION_NAMES: Record<string, string> = {
  "one-time": "One-time booking",
  monthly: "Monthly subscription",
  biweekly: "Biweekly subscription",
  weekly: "Weekly subscription",
};

interface BookingData {
  serviceId: string;
  hours: number;
  maids: number;
  addons: string[];
  address: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  subscriptionPlan: string;
  date: string;
  timeSlot: string;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage) {
      const bookingData = sessionStorage.getItem("apartmentmaid_booking");
      if (bookingData) {
        setBooking(JSON.parse(bookingData));
      }
    }
    setIsLoading(false);
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .slice(0, 19);
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setFormData({ ...formData, expiry: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setFormData({ ...formData, cvv: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsConfirmed(true);
    setIsSubmitting(false);

    // Redirect after 2 seconds
    setTimeout(() => {
      if (sessionStorage) {
        sessionStorage.removeItem("apartmentmaid_booking");
      }
      router.push("/");
    }, 2000);
  };

  if (isLoading || !booking) {
    return (
      <div style={{ fontFamily: "var(--font-sans)", background: T.canvas, minHeight: "100vh" }}>
        <div
          style={{
            padding: "16px 32px",
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <a
              href="/"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: T.primary,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ArrowLeft size={16} />
              Back to home
            </a>
          </div>
        </div>
        <div
          style={{
            padding: "56px 32px",
            textAlign: "center",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: T.body, fontSize: 16 }}>Loading checkout...</p>
        </div>
      </div>
    );
  }

  const serviceLabel = SERVICES[booking.serviceId] || booking.serviceId;
  const subscriptionLabel = SUBSCRIPTION_NAMES[booking.subscriptionPlan] || "One-time booking";

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: T.canvas, color: T.ink }}>
      {/* Navigation */}
      <div
        style={{
          padding: "16px 32px",
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <a
            href="/booking"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: T.primary,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ArrowLeft size={16} />
            Back to booking
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "56px 32px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {isConfirmed ? (
            // Confirmation State
            <div
              style={{
                maxWidth: 600,
                margin: "0 auto",
                textAlign: "center",
                padding: "56px 32px",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: T.success,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 32px",
                  animation: "scaleIn 0.5s ease-out",
                }}
              >
                <ShieldCheck size={40} color={T.onPrimary} strokeWidth={1.5} />
              </div>

              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.ink,
                  margin: "0 0 16px",
                }}
              >
                Booking Confirmed! ✓
              </h1>

              <p
                style={{
                  fontSize: 16,
                  color: T.body,
                  lineHeight: "26px",
                  margin: "0 0 32px",
                }}
              >
                Your cleaning is scheduled for{" "}
                <strong>{new Date(booking.date).toLocaleDateString()}</strong>. You'll
                receive a confirmation email shortly.
              </p>

              <div
                style={{
                  background: T.soft,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 32,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <span style={{ fontWeight: 600, color: T.ink }}>
                    {serviceLabel}
                  </span>
                  <span style={{ fontWeight: 600, color: T.ink }}>
                    {booking.hours}h × {booking.maids} pro
                  </span>
                </div>

                <div style={{ fontSize: 14, color: T.body, lineHeight: "20px" }}>
                  <div>{booking.address}</div>
                  {booking.unit && <div>{booking.unit}</div>}
                  <div>
                    {booking.city}, {booking.state} {booking.zip}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: T.body, margin: "0" }}>
                Redirecting to home in a moment...
              </p>
            </div>
          ) : (
            // Checkout Form
            <div
              className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10"
              style={{ gridAutoFlow: "row" }}
            >
              {/* Left: Order Summary */}
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: T.ink,
                    margin: "0 0 32px",
                  }}
                >
                  Order Review
                </h1>

                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: 32,
                    marginBottom: 24,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 24px",
                    }}
                  >
                    Booking Details
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Service */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: 16,
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: T.ink,
                            marginBottom: 4,
                          }}
                        >
                          Service
                        </div>
                        <div style={{ fontSize: 13, color: T.body }}>
                          {serviceLabel}
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: 16,
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: T.ink,
                            marginBottom: 4,
                          }}
                        >
                          Date & Time
                        </div>
                        <div style={{ fontSize: 13, color: T.body }}>
                          {new Date(booking.date).toLocaleDateString()},{" "}
                          {booking.timeSlot}
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: 16,
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: T.ink,
                            marginBottom: 4,
                          }}
                        >
                          Team Size
                        </div>
                        <div style={{ fontSize: 13, color: T.body }}>
                          {booking.hours} hours × {booking.maids}{" "}
                          {booking.maids === 1 ? "professional" : "professionals"}
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: 16,
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: T.ink,
                            marginBottom: 4,
                          }}
                        >
                          Location
                        </div>
                        <div style={{ fontSize: 13, color: T.body }}>
                          <div>{booking.address}</div>
                          {booking.unit && <div>{booking.unit}</div>}
                          <div>
                            {booking.city}, {booking.state} {booking.zip}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add-ons */}
                    {booking.addons.length > 0 && (
                      <div
                        style={{
                          paddingBottom: 16,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: T.ink,
                            marginBottom: 8,
                          }}
                        >
                          Add-on Services
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {booking.addons.map((id) => (
                            <div
                              key={id}
                              style={{
                                fontSize: 13,
                                color: T.body,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{ADDON_NAMES[id]}</span>
                              <span>+${ADDON_PRICES[id]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subscription Plan */}
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: T.ink,
                          marginBottom: 4,
                        }}
                      >
                        Plan
                      </div>
                      <div style={{ fontSize: 13, color: T.body }}>
                        {subscriptionLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: 32,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 24px",
                    }}
                  >
                    Payment Details
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.ink,
                          marginBottom: 8,
                        }}
                      >
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          fontSize: 14,
                          border: `1px solid ${T.border}`,
                          borderRadius: 8,
                          background: T.soft,
                          fontFamily: "var(--font-sans)",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.outline = "none";
                          (e.target as HTMLInputElement).style.borderColor = T.primary;
                          (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${T.primary}20`;
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = T.border;
                          (e.target as HTMLInputElement).style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.ink,
                          marginBottom: 8,
                        }}
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          fontSize: 14,
                          border: `1px solid ${T.border}`,
                          borderRadius: 8,
                          background: T.soft,
                          fontFamily: "monospace",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.outline = "none";
                          (e.target as HTMLInputElement).style.borderColor = T.primary;
                          (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${T.primary}20`;
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = T.border;
                          (e.target as HTMLInputElement).style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 20 }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.ink,
                            marginBottom: 8,
                          }}
                        >
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={formData.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            fontSize: 14,
                            border: `1px solid ${T.border}`,
                            borderRadius: 8,
                            background: T.soft,
                            fontFamily: "monospace",
                            boxSizing: "border-box",
                          }}
                          onFocus={(e) => {
                            (e.target as HTMLInputElement).style.outline = "none";
                            (e.target as HTMLInputElement).style.borderColor = T.primary;
                            (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${T.primary}20`;
                          }}
                          onBlur={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = T.border;
                            (e.target as HTMLInputElement).style.boxShadow = "none";
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.ink,
                            marginBottom: 8,
                          }}
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          maxLength={3}
                          required
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            fontSize: 14,
                            border: `1px solid ${T.border}`,
                            borderRadius: 8,
                            background: T.soft,
                            fontFamily: "monospace",
                            boxSizing: "border-box",
                          }}
                          onFocus={(e) => {
                            (e.target as HTMLInputElement).style.outline = "none";
                            (e.target as HTMLInputElement).style.borderColor = T.primary;
                            (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${T.primary}20`;
                          }}
                          onBlur={(e) => {
                            (e.target as HTMLInputElement).style.borderColor = T.border;
                            (e.target as HTMLInputElement).style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.ink,
                          marginBottom: 8,
                        }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        required
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          fontSize: 14,
                          border: `1px solid ${T.border}`,
                          borderRadius: 8,
                          background: T.soft,
                          fontFamily: "var(--font-sans)",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.outline = "none";
                          (e.target as HTMLInputElement).style.borderColor = T.primary;
                          (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${T.primary}20`;
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = T.border;
                          (e.target as HTMLInputElement).style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: "100%",
                        background: isSubmitting ? T.muted : T.primary,
                        color: T.onPrimary,
                        border: "none",
                        borderRadius: 999,
                        padding: "16px 24px",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        transition: "all 0.15s ease",
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          (e.currentTarget as HTMLElement).style.background = T.primaryH;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          (e.currentTarget as HTMLElement).style.background = T.primary;
                        }
                      }}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : `Confirm & Pay $${booking.total.toFixed(2)}`}
                    </button>
                  </form>

                  {/* Trust Badges */}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      marginTop: 24,
                      paddingTop: 24,
                      borderTop: `1px solid ${T.border}`,
                      fontSize: 12,
                      color: T.body,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Lock size={16} color={T.primary} />
                      Secured by SSL
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <ShieldCheck size={16} color={T.primary} />
                      100% Guaranteed
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Order Summary Sidebar */}
              <div style={{ position: "sticky", top: 88, zIndex: 10 }}>
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 20px",
                    }}
                  >
                    Order Summary
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        color: T.body,
                      }}
                    >
                      <span>Service</span>
                      <span>{serviceLabel}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        color: T.body,
                      }}
                    >
                      <span>Duration</span>
                      <span>{booking.hours}h × {booking.maids}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        color: T.body,
                      }}
                    >
                      <span>Date</span>
                      <span>
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                    </div>

                    {booking.addons.length > 0 && (
                      <div
                        style={{
                          fontSize: 13,
                          color: T.body,
                          paddingTop: 12,
                          borderTop: `1px solid ${T.border}`,
                        }}
                      >
                        <div style={{ marginBottom: 8 }}>
                          <strong>Add-ons:</strong>
                        </div>
                        {booking.addons.map((id) => (
                          <div
                            key={id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 4,
                            }}
                          >
                            <span>{ADDON_NAMES[id]}</span>
                            <span>${ADDON_PRICES[id]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: T.border,
                      margin: "20px 0",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: T.ink,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: T.primary,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      ${booking.total.toFixed(2)}
                    </span>
                  </div>

                  <a
                    href="/booking"
                    style={{
                      display: "block",
                      marginTop: 20,
                      fontSize: 13,
                      color: T.primary,
                      textDecoration: "underline",
                      textAlign: "center",
                    }}
                  >
                    Edit booking
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Snowflake,
  Flame,
  Layers,
  AppWindow,
  Heart,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Check,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────────────
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
};

// ─── Service Definitions ──────────────────────────────────────────────────
interface ServiceDefinition {
  id: string;
  title: string;
  subtitle: string;
  hourlyRate: number;
  features: string[];
}

const SERVICES: ServiceDefinition[] = [
  {
    id: "regular-cleaning",
    title: "Regular Cleaning",
    subtitle: "Thorough apartment & home cleaning",
    hourlyRate: 30,
    features: [
      "Complete room-by-room cleaning",
      "Dusting, vacuuming, and mopping",
      "Bathroom & kitchen sanitization",
    ],
  },
  {
    id: "deep-cleaning",
    title: "Deep Cleaning",
    subtitle: "Intensive seasonal refresh",
    hourlyRate: 45,
    features: [
      "All features from Regular Cleaning",
      "Inside appliances (oven, fridge, microwave)",
      "Baseboards & door frames",
    ],
  },
  {
    id: "kitchen-cleaning",
    title: "Kitchen Deep Clean",
    subtitle: "Specialist kitchen sanitization",
    hourlyRate: 45,
    features: [
      "Inside & outside refrigerator cleaning",
      "Oven & stovetop deep clean",
      "Microwave interior & exterior",
    ],
  },
  {
    id: "commercial-cleaning",
    title: "Commercial Cleaning",
    subtitle: "Professional office spaces",
    hourlyRate: 50,
    features: [
      "Customizable cleaning schedules",
      "Daily, weekly, or monthly service",
      "Floor care & maintenance",
    ],
  },
  {
    id: "move-cleaning",
    title: "Move-In / Move-Out",
    subtitle: "Get your deposit back",
    hourlyRate: 45,
    features: [
      "All surfaces cleaned",
      "Inside all appliances",
      "Wall spot cleaning",
    ],
  },
  {
    id: "post-construction",
    title: "Post-Construction Cleaning",
    subtitle: "Specialized debris cleanup",
    hourlyRate: 50,
    features: [
      "Debris removal & disposal",
      "Dust & drywall residue cleanup",
      "Window & glass cleaning",
    ],
  },
];

const HOUR_OPTIONS = [2, 3, 4, 5, 6, 8];
const MAID_OPTIONS = [1, 2, 3, 4];

interface AddonOption {
  id: string;
  name: string;
  price: number;
  desc: string;
  icon: React.ReactNode;
}

const ADDON_OPTIONS: AddonOption[] = [
  {
    id: "deep_clean",
    name: "Deep cleaning upgrade",
    price: 50,
    desc: "Additional deep sanitation for detailed areas",
    icon: <Sparkles size={18} />,
  },
  {
    id: "fridge",
    name: "Inside fridge",
    price: 25,
    desc: "Full interior wipe down of shelves & drawers",
    icon: <Snowflake size={18} />,
  },
  {
    id: "oven",
    name: "Inside oven",
    price: 25,
    desc: "Scrubbing oven interior walls, racks & door",
    icon: <Flame size={18} />,
  },
  {
    id: "cabinets",
    name: "Inside cabinets",
    price: 35,
    desc: "Dusting and cleaning empty cabinet shelves",
    icon: <Layers size={18} />,
  },
  {
    id: "windows",
    name: "Windows (inside)",
    price: 40,
    desc: "Interior glass squeegee and sill detailing",
    icon: <AppWindow size={18} />,
  },
  {
    id: "pets",
    name: "Pet friendly care",
    price: 20,
    desc: "Eco-friendly hair extraction & safe cleaning",
    icon: <Heart size={18} />,
  },
];

interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: string;
  discountPercent: number;
  isFeatured: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "one-time",
    name: "One-time",
    frequency: "Single booking",
    discountPercent: 0,
    isFeatured: false,
  },
  {
    id: "monthly",
    name: "Monthly",
    frequency: "Every month",
    discountPercent: 5,
    isFeatured: false,
  },
  {
    id: "biweekly",
    name: "Biweekly",
    frequency: "Every 2 weeks",
    discountPercent: 10,
    isFeatured: false,
  },
  {
    id: "weekly",
    name: "Weekly",
    frequency: "Every week",
    discountPercent: 15,
    isFeatured: true,
  },
];

interface BookingState {
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
}

const INITIAL_STATE: BookingState = {
  serviceId: SERVICES[0].id,
  hours: 3,
  maids: 2,
  addons: [],
  address: "",
  unit: "",
  city: "",
  state: "NY",
  zip: "",
  subscriptionPlan: "one-time",
  date: "",
  timeSlot: "morning",
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BookingState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-select service from URL param
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam && SERVICES.find((s) => s.id === serviceParam)) {
      setState((prev) => ({ ...prev, serviceId: serviceParam }));
    }
    setIsLoading(false);
  }, [searchParams]);

  const currentService = useMemo(
    () => SERVICES.find((s) => s.id === state.serviceId) || SERVICES[0],
    [state.serviceId]
  );

  const pricing = useMemo(() => {
    const baseLabor = state.hours * state.maids * currentService.hourlyRate;
    const addonsTotal = state.addons.reduce((sum, id) => {
      const addon = ADDON_OPTIONS.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);
    const subtotal = baseLabor + addonsTotal;

    const subscription = SUBSCRIPTION_PLANS.find(
      (p) => p.id === state.subscriptionPlan
    ) || SUBSCRIPTION_PLANS[0];
    const discountAmount = subtotal * (subscription.discountPercent / 100);
    const total = subtotal - discountAmount;

    return {
      baseLabor,
      addonsTotal,
      subtotal,
      subscription,
      discountAmount,
      total,
    };
  }, [state.hours, state.maids, state.addons, state.subscriptionPlan, currentService]);

  const handleContinue = () => {
    if (step === 7) {
      if (sessionStorage) {
        sessionStorage.setItem(
          "apartmentmaid_booking",
          JSON.stringify({ ...state, total: pricing.total })
        );
      }
      router.push("/booking/checkout");
    } else {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleAddon = (id: string) => {
    setState((prev) => ({
      ...prev,
      addons: prev.addons.includes(id)
        ? prev.addons.filter((a) => a !== id)
        : [...prev.addons, id],
    }));
  };

  if (isLoading) return null;

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

      {/* Main Content */}
      <div style={{ padding: "56px 32px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Step Indicator */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 56,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  background: s < step ? T.primary : s === step ? T.primary : T.soft,
                  color: s < step || s === step ? T.onPrimary : T.body,
                }}
              >
                {s < step ? <Check size={18} strokeWidth={3} /> : s}
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start"
            style={{ gridAutoFlow: "row" }}
          >
            {/* Left: Step Content */}
            <div>
              {/* Step 1: Service Selection */}
              {step === 1 && (
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
                      fontSize: 24,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 32px",
                    }}
                  >
                    1. Select your service
                  </h2>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {SERVICES.map((svc) => {
                      const isActive = state.serviceId === svc.id;
                      return (
                        <div
                          key={svc.id}
                          onClick={() => setState({ ...state, serviceId: svc.id })}
                          style={{
                            border: `2px solid ${isActive ? T.primary : T.border}`,
                            borderRadius: 16,
                            padding: 20,
                            cursor: "pointer",
                            background: isActive ? `${T.primary}08` : T.soft,
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            if (!isActive) el.style.borderColor = T.accentW;
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            if (!isActive) el.style.borderColor = T.border;
                          }}
                        >
                          <h3
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: T.ink,
                              margin: "0 0 4px",
                            }}
                          >
                            {svc.title}
                          </h3>
                          <p
                            style={{
                              fontSize: 13,
                              color: T.body,
                              margin: "0 0 12px",
                            }}
                          >
                            {svc.subtitle}
                          </p>
                          <div style={{ marginBottom: 12 }}>
                            {svc.features.slice(0, 2).map((f, i) => (
                              <div
                                key={i}
                                style={{
                                  fontSize: 12,
                                  color: T.body,
                                  marginBottom: 4,
                                }}
                              >
                                • {f}
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: T.primary,
                            }}
                          >
                            ${svc.hourlyRate}
                            <span style={{ fontSize: 12, color: T.body, fontWeight: 500 }}>
                              /hr
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Hours */}
              {step === 2 && (
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
                      fontSize: 24,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 28px",
                    }}
                  >
                    2. Select hours
                  </h2>

                  <div style={{ marginBottom: 28 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        marginBottom: 16,
                      }}
                    >
                      How long do you need cleaning?
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {HOUR_OPTIONS.map((num) => {
                        const isActive = state.hours === num;
                        return (
                          <button
                            key={num}
                            onClick={() => setState({ ...state, hours: num })}
                            style={{
                              padding: "10px 22px",
                              borderRadius: 999,
                              fontSize: 14,
                              fontWeight: 600,
                              border: `1px solid ${isActive ? T.primary : T.border}`,
                              background: isActive ? T.primary : T.soft,
                              color: isActive ? T.onPrimary : T.ink,
                              cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {num} {num === 1 ? "hour" : "hours"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Number of Maids */}
              {step === 3 && (
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
                      fontSize: 24,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 28px",
                    }}
                  >
                    3. Select number of maids
                  </h2>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        marginBottom: 16,
                      }}
                    >
                      How many cleaning professionals?
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {MAID_OPTIONS.map((num) => {
                        const isActive = state.maids === num;
                        return (
                          <button
                            key={num}
                            onClick={() => setState({ ...state, maids: num })}
                            style={{
                              padding: "10px 22px",
                              borderRadius: 999,
                              fontSize: 14,
                              fontWeight: 600,
                              border: `1px solid ${isActive ? T.primary : T.border}`,
                              background: isActive ? T.primary : T.soft,
                              color: isActive ? T.onPrimary : T.ink,
                              cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {num} {num === 1 ? "maid" : "maids"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Add-ons */}
              {step === 4 && (
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
                      fontSize: 24,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 28px",
                    }}
                  >
                    4. Add extra services (optional)
                  </h2>

                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                  >
                    {ADDON_OPTIONS.map((opt) => {
                      const isSelected = state.addons.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleAddon(opt.id)}
                          style={{
                            border: `1.5px solid ${isSelected ? T.primary : T.border}`,
                            borderRadius: 16,
                            padding: 18,
                            cursor: "pointer",
                            background: isSelected ? `${T.accentS}1A` : T.soft,
                            transition: "all 0.15s ease",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 14,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              color: isSelected ? T.primary : T.body,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {opt.icon}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                marginBottom: 3,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: T.ink,
                                }}
                              >
                                {opt.name}
                              </span>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: T.primary,
                                }}
                              >
                                +${opt.price}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: 11,
                                color: T.body,
                                margin: 0,
                                lineHeight: "16px",
                              }}
                            >
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Address */}
              {step === 5 && (
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
                      fontSize: 24,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 28px",
                    }}
                  >
                    5. Where are we cleaning?
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                        Street address
                      </label>
                      <input
                        type="text"
                        placeholder="123 Main Street"
                        value={state.address}
                        onChange={(e) =>
                          setState({ ...state, address: e.target.value })
                        }
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
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
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
                          Apt/Unit (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Apt 4B"
                          value={state.unit}
                          onChange={(e) =>
                            setState({ ...state, unit: e.target.value })
                          }
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
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
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
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="New York"
                          value={state.city}
                          onChange={(e) =>
                            setState({ ...state, city: e.target.value })
                          }
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
                          ZIP
                        </label>
                        <input
                          type="text"
                          placeholder="10001"
                          value={state.zip}
                          onChange={(e) =>
                            setState({ ...state, zip: e.target.value })
                          }
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Subscription Upsell */}
              {step === 6 && (
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
                      fontSize: 24,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 28px",
                    }}
                  >
                    6. Choose your plan
                  </h2>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {SUBSCRIPTION_PLANS.map((plan) => {
                      const isActive = state.subscriptionPlan === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() =>
                            setState({ ...state, subscriptionPlan: plan.id })
                          }
                          style={{
                            border: `2px solid ${isActive ? T.primary : T.border}`,
                            borderRadius: 16,
                            padding: 24,
                            cursor: "pointer",
                            background: isActive
                              ? plan.isFeatured
                                ? `${T.primary}08`
                                : `${T.primary}08`
                              : T.soft,
                            position: "relative",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            if (!isActive) el.style.borderColor = T.accentW;
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            if (!isActive) el.style.borderColor = T.border;
                          }}
                        >
                          {plan.isFeatured && (
                            <div
                              style={{
                                position: "absolute",
                                top: -12,
                                right: 16,
                                background: T.accentW,
                                color: T.ink,
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "4px 12px",
                                borderRadius: 12,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                              }}
                            >
                              Best value
                            </div>
                          )}

                          <h3
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: T.ink,
                              margin: "0 0 8px",
                            }}
                          >
                            {plan.name}
                          </h3>
                          <p
                            style={{
                              fontSize: 13,
                              color: T.body,
                              margin: "0 0 12px",
                            }}
                          >
                            {plan.frequency}
                          </p>

                          {plan.discountPercent > 0 && (
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: T.primary,
                              }}
                            >
                              Save {plan.discountPercent}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setState({ ...state, subscriptionPlan: "one-time" });
                    }}
                    style={{
                      marginTop: 24,
                      fontSize: 14,
                      color: T.primary,
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Skip subscription offer
                  </button>
                </div>
              )}

              {/* Step 7: Date & Time */}
              {step === 7 && (
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
                      fontSize: 24,
                      fontWeight: 700,
                      color: T.ink,
                      margin: "0 0 28px",
                    }}
                  >
                    7. When do you need us?
                  </h2>

                  <div style={{ marginBottom: 28 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        marginBottom: 12,
                      }}
                    >
                      Preferred date
                    </label>
                    <input
                      type="date"
                      value={state.date}
                      onChange={(e) => setState({ ...state, date: e.target.value })}
                      style={{
                        padding: "12px 16px",
                        fontSize: 14,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        background: T.soft,
                        fontFamily: "var(--font-sans)",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        marginBottom: 12,
                      }}
                    >
                      Time preference
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["morning", "afternoon", "evening"].map((slot) => {
                        const isActive = state.timeSlot === slot;
                        const labels: Record<string, string> = {
                          morning: "Morning (8am - 12pm)",
                          afternoon: "Afternoon (12pm - 5pm)",
                          evening: "Evening (5pm - 8pm)",
                        };
                        return (
                          <button
                            key={slot}
                            onClick={() =>
                              setState({ ...state, timeSlot: slot })
                            }
                            style={{
                              padding: "10px 20px",
                              borderRadius: 999,
                              fontSize: 14,
                              fontWeight: 600,
                              border: `1px solid ${isActive ? T.primary : T.border}`,
                              background: isActive ? T.primary : T.soft,
                              color: isActive ? T.onPrimary : T.ink,
                              cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {labels[slot]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 32,
                }}
              >
                <button
                  onClick={handleBack}
                  style={{
                    display: step === 1 ? "none" : "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: T.primary,
                    textDecoration: "none",
                  }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  onClick={handleContinue}
                  style={{
                    marginLeft: "auto",
                    background: T.primary,
                    color: T.onPrimary,
                    border: "none",
                    borderRadius: 999,
                    padding: "14px 28px",
                    fontSize: 15,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = T.primaryH;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = T.primary;
                  }}
                >
                  {step === 7 ? "Go to Checkout" : "Continue"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: Sticky Summary */}
            <div style={{ position: "sticky", top: 88, zIndex: 10 }}>
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.ink,
                    margin: "0 0 24px",
                  }}
                >
                  Order summary
                </h3>

                {/* Service & Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: T.ink }}>
                        {currentService.title}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: T.body,
                          display: "block",
                          marginTop: 2,
                        }}
                      >
                        {state.hours} hours × {state.maids}{" "}
                        {state.maids === 1 ? "professional" : "professionals"} at $
                        {currentService.hourlyRate}/hr
                      </span>
                    </div>
                    <span
                      style={{ fontWeight: 600, color: T.ink, textAlign: "right" }}
                    >
                      ${pricing.baseLabor.toFixed(2)}
                    </span>
                  </div>

                  {/* Add-ons */}
                  {state.addons.length > 0 && (
                    <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.body,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          marginBottom: 10,
                        }}
                      >
                        Add-on services
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {state.addons.map((id) => {
                          const addon = ADDON_OPTIONS.find((a) => a.id === id);
                          if (!addon) return null;
                          return (
                            <div
                              key={id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 13,
                              }}
                            >
                              <span style={{ color: T.ink }}>{addon.name}</span>
                              <span
                                style={{
                                  fontWeight: 500,
                                  color: T.ink,
                                }}
                              >
                                +${addon.price.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Subscription */}
                  {state.subscriptionPlan !== "one-time" && (
                    <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: T.ink }}>
                          {pricing.subscription.name} discount
                        </span>
                        <span
                          style={{
                            fontWeight: 500,
                            color: T.primary,
                          }}
                        >
                          -${pricing.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div
                  style={{ height: 1, background: T.border, margin: "24px 0" }}
                />

                {/* Total */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: T.body,
                    }}
                  >
                    <span>Subtotal</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: T.ink,
                        }}
                      >
                        Total
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: T.primary,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      ${pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginTop: 24,
                    padding: "14px 16px",
                    background: T.soft,
                    borderRadius: 12,
                  }}
                >
                  <ShieldCheck
                    size={18}
                    style={{
                      color: T.primary,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: T.body,
                      lineHeight: "16px",
                    }}
                  >
                    <strong>100% satisfaction guarantee.</strong> Not happy? We&apos;ll
                    send another professional back at no cost.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingContent />
    </Suspense>
  );
}

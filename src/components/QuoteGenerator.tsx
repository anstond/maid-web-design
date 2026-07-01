"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  Snowflake,
  Flame,
  Layers,
  AppWindow,
  Heart,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { openIntercomComposer, setIntercomContext, trackIntercomEvent } from "@/lib/intercom-conversion";

// ─── Design Tokens (DESIGN.md) ────────────────────────────────────────────────
const T = {
  primary:   "#155E63",     // Deep Teal (primary conversion)
  primaryH:  "#124A54",    // Dark Teal (hover/pressed)
  accentW:   "#D9C7A3",    // Warm Sand (highlight badges)
  accentS:   "#EFE6D3",    // Soft Sand
  ink:       "#1F2937",        // Slate Charcoal (text primary)
  body:      "#6B7280",       // Cool Gray (text secondary)
  muted:     "#B8C0C2",      // Muted Gray
  canvas:    "#FCFBF8",     // Warm White
  surface:   "#FFFFFF",    // Pure White
  soft:      "#F7F5F1",       // Soft Cream (canvas-soft)
  border:    "#E5DFD3",     // Warm Border (hairline)
  onPrimary: "#FFFFFF",  // Pure White
};

// ─── Options Constants ────────────────────────────────────────────────────────
interface ServiceOption {
  id: string;
  name: string;
  rate: number; // Hourly rate per maid
  desc: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: "regular", name: "Regular cleaning", rate: 30, desc: "Standard dusting, vacuuming & surface wipes" },
  { id: "deep", name: "Deep cleaning", rate: 45, desc: "Intense clean for baseboards, vents & grime" },
  { id: "commercial", name: "Commercial cleaning", rate: 50, desc: "Professional office & workspace cleanings" },
];

interface LocationOption {
  id: string;
  name: string;
  surcharge: number; // Flat surcharge
}

const LOCATION_OPTIONS: LocationOption[] = [
  { id: "nyc", name: "New York City", surcharge: 10 },
  { id: "miami", name: "Miami", surcharge: 0 },
  { id: "la", name: "Los Angeles", surcharge: 5 },
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

export default function QuoteGenerator() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [service, setService] = useState<string>("regular");
  const [location, setLocation] = useState<string>("nyc");
  const [hours, setHours] = useState<number>(3);
  const [maids, setMaids] = useState<number>(2);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["deep_clean"]);
  const quoteStartedTracked = useRef(false);

  // ─── Add-on options definition ──────────────────────────────────────────────
  const addonOptions = useMemo<AddonOption[]>(() => [
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
  ], []);

  // ─── Pricing Logic ──────────────────────────────────────────────────────────
  const pricing = useMemo(() => {
    const selectedService = SERVICE_OPTIONS.find((s) => s.id === service) || SERVICE_OPTIONS[0];
    const hourlyRate = selectedService.rate;

    const baseLabor = hours * maids * hourlyRate;

    const selectedLoc = LOCATION_OPTIONS.find((l) => l.id === location) || LOCATION_OPTIONS[0];
    const locationSurcharge = selectedLoc.surcharge;

    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = addonOptions.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const subtotal = baseLabor + locationSurcharge + addonsTotal;
    const total = subtotal; // No direct subscription discount here unless we add it, keeps it simple and clean.

    return {
      hourlyRate,
      baseLabor,
      locationSurcharge,
      addonsTotal,
      subtotal,
      total,
      serviceName: selectedService.name,
      locationName: selectedLoc.name,
    };
  }, [service, location, hours, maids, selectedAddons, addonOptions]);

  const toggleAddon = (id: string) => {
    markQuoteStarted();
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  function getQuotePriceBand(total: number) {
    if (total < 150) return "under_150";
    if (total < 300) return "150_299";
    return "300_plus";
  }

  function markQuoteStarted() {
    setIntercomContext({
      funnelStage: "quote",
      selectedService: service,
      quotePriceBand: getQuotePriceBand(pricing.total),
      city: pricing.locationName,
      currentRoute: "/",
    });

    if (!quoteStartedTracked.current) {
      quoteStartedTracked.current = true;
      trackIntercomEvent("quote_started", {
        source: "quote_generator",
        service,
        city: pricing.locationName,
      });
    }
  }

  function completeQuote() {
    setIntercomContext({
      funnelStage: "quote",
      selectedService: service,
      quotePriceBand: getQuotePriceBand(pricing.total),
      city: pricing.locationName,
      currentRoute: "/",
    });
    trackIntercomEvent("quote_completed", {
      service,
      city: pricing.locationName,
      total: pricing.total,
    });
    window.location.href = `/booking?service=${service}`;
  }

  function askAboutQuote() {
    setIntercomContext({
      funnelStage: "quote",
      selectedService: service,
      quotePriceBand: getQuotePriceBand(pricing.total),
      city: pricing.locationName,
      currentRoute: "/",
    });
    trackIntercomEvent("chat_prompt_clicked", {
      prompt_id: "quote_manual",
      service,
    });
    openIntercomComposer("Hi, can you help me understand this cleaning quote before I book?");
  }

  useEffect(() => {
    if (!quoteStartedTracked.current) return;
    setIntercomContext({
      funnelStage: "quote",
      selectedService: service,
      quotePriceBand: getQuotePriceBand(pricing.total),
      city: pricing.locationName,
      currentRoute: "/",
    });
  }, [service, pricing.total, pricing.locationName]);

  return (
    <div id="quote-generator" style={{ background: T.canvas, padding: "88px 32px", borderTop: `1px solid ${T.border}`, fontFamily: "var(--font-sans)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            color: T.primary,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}>
            Calculate cost
          </p>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            fontWeight: 700,
            lineHeight: "1.1",
            letterSpacing: "-0.03em",
            color: T.ink,
            margin: "0 0 16px",
          }}>
            Live quote generator
          </h2>
          <p style={{ fontSize: 16, color: T.body, maxWidth: 600, margin: 0, lineHeight: "26px" }}>
            Configure your cleaning needs below to view your custom pricing in real-time. No commitments, transparent billing.
          </p>
        </div>

        {/* Form & Receipt Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          
          {/* Left: Input Stack (Flat card-content borders, zero shadows) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* Card 1: Service & Location Selection */}
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.ink, margin: "0 0 24px" }}>
                1. Select service & location
              </h3>

              {/* Service Selection */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 12 }}>
                  Type of service
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  {SERVICE_OPTIONS.map((opt) => {
                    const isActive = service === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          markQuoteStarted();
                          setService(opt.id);
                        }}
                        style={{
                          padding: "10px 22px",
                          borderRadius: 999, // Canonical rounded.pill
                          fontSize: 14,
                          fontWeight: 600,
                          border: "1px solid",
                          borderColor: isActive ? T.primary : T.border,
                          background: isActive ? T.primary : T.soft,
                          color: isActive ? T.onPrimary : T.ink,
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {opt.name} (${opt.rate}/hr)
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: 12, color: T.body, margin: "6px 0 0" }}>
                  {SERVICE_OPTIONS.find((s) => s.id === service)?.desc}
                </p>
              </div>

              {/* Location Selection */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 12 }}>
                  Service location
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {LOCATION_OPTIONS.map((opt) => {
                    const isActive = location === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          markQuoteStarted();
                          setLocation(opt.id);
                        }}
                        style={{
                          padding: "10px 22px",
                          borderRadius: 999, // Canonical rounded.pill
                          fontSize: 14,
                          fontWeight: 600,
                          border: "1px solid",
                          borderColor: isActive ? T.primary : T.border,
                          background: isActive ? T.primary : T.soft,
                          color: isActive ? T.onPrimary : T.ink,
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {opt.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 2: Hours & Maids Selection */}
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.ink, margin: "0 0 24px" }}>
                2. Select time & labor
              </h3>

              {/* Hours Selection */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 12 }}>
                  Estimated cleaning hours
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {HOUR_OPTIONS.map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        markQuoteStarted();
                        setHours(num);
                      }}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 999, // Canonical rounded.pill
                        fontSize: 14,
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: hours === num ? T.primary : T.border,
                        background: hours === num ? T.primary : T.soft,
                        color: hours === num ? T.onPrimary : T.ink,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {num} {num === 1 ? "hour" : "hours"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maids Selection */}
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 12 }}>
                  Number of cleaning professionals
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {MAID_OPTIONS.map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        markQuoteStarted();
                        setMaids(num);
                      }}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 999, // Canonical rounded.pill
                        fontSize: 14,
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: maids === num ? T.primary : T.border,
                        background: maids === num ? T.primary : T.soft,
                        color: maids === num ? T.onPrimary : T.ink,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {num} {num === 1 ? "maid" : "maids"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Add-on Services Checklist (Level 0 flat cards) */}
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.ink, margin: "0 0 24px" }}>
                3. Extra shine (add-ons)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addonOptions.map((opt) => {
                  const isSelected = selectedAddons.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleAddon(opt.id)}
                      style={{
                        border: `1.5px solid ${isSelected ? T.primary : T.border}`,
                        borderRadius: 16, // rounded.xl
                        padding: 18,
                        cursor: "pointer",
                        background: isSelected ? `${T.accentS}1A` : T.soft,
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                      }}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        color: isSelected ? T.primary : T.body,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {opt.icon}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{opt.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: T.primary }}>+${opt.price}</span>
                        </div>
                        <p style={{ fontSize: 11, color: T.body, margin: 0, lineHeight: "16px" }}>{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Sticky Quote Summary Card (Level 0 flat sidebar, zero shadows/gradients) */}
          <div style={{ position: "sticky", top: 88, zIndex: 10 }}>
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16, // rounded.xl
              padding: 32,
            }}>
              
              <h3 style={{ fontSize: 20, fontWeight: 700, color: T.ink, margin: "0 0 24px" }}>
                Quote summary
              </h3>

              {/* Line Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                
                {/* Labour base cost */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: T.ink }}>{pricing.serviceName}</span>
                    <span style={{ fontSize: 12, color: T.body, display: "block", marginTop: 2 }}>
                      {hours} hours × {maids} {maids === 1 ? "professional" : "professionals"} at ${pricing.hourlyRate}/hr
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, color: T.ink }}>
                    ${pricing.baseLabor.toFixed(2)}
                  </span>
                </div>

                {/* Location surcharge */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: T.ink }}>Service region</span>
                    <span style={{ fontSize: 12, color: T.body, display: "block", marginTop: 2 }}>
                      {pricing.locationName} surcharge
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, color: T.ink }}>
                    ${pricing.locationSurcharge.toFixed(2)}
                  </span>
                </div>

                {/* Selected Add-ons */}
                {selectedAddons.length > 0 && (
                  <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.body, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
                      Add-on services
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {selectedAddons.map((id) => {
                        const addon = addonOptions.find((a) => a.id === id);
                        if (!addon) return null;
                        return (
                          <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                            <span style={{ color: T.ink }}>{addon.name}</span>
                            <span style={{ fontWeight: 500, color: T.ink }}>+${addon.price.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Simple Solid Divider */}
              <div style={{ height: 1, background: T.border, margin: "24px 0" }} />

              {/* Total Calculation */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: T.body }}>
                  <span>Subtotal</span>
                  <span>${pricing.subtotal.toFixed(2)}</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: T.ink }}>Estimated total</span>
                    <span style={{ display: "block", fontSize: 11, color: T.body, marginTop: 2 }}>
                      Total booking cost
                    </span>
                  </div>
                  <span style={{ fontSize: 32, fontWeight: 700, color: T.primary, letterSpacing: "-0.03em" }}>
                    ${pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CTA Booking Button (Pill shaped, flat, zero shadow) */}
              <button
                type="button"
                onClick={completeQuote}
                style={{
                  width: "100%",
                  background: T.primary,
                  color: T.onPrimary,
                  border: "none",
                  borderRadius: 999, // Canonical rounded.pill
                  padding: "16px 24px",
                  fontSize: 15,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="hover:bg-[#124A54]"
              >
                Proceed to booking
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={askAboutQuote}
                style={{
                  width: "100%",
                  marginTop: 10,
                  background: T.soft,
                  color: T.primary,
                  border: `1px solid ${T.border}`,
                  borderRadius: 999,
                  padding: "13px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Questions about this quote?
              </button>

              {/* Guarantee info */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 24, padding: "14px 16px", background: T.soft, borderRadius: 12 }}>
                <ShieldCheck size={18} style={{ color: T.primary, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: T.body, lineHeight: "16px" }}>
                  <strong>100% satisfaction guarantee.</strong> Not happy with your clean? We&apos;ll send another professional back at no cost.
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

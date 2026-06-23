"use client";

import React, { useState, useMemo } from "react";
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

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6];
const BATHROOM_OPTIONS = [1, 1.5, 2, 2.5, 3, 4];

interface FrequencyOption {
  id: string;
  name: string;
  discount: number;
  desc: string;
  badge: string;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { id: "one-time", name: "One-time", discount: 0, desc: "Perfect for deep cleans", badge: "" },
  { id: "weekly", name: "Weekly", discount: 0.20, desc: "Most popular", badge: "Save 20%" },
  { id: "biweekly", name: "Biweekly", discount: 0.15, desc: "Great balance", badge: "Save 15%" },
  { id: "monthly", name: "Monthly", discount: 0.10, desc: "Steady clean", badge: "Save 10%" },
];

interface AddonOption {
  id: string;
  name: string;
  price: number;
  desc: string;
  icon: React.ReactNode;
}

export default function QuoteGenerator() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1.5);
  const [sqft, setSqft] = useState<number>(1200);
  const [frequency, setFrequency] = useState<string>("weekly");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["deep_clean"]);

  const addonOptions = useMemo<AddonOption[]>(() => [
    {
      id: "deep_clean",
      name: "Deep cleaning",
      price: 50,
      desc: "Detailed scrubbing of baseboards, vents & doors",
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
    const basePrice = 80;
    const bedroomSurcharge = (bedrooms - 1) * 25;
    const bathroomSurcharge = (bathrooms - 1) * 30;
    const sqftSurcharge = Math.max(0, sqft - 1000) * 0.05;

    const houseSubtotal = basePrice + bedroomSurcharge + bathroomSurcharge + sqftSurcharge;

    const selectedFreq = FREQUENCY_OPTIONS.find((f) => f.id === frequency);
    const discountRate = selectedFreq ? selectedFreq.discount : 0;
    const discountAmount = houseSubtotal * discountRate;

    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = addonOptions.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const subtotal = houseSubtotal + addonsTotal;
    const total = (houseSubtotal - discountAmount) + addonsTotal;

    return {
      basePrice,
      bedroomSurcharge,
      bathroomSurcharge,
      sqftSurcharge,
      houseSubtotal,
      discountRate,
      discountAmount,
      addonsTotal,
      subtotal,
      total,
    };
  }, [bedrooms, bathrooms, sqft, frequency, selectedAddons, addonOptions]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div id="quote-generator" style={{ background: T.canvas, padding: "88px 32px", borderTop: `1px solid ${T.border}`, fontFamily: "var(--font-sans)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
        {/* Section Header (Sentence-case, No decorative icons/accent overlays) */}
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
            Select your preferences below to instantly calculate your custom quote. No commitments, no hidden fees.
          </p>
        </div>

        {/* Form & Receipt Grid (Level 0 flat cards, strictly styled by DESIGN.md) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          
          {/* Left: Input Stack (Flat card-content borders, zero shadows) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* Card 1: Space Details */}
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.ink, margin: "0 0 24px" }}>
                1. Tell us about your space
              </h3>

              {/* Bedrooms selector (Pill style buttons) */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 12 }}>
                  Number of bedrooms
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {BEDROOM_OPTIONS.map((num) => (
                    <button
                      key={num}
                      onClick={() => setBedrooms(num)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 999, // Canonical rounded.pill
                        fontSize: 14,
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: bedrooms === num ? T.primary : T.border,
                        background: bedrooms === num ? T.primary : T.soft,
                        color: bedrooms === num ? T.onPrimary : T.ink,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {num === 6 ? "6+ beds" : `${num} ${num === 1 ? "bed" : "beds"}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms selector (Pill style buttons) */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 12 }}>
                  Number of bathrooms
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {BATHROOM_OPTIONS.map((num) => (
                    <button
                      key={num}
                      onClick={() => setBathrooms(num)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 999, // Canonical rounded.pill
                        fontSize: 14,
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: bathrooms === num ? T.primary : T.border,
                        background: bathrooms === num ? T.primary : T.soft,
                        color: bathrooms === num ? T.onPrimary : T.ink,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {num === 4 ? "4+ baths" : `${num} ${num === 1 ? "bath" : "baths"}`}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: T.border, marginBottom: 24 }} />

              {/* Square Footage Slider (Flat geometry) */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
                    Approximate home size
                  </label>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.primary }}>
                    {sqft.toLocaleString()} sq. ft.
                  </span>
                </div>
                
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="50"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 0, // Flat geometry for slider track
                    background: T.border,
                    outline: "none",
                    cursor: "pointer",
                    WebkitAppearance: "none",
                  }}
                  className="accent-[#155E63]"
                />
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.body, marginTop: 8 }}>
                  <span>500 sq ft</span>
                  <span>1,000 (Base)</span>
                  <span>3,000 sq ft</span>
                  <span>5,000 sq ft</span>
                </div>
              </div>
            </div>

            {/* Card 2: Frequency Selector (Category-button style pills, Level 0) */}
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 32,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.ink, margin: "0 0 8px" }}>
                2. Choose frequency
              </h3>
              <p style={{ fontSize: 13, color: T.body, margin: "0 0 24px" }}>
                Select a routine scheduling for continuous service discount.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {FREQUENCY_OPTIONS.map((opt) => {
                  const isActive = frequency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFrequency(opt.id)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 999, // Canonical rounded.pill
                        fontSize: 14,
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: isActive ? T.primary : T.border,
                        background: isActive ? T.primary : "transparent",
                        color: isActive ? T.onPrimary : T.ink,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>{opt.name}</span>
                      {opt.badge && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          background: isActive ? T.accentW : T.accentS,
                          color: T.ink,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}>
                          {opt.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
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
                
                {/* Base clean */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: T.ink }}>Base clean</span>
                    <span style={{ fontSize: 12, color: T.body, display: "block", marginTop: 2 }}>
                      1 bed, 1 bath (up to 1,000 sq ft)
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, color: T.ink }}>
                    ${pricing.basePrice.toFixed(2)}
                  </span>
                </div>

                {/* Additional Rooms */}
                {(pricing.bedroomSurcharge > 0 || pricing.bathroomSurcharge > 0) && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: T.ink }}>Room surcharges</span>
                      <span style={{ fontSize: 12, color: T.body, display: "block", marginTop: 2 }}>
                        {bedrooms > 1 ? `+${bedrooms - 1} bed(s) ` : ""}
                        {bathrooms > 1 ? `+${bathrooms - 1} bath(s) ` : ""}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, color: T.ink }}>
                      ${(pricing.bedroomSurcharge + pricing.bathroomSurcharge).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Square Footage Surcharge */}
                {pricing.sqftSurcharge > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: T.ink }}>Space adjustment</span>
                      <span style={{ fontSize: 12, color: T.body, display: "block", marginTop: 2 }}>
                        +{Math.round(sqft - 1000).toLocaleString()} extra sq. ft.
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, color: T.ink }}>
                      ${pricing.sqftSurcharge.toFixed(2)}
                    </span>
                  </div>
                )}

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

                {/* Frequency Discount */}
                {pricing.discountAmount > 0 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    background: T.soft,
                    padding: "10px 14px",
                    borderRadius: 999, // Pill style tag
                    color: T.primary,
                    fontWeight: 600,
                    marginTop: 4,
                  }}>
                    <span>
                      {FREQUENCY_OPTIONS.find((f) => f.id === frequency)?.name} discount ({(pricing.discountRate * 100)}%)
                    </span>
                    <span>
                      -${pricing.discountAmount.toFixed(2)}
                    </span>
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
                      {frequency === "one-time" ? "per visit" : `per ${frequency.replace("ly", "")} visit`}
                    </span>
                  </div>
                  <span style={{ fontSize: 32, fontWeight: 700, color: T.primary, letterSpacing: "-0.03em" }}>
                    ${pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CTA Booking Button (Pill shaped, flat, zero shadow) */}
              <button
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

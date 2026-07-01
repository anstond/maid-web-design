"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Lock, Pause, RotateCcw } from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  primary:   "#155E63",
  primaryH:  "#124A54",
  accentW:   "#D9C7A3",
  ink:       "#1F2937",
  body:      "#6B7280",
  muted:     "#B8C0C2",
  canvas:    "#FCFBF8",
  soft:      "#F7F5F1",
  border:    "#E5DFD3",
  onPrimary: "#FFFFFF",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Service = "standard" | "deep" | "move-out" | "recurring";
type Duration = "2h" | "3h" | "4h" | "6h" | "7h" | "8h";

// ─── Content ──────────────────────────────────────────────────────────────────
const SERVICES: { id: Service; label: string; desc: string; icon: string }[] = [
  { id: "standard",  label: "Standard",   desc: "Regular deep tidy",   icon: "✦" },
  { id: "deep",      label: "Deep Clean", desc: "Top-to-bottom scrub", icon: "◈" },
  { id: "move-out",  label: "Move-Out",   desc: "Get deposit back",    icon: "⊞" },
  { id: "recurring", label: "Recurring",  desc: "Save 20% per visit",  icon: "↻" },
];

const DURATIONS: { id: Duration; label: string; sub: string }[] = [
  { id: "2h", label: "2 hours",  sub: "Quick tidy"  },
  { id: "3h", label: "3 hours",  sub: "Standard"    },
  { id: "4h", label: "4 hours",  sub: "Deep clean"  },
  { id: "6h", label: "6 hours",  sub: "Thorough"    },
  { id: "7h", label: "7 hours",  sub: "Very deep"   },
  { id: "8h", label: "8 hours",  sub: "Full day"    },
];

// ─── Pricing matrix ───────────────────────────────────────────────────────────
const PRICES: Record<Service, Record<Duration, number>> = {
  standard:  { "2h": 39, "3h": 59, "4h": 79, "6h": 119, "7h": 139, "8h": 159 },
  deep:      { "2h": 59, "3h": 89, "4h": 119, "6h": 179, "7h": 209, "8h": 239 },
  "move-out":{ "2h": 79, "3h": 119, "4h": 159, "6h": 239, "7h": 279, "8h": 319 },
  recurring: { "2h": 31, "3h": 47, "4h": 63, "6h": 95, "7h": 111, "8h": 127 },
};

// ─── Counter animation hook ───────────────────────────────────────────────────
function useCountUp(target: number | null, duration = 650) {
  const [displayed, setDisplayed] = useState(0);
  const startRef  = useRef(0);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplayed(0);
      startRef.current = 0;
      return;
    }

    const from      = startRef.current;
    const startTime = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    function animate(now: number) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(from + (target! - from) * eased);
      setDisplayed(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        startRef.current = target!;
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return displayed;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface HeroInteractiveQuoteProps {
  initialZipCode?: string;
  onZipCodeChange?: (zip: string) => void;
  isMobileDrawer?: boolean;
}

export default function HeroInteractiveQuote({
  initialZipCode = "",
  onZipCodeChange,
  isMobileDrawer = false,
}: HeroInteractiveQuoteProps) {
  const [service, setService] = useState<Service>("standard");
  const [duration, setDuration] = useState<Duration | null>(null);
  const [zipCode, setZipCode] = useState(initialZipCode);

  useEffect(() => {
    setZipCode(initialZipCode);
  }, [initialZipCode]);

  const handleZipChange = (val: string) => {
    setZipCode(val);
    if (onZipCodeChange) {
      onZipCodeChange(val);
    }
  };

  const selectedPrice = zipCode && duration ? PRICES[service][duration] : null;
  const startingPrice = zipCode ? 31 : null; // Cheapest across all options (recurring 2h)
  const targetPrice   = selectedPrice ?? startingPrice;
  const displayPrice  = useCountUp(targetPrice);
  const priceReady    = targetPrice !== null && displayPrice === targetPrice;
  const isStarting    = !selectedPrice && zipCode;

  // Inline keyframes injected once
  const styles = `
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes pulseRing {
      0%   { box-shadow: 0 0 0 0 rgba(21,94,99,0.35); }
      70%  { box-shadow: 0 0 0 10px rgba(21,94,99,0);  }
      100% { box-shadow: 0 0 0 0 rgba(21,94,99,0);     }
    }
    .iq-cta { animation: slideUp 0.35s ease-out both; }
    .iq-price-ring { animation: pulseRing 0.8s ease-out 0.3s; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={{
        background:           isMobileDrawer ? "transparent" : "rgba(252,251,248,0.97)",
        backdropFilter:       isMobileDrawer ? "none" : "blur(24px)",
        WebkitBackdropFilter: isMobileDrawer ? "none" : "blur(24px)",
        borderRadius:         isMobileDrawer ? 0 : 20,
        boxShadow:            isMobileDrawer ? "none" : "rgba(0,0,0,0.22) 0px 12px 56px 0px, rgba(0,0,0,0.06) 0px 2px 8px 0px",
        overflow:             "hidden",
        fontFamily:           "var(--font-sans)",
        width:                "100%",
        border:               isMobileDrawer ? "none" : "1px solid rgba(255,255,255,0.55)",
      }}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div style={{ padding: isMobileDrawer ? "0px 0px 15px" : "20px 20px 15px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em", marginBottom: 3 }}>
            Your instant quote
          </div>
          <div style={{ fontSize: 12, color: T.body, lineHeight: "17px" }}>
            Pick your location and cleaning duration.
          </div>
        </div>

        <div style={{ padding: isMobileDrawer ? "18px 0px 0px" : "18px 18px" }}>

          {/* ── Step 1: ZIP Code ────────────────────────────────────────── */}
          <div style={{ marginBottom: 18 }}>
            <div style={{
              display:       "flex",
              alignItems:    "center",
              gap:           7,
              fontSize:      11,
              fontWeight:    600,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              color:         T.body,
              marginBottom:  10,
            }}>
              <span style={{
                width:           18,
                height:          18,
                borderRadius:    "50%",
                background:      zipCode ? T.primary : T.soft,
                color:           zipCode ? "#fff" : T.body,
                display:         "inline-flex",
                alignItems:      "center",
                justifyContent:  "center",
                fontSize:        10,
                fontWeight:      700,
                flexShrink:      0,
                transition:      "background 0.25s ease, color 0.25s ease",
              }}>
                {zipCode ? "✓" : "1"}
              </span>
              Your location
            </div>

            <input
              type="text"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => handleZipChange(e.target.value)}
              style={{
                width:          "100%",
                padding:        "12px 14px",
                border:         `1.5px solid ${zipCode ? T.primary : T.border}`,
                borderRadius:   10,
                fontSize:       14,
                fontWeight:     500,
                color:          T.ink,
                background:     zipCode ? "rgba(21,94,99,0.08)" : T.soft,
                outline:        "none",
                transition:     "all 0.15s ease",
                fontFamily:     "inherit",
              }}
            />
          </div>

          {/* ── Step 2: Duration ────────────────────────────────────────── */}
          <div style={{ marginBottom: 18 }}>
            <div style={{
              display:       "flex",
              alignItems:    "center",
              gap:           7,
              fontSize:      11,
              fontWeight:    600,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              color:         T.body,
              marginBottom:  10,
            }}>
              <span style={{
                width:          18,
                height:         18,
                borderRadius:   "50%",
                background:     duration ? T.primary : T.soft,
                color:          duration ? "#fff" : T.body,
                display:        "inline-flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       10,
                fontWeight:     700,
                flexShrink:     0,
                transition:     "background 0.25s ease, color 0.25s ease",
              }}>
                {duration ? "✓" : "2"}
              </span>
              Duration
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {DURATIONS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setDuration(id)}
                  style={{
                    padding:      "12px 8px",
                    border:       duration === id
                      ? `2px solid ${T.primary}`
                      : `1.5px solid ${T.border}`,
                    borderRadius: 8,
                    background:   duration === id ? "rgba(21,94,99,0.08)" : T.soft,
                    fontSize:     13,
                    fontWeight:   duration === id ? 700 : 600,
                    color:        duration === id ? T.primary : T.ink,
                    cursor:       "pointer",
                    transition:   "all 0.15s ease",
                    textAlign:    "center",
                    whiteSpace:   "nowrap",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Price reveal panel ──────────────────────────────────────── */}
          <div
            className={priceReady && selectedPrice ? "iq-price-ring" : ""}
            style={{
              borderRadius: 14,
              padding:      "18px 20px",
              marginBottom: 12,
              transition:   "background 0.5s ease",
              background:   targetPrice ? T.primary : T.soft,
              border:       targetPrice
                ? "none"
                : `1.5px dashed ${T.border}`,
            }}
          >
            {!targetPrice ? (
              /* Locked state */
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width:           42,
                  height:          42,
                  borderRadius:    "50%",
                  background:      "rgba(184,192,194,0.20)",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  flexShrink:      0,
                }}>
                  <Lock size={20} strokeWidth={2} color={T.muted} />
                </div>
                <div>
                  <div style={{
                    fontSize:      26,
                    fontWeight:    700,
                    color:         T.muted,
                    letterSpacing: "-0.04em",
                    lineHeight:    1,
                    marginBottom:  4,
                  }}>
                    —
                  </div>
                  <div style={{ fontSize: 12, color: T.muted }}>
                    Enter your ZIP code above to get started
                  </div>
                </div>
              </div>
            ) : (
              /* Price revealed state */
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(255,255,255,0.60)", textTransform: "uppercase", marginBottom: 8 }}>
                  Starting from
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontSize:      46,
                    fontWeight:    700,
                    color:         "#fff",
                    letterSpacing: "-0.05em",
                    lineHeight:    1,
                  }}>
                    ${displayPrice}
                  </span>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: T.accentW,
                    textDecoration: "line-through",
                    textDecorationColor: T.accentW,
                    textDecorationThickness: "1.5px",
                  }}>
                    ${Math.round(displayPrice / 0.8)} competitors
                  </span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.60)" }}>
                    / visit
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: "18px" }}>
                  Standard clean · No contracts · Free re-clean
                </div>
              </div>
            )}
          </div>

          {/* ── CTA ─────────────────────────────────────────────────────── */}
          {targetPrice && (
            <button
              className="iq-cta"
              onClick={() => document.getElementById("quote-generator")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                gap:             8,
                width:           "100%",
                background:      T.ink,
                color:           "#fff",
                border:          "none",
                borderRadius:    999,
                fontSize:        15,
                fontWeight:      600,
                padding:         "15px 28px",
                cursor:          "pointer",
                letterSpacing:   "-0.01em",
                marginBottom:    12,
                transition:      "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background  = "#0e1a1f";
                (e.currentTarget as HTMLButtonElement).style.transform   = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background  = T.ink;
                (e.currentTarget as HTMLButtonElement).style.transform   = "translateY(0)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform   = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform   = "translateY(-1px)";
              }}
            >
              {selectedPrice ? "Book this clean" : "See detailed quote"}
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>
          )}

          {/* ── Trust footer ─────────────────────────────────────────────── */}
          <div style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             20,
            flexWrap:        "wrap",
            marginTop:       4,
          }}>
            {[
              { icon: Lock, label: "No contracts" },
              { icon: Pause, label: "Cancel anytime" },
              { icon: RotateCcw, label: "Free re-clean" }
            ].map(({ icon: Icon, label }) => (
              <span key={label} style={{
                fontSize:   11,
                color:      T.body,
                display:    "flex",
                alignItems: "center",
                gap:        6,
              }}>
                <Icon size={14} strokeWidth={2} color={T.primary} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

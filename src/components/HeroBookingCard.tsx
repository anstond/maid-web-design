"use client";

import { useState } from "react";
import { ArrowRight, MapPin, Calendar, Home } from "lucide-react";

const T = {
  primary:   "#155E63",
  primaryH:  "#124A54",
  ink:       "#1F2937",
  body:      "#6B7280",
  muted:     "#B8C0C2",
  canvas:    "#FCFBF8",
  soft:      "#F7F5F1",
  softer:    "#EFE6D3",
  border:    "#E5DFD3",
  onPrimary: "#FFFFFF",
};

type ServiceType = "home" | "office" | "move-out";

const TABS: { id: ServiceType; label: string }[] = [
  { id: "home",     label: "Home"    },
  { id: "office",   label: "Office"  },
  { id: "move-out", label: "Move-Out"},
];

const DURATIONS = ["1 hour", "2 hours", "3 hours", "4 hours", "5 hours", "6 hours", "7 hours", "8 hours", "9 hours", "10 hours"];

export default function HeroBookingCard() {
  const [activeTab, setActiveTab] = useState<ServiceType>("home");
  const [address, setAddress]     = useState("");
  const [duration, setDuration]   = useState("1 hour");

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    document.getElementById("quote-generator")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{
      background:   T.canvas,
      borderRadius: 16,
      boxShadow:    "rgba(0,0,0,0.16) 0px 8px 40px 0px, rgba(0,0,0,0.06) 0px 2px 8px 0px",
      overflow:     "hidden",
      fontFamily:   "var(--font-sans)",
      width:        "100%",
    }}>
      {/* ── Card header ─────────────────────────────────────────────────── */}
      <div style={{
        padding:      "22px 22px 18px",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          fontSize:      18,
          fontWeight:    700,
          color:         T.ink,
          letterSpacing: "-0.02em",
          lineHeight:    "24px",
          marginBottom:  3,
        }}>
          Book your cleaning
        </div>
        <div style={{ fontSize: 13, color: T.body, lineHeight: "18px" }}>
          Real-time availability · Same-day slots in 50+ cities
        </div>
      </div>

      {/* ── Service type tabs ───────────────────────────────────────────── */}
      <div style={{
        padding:    "10px 10px 0",
        background: T.soft,
        display:    "flex",
        gap:        4,
      }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex:       1,
              padding:    "10px 0",
              border:     "none",
              borderRadius: 36,
              fontSize:   14,
              fontWeight: activeTab === id ? 600 : 400,
              cursor:     "pointer",
              background: activeTab === id ? T.canvas : "transparent",
              color:      activeTab === id ? T.ink : T.body,
              boxShadow:  activeTab === id
                ? "0 1px 6px rgba(0,0,0,0.10)"
                : "none",
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <form onSubmit={handleBook} style={{ padding: "16px" }}>

        {/* Stacked input rows */}
        <div style={{
          background:    T.soft,
          borderRadius:  12,
          overflow:      "hidden",
          border:        `1px solid ${T.border}`,
          marginBottom:  12,
        }}>

          {/* ZIP / Address */}
          <label style={{ display: "block" }}>
            <div style={{
              display:     "flex",
              alignItems:  "center",
              gap:         12,
              padding:     "0 16px",
              borderBottom: `1px solid ${T.border}`,
            }}>
              <MapPin size={16} color={T.primary} strokeWidth={2} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="ZIP code or full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-label="Enter your ZIP code or address"
                style={{
                  flex:       1,
                  height:     52,
                  border:     "none",
                  background: "transparent",
                  fontSize:   14,
                  color:      T.ink,
                  outline:    "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </label>

          {/* Date & time */}
          <label style={{ display: "block" }}>
            <div style={{
              display:     "flex",
              alignItems:  "center",
              gap:         12,
              padding:     "0 16px",
              borderBottom: `1px solid ${T.border}`,
            }}>
              <Calendar size={16} color={T.primary} strokeWidth={2} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="When? (date &amp; time)"
                aria-label="Select date and time"
                onFocus={(e) => { e.target.type = "datetime-local"; }}
                onBlur={(e)  => { if (!e.target.value) e.target.type = "text"; }}
                style={{
                  flex:       1,
                  height:     52,
                  border:     "none",
                  background: "transparent",
                  fontSize:   14,
                  color:      T.ink,
                  outline:    "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </label>

          {/* Duration */}
          <label style={{ display: "block" }}>
            <div style={{
              display:    "flex",
              alignItems: "center",
              gap:        12,
              padding:    "0 16px",
            }}>
              <Home size={16} color={T.primary} strokeWidth={2} style={{ flexShrink: 0 }} />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                aria-label="Select duration"
                style={{
                  flex:              1,
                  height:            52,
                  border:            "none",
                  background:        "transparent",
                  fontSize:          14,
                  color:             T.ink,
                  outline:           "none",
                  fontFamily:        "inherit",
                  cursor:            "pointer",
                  appearance:        "none",
                  WebkitAppearance:  "none",
                }}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span style={{ color: T.muted, fontSize: 11, flexShrink: 0 }}>▾</span>
            </div>
          </label>
        </div>

        {/* Primary CTA — pill */}
        <button
          type="submit"
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             8,
            width:           "100%",
            background:      T.primary,
            color:           T.onPrimary,
            border:          "none",
            borderRadius:    999,
            fontSize:        16,
            fontWeight:      600,
            padding:         "16px 28px",
            cursor:          "pointer",
            letterSpacing:   "-0.01em",
            boxShadow:       "0 4px 16px rgba(21,94,99,0.25)",
            transition:      "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background  = T.primaryH;
            (e.currentTarget as HTMLButtonElement).style.boxShadow   = "0 8px 28px rgba(21,94,99,0.35)";
            (e.currentTarget as HTMLButtonElement).style.transform   = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background  = T.primary;
            (e.currentTarget as HTMLButtonElement).style.boxShadow   = "0 4px 16px rgba(21,94,99,0.25)";
            (e.currentTarget as HTMLButtonElement).style.transform   = "translateY(0)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform   = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform   = "translateY(-1px)";
          }}
        >
          See prices
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        {/* Competitive pricing badge */}
        <div style={{
          background:    "rgba(21,94,99,0.08)",
          border:        `1px solid rgba(21,94,99,0.16)`,
          borderRadius:  8,
          padding:       "10px 14px",
          marginTop:     12,
          marginBottom:  12,
          display:       "flex",
          alignItems:    "center",
          gap:           8,
          justifyContent: "center",
        }}>
          <span style={{ color: T.primary, fontSize: 12, fontWeight: 700 }}>✓</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: T.ink }}>
            This price is <strong>20% cheaper</strong> than competitors
          </span>
        </div>

        {/* Trust footer */}
        <div style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          gap:             16,
          marginTop:       14,
          flexWrap:        "wrap",
        }}>
          {["No contracts", "Cancel anytime", "Free re-clean"].map((item) => (
            <span
              key={item}
              style={{
                fontSize:   11,
                fontWeight: 500,
                color:      T.body,
                display:    "flex",
                alignItems: "center",
                gap:        4,
              }}
            >
              <span style={{ color: T.primary, fontSize: 12, fontWeight: 700 }}>✓</span>
              {item}
            </span>
          ))}
        </div>
      </form>
    </div>
  );
}

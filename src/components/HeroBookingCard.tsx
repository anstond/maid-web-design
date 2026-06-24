"use client";

import { useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";

const T = {
  primary:   "#155E63",
  primaryH:  "#124A54",
  ink:       "#1F2937",
  body:      "#6B7280",
  muted:     "#B8C0C2",
  canvas:    "#FCFBF8",
  surface:   "#FFFFFF",
  soft:      "#F7F5F1",
  border:    "#E5DFD3",
  onPrimary: "#FFFFFF",
};

type Tab = "hourly" | "deep" | "recurring";

const TABS: { id: Tab; label: string }[] = [
  { id: "hourly",    label: "Hourly"     },
  { id: "deep",      label: "Deep Clean" },
  { id: "recurring", label: "Recurring"  },
];

export default function HeroBookingCard() {
  const [activeTab, setActiveTab]   = useState<Tab>("hourly");
  const [address,   setAddress]     = useState("");

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    // Smooth-scroll to the full quote generator below
    document.getElementById("quote-generator")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      style={{
        background:   "#fafaf9",
        borderRadius: 16,
        border:       "1px solid rgba(255,255,255,0.25)",
        boxShadow:    "0 24px 56px rgba(0,0,0,0.35), 0 0 0 1px rgba(21,94,99,0.10)",
        overflow:     "hidden",
        fontFamily:   "var(--font-sans)",
      }}
    >
      {/* ── Card header ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding:         "28px 28px 22px",
          borderBottom:    `1px solid ${T.border}`,
          display:         "flex",
          alignItems:      "flex-start",
          justifyContent:  "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em", lineHeight: "26px" }}>
            Get your price
          </div>
          <div style={{ fontSize: 13, color: T.body, marginTop: 5 }}>
            Clear pricing in under a minute. No account needed.
          </div>
        </div>
      </div>

      {/* ── Service tabs ────────────────────────────────────────────────── */}
      <div style={{ padding: "22px 28px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
          Choose your clean
        </div>
        <div
          style={{
            display:       "flex",
            gap:           4,
            background:    T.soft,
            borderRadius:  36,
            padding:       4,
          }}
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              style={{
                flex:         1,
                padding:      "8px 0",
                borderRadius: 36,
                border:       "none",
                fontSize:     13,
                fontWeight:   500,
                cursor:       "pointer",
                transition:   "all 0.15s ease",
                background:   activeTab === id ? T.primary : "transparent",
                color:        activeTab === id ? T.onPrimary : T.body,
                boxShadow:    "none",
                transform:    "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== id) {
                  (e.target as HTMLButtonElement).style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Address / ZIP input ─────────────────────────────────────────── */}
      <form onSubmit={handleBook} style={{ padding: "22px 28px 28px" }}>
        <label htmlFor="hero-address" style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
          Where should we clean?
        </label>
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           8,
            background:    T.soft,
            border:        `1px solid ${T.border}`,
            borderRadius:  8,
            padding:       "0 12px",
            transition:    "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            if (e.currentTarget === e.target) return;
            (e.currentTarget as HTMLDivElement).style.borderColor = T.primary;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 2px rgba(21,94,99,0.1)`;
          }}
        >
          <MapPin size={17} strokeWidth={2} style={{ color: T.primary, flexShrink: 0 }} />
          <input
            id="hero-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address or ZIP code"
            style={{
              flex:         1,
              height:       44,
              border:       "none",
              background:   "transparent",
              fontSize:     14,
              color:        T.ink,
              outline:      "none",
              fontFamily:   "inherit",
            }}
            onFocus={(e) => {
              const parent = e.currentTarget.parentElement as HTMLDivElement;
              parent.style.borderColor = T.primary;
              parent.style.boxShadow = `0 0 0 2px rgba(21,94,99,0.1)`;
            }}
            onBlur={(e) => {
              const parent = e.currentTarget.parentElement as HTMLDivElement;
              parent.style.borderColor = T.border;
              parent.style.boxShadow = "none";
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            display:       "flex",
            alignItems:    "center",
            justifyContent: "center",
            gap:           8,
            width:         "100%",
            marginTop:     12,
            background:    T.primary,
            color:         T.onPrimary,
            border:        "none",
            borderRadius:  12,
            fontSize:      16,
            fontWeight:    500,
            padding:       "13px 16px",
            cursor:        "pointer",
            transition:    "all 0.2s ease",
            opacity:       1,
            boxShadow:     "0 4px 12px rgba(21,94,99,0.15)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.95";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(21,94,99,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(21,94,99,0.15)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          Get my instant quote
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
        <p style={{ fontSize: 12, color: T.body, lineHeight: "16px", margin: "10px 0 0", textAlign: "center" }}>
          Starting at $20/hr · No credit card required
        </p>
      </form>

    </div>
  );
}

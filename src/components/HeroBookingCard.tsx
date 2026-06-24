"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

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
        background:   T.surface,
        borderRadius: 16,
        border:       `1px solid ${T.border}`,
        boxShadow:    "0 4px 16px rgba(0,0,0,0.16)",
        overflow:     "hidden",
        fontFamily:   "var(--font-sans)",
      }}
    >
      {/* ── Card header ─────────────────────────────────────────────────── */}
      <div
        style={{
          padding:         "16px",
          borderBottom:    `1px solid ${T.border}`,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, lineHeight: "22px" }}>
            Get your price
          </div>
          <div style={{ fontSize: 12, color: T.body, marginTop: 2 }}>
            Choose a service and enter your ZIP to start.
          </div>
        </div>
      </div>

      {/* ── Service tabs ────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 16px 0" }}>
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
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Address / ZIP input ─────────────────────────────────────────── */}
      <form onSubmit={handleBook} style={{ padding: "16px" }}>
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           6,
            background:    T.soft,
            border:        `1px solid ${T.border}`,
            borderRadius:  8,
            padding:       "0 6px 0 12px",
            transition:    "border-color 0.2s",
          }}
        >
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address or ZIP…"
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
          />
          <button
            type="submit"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           5,
              background:    T.primary,
              color:         T.onPrimary,
              border:        "none",
              borderRadius:  16,
              fontSize:      16,
              fontWeight:    500,
              padding:       "10px 16px",
              cursor:        "pointer",
              flexShrink:    0,
              whiteSpace:    "nowrap",
            }}
          >
            Book Now
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </form>

    </div>
  );
}

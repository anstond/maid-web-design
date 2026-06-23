import { MapPin, Sparkles, CalendarDays, Check, Star, ArrowRight, Phone, Mail } from "lucide-react";

// ─── Design tokens — sourced from colors.json ────────────────────────────────
const T = {
  primary:  "#155E63",  // Deep Teal — CTAs, active states
  primaryH: "#124A54",  // Dark Teal — hover / pressed
  accentW:  "#D9C7A3",  // Warm Sand — highlights, badges
  accentS:  "#EFE6D3",  // Soft Sand — bg accents, empty states
  ink:      "#1F2937",  // Slate Charcoal — headlines, body text
  body:     "#6B7280",  // Cool Gray — supporting text
  muted:    "#B8C0C2",  // Muted Gray — on-dark supporting text
  canvas:   "#FCFBF8",  // Warm White — main page background
  surface:  "#FFFFFF",  // Pure White — cards, modals
  soft:     "#F7F5F1",  // Soft Cream — alternate sections
  border:   "#E5DFD3",  // Warm Border — dividers, input borders
  onPrimary: "#FFFFFF", // Text on teal
  onDark:   "#F5F5F2",  // Warm White — text on dark surfaces
};

// ─── Content ─────────────────────────────────────────────────────────────────
const categories = [
  "Hourly Cleaning",
  "Deep Clean",
  "Move-In / Out",
  "Recurring",
  "Eco-Friendly",
];

const stats = [
  { value: "150k+",  label: "Cleanings completed" },
  { value: "4.8",    label: "Average star rating" },
  { value: "1,460+", label: "Vetted professionals" },
  { value: "4,849+", label: "Happy residents" },
];

const features = [
  "Multi-stage background checks on every professional",
  "ISO-certified cleaning protocols, every visit",
  "Same-day booking available nationwide",
  "Precise 1-hour arrival window guaranteed",
  "100% satisfaction or we return at no cost",
  "1,460+ active vetted professionals",
];

const steps = [
  {
    num: "01",
    title: "Pick your date and time",
    body: "Browse real-time slot availability and book in under 30 seconds. No phone tag, no waitlists.",
  },
  {
    num: "02",
    title: "Matched to a vetted pro",
    body: "Our algorithm assigns a background-checked professional rated 4.8+ stars, specific to your ZIP code.",
  },
  {
    num: "03",
    title: "Arrive to perfection",
    body: "Your home is transformed using EPA-approved supplies. Not satisfied? We return within 24 hours at no charge.",
  },
];

const testimonials = [
  {
    text: "Apartment Maid is genuinely the best cleaning service I have ever used. My tenants constantly compliment how pristine the units are between occupancies.",
    name: "Sarah J.",
    role: "Property Manager",
    location: "New York City",
    seed: "sarah-property-nyc",
  },
  {
    text: "I have tried four other services and none come close. The booking is effortless, the pros are always on time, and my apartment looks better than when I moved in.",
    name: "Marcus R.",
    role: "Busy Professional",
    location: "Brooklyn",
    seed: "marcus-brooklyn-r",
  },
  {
    text: "Helped me get my full security deposit back after a difficult tenant. The team documented everything with photos. Absolutely professional.",
    name: "Priya K.",
    role: "Landlord",
    location: "Miami",
    seed: "priya-miami-landlord",
  },
];

const footerLinks: Record<string, string[]> = {
  Explore:   ["Home", "Book Now", "Services", "About", "Subscriptions", "Blog"],
  Account:   ["Log in", "Sign up", "Become a Maid", "Register as Landlord"],
  Locations: ["New York City", "Miami", "Los Angeles", "Manhattan", "Brooklyn"],
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: "var(--font-sans)", background: T.canvas, color: T.ink }}>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}>
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background: T.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: T.onPrimary, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>M</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: "-0.02em" }}>
              ApartmentMaid
            </span>
          </a>

          {/* Center nav */}
          <div className="hidden lg:flex" style={{ alignItems: "center", gap: 2 }}>
            {[
              { label: "Home",          active: true  },
              { label: "Book",          active: false },
              { label: "Services",      active: false },
              { label: "About",         active: false },
              { label: "Subscriptions", active: false },
            ].map(({ label, active }) => (
              <a
                key={label}
                href="#"
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: active ? T.ink : T.body,
                  textDecoration: "none",
                  padding: "7px 14px",
                  borderRadius: 999,
                  background: active ? T.soft : "transparent",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href="#"
              className="hidden md:inline"
              style={{ fontSize: 15, fontWeight: 500, color: T.body, textDecoration: "none" }}
            >
              Log in
            </a>
            <a
              href="#"
              style={{
                background: T.primary,
                color: T.onPrimary,
                fontSize: 15,
                fontWeight: 600,
                padding: "9px 20px",
                borderRadius: 999,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Book Now
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/bright-modern-apartment-living/1920/1080"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Directional gradient overlay — darker on left for legibility, lighter on right */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(105deg, rgba(10,12,18,0.90) 0%, rgba(10,12,18,0.65) 42%, rgba(10,12,18,0.30) 72%, rgba(10,12,18,0.12) 100%)",
        }} />

        {/* Content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 32px",
            width: "100%",
          }}
        >
          {/* Left — copy */}
          <div>
            <h1 style={{
              fontSize: "clamp(42px, 5.5vw, 68px)",
              fontWeight: 700,
              lineHeight: "1.12",
              color: "#FFFFFF",
              margin: "0 0 20px",
              letterSpacing: "-0.03em",
            }}>
              Your home.<br />
              Spotless, guaranteed.
            </h1>

            <p style={{
              fontSize: 18,
              fontWeight: 400,
              lineHeight: "28px",
              color: "rgba(255,255,255,0.76)",
              margin: "0 0 32px",
              maxWidth: 440,
            }}>
              Professional apartment cleaning from{" "}
              <strong style={{ color: "#fff", fontWeight: 600 }}>$20/hr</strong>.
              Background-checked pros, same-day availability, zero hidden fees.
            </p>

            {/* Service chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.90)",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.20)",
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    transition: "background 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile-only CTA (booking card hidden on mobile) */}
            <a
              href="#"
              className="inline-flex lg:hidden"
              style={{
                background: T.primary,
                color: T.onPrimary,
                fontSize: 16,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 999,
                textDecoration: "none",
                alignItems: "center",
                gap: 8,
              }}
            >
              Book Now
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>

          {/* Right — booking card (desktop only) */}
          <div
            className="hidden lg:block"
            style={{
              background: T.surface,
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 28px 80px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.10)",
            }}
          >
            {/* Tab toggle */}
            <div style={{
              display: "flex",
              background: T.soft,
              borderRadius: 999,
              padding: 4,
              marginBottom: 16,
            }}>
              {["Residents", "Landlords"].map((tab, i) => (
                <button
                  key={tab}
                  style={{
                    flex: 1,
                    background: i === 0 ? T.surface : "transparent",
                    color: i === 0 ? T.ink : T.body,
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "9px 16px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: i === 0 ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Input fields */}
            <div style={{
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}>
              {[
                { icon: <MapPin size={15} color={T.primary} />,       label: "Your zip code",  value: "10001 — New York, NY"        },
                { icon: <Sparkles size={15} color={T.primary} />,     label: "Service type",   value: "Hourly Cleaning"              },
                { icon: <CalendarDays size={15} color={T.primary} />, label: "When",           value: "Today, Jun 23 · 10:00 AM"    },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    background: i % 2 === 0 ? T.surface : T.soft,
                    padding: "13px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    borderBottom: i < 2 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{row.icon}</span>
                  <div>
                    <div style={{
                      fontSize: 11,
                      color: T.muted,
                      lineHeight: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      fontWeight: 600,
                    }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: "22px" }}>
                      {row.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <button
              style={{
                marginTop: 14,
                width: "100%",
                background: T.primary,
                color: T.onPrimary,
                fontSize: 16,
                fontWeight: 700,
                padding: "15px 12px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "opacity 0.15s",
              }}
            >
              See prices
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 10, lineHeight: "18px" }}>
              No credit card required to browse
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────── */}
      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            gap: "1px",
            background: T.border,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: T.canvas,
                textAlign: "center",
                padding: "36px 20px",
              }}
            >
              <div style={{
                fontSize: 42,
                fontWeight: 700,
                lineHeight: "1.1",
                color: T.ink,
                letterSpacing: "-0.04em",
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: T.body, marginTop: 6, lineHeight: "20px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature split ────────────────────────────────────────── */}
      <section style={{ background: T.soft, padding: "96px 32px" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-16 items-center"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          {/* Left — text */}
          <div>
            <h2 style={{
              fontSize: "clamp(30px, 3.5vw, 52px)",
              fontWeight: 700,
              lineHeight: "1.1",
              color: T.ink,
              margin: "0 0 16px",
              letterSpacing: "-0.03em",
            }}>
              The highest standard.<br />
              Every time.
            </h2>
            <p style={{
              fontSize: 17,
              lineHeight: "27px",
              color: T.body,
              margin: "0 0 40px",
              maxWidth: 460,
            }}>
              Only 1 in 8 applicants are accepted. Every professional passes multi-stage
              background checks and ISO-certified training before their first booking.
            </p>

            {/* Feature list — 2-col grid at desktop */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
              style={{ marginBottom: 40 }}
            >
              {features.map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: T.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <Check size={11} color={T.onPrimary} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 14, lineHeight: "22px", color: T.ink }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            {/* Contact links */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="tel:+18779905625"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  color: T.ink,
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: `1px solid ${T.border}`,
                  textDecoration: "none",
                  background: T.canvas,
                }}
              >
                <Phone size={14} />
                +1 (877) 990-5625
              </a>
              <a
                href="mailto:booking@apartmentmaid.co"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  color: T.ink,
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: `1px solid ${T.border}`,
                  textDecoration: "none",
                  background: T.canvas,
                }}
              >
                <Mail size={14} />
                booking@apartmentmaid.co
              </a>
            </div>
          </div>

          {/* Right — lifestyle photo */}
          <div style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.10)",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/clean-apartment-interior-bright/460/560"
              alt="A beautifully clean, bright modern apartment interior"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section style={{ background: T.canvas, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 700,
            lineHeight: "1.1",
            color: T.ink,
            letterSpacing: "-0.03em",
            margin: "0 0 64px",
          }}>
            Spotless in 3 steps.
          </h2>

          <div>
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="grid grid-cols-1 md:grid-cols-[110px_1fr]"
                style={{
                  gap: "16px 48px",
                  padding: "44px 0",
                  borderTop: `1px solid ${T.border}`,
                  alignItems: "start",
                  ...(i === steps.length - 1 ? { borderBottom: `1px solid ${T.border}` } : {}),
                }}
              >
                {/* Large lime step number */}
                <div style={{
                  fontSize: "clamp(52px, 5vw, 80px)",
                  fontWeight: 700,
                  lineHeight: "1",
                  color: T.primary,
                  letterSpacing: "-0.05em",
                }}>
                  {step.num}
                </div>

                <div>
                  <h3 style={{
                    fontSize: "clamp(20px, 2vw, 28px)",
                    fontWeight: 700,
                    lineHeight: "1.2",
                    color: T.ink,
                    margin: "0 0 12px",
                    letterSpacing: "-0.02em",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: 16,
                    lineHeight: "26px",
                    color: T.body,
                    margin: 0,
                    maxWidth: 520,
                  }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section style={{ background: T.soft, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 52 }}>
            <p style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.body,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: 14,
            }}>
              Testimonials
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              fontWeight: 700,
              lineHeight: "1.1",
              color: T.ink,
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              Built for clients who demand results.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  background: T.surface,
                  borderRadius: 16,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid ${T.border}`,
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>

                <p style={{
                  fontSize: 15,
                  lineHeight: "24px",
                  color: T.ink,
                  flex: 1,
                  marginBottom: 24,
                }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 20,
                  borderTop: `1px solid ${T.border}`,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${t.seed}/48/48`}
                    alt={t.name}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, lineHeight: "20px" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: T.body, lineHeight: "18px" }}>
                      {t.role}, {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA band ─────────────────────────────────────────── */}
      <section style={{ background: T.ink, padding: "88px 32px" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          <div>
            <h2 style={{
              fontSize: "clamp(30px, 4vw, 56px)",
              fontWeight: 700,
              lineHeight: "1.1",
              color: "#fff",
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              Ready for a spotless home?
            </h2>
            <p style={{
              fontSize: 17,
              lineHeight: "26px",
              color: "rgba(255,255,255,0.55)",
              margin: "14px 0 0",
            }}>
              Serving NYC, Miami, and Los Angeles. Same-day availability.
            </p>
          </div>

          <a
            href="#"
            style={{
              background: T.primary,
              color: T.onPrimary,
              fontSize: 16,
              fontWeight: 700,
              padding: "16px 32px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Book Now
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer style={{ background: "#081417", padding: "64px 32px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
            style={{ marginBottom: 56 }}
          >
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: T.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: T.onPrimary, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>M</span>
                </div>
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>ApartmentMaid</span>
              </div>
              <p style={{
                fontSize: 13,
                lineHeight: "20px",
                color: "rgba(255,255,255,0.38)",
                maxWidth: 180,
              }}>
                Professional cleaning for modern apartment living.
              </p>
            </div>

            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.60)",
                  marginBottom: 18,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {heading}
                </h4>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}>
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{
                          fontSize: 14,
                          lineHeight: "20px",
                          color: "rgba(255,255,255,0.42)",
                          textDecoration: "none",
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Legal strip */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: "20px" }}>
              © 2026 MAID. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", textDecoration: "none", lineHeight: "20px" }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

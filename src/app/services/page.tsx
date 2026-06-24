"use client";

import {
  ArrowRight,
  Star,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const heroStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0);    }
  }

  .hero-eyebrow  { animation: fadeInUp    0.55s ease-out 0.05s both; }
  .hero-headline { animation: fadeInUp    0.60s ease-out 0.15s both; }
  .hero-subtext  { animation: fadeInUp    0.60s ease-out 0.25s both; }
`;

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

const services = [
  {
    id: "regular-cleaning",
    title: "Regular Cleaning",
    subtitle: "Thorough apartment & home cleaning",
    startingAt: "$89",
    period: "/visit",
    image: "apartment-clean-living-room",
    description: "Our most popular service for maintaining a spotless home. Perfect for busy professionals and families who want a consistently clean living space.",
    features: [
      "Complete room-by-room cleaning",
      "Dusting, vacuuming, and mopping",
      "Bathroom & kitchen sanitization",
      "Trash removal",
      "Bed sheet change (on request)",
      "Up to 3-hour sessions",
    ],
    bestFor: "Weekly or biweekly maintenance to keep your home pristine.",
    includes: [
      "All cleaning supplies included",
      "Vetted professional",
      "Free 24-hour re-clean if unsatisfied",
      "Real-time tracking",
    ],
  },
  {
    id: "deep-cleaning",
    title: "Deep Cleaning",
    subtitle: "Intensive seasonal refresh",
    startingAt: "$149",
    period: "/visit",
    image: "kitchen-spotless-modern",
    description: "A comprehensive, move-out level clean that reaches every corner, crevice, and detail. Ideal for seasonal refreshes or preparing for special occasions.",
    features: [
      "All features from Regular Cleaning",
      "Inside appliances (oven, fridge, microwave)",
      "Baseboards & door frames",
      "Window sills & tracks",
      "Behind furniture deep clean",
      "Grout & tile scrubbing",
      "Up to 5-hour sessions",
    ],
    bestFor: "Quarterly deep cleans or move-in/move-out preparation.",
    includes: [
      "All cleaning supplies included",
      "Professional-grade equipment",
      "Vetted professional",
      "Free 24-hour re-clean if unsatisfied",
    ],
  },
  {
    id: "kitchen-cleaning",
    title: "Kitchen Deep Clean",
    subtitle: "Specialist kitchen sanitization",
    startingAt: "$129",
    period: "/visit",
    image: "kitchen-spotless-modern",
    description: "Dedicated kitchen expertise. We focus on every surface, appliance, and hidden area to make your kitchen shine and gleam.",
    features: [
      "Inside & outside refrigerator cleaning",
      "Oven & stovetop deep clean",
      "Microwave interior & exterior",
      "Cabinet interior & exterior polish",
      "Sink & faucet shine",
      "Dishwasher filter & interior clean",
      "Countertop & backsplash detail",
      "Floor & baseboards",
    ],
    bestFor: "Kitchens that need professional-level sanitization.",
    includes: [
      "Eco-friendly degreasers",
      "Specialist equipment",
      "Vetted professional",
      "Same-day booking available",
    ],
  },
  {
    id: "commercial-cleaning",
    title: "Commercial Cleaning",
    subtitle: "Professional office spaces",
    startingAt: "$199",
    period: "/2hrs",
    image: "commercial-office-bright",
    description: "Tailored for offices, clinics, retail spaces, and other commercial properties. We maintain professional standards and work around your business hours.",
    features: [
      "Customizable cleaning schedules",
      "Daily, weekly, or monthly service",
      "Floor care & maintenance",
      "Restroom sanitization",
      "Common area cleaning",
      "Waste & recycling management",
      "Green cleaning options",
      "Flexible scheduling",
    ],
    bestFor: "Offices and commercial spaces requiring consistent professional cleaning.",
    includes: [
      "Eco-certified supplies",
      "Vetted professionals",
      "Flexible scheduling",
      "Customizable checklists",
    ],
  },
  {
    id: "move-cleaning",
    title: "Move-In / Move-Out",
    subtitle: "Get your deposit back",
    startingAt: "$199",
    period: "/visit",
    image: "move-out-checklist-apartment",
    description: "Prepare your space for move-out or move-in inspections. We document everything with photos to ensure you get your full security deposit back.",
    features: [
      "All surfaces cleaned",
      "Inside all appliances",
      "Wall spot cleaning",
      "Carpet shampooing (optional add-on)",
      "Photo documentation",
      "Landlord-ready condition",
      "Professional inspection walkthrough",
      "Extended session options",
    ],
    bestFor: "Rentals where you need to pass final landlord inspection.",
    includes: [
      "Photo documentation included",
      "Professional-grade supplies",
      "Damage assessment notes",
      "Free consultation call",
    ],
  },
  {
    id: "post-construction",
    title: "Post-Construction Cleaning",
    subtitle: "Specialized debris cleanup",
    startingAt: "$249",
    period: "/visit",
    image: "commercial-office-bright",
    description: "Heavy-duty cleanup after renovations, construction, or major home projects. We remove debris, dust, and prepare spaces for occupancy.",
    features: [
      "Debris removal & disposal",
      "Dust & drywall residue cleanup",
      "Window & glass cleaning",
      "Floor cleaning & polishing",
      "Fixture & fitting cleanup",
      "Air filter replacement",
      "Odor neutralization",
      "Final walkthrough inspection",
    ],
    bestFor: "Post-renovation or post-construction spaces requiring heavy cleanup.",
    includes: [
      "Industrial equipment",
      "Specialist team",
      "Disposal included",
      "Extended session (6+ hours)",
    ],
  },
];

const faqItems = [
  {
    question: "What cleaning products do you use?",
    answer: "We use EPA-approved, eco-friendly cleaning supplies that are safe for families and pets. All products are non-toxic and biodegradable. You can request fragrance-free or hypoallergenic options when booking.",
  },
  {
    question: "Can I customize my cleaning service?",
    answer: "Absolutely! Every service can be customized to your needs. You can specify areas to focus on, products to avoid, or particular concerns. Just add notes when booking or call our support team.",
  },
  {
    question: "What happens if I'm not satisfied?",
    answer: "We offer a 100% satisfaction guarantee. If there's any issue, we'll return within 24 hours at no charge to re-clean any area. No questions asked.",
  },
  {
    question: "How long does a typical cleaning take?",
    answer: "Regular cleaning typically takes 2-3 hours for a 1-2 bedroom apartment. Deep cleans take 4-5 hours. The exact time depends on your home's size and current condition. We provide time estimates during booking.",
  },
  {
    question: "Are your cleaners vetted and insured?",
    answer: "Yes. Every cleaner undergoes multi-stage background checks, professional training, and carries full liability insurance. You can see their profiles and ratings before booking.",
  },
  {
    question: "Can I book same-day cleaning?",
    answer: "Yes! Same-day booking is available in most areas. If we have availability, you can book a cleaning for the same day. We typically show available time slots in real-time when you start booking.",
  },
];

const comparisonServices = [
  { name: "Regular Cleaning", regular: true, deep: true, kitchen: true, commercial: false, move: true, construction: false },
  { name: "Deep Cleaning", regular: true, deep: true, kitchen: true, commercial: false, move: true, construction: true },
  { name: "Kitchen Focus", regular: false, deep: true, kitchen: true, commercial: true, move: true, construction: false },
  { name: "Specialized Equipment", regular: false, deep: true, kitchen: true, commercial: true, move: true, construction: true },
  { name: "Same-Day Available", regular: true, deep: true, kitchen: true, commercial: false, move: true, construction: false },
  { name: "Photo Documentation", regular: false, deep: false, kitchen: false, commercial: false, move: true, construction: true },
];

function ServiceCard({ service, T }: { service: typeof services[0]; T: any }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        background: T.surface,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 16px 40px rgba(21,94,99,0.12)";
        el.style.transform = "translateY(-2px)";
        el.style.borderColor = T.accentW;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)";
        el.style.transform = "translateY(0)";
        el.style.borderColor = T.border;
      }}
    >
      <div style={{ padding: "28px 28px 24px", display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 700,
            color: T.ink,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            {service.title}
          </h3>
          <div style={{
            height: 2,
            width: 32,
            background: T.accentW,
            borderRadius: 1,
            marginBottom: 12,
          }} />
          <p style={{
            fontSize: 13,
            color: T.body,
            margin: 0,
            fontWeight: 500,
          }}>
            {service.subtitle}
          </p>
        </div>

        <p style={{
          fontSize: 14,
          lineHeight: "22px",
          color: T.body,
          margin: "0 0 20px",
        }}>
          {service.description}
        </p>

        <div style={{
          height: 1,
          background: T.border,
          margin: "0 0 18px",
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {service.features.slice(0, 3).map((feature, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: T.accentS,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}>
                <Check size={12} color={T.primary} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 13, color: T.ink, lineHeight: "20px" }}>{feature}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: "transparent",
          padding: 0,
          marginTop: "auto",
          marginBottom: 20,
          borderTop: `2px solid ${T.accentW}`,
          paddingTop: 18,
        }}>
          <div style={{
            fontSize: 11,
            color: T.body,
            marginBottom: 6,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            Starting at
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{
              fontSize: 28,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>
              {service.startingAt}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: T.body }}>
              {service.period}
            </span>
          </div>
        </div>

        <a href="#" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: T.primary,
          color: T.onPrimary,
          fontSize: 14,
          fontWeight: 600,
          padding: "13px 20px",
          borderRadius: 999,
          textDecoration: "none",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = T.primaryH;
          el.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = T.primary;
          el.style.transform = "scale(1)";
        }}
        >
          Book Now
          <ArrowRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: T.canvas, color: T.ink }}>
      <style>{heroStyles}</style>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(252,251,248,0.94)",
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
          height: 66,
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: T.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: T.onPrimary, fontSize: 13, fontWeight: 700 }}>M</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: "-0.02em" }}>
              ApartmentMaid
            </span>
          </Link>

          <div className="hidden lg:flex" style={{ alignItems: "center", gap: 2 }}>
            {[
              { label: "Home", href: "/", active: false },
              { label: "Services", href: "/services", active: true },
              { label: "About Us", href: "#", active: false },
              { label: "Subscriptions", href: "#", active: false },
              { label: "Blog", href: "#", active: false },
            ].map(({ label, href, active }) => (
              <Link key={label} href={href} style={{
                fontSize: 14,
                fontWeight: 500,
                color: active ? T.ink : T.body,
                textDecoration: "none",
                padding: "7px 14px",
                borderRadius: 999,
                background: active ? T.soft : "transparent",
              }}>
                {label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="#" className="hidden md:inline" style={{
              fontSize: 14,
              fontWeight: 500,
              color: T.body,
              textDecoration: "none",
            }}>
              Log in
            </a>
            <a href="#" style={{
              background: T.primary,
              color: T.onPrimary,
              fontSize: 14,
              fontWeight: 600,
              padding: "9px 20px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}>
              Book now
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.ink,
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        padding: "64px 32px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          <div className="hero-eyebrow" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 999,
            padding: "5px 14px",
            marginBottom: 20,
            width: "fit-content",
          }}>
            <div style={{
              background: T.primary,
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.80)", letterSpacing: "0.04em" }}>
              150,000+ cleanings delivered
            </span>
          </div>

          <h1 className="hero-headline" style={{
            fontSize: "clamp(38px, 4vw, 60px)",
            fontWeight: 700,
            lineHeight: "1.07",
            letterSpacing: "-0.035em",
            color: "#fff",
            margin: "0 0 20px",
            maxWidth: 700,
          }}>
            Clean Spaces Made <span style={{ color: T.accentW }}>Simple</span>
          </h1>

          <p className="hero-subtext" style={{
            fontSize: 18,
            lineHeight: "1.65",
            color: "rgba(255,255,255,0.70)",
            margin: "0 0 30px",
            maxWidth: 600,
          }}>
            From regular maintenance to deep cleans, we offer specialized services tailored to every need. Choose your service and book in seconds.
          </p>

          <a href="#services" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: T.primary,
            color: T.onPrimary,
            fontSize: 15,
            fontWeight: 600,
            padding: "14px 28px",
            borderRadius: 999,
            textDecoration: "none",
          }}>
            Explore Services
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Header row */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            style={{ marginBottom: 40, alignItems: "end" }}
          >
            <h2 style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 700,
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              color: T.ink,
              margin: 0,
            }}>
              Our Sparkling Touch
            </h2>
            <p style={{ fontSize: 16, lineHeight: "26px", color: T.body, margin: 0, maxWidth: 400 }}>
              We deliver spotless spaces with care, precision, and a touch of sparkle — every single time.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4" style={{ gap: 16 }}>
            {services.map((svc) => (
              <div key={svc.num} className="col-span-1">
                <ServiceCard service={svc} T={T} />
              </div>
            ))}

            {/* Marketing Content Card — Live Quote Generator */}
            <div style={{
              borderRadius: 16,
              background: T.primary,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: 32,
              gap: 20,
              cursor: "pointer",
              transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 4px 20px rgba(21,94,99,0.15)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 16px 40px rgba(21,94,99,0.25)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 4px 20px rgba(21,94,99,0.15)";
              el.style.transform = "translateY(0)";
            }}
            >
              <div>
                <h3 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: T.onPrimary,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}>
                  Get Your Instant Quote
                </h3>
                <p style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: "rgba(255,255,255,0.85)",
                  margin: 0,
                }}>
                  See exactly what your cleaning will cost in seconds. No hidden fees, transparent pricing.
                </p>
              </div>

              <a
                href="#quote-generator"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.accentW,
                  color: T.ink,
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 20px",
                  borderRadius: 999,
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1)";
                }}
              >
                Calculate Price
                <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us — Marketing Section ─────────────────────────────── */}
      <section style={{ background: T.soft, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Content */}
            <div>
              <h2 style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 700,
                lineHeight: "1.15",
                letterSpacing: "-0.03em",
                color: T.ink,
                margin: "0 0 20px",
              }}>
                Why ApartmentMaid Stands Out
              </h2>
              <p style={{ fontSize: 16, lineHeight: "26px", color: T.body, margin: "0 0 28px", maxWidth: 480 }}>
                We're not just a cleaning service. We're a trusted partner committed to making your space pristine and your life easier.
              </p>

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {[
                  "Vetted professionals with background checks",
                  "ISO-certified cleaning protocols",
                  "Same-day booking available nationwide",
                  "100% satisfaction or free re-clean",
                ].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Check size={20} color={T.primary} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, lineHeight: "22px", color: T.ink }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href="#quote-generator" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: T.primary,
                color: T.onPrimary,
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "scale(1)";
              }}
              >
                Get Your Estimate
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
            </div>

            {/* Right — Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { value: "150k+", label: "Cleanings completed" },
                { value: "4.8 / 5", label: "Average rating" },
                { value: "1,460+", label: "Vetted professionals" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "24px 20px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: T.ink, lineHeight: "32px", letterSpacing: "-0.04em", marginBottom: 6 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 13, color: T.body, lineHeight: "18px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Details ────────────────────────────────────────────────── */}
      <section style={{ background: T.soft, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: T.ink,
            margin: "0 0 56px",
          }}>
            What's Included in Every Service
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 32, marginBottom: 56 }}>
            {[
              {
                title: "Professional Standards",
                items: [
                  "Multi-stage background checks on every pro",
                  "ISO-certified cleaning protocols",
                  "Professional-grade equipment & supplies",
                  "Uniform and ID verification",
                ],
              },
              {
                title: "Your Protection",
                items: [
                  "100% satisfaction guarantee with free re-clean",
                  "Full liability insurance coverage",
                  "Real-time GPS tracking",
                  "Direct communication with your assigned pro",
                ],
              },
              {
                title: "Convenience",
                items: [
                  "Same-day booking available",
                  "Flexible scheduling options",
                  "Easy rescheduling anytime",
                  "No long-term contracts",
                ],
              },
              {
                title: "Eco-Friendly",
                items: [
                  "EPA-approved, non-toxic products",
                  "Biodegradable cleaning solutions",
                  "Safe for families and pets",
                  "Fragrance-free options available",
                ],
              },
            ].map((section) => (
              <div key={section.title} style={{
                background: T.surface,
                borderRadius: 16,
                border: `1px solid ${T.border}`,
                padding: 32,
              }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: T.ink,
                  margin: "0 0 20px",
                  letterSpacing: "-0.02em",
                }}>
                  {section.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {section.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <Check size={16} color={T.primary} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 14, lineHeight: "22px", color: T.body }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Comparison ────────────────────────────────────────────── */}
      <section style={{ background: T.canvas, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: T.ink,
            margin: "0 0 48px",
          }}>
            Service Comparison
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  <th style={{ textAlign: "left", padding: "16px 0", fontWeight: 700, color: T.ink }}>Feature</th>
                  {["Regular", "Deep", "Kitchen", "Commercial", "Move", "Post-Constr."].map((h) => (
                    <th key={h} style={{ textAlign: "center", padding: "16px", fontWeight: 600, color: T.body, fontSize: 13 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonServices.map((row, i) => (
                  <tr key={i} style={{
                    borderBottom: `1px solid ${T.border}`,
                    background: i % 2 === 0 ? T.soft : T.surface,
                  }}>
                    <td style={{ padding: "16px 0", color: T.ink, fontWeight: 500 }}>{row.name}</td>
                    <td style={{ textAlign: "center", padding: "16px" }}>
                      {row.regular && <Check size={16} color={T.primary} strokeWidth={2.5} style={{ margin: "0 auto" }} />}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px" }}>
                      {row.deep && <Check size={16} color={T.primary} strokeWidth={2.5} style={{ margin: "0 auto" }} />}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px" }}>
                      {row.kitchen && <Check size={16} color={T.primary} strokeWidth={2.5} style={{ margin: "0 auto" }} />}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px" }}>
                      {row.commercial && <Check size={16} color={T.primary} strokeWidth={2.5} style={{ margin: "0 auto" }} />}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px" }}>
                      {row.move && <Check size={16} color={T.primary} strokeWidth={2.5} style={{ margin: "0 auto" }} />}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px" }}>
                      {row.construction && <Check size={16} color={T.primary} strokeWidth={2.5} style={{ margin: "0 auto" }} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section style={{ background: T.soft, padding: "88px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: T.ink,
            margin: "0 0 48px",
            textAlign: "center",
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqItems.map((item, i) => (
              <div
                key={i}
                style={{
                  background: T.surface,
                  borderRadius: 12,
                  border: `1px solid ${T.border}`,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    textAlign: "left",
                  }}
                >
                  <span style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: T.ink,
                    flex: 1,
                  }}>
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    color={T.primary}
                    strokeWidth={2}
                    style={{
                      transition: "transform 0.3s ease",
                      transform: expandedFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {expandedFaq === i && (
                  <div style={{
                    padding: "0 24px 20px",
                    borderTop: `1px solid ${T.border}`,
                    background: "rgba(245,245,242,0.5)",
                  }}>
                    <p style={{
                      fontSize: 14,
                      lineHeight: "24px",
                      color: T.body,
                      margin: 0,
                    }}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────────────────── */}
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
              Ready to book your clean?
            </h2>
            <p style={{ fontSize: 16, lineHeight: "26px", color: "rgba(255,255,255,0.50)", margin: "14px 0 0" }}>
              Choose your service and get started in under 30 seconds.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="tel:+18779905625" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              padding: "14px 24px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.20)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}>
              <Phone size={14} />
              Call Us
            </a>
            <a href="#" style={{
              background: T.primary,
              color: T.onPrimary,
              fontSize: 15,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 999,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
              Book Now
              <ArrowRight size={15} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#081417", padding: "64px 32px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10" style={{ marginBottom: 56 }}>
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
                }}>
                  <span style={{ color: T.onPrimary, fontSize: 12, fontWeight: 700 }}>M</span>
                </div>
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>ApartmentMaid</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: "20px", color: "rgba(255,255,255,0.35)", maxWidth: 180 }}>
                Professional cleaning for modern apartment living.
              </p>
            </div>

            {[
              { heading: "Explore", links: ["Home", "Services", "About", "Blog"] },
              { heading: "Account", links: ["Log in", "Sign up", "Become a Maid"] },
              { heading: "Contact", links: ["Support", "Locations", "Pricing"] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h4 style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.50)",
                  marginBottom: 18,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {heading}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", textDecoration: "none", lineHeight: "20px" }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: "20px" }}>
              © 2026 ApartmentMaid. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                <a key={item} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none", lineHeight: "20px" }}>
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

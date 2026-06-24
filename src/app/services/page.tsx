"use client";

import {
  ArrowRight,
  Star,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  ChevronDown,
  Heart,
  Home,
  User,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Navigation from "@/components/Navigation";

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
  .hero-cta      { animation: fadeInUp    0.60s ease-out 0.35s both; }
`;

const T = {
  primary: "#155E63",
  primaryH: "#124A54",
  primaryLight: "#1f8c94",
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
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 12px 32px rgba(21,94,99,0.10)";
        el.style.transform = "translateY(-3px)";
        el.style.borderColor = T.accentW;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
        el.style.transform = "translateY(0)";
        el.style.borderColor = T.border;
      }}
    >
      <div style={{ padding: "28px 28px 24px", display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: T.ink,
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
          }}>
            {service.title}
          </h3>
          <div style={{
            height: 2,
            width: 28,
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
                marginTop: 2,
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
          borderTop: `1px solid ${T.accentS}`,
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
              fontSize: 26,
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
          padding: "12px 20px",
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
          <ArrowRight size={15} strokeWidth={2.5} />
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

      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: T.ink,
        minHeight: "480px",
        display: "flex",
        alignItems: "center",
        padding: "80px 32px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          right: "-20%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          background: `radial-gradient(circle, ${T.primary}20 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="hero-eyebrow" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.08)",
            border: `1px solid ${T.accentW}40`,
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 24,
            width: "fit-content",
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.accentW, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Professional cleaning
            </span>
          </div>

          <h1 className="hero-headline" style={{
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 700,
            lineHeight: "1.1",
            letterSpacing: "-0.035em",
            color: "#fff",
            margin: "0 0 24px",
            maxWidth: 700,
          }}>
            Your home, <span style={{ color: T.accentW }}>spotless</span>
          </h1>

          <p className="hero-subtext" style={{
            fontSize: 18,
            lineHeight: "1.6",
            color: "rgba(255,255,255,0.75)",
            margin: "0 0 32px",
            maxWidth: 580,
          }}>
            From weekly maintenance to seasonal deep cleans. Same-day booking, vetted professionals, 100% satisfaction guaranteed.
          </p>

          <div className="hero-cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#services" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.accentW,
              color: T.ink,
              fontSize: 15,
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: 999,
              textDecoration: "none",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(217,199,163,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
            >
              Browse Services
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a href="tel:+18779905625" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: 999,
              textDecoration: "none",
              border: `1px solid rgba(255,255,255,0.2)`,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.15)";
              el.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.1)";
              el.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            >
              <Phone size={16} strokeWidth={2} />
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "120px 32px", background: T.canvas }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.primary,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Our Services
            </div>
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: "1.1",
              letterSpacing: "-0.035em",
              color: T.ink,
              margin: "0 0 20px",
              maxWidth: 680,
            }}>
              Cleaning Services Built for Every Need
            </h2>
            <p style={{ fontSize: 16, lineHeight: "26px", color: T.body, margin: 0, maxWidth: 680 }}>
              From weekly maintenance to seasonal deep cleans, we have a service tailored to your home and lifestyle.
            </p>
          </div>

          {/* Cards Grid - Clean 3 Column Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 56,
          }}>
            {services.map((svc) => (
              <div key={svc.id}>
                <ServiceCard service={svc} T={T} />
              </div>
            ))}
          </div>

          {/* Quote CTA Card - Full Width Premium */}
          <div style={{
            borderRadius: 20,
            background: `linear-gradient(135deg, ${T.primary}, ${T.primaryLight})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "56px",
            gap: 28,
            cursor: "pointer",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 16px 48px rgba(21,94,99,0.20)",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "0 24px 64px rgba(21,94,99,0.30)";
            el.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "0 16px 48px rgba(21,94,99,0.20)";
            el.style.transform = "translateY(0)";
          }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}>
                Transparent Pricing
              </div>
              <h3 style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 700,
                color: T.onPrimary,
                margin: "0 0 12px",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}>
                Get Your Instant Quote
              </h3>
              <p style={{
                fontSize: 16,
                lineHeight: "26px",
                color: "rgba(255,255,255,0.90)",
                margin: 0,
                maxWidth: 560,
              }}>
                See exactly what your cleaning will cost. No hidden fees, no surprises, just transparent pricing you can trust.
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
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              Calculate Price
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Why ApartmentMaid Stands Out ──────────────────────────────── */}
      <section style={{ background: T.soft, padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.primary,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Why Choose Us
            </div>
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: "1.1",
              letterSpacing: "-0.035em",
              color: T.ink,
              margin: "0 0 20px",
              maxWidth: 680,
            }}>
              The ApartmentMaid Difference
            </h2>
            <p style={{
              fontSize: 16,
              lineHeight: "26px",
              color: T.body,
              margin: 0,
              maxWidth: 680,
            }}>
              What sets us apart from everyone else in the cleaning industry.
            </p>
          </div>

          {/* Content Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            {/* Left: Differentiators */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  { icon: "shield", title: "Vetted Professionals", desc: "Every cleaner passes multi-stage background checks and ongoing professional training." },
                  { icon: "check", title: "ISO-Certified Standards", desc: "Enterprise-grade protocols ensure consistent, professional results every single time." },
                  { icon: "clock", title: "Same-Day Booking", desc: "Real-time availability across major areas means you can book within hours." },
                  { icon: "heart", title: "100% Satisfaction", desc: "Not happy? We return free within 24 hours. Your satisfaction is our promise." },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 16,
                      padding: "28px",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = "0 12px 32px rgba(21,94,99,0.08)";
                      el.style.transform = "translateY(-3px)";
                      el.style.borderColor = T.accentW;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                      el.style.transform = "translateY(0)";
                      el.style.borderColor = T.border;
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: T.accentS,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.25s ease",
                    }}>
                      {item.icon === "shield" && <Check size={24} color={T.primary} strokeWidth={1.5} />}
                      {item.icon === "check" && <Check size={24} color={T.primary} strokeWidth={1.5} />}
                      {item.icon === "clock" && <Clock size={24} color={T.primary} strokeWidth={1.5} />}
                      {item.icon === "heart" && <Heart size={24} color={T.primary} strokeWidth={1.5} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: 14, lineHeight: "22px", color: T.body, margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Stats & Proof */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Top: Big featured stat */}
                <div style={{
                  background: `linear-gradient(135deg, ${T.primary}, ${T.primaryLight})`,
                  borderRadius: 20,
                  padding: "48px 32px",
                  color: T.onPrimary,
                  textAlign: "center",
                  boxShadow: "0 16px 40px rgba(21,94,99,0.20)",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, opacity: 0.9 }}>
                    Trusted by
                  </div>
                  <div style={{ fontSize: "clamp(40px, 6vw, 56px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 8 }}>
                    150k+
                  </div>
                  <div style={{ fontSize: 16, lineHeight: "24px", opacity: 0.95 }}>
                    Happy apartment dwellers
                  </div>
                </div>

                {/* Bottom: Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { value: "4.8", label: "Average Rating", sublabel: "★" },
                    { value: "1,460+", label: "Vetted Pros", sublabel: "In Your Area" },
                    { value: "24/7", label: "Support", sublabel: "Always Available" },
                    { value: "100%", label: "Satisfaction", sublabel: "Guaranteed" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        borderRadius: 16,
                        padding: "24px",
                        textAlign: "center",
                        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.boxShadow = "0 8px 24px rgba(21,94,99,0.08)";
                        el.style.transform = "translateY(-2px)";
                        el.style.borderColor = T.accentW;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                        el.style.transform = "translateY(0)";
                        el.style.borderColor = T.border;
                      }}
                    >
                      <div style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: T.primary,
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                        marginBottom: 6,
                      }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 2 }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 12, color: T.body, lineHeight: "16px" }}>
                        {stat.sublabel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Included ────────────────────────────────────────────────── */}
      <section style={{ background: T.canvas, padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.primary,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              What's Included
            </div>
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: "1.1",
              letterSpacing: "-0.035em",
              color: T.ink,
              margin: "0 0 20px",
              maxWidth: 700,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Everything We Handle, Before We Enter Your Home
            </h2>
            <p style={{
              fontSize: 16,
              lineHeight: "26px",
              color: T.body,
              margin: 0,
              maxWidth: 660,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Background checked professionals. Fully insured. Satisfaction guaranteed. Same-day availability.
            </p>
          </div>

          {/* 4-Column Icon Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 32,
            marginBottom: 80,
          }}>
            {[
              { icon: "shield", title: "Background Checked", desc: "Every cleaner passes a multi-step screening, including criminal record checks and ID verification." },
              { icon: "heart", title: "Satisfaction Guaranteed", desc: "Not happy? We'll make it right. Your satisfaction is our top priority." },
              { icon: "home", title: "Fully Insured", desc: "Every booking is backed by comprehensive insurance for complete peace of mind." },
              { icon: "clock", title: "Same-Day Available", desc: "Book in minutes and get a professional cleaner to your door, often within hours." },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: T.accentS,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  cursor: "pointer",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1.08)";
                  el.style.background = T.accentW;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1)";
                  el.style.background = T.accentS;
                }}
                >
                  {item.icon === "shield" && <Check size={40} color={T.primary} strokeWidth={1.5} />}
                  {item.icon === "heart" && <Heart size={40} color={T.primary} strokeWidth={1.5} />}
                  {item.icon === "home" && <Home size={40} color={T.primary} strokeWidth={1.5} />}
                  {item.icon === "clock" && <Clock size={40} color={T.primary} strokeWidth={1.5} />}
                </div>

                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: T.ink,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: T.body,
                  margin: 0,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Trusted By Section */}
          <div style={{
            background: T.surface,
            borderRadius: 24,
            padding: "64px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
            marginBottom: 64,
          }}>
            {/* Stats */}
            <div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                color: T.ink,
                margin: "0 0 40px",
                letterSpacing: "-0.02em",
              }}>
                Trusted by thousands of residents
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {[
                  { icon: "users", value: "15,000+", label: "Apartments Cleaned" },
                  { icon: "star", value: "4.9", label: "Average Rating" },
                  { icon: "check", value: "100%", label: "Satisfaction Guarantee" },
                  { icon: "shield", value: "Fully", label: "Insured for Your Protection" },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: T.accentS,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}>
                      {stat.icon === "users" && <User size={28} color={T.primary} strokeWidth={1.5} />}
                      {stat.icon === "star" && <Star size={28} color={T.primary} strokeWidth={1.5} />}
                      {stat.icon === "check" && <Check size={28} color={T.primary} strokeWidth={1.5} />}
                      {stat.icon === "shield" && <Check size={28} color={T.primary} strokeWidth={1.5} />}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 12, color: T.body, lineHeight: "16px", maxWidth: 100, margin: "0 auto" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Placeholder */}
            <div style={{
              borderRadius: 20,
              background: `linear-gradient(135deg, ${T.accentS}, ${T.accentW})`,
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.primary,
              fontSize: 14,
            }}>
              Professional cleaner at home
            </div>
          </div>

          {/* Trust Statement */}
          <div style={{
            background: `linear-gradient(135deg, ${T.accentS}40, ${T.accentW}40)`,
            border: `1px solid ${T.accentW}`,
            borderRadius: 16,
            padding: "40px",
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: T.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <Check size={24} color={T.onPrimary} strokeWidth={2} />
            </div>
            <div>
              <h4 style={{
                fontSize: 20,
                fontWeight: 700,
                color: T.ink,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}>
                Your home. Your trust. Our priority.
              </h4>
              <p style={{
                fontSize: 15,
                lineHeight: "24px",
                color: T.body,
                margin: 0,
              }}>
                We treat your home with the same care and respect we would our own. That's the ApartmentMaid promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Comparison ────────────────────────────────────────────── */}
      <section style={{ background: T.canvas, padding: "96px 32px" }}>
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
      <section style={{ background: T.soft, padding: "96px 32px" }}>
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
                    transition: "background 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = T.soft;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
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
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.1)";
              el.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            >
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
              transition: "all 0.25s ease",
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

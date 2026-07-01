"use client";

import {
  ArrowRight,
  Star,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  X,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import QuoteGenerator from "@/components/QuoteGenerator";
import HeroInteractiveQuote from "@/components/HeroInteractiveQuote";
import Navigation from "@/components/Navigation";
import { openIntercomComposer, setIntercomContext, trackIntercomEvent } from "@/lib/intercom-conversion";


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
  .hero-proof    { animation: fadeInUp    0.60s ease-out 0.35s both; }
  .hero-chips    { animation: fadeInUp    0.60s ease-out 0.45s both; }
  .hero-card     { animation: fadeInRight 0.65s ease-out 0.20s both; }
`;

// ─── Design tokens ────────────────────────────────────────────────────────────
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

// ─── Content ──────────────────────────────────────────────────────────────────
const partners = [
  "Zillow", "StreetEasy", "Apartments.com", "CoStar", "Zumper", "Avail",
];

const services = [
  { num: "01", title: "Commercial Cleaning", seed: "commercial-office-bright", price: "$199", period: "/2hrs", description: "Professional office & commercial spaces" },
  { num: "02", title: "Regular Cleaning", seed: "apartment-clean-living-room", price: "$89", period: "/visit", description: "Thorough apartment & home cleaning" },
  { num: "03", title: "Kitchen Cleaning", seed: "kitchen-spotless-modern", price: "$129", period: "/visit", description: "Deep kitchen sanitization & detail work" },
];

const featurePoints = [
  "Multi-stage background checks on every pro",
  "ISO-certified protocols, every single visit",
  "Same-day booking available nationwide",
  "Precise 1-hour arrival window guaranteed",
  "100% satisfaction or we return at no cost",
];

const featureStats = [
  { value: "150k+", label: "Cleanings done" },
  { value: "4.8 / 5", label: "Average rating" },
  { value: "1,460+", label: "Vetted pros" },
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

const featuredPlan = {
  name: "Weekly",
  price: "$89",
  period: "per visit",
  badge: "Most Popular",
  savings: "Save 40% ($60/visit)",
  description: "Our best per-visit rate. A spotless home, every single week — guaranteed.",
  features: [
    "Weekly visit guaranteed",
    "Free re-clean within 24 hrs",
    "Dedicated account manager",
    "Eco-friendly products included",
  ],
  cta: "Go Weekly",
};

const sidePlans = [
  {
    name: "One-Time",
    price: "$149",
    period: "/ visit",
    savings: "",
    description: "Perfect for a deep clean or special occasion.",
    features: ["Standard clean", "Up to 10-hour session", "Vetted pro"],
    cta: "Book Now",
  },
  {
    name: "Every 4 Weeks",
    price: "$129",
    period: "/ visit",
    savings: "Save 13% ($20/visit)",
    description: "One thorough cleaning every 4 weeks at a reduced rate.",
    features: ["Priority scheduling", "Same-day availability", "Dedicated pro"],
    cta: "Start Every 4 Weeks",
  },
  {
    name: "Biweekly",
    price: "$109",
    period: "/ visit",
    savings: "Save 27% ($40/visit)",
    description: "Two cleanings per month — a steady routine.",
    features: ["Everything in Monthly", "Flexible rescheduling", "Dedicated pro"],
    cta: "Start Biweekly",
  },
  {
    name: "Custom",
    price: "Flexible",
    period: "your schedule",
    savings: "Save up to 40%",
    description: "Pick any number of days per week. We build around you.",
    features: ["2–5 days/week", "Mixed session lengths", "Tailored checklist"],
    cta: "Get a Quote",
  },
];

const testimonials = [
  {
    text: "ApartmentMaid is genuinely the best cleaning service I have ever used. My tenants constantly compliment how pristine the units are between occupancies — it has become a true differentiator for my listings.",
    name: "Sarah J.",
    role: "Property Manager",
    seed: "sarah-property-nyc",
  },
  {
    text: "I have tried four other services and none come close. The booking is effortless and my apartment looks better than when I moved in.",
    name: "Marcus R.",
    role: "Busy Professional",
    seed: "marcus-brooklyn-r",
  },
  {
    text: "Helped me get my full security deposit back. The team documented everything with photos. Absolutely professional.",
    name: "Priya K.",
    role: "Landlord",
    seed: "priya-miami-landlord",
  },
];

const blogPosts = [
  {
    category: "Cleaning Tips",
    title: "5 Smart Cleaning Hacks For Busy Renters",
    excerpt: "Discover time-saving tricks that make your daily routine easier and more effective.",
    seed: "cleaning-tips-apartment-bright",
  },
  {
    category: "Guides",
    title: "Choosing The Right Service",
    excerpt: "Not all cleaning services are the same. Here's what to look for when hiring professionals.",
    seed: "apartment-guide-modern",
  },
  {
    category: "Move-In / Out",
    title: "How To Get Your Full Deposit Back",
    excerpt: "A complete checklist to ensure your landlord is impressed, not disappointed.",
    seed: "move-out-checklist-apartment",
  },
];

const footerLinks: Record<string, string[]> = {
  Explore: ["Home", "Book Now", "Services", "About", "Subscriptions", "Blog"],
  Account: ["Log in", "Sign up", "Become a Maid", "Register as Landlord"],
  Locations: ["New York City", "Miami", "Los Angeles", "Manhattan", "Brooklyn"],
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileZipCode, setMobileZipCode] = useState("");

  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileDrawerOpen]);

  useEffect(() => {
    setIntercomContext({
      funnelStage: "homepage_hero",
      currentRoute: "/",
    });
    trackIntercomEvent("quote_started", { source: "homepage_hero" });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  function askHeroQuestion() {
    setIntercomContext({
      funnelStage: "homepage_hero",
      currentRoute: "/",
    });
    trackIntercomEvent("chat_prompt_clicked", { prompt_id: "homepage_hero_manual", route: "/" });
    openIntercomComposer("Hi, I need help choosing the right cleaning service.");
  }

  function openFooterChat() {
    setIntercomContext({
      funnelStage: "footer_contact",
      currentRoute: "/",
    });
    trackIntercomEvent("chat_prompt_clicked", { prompt_id: "footer_chat_manual", route: "/" });
    openIntercomComposer("Hi, I would like to chat with someone about booking a cleaning.");
  }

  function markServicesIntent(planName: string) {
    setIntercomContext({
      funnelStage: "services",
      selectedService: planName,
      currentRoute: "/",
    });
  }

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: T.canvas, color: T.ink }}>
      <style>{heroStyles}</style>

      <Navigation />

      {/* ── Hero — Full-bleed dark with interactive price-reveal card ──────── */}
      <section style={{
        background: T.ink,
        boxSizing:  "border-box",
        minHeight:  "calc(100svh - 66px)",
        display:    "flex",
        alignItems: "stretch",
        position:   "relative",
        overflow:   "hidden",
      }}>
        {/* Full-bleed background image */}
        <div style={{ position: "absolute", inset: 0 }}>
          <Image
            src="/images/hero-3-final.png"
            alt="Professional cleaner at work in a bright apartment"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
          {/* Gradient: deep on left for text legibility, lighter on right */}
          <div style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(to right, rgba(8,20,23,0.70) 0%, rgba(8,20,23,0.65) 38%, rgba(8,20,23,0.45) 62%, rgba(8,20,23,0.50) 100%)",
          }} />
        </div>

        {/* ── Desktop layout ────────────────────────────────────────────── */}
        <div
          className="hidden lg:flex"
          style={{
            maxWidth:   1280,
            margin:     "0 auto",
            width:      "100%",
            padding:    "0 max(5vw, 40px)",
            alignItems: "center",
            gap:        72,
            position:   "relative",
            zIndex:     1,
          }}
        >
          {/* Left: headline + social proof + testimonials */}
          <div style={{ flex: "0 0 50%", maxWidth: "50%", display: "flex", flexDirection: "column", gap: 32, paddingTop: 100 }}>

            <div>
              {/* Eyebrow */}
              <div
                className="hero-eyebrow"
                style={{
                  display:      "inline-flex",
                  alignItems:   "center",
                  gap:          8,
                  background:   "rgba(255,255,255,0.10)",
                  border:       "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 999,
                  padding:      "5px 14px 5px 8px",
                  marginBottom: 28,
                  width:        "fit-content",
                }}
              >
                <div style={{
                  background:    T.primary,
                  borderRadius:  "50%",
                  width:         20,
                  height:        20,
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent:"center",
                  flexShrink:    0,
                }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.80)", letterSpacing: "0.04em" }}>
                  150,000 cleanings delivered
                </span>
              </div>

              {/* Headline */}
              <h1
                className="hero-headline"
                style={{
                  fontSize:      "clamp(38px, 4vw, 60px)",
                  fontWeight:    700,
                  lineHeight:    "1.07",
                  letterSpacing: "-0.035em",
                  color:         "#fff",
                  margin:        "0 0 12px",
                }}
              >
                Your home cleaning<br />
                <span style={{ color: T.accentW }}>made simple</span>
              </h1>

              {/* Instruction line — ties headline to the card */}
              <p
                className="hero-subtext"
                style={{
                  fontSize:   17,
                  lineHeight: "1.65",
                  color:      "rgba(255,255,255,0.68)",
                  margin:     "0 0 44px",
                  maxWidth:   400,
                }}
              >
                Trusted cleaner. Transparent pricing. Book under a minute. If there's any problem with our cleaning, we will re-clean it for free.
              </p>

              {/* Social proof */}
              <div
                className="hero-proof"
                style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", marginBottom: 32 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={14} fill="#E4B44B" color="#E4B44B" strokeWidth={0} />
                    ))}
                  </div>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>4.8</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.50)", marginLeft: 5 }}>on Google</span>
                  </div>
                </div>

                <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: "20px" }}>150k+</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: "16px" }}>cleanings done</div>
                </div>

                <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: "20px" }}>1,460+</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: "16px" }}>vetted pros</div>
                </div>

                <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: "20px" }}>20% cheaper</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: "16px" }}>vs competitors</div>
                </div>
              </div>


              {/* Book Now CTA for returning customers */}
              <button
                onClick={() => document.getElementById("quote-generator")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  display:         "inline-flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  gap:             8,
                  background:      "#155E63",
                  color:           "#fff",
                  border:          "1px solid #155E63",
                  borderRadius:    999,
                  fontSize:        14,
                  fontWeight:      600,
                  padding:         "12px 28px",
                  cursor:          "pointer",
                  letterSpacing:   "-0.01em",
                  transition:      "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background  = "#124A54";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#124A54";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background  = "#155E63";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#155E63";
                }}
              >
                Book now
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={askHeroQuestion}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(252,251,248,0.12)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.32)",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 22px",
                  minHeight: 44,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                }}
              >
                Need help choosing?
              </button>
            </div>

            {/* Testimonial card */}
            {(() => {
              const t = testimonials[0];
              return (
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 16,
                    padding: "20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="#F4B860" color="#F4B860" strokeWidth={0} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p style={{
                    fontSize: 14,
                    lineHeight: "20px",
                    color: "rgba(255,255,255,0.85)",
                    margin: 0,
                    fontWeight: 400,
                  }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Name */}
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: "18px",
                  }}>
                    {t.name}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right: floating interactive quote card */}
          <div
            className="hero-card"
            style={{ flex: "1 1 0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 16 }}
          >
            <HeroInteractiveQuote />
          </div>
        </div>

        {/* ── Mobile layout (stacked, left-aligned, high-end editorial) ─────── */}
        <div
          className="flex lg:hidden"
          style={{
            flexDirection:  "column",
            alignItems:     "flex-start",
            justifyContent: "center",
            padding:        "72px 24px 80px",
            position:       "relative",
            zIndex:         1,
            width:          "100%",
            minHeight:      "calc(100svh - 66px)",
            background:     "linear-gradient(to bottom, rgba(8,20,23,0.88) 0%, rgba(8,20,23,0.65) 45%, rgba(8,20,23,0.88) 100%)",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          6,
              background:   "rgba(255,255,255,0.08)",
              border:       "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              padding:      "4px 10px 4px 6px",
              marginBottom: 18,
            }}
          >
            <div style={{
              background:    T.primary,
              borderRadius:  "50%",
              width:         16,
              height:        16,
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
            }}>
              <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>
              150k+ cleanings delivered
            </span>
          </div>

          {/* Mobile headline */}
          <div style={{ textAlign: "left", marginBottom: 28, width: "100%" }}>
            <h1
              className="hero-headline"
              style={{
                fontSize:      "clamp(34px, 8.5vw, 44px)",
                fontWeight:    700,
                lineHeight:    "1.06",
                letterSpacing: "-0.035em",
                color:         "#fff",
                margin:        "0 0 16px",
              }}
            >
              Your home cleaning<br />
              <span style={{ color: T.accentW }}>made simple</span>
            </h1>
            <p
              className="hero-subtext"
              style={{
                fontSize:   15,
                lineHeight: "1.55",
                color:      "rgba(255,255,255,0.72)",
                margin:     "0 0 24px",
                maxWidth:   340,
              }}
            >
              Trusted cleaner. Transparent pricing. Book under a minute. If there's any problem with our cleaning, we will re-clean it for free.
            </p>
          </div>
 
          {/* Mobile ZIP code action bar */}
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              display: "flex",
              flexDirection: "row",
              background: "#FCFBF8",
              borderRadius: 999,
              padding: "4px",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
              marginBottom: 16,
            }}
          >
            <input
              type="text"
              placeholder="Enter ZIP code"
              value={mobileZipCode}
              onChange={(e) => setMobileZipCode(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "12px 18px",
                color: T.ink,
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "inherit",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsMobileDrawerOpen(true);
                }
              }}
            />
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              style={{
                background: T.primary,
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "0 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "background 0.2s ease",
              }}
            >
              Get Price
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* Unified Double-Bezel Proof & Review Card */}
          {(() => {
            const t = testimonials[0];
            return (
              <div
                style={{
                  width: "100%",
                  maxWidth: 380,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 24,
                  padding: 6,
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div
                  style={{
                    background: "rgba(20, 20, 20, 0.45)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: 18,
                    padding: 18,
                  }}
                >
                  {/* Stats Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px 12px",
                    }}
                  >
                    {/* Google reviews */}
                    <div>
                      <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} size={10} fill="#E4B44B" color="#E4B44B" strokeWidth={0} />
                        ))}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: "1.2" }}>4.8 Rating</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>on Google</div>
                    </div>

                    {/* Cleanings */}
                    <div>
                      <div style={{ height: 14 }} /> {/* alignment offset */}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: "1.2" }}>150k+</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>cleanings done</div>
                    </div>

                    {/* Pros */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: "1.2" }}>1,460+</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>vetted pros</div>
                    </div>

                    {/* Cost */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: "1.2" }}>20% cheaper</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>vs competitors</div>
                    </div>
                  </div>

                  {/* Hairline Divider */}
                  <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", margin: "16px 0" }} />

                  {/* Testimonial Quote */}
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: "18px",
                        color: "rgba(255,255,255,0.80)",
                        margin: "0 0 12px",
                        fontWeight: 400,
                        fontStyle: "italic",
                      }}
                    >
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: "1" }}>
                      {t.name}
                      <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 400, marginLeft: 6 }}>
                        {t.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── Partner logo strip ────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "28px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
            Trusted by tenants at
          </span>
          {partners.map((partner) => (
            <span key={partner} style={{ fontSize: 16, fontWeight: 700, color: T.muted, letterSpacing: "-0.02em", fontStyle: "italic" }}>
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* ── Services grid — "Our Sparkling Touch" ─────────────────────────── */}
      <section style={{ padding: "88px 32px" }}>
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

          {/* Cards - Bento list on mobile, standard grid on desktop */}
          <div
            className="flex flex-col lg:grid lg:grid-cols-4 gap-4"
            style={{ width: "100%" }}
          >
            {services.map((svc) => (
              <div key={svc.num} className="group relative">
                {/* Mobile horizontal card layout */}
                <div
                  className="flex lg:hidden"
                  style={{
                    background: "#FCFBF8",
                    border: `1.5px solid ${T.border}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    height: 124,
                    width: "100%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* Left: Text Content */}
                  <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.primary, letterSpacing: "0.06em", marginBottom: 2, textTransform: "uppercase" }}>
                        SERVICE {svc.num}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, lineHeight: "18px", marginBottom: 4 }}>
                        {svc.title}
                      </div>
                      <div style={{ fontSize: 12, color: T.body, lineHeight: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {svc.description}
                      </div>
                    </div>
                    
                    {/* Price / Action */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <span style={{ color: T.body }}>Starting at</span>
                      <span style={{ fontWeight: 700, color: T.primary }}>{svc.price}{svc.period}</span>
                    </div>
                  </div>

                  {/* Right: Cropped Image with gradient fade */}
                  <div style={{ width: "30%", minWidth: 90, position: "relative", height: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${svc.seed}/200/200`}
                      alt={svc.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: "12px",
                      background: "linear-gradient(to right, #FCFBF8 0%, rgba(252,251,248,0) 100%)",
                    }} />
                  </div>
                </div>

                {/* Desktop vertical card layout */}
                <div
                  className="hidden lg:block"
                  style={{
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    aspectRatio: "3/4",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    const current = e.currentTarget as HTMLElement;
                    current.style.transform = "translateY(-6px)";
                    current.style.boxShadow = "0 16px 32px rgba(0,0,0,0.16)";
                  }}
                  onMouseLeave={(e) => {
                    const current = e.currentTarget as HTMLElement;
                    current.style.transform = "translateY(0)";
                    current.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${svc.seed}/300/400`}
                    alt={svc.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {/* Dark overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.9) 100%)",
                  }} />

                  {/* Top badge with service number */}
                  <div style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.05em",
                  }}>
                    SERVICE {svc.num}
                  </div>

                  {/* Bottom content container */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Title */}
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: "22px", marginBottom: 6 }}>
                        {svc.title}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)", fontWeight: 400, lineHeight: "18px" }}>
                        {svc.description}
                      </div>
                    </div>

                    {/* Pricing card */}
                    <div style={{
                      background: T.accentW,
                      borderRadius: 12,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 8,
                    }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: T.body, lineHeight: "14px", marginBottom: 2 }}>
                          Starting at
                        </div>
                        <div style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: T.ink,
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}>
                          {svc.price}
                          <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 4 }}>
                            {svc.period}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        background: T.primary,
                        color: "#fff",
                        flexShrink: 0,
                        transition: "transform 0.2s ease",
                      }}
                      className="group-hover:scale-110"
                      >
                        <ArrowUpRight
                          size={18}
                          strokeWidth={2.5}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA tile - Mobile Horizontal Row */}
            <div
              className="flex lg:hidden group"
              style={{
                borderRadius: 16,
                background: T.accentW,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1.5px solid rgba(0,0,0,0.05)",
                marginTop: 4,
              }}
            >
              <p style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.ink,
                lineHeight: "18px",
                margin: 0,
              }}>
                Explore 20+ other cleanings we offer
              </p>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: T.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <ArrowUpRight
                  size={16}
                  color="#fff"
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>

            {/* CTA tile - Desktop Vertical Card */}
            <div
              className="hidden lg:flex group"
              style={{
                borderRadius: 16,
                background: T.accentW,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: "3/4",
                padding: 24,
                gap: 20,
                cursor: "pointer",
              }}
            >
              <p style={{
                fontSize: 17,
                fontWeight: 700,
                color: T.ink,
                lineHeight: "24px",
                textAlign: "center",
                margin: 0,
              }}>
                20+ Services You Can Explore
              </p>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: T.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <ArrowUpRight
                  size={18}
                  color="#fff"
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature split — "Bringing Shine And Comfort" ──────────────────── */}
      <section style={{ background: T.soft, padding: "88px 32px" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          {/* Left */}
          <div>
            <h2 style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 700,
              lineHeight: "1.15",
              letterSpacing: "-0.03em",
              color: T.ink,
              margin: "0 0 20px",
            }}>
              Bringing Shine And Comfort<br />
              To Every{" "}
              <em style={{ fontStyle: "italic", color: T.primary }}>Space</em>
            </h2>
            <p style={{ fontSize: 16, lineHeight: "26px", color: T.body, margin: "0 0 32px", maxWidth: 480 }}>
              Manage your team&apos;s workflow in real time — all in one place. Book cleanings,
              track progress reports, and get live analytics so you can move fast and stay in control.
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {featurePoints.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
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
                  <span style={{ fontSize: 14, lineHeight: "22px", color: T.ink }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Mini stat bubbles */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {featureStats.map((s) => (
                <div key={s.label} style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "12px 20px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: T.ink, lineHeight: "28px", letterSpacing: "-0.04em" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: T.body, lineHeight: "18px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.10)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/professional-cleaner-apartment-bright/480/560"
                alt="Professional cleaner at work in a bright apartment"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            {/* Floating contact chip */}
            <div style={{
              position: "absolute",
              bottom: 24,
              left: -20,
              background: T.surface,
              borderRadius: 12,
              padding: "14px 18px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: T.accentS,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Phone size={14} color={T.primary} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.body, lineHeight: "16px" }}>Call us anytime</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, lineHeight: "20px" }}>+1 (877) 990-5625</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: T.canvas, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.primary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
              How It Works
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              fontWeight: 700,
              lineHeight: "1.1",
              color: T.ink,
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              Spotless in 3 steps.
            </h2>
          </div>

          <div>
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="grid grid-cols-1 md:grid-cols-[96px_1fr]"
                style={{
                  gap: "12px 48px",
                  padding: "40px 0",
                  borderTop: `1px solid ${T.border}`,
                  alignItems: "start",
                  ...(i === steps.length - 1 ? { borderBottom: `1px solid ${T.border}` } : {}),
                }}
              >
                <div style={{
                  fontSize: "clamp(48px, 5vw, 72px)",
                  fontWeight: 700,
                  lineHeight: "1",
                  color: T.primary,
                  letterSpacing: "-0.05em",
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{
                    fontSize: "clamp(18px, 2vw, 26px)",
                    fontWeight: 700,
                    lineHeight: "1.2",
                    color: T.ink,
                    margin: "0 0 10px",
                    letterSpacing: "-0.02em",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: "25px", color: T.body, margin: 0, maxWidth: 520 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscriptions ────────────────────────────────────────────────── */}
      <section style={{ background: T.soft, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Header */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end"
            style={{ marginBottom: 44 }}
          >
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.primary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
                Subscriptions
              </p>
              <h2 style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 700,
                lineHeight: "1.1",
                letterSpacing: "-0.03em",
                color: T.ink,
                margin: 0,
              }}>
                Plans That Fit Your Life
              </h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: "24px", color: T.body, maxWidth: 340, margin: 0 }}>
              Save more the more you book. Pause or cancel anytime — no contracts, no fine print.
            </p>
          </div>

          {/* Bento grid — featured Weekly left (2×2), four side plans right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr]" style={{ gap: 16 }}>

            {/* Featured — Weekly */}
            <div
              className="lg:col-span-2 lg:row-span-2 group teal-shimmer-container"
              style={{
                borderRadius: 24,
                background: "linear-gradient(135deg, rgba(52, 181, 164, 0.25) 0%, rgba(21, 94, 99, 0.2) 50%, rgba(52, 181, 164, 0.05) 100%)",
                border: "1px solid rgba(52, 181, 164, 0.25)",
                padding: 3,
                boxShadow: "0 24px 64px rgba(21,94,99,0.24)",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "stretch",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "0 32px 72px rgba(52, 181, 164, 0.18), 0 24px 64px rgba(21, 94, 99, 0.35)";
                el.style.borderColor = "rgba(52, 181, 164, 0.8)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 24px 64px rgba(21,94,99,0.24)";
                el.style.borderColor = "rgba(52, 181, 164, 0.25)";
              }}
            >
              {/* Ambient Glow Orb */}
              <div
                className="animate-ambient-glow"
                style={{
                  position: "absolute",
                  bottom: "-15%",
                  right: "-15%",
                  width: 260,
                  height: 260,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(52, 181, 164, 0.18) 0%, rgba(52, 181, 164, 0) 70%)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              <div style={{
                borderRadius: 21,
                background: "#0e4247",
                padding: "36px 32px",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                position: "relative",
                zIndex: 2,
              }}>
                {/* Top */}
                <div>
                  <span 
                    className="animate-teal-breath"
                    style={{
                      display: "inline-block",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: T.ink,
                      background: T.accentW,
                      padding: "5px 14px",
                      borderRadius: 999,
                      marginBottom: 32,
                    }}
                  >
                    {featuredPlan.badge}
                  </span>

                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em", marginBottom: 10 }}>
                    {featuredPlan.name}
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "clamp(52px, 5vw, 72px)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#fff" }}>
                      {featuredPlan.price}
                    </span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.40)", marginRight: 4 }}>{featuredPlan.period}</span>
                    
                    {/* Struck-through base price */}
                    <span style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.35)",
                      textDecoration: "line-through",
                      marginRight: 6,
                    }}>
                      $149
                    </span>

                    <span style={{
                      display: "inline-block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: T.accentW,
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}>
                      {featuredPlan.savings}
                    </span>
                  </div>

                  <p style={{ fontSize: 15, lineHeight: "24px", color: "rgba(255,255,255,0.55)", margin: "0 0 32px", maxWidth: 320 }}>
                    {featuredPlan.description}
                  </p>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 28 }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {featuredPlan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <Check size={11} color={T.accentW} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: "22px" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a href="#quote-generator" onMouseEnter={() => markServicesIntent(featuredPlan.name)} onFocus={() => markServicesIntent(featuredPlan.name)} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 36,
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "14px 28px",
                  borderRadius: 999,
                  textDecoration: "none",
                  background: T.accentW,
                  color: T.ink,
                  width: "fit-content",
                }}>
                  {featuredPlan.cta}
                  <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

             {/* Four side plans */}
             {sidePlans.map((plan) => {
               const isCustom = plan.name === "Custom";
               if (isCustom) {
                 return (
                   <div
                     key={plan.name}
                     className="group premium-shimmer-container"
                     style={{
                       borderRadius: 24,
                       background: "linear-gradient(135deg, rgba(217, 199, 163, 0.22) 0%, rgba(22, 48, 55, 0.2) 50%, rgba(217, 199, 163, 0.05) 100%)",
                       border: "1px solid rgba(217, 199, 163, 0.25)",
                       padding: 3,
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "stretch",
                       transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                       cursor: "pointer",
                       boxShadow: "0 12px 32px rgba(22, 48, 55, 0.15)",
                       position: "relative",
                       overflow: "hidden",
                     }}
                     onMouseEnter={(e) => {
                       const el = e.currentTarget as HTMLElement;
                       el.style.transform = "translateY(-6px)";
                       el.style.boxShadow = "0 20px 40px rgba(217, 199, 163, 0.18), 0 12px 32px rgba(22, 48, 55, 0.3)";
                       el.style.borderColor = "rgba(217, 199, 163, 0.8)";
                     }}
                     onMouseLeave={(e) => {
                       const el = e.currentTarget as HTMLElement;
                       el.style.transform = "translateY(0)";
                       el.style.boxShadow = "0 12px 32px rgba(22, 48, 55, 0.15)";
                       el.style.borderColor = "rgba(217, 199, 163, 0.25)";
                     }}
                   >
                     {/* Ambient Glow Orb */}
                     <div
                       className="animate-ambient-glow"
                       style={{
                         position: "absolute",
                         bottom: "-20%",
                         right: "-20%",
                         width: 180,
                         height: 180,
                         borderRadius: "50%",
                         background: "radial-gradient(circle, rgba(217, 199, 163, 0.18) 0%, rgba(217, 199, 163, 0) 70%)",
                         pointerEvents: "none",
                         zIndex: 1,
                       }}
                     />

                     {/* Inner Core */}
                     <div style={{
                       borderRadius: 21,
                       background: "#163037",
                       padding: "24px 22px",
                       height: "100%",
                       width: "100%",
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "space-between",
                       boxSizing: "border-box",
                       boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                       position: "relative",
                       zIndex: 2,
                     }}>
                       <div>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                           <div style={{ fontSize: 12, fontWeight: 600, color: "#D9C7A3", letterSpacing: "0.04em" }}>
                             {plan.name}
                           </div>
                           <span 
                             className="animate-gold-breath"
                             style={{
                               fontSize: 9,
                               fontWeight: 700,
                               letterSpacing: "0.08em",
                               color: T.ink,
                               background: "#D9C7A3",
                               padding: "3px 8px",
                               borderRadius: 999,
                               textTransform: "uppercase",
                               display: "inline-block",
                             }}
                           >
                             Flagship
                           </span>
                         </div>

                         <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                           <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#fff" }}>
                             {plan.price}
                           </span>
                           <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>
                         </div>

                         {plan.savings && (
                           <div style={{
                             display: "inline-block",
                             fontSize: 11,
                             fontWeight: 600,
                             color: "#D9C7A3",
                             background: "rgba(217, 199, 163, 0.12)",
                             border: "1px solid rgba(217, 199, 163, 0.2)",
                             padding: "3px 10px",
                             borderRadius: 999,
                             marginBottom: 12,
                             width: "fit-content",
                           }}>
                             {plan.savings}
                           </div>
                         )}

                         <p style={{ fontSize: 13, lineHeight: "20px", color: "rgba(255,255,255,0.6)", margin: "0 0 18px" }}>
                           {plan.description}
                         </p>

                         <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />

                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                           {plan.features.map((f) => (
                             <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                               <div style={{
                                 width: 16,
                                 height: 16,
                                 borderRadius: "50%",
                                 background: "rgba(217, 199, 163, 0.15)",
                                 border: "1px solid rgba(217, 199, 163, 0.2)",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 flexShrink: 0,
                               }}>
                                 <Check size={9} color="#D9C7A3" strokeWidth={2.5} />
                               </div>
                               <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: "20px" }}>{f}</span>
                             </div>
                           ))}
                         </div>
                       </div>

                       <a href="#quote-generator" onMouseEnter={() => markServicesIntent(plan.name)} onFocus={() => markServicesIntent(plan.name)} style={{
                         display: "inline-flex",
                         alignItems: "center",
                         gap: 6,
                         marginTop: 22,
                         fontSize: 13,
                         fontWeight: 600,
                         color: "#D9C7A3",
                         textDecoration: "none",
                       }}>
                         {plan.cta}
                         <ArrowRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                       </a>
                     </div>
                   </div>
                 );
               }

               return (
                 <div
                   key={plan.name}
                   className="group"
                   style={{
                     borderRadius: 16,
                     background: T.surface,
                     border: `1px solid ${T.border}`,
                     padding: "24px 22px",
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "space-between",
                     transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                     cursor: "pointer",
                   }}
                   onMouseEnter={(e) => {
                     const el = e.currentTarget as HTMLElement;
                     el.style.transform = "translateY(-6px)";
                     el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
                     el.style.borderColor = T.primary;
                   }}
                   onMouseLeave={(e) => {
                     const el = e.currentTarget as HTMLElement;
                     el.style.transform = "translateY(0)";
                     el.style.boxShadow = "none";
                     el.style.borderColor = T.border;
                   }}
                 >
                   <div>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                       <div style={{ fontSize: 12, fontWeight: 600, color: T.body, letterSpacing: "0.04em" }}>
                         {plan.name}
                       </div>
                     </div>

                     <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: plan.savings ? 6 : 12, flexWrap: "wrap" }}>
                       <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: T.ink }}>
                         {plan.price}
                       </span>
                       <span style={{ fontSize: 12, color: T.muted, marginRight: plan.savings ? 6 : 0 }}>{plan.period}</span>
                       
                       {/* Struck-through base price for Monthly/Biweekly */}
                       {plan.savings && (
                         <span style={{
                           fontSize: 16,
                           fontWeight: 600,
                           color: T.muted,
                           textDecoration: "line-through",
                         }}>
                           $149
                         </span>
                       )}
                     </div>
 
                     {plan.savings && (
                       <div style={{
                         display: "inline-block",
                         fontSize: 11,
                         fontWeight: 600,
                         color: T.primary,
                         background: "rgba(21, 94, 99, 0.08)",
                         border: "1px solid rgba(21, 94, 99, 0.12)",
                         padding: "3px 10px",
                         borderRadius: 999,
                         marginBottom: 12,
                         width: "fit-content",
                       }}>
                         {plan.savings}
                       </div>
                     )}
                     <p style={{ fontSize: 13, lineHeight: "20px", color: T.body, margin: "0 0 18px" }}>
                       {plan.description}
                     </p>
                     <div style={{ height: 1, background: T.border, marginBottom: 16 }} />
                     <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                       {plan.features.map((f) => (
                         <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                           <div style={{
                             width: 16,
                             height: 16,
                             borderRadius: "50%",
                             background: T.accentS,
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             flexShrink: 0,
                           }}>
                             <Check size={9} color={T.primary} strokeWidth={2.5} />
                           </div>
                           <span style={{ fontSize: 13, color: T.ink, lineHeight: "20px" }}>{f}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                   <a href="#quote-generator" onMouseEnter={() => markServicesIntent(plan.name)} onFocus={() => markServicesIntent(plan.name)} style={{
                     display: "inline-flex",
                     alignItems: "center",
                     gap: 6,
                     marginTop: 22,
                     fontSize: 13,
                     fontWeight: 600,
                     color: T.primary,
                     textDecoration: "none",
                   }}>
                     {plan.cta}
                     <ArrowRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                   </a>
                 </div>
               );
             })}
          </div>

          <p style={{ fontSize: 13, color: T.muted, marginTop: 28 }}>
            All plans include eco-friendly supplies and a vetted professional. Pause or cancel anytime.
          </p>
        </div>
      </section>

      {/* ── Live Quote Generator ─────────────────────────────────────────── */}
      <QuoteGenerator />

      {/* ── Testimonials (Carousel) ───────────────────────────────────────── */}
      <section style={{ background: T.soft, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end"
            style={{ marginBottom: 44 }}
          >
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.primary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
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
                Hear From Our Happy Customers
              </h2>
            </div>
            <a href="#" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: T.primary,
              textDecoration: "none",
            }}>
              View all reviews
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>

          {/* Rotating testimonial card */}
          {(() => {
            const t = testimonials[currentTestimonial];
            return (
              <div style={{
                background: T.primary,
                borderRadius: 20,
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 280,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(21,94,99,0.20)",
              }}>
                {/* Decorative accent */}
                <div style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Rating */}
                  <div style={{ display: "flex", gap: 3, marginBottom: 28, alignItems: "center" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} style={{ color: T.accentW, fill: T.accentW }} />
                    ))}
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.50)", marginLeft: 8 }}>
                      5.0 Rating
                    </span>
                  </div>

                  {/* Quote */}
                  <p style={{
                    fontSize: 19,
                    lineHeight: "32px",
                    color: "rgba(255,255,255,0.95)",
                    margin: "0 0 40px",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${t.seed}/56/56`}
                      alt={t.name}
                      style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.20)" }}
                    />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: "20px" }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: "18px" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Carousel indicators */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                style={{
                  width: i === currentTestimonial ? 32 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: i === currentTestimonial ? T.primary : T.border,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ──────────────────────────────────────────────────────────── */}
      <section style={{ background: T.canvas, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center"
            style={{ marginBottom: 44 }}
          >
            <h2 style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              fontWeight: 700,
              lineHeight: "1.1",
              color: T.ink,
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              Our Latest Blog
            </h2>
            <a href="#" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: T.primary,
              textDecoration: "none",
            }}>
              View all posts
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
            {blogPosts.map((post) => (
              <a key={post.title} href="#" style={{ textDecoration: "none", display: "block" }}>
                <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${post.seed}/420/240`}
                    alt={post.title}
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  />
                </div>
                <span style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.primary,
                  background: T.accentS,
                  padding: "4px 10px",
                  borderRadius: 999,
                  marginBottom: 10,
                  letterSpacing: "0.04em",
                }}>
                  {post.category}
                </span>
                <h3 style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: T.ink,
                  lineHeight: "24px",
                  letterSpacing: "-0.02em",
                  margin: "0 0 8px",
                }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: "22px", color: T.body, margin: "0 0 14px" }}>
                  {post.excerpt}
                </p>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.primary,
                }}>
                  Learn More
                  <ArrowUpRight size={13} strokeWidth={2.5} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA band ─────────────────────────────────────────────────── */}
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
            <p style={{ fontSize: 16, lineHeight: "26px", color: "rgba(255,255,255,0.50)", margin: "14px 0 0" }}>
              Serving NYC, Miami, and Los Angeles. Same-day availability.
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
            <a href="mailto:booking@apartmentmaid.co" style={{
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
              <Mail size={14} />
              Email Us
            </a>
            <button
              onClick={openFooterChat}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: "transparent",
                padding: "14px 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.20)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              <MessageSquare size={14} />
              Chat with Us
            </button>
            <a href="#quote-generator" style={{
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

            {Object.entries(footerLinks).map(([heading, links]) => (
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

      {/* ── Mobile Bottom Sheet Drawer ─────────────────────────────────── */}
      {isMobileDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            animation: "fadeIn 0.25s ease-out both",
          }}
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUpDrawer {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
          <div
            style={{
              background: "#FCFBF8",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "24px 20px 40px",
              boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.15)",
              animation: "slideUpDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grabber handle */}
            <div
              style={{
                width: 48,
                height: 5,
                background: "#E5DFD3",
                borderRadius: 999,
                margin: "0 auto 20px",
              }}
            />

            {/* Close Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#F7F5F1",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#1F2937",
                zIndex: 10,
              }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Mobile-adapted Quote Component */}
            <HeroInteractiveQuote
              initialZipCode={mobileZipCode}
              onZipCodeChange={setMobileZipCode}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

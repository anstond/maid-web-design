import {
  Leaf,
  Users,
  CalendarCheck,
  ArrowRight,
  Star,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  primary:   "#155E63",
  primaryH:  "#124A54",
  accentW:   "#D9C7A3",
  accentS:   "#EFE6D3",
  ink:       "#1F2937",
  body:      "#6B7280",
  muted:     "#B8C0C2",
  canvas:    "#FCFBF8",
  surface:   "#FFFFFF",
  soft:      "#F7F5F1",
  border:    "#E5DFD3",
  onPrimary: "#FFFFFF",
};

// ─── Content ──────────────────────────────────────────────────────────────────
const heroBadges = [
  { icon: <Leaf size={13} />,          label: "Eco-Friendly Products"   },
  { icon: <Users size={13} />,         label: "Trained Professionals"   },
  { icon: <CalendarCheck size={13} />, label: "Flexible Scheduling"     },
];

const partners = [
  "Zillow", "StreetEasy", "Apartments.com", "CoStar", "Zumper", "Avail",
];

const services = [
  { num: "01", title: "Commercial Cleaning",  seed: "commercial-office-bright"     },
  { num: "02", title: "Regular Cleaning",     seed: "apartment-clean-living-room"  },
  { num: "03", title: "Kitchen Cleaning",     seed: "kitchen-spotless-modern"      },
  { num: "04", title: "Move-In / Out",        seed: "empty-bright-apartment-clean" },
];

const featurePoints = [
  "Multi-stage background checks on every pro",
  "ISO-certified protocols, every single visit",
  "Same-day booking available nationwide",
  "Precise 1-hour arrival window guaranteed",
  "100% satisfaction or we return at no cost",
];

const featureStats = [
  { value: "150k+",  label: "Cleanings done"     },
  { value: "4.8★",   label: "Average rating"     },
  { value: "1,460+", label: "Vetted pros"         },
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
    text: "ApartmentMaid is genuinely the best cleaning service I have ever used. My tenants constantly compliment how pristine the units are between occupancies — it has become a true differentiator for my listings.",
    name: "Sarah J.",
    role: "Property Manager",
    location: "New York City",
    seed: "sarah-property-nyc",
    featured: true,
  },
  {
    text: "I have tried four other services and none come close. The booking is effortless and my apartment looks better than when I moved in.",
    name: "Marcus R.",
    role: "Busy Professional",
    location: "Brooklyn",
    seed: "marcus-brooklyn-r",
    featured: false,
  },
  {
    text: "Helped me get my full security deposit back. The team documented everything with photos. Absolutely professional.",
    name: "Priya K.",
    role: "Landlord",
    location: "Miami",
    seed: "priya-miami-landlord",
    featured: false,
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
  Explore:   ["Home", "Book Now", "Services", "About", "Subscriptions", "Blog"],
  Account:   ["Log in", "Sign up", "Become a Maid", "Register as Landlord"],
  Locations: ["New York City", "Miami", "Los Angeles", "Manhattan", "Brooklyn"],
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: "var(--font-sans)", background: T.canvas, color: T.ink }}>

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
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
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
          </a>

          <div className="hidden lg:flex" style={{ alignItems: "center", gap: 2 }}>
            {[
              { label: "Home",          active: true  },
              { label: "Services",      active: false },
              { label: "About Us",      active: false },
              { label: "Subscriptions", active: false },
              { label: "Blog",          active: false },
            ].map(({ label, active }) => (
              <a key={label} href="#" style={{
                fontSize: 14,
                fontWeight: 500,
                color: active ? T.ink : T.body,
                textDecoration: "none",
                padding: "7px 14px",
                borderRadius: 999,
                background: active ? T.soft : "transparent",
              }}>
                {label}
              </a>
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
              Contact Us
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ background: T.canvas, padding: "72px 32px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Text block — centered */}
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 56px" }}>
            <p style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.primary,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Professional Home Cleaning
            </p>
            <h1 style={{
              fontSize: "clamp(40px, 5.5vw, 68px)",
              fontWeight: 700,
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              color: T.ink,
              margin: "0 0 20px",
            }}>
              Creating Comfort<br />
              Through{" "}
              <em style={{
                fontStyle: "italic",
                color: T.primary,
                fontWeight: 700,
              }}>
                Cleanliness
              </em>
            </h1>
            <p style={{
              fontSize: 17,
              lineHeight: "27px",
              color: T.body,
              margin: "0 0 32px",
            }}>
              From homes to offices — we bring spotless perfection and peace of mind
              through trusted, professional cleaning services.
            </p>
            <a href="#" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.ink,
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              padding: "13px 26px",
              borderRadius: 999,
              textDecoration: "none",
            }}>
              <CalendarCheck size={15} />
              Book a Cleaning
            </a>
          </div>

          {/* Visual stage */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end", minHeight: 420 }}>

            {/* Teal arc / circle behind figure */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background: T.primary,
            }} />

            {/* Cleaning professional image */}
            <div style={{
              position: "relative",
              zIndex: 2,
              width: 340,
              height: 440,
              borderRadius: "200px 200px 0 0",
              overflow: "hidden",
              flexShrink: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/apartment-cleaning-professional/340/440"
                alt="Professional cleaner"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Floating badge — left */}
            <div style={{
              position: "absolute",
              bottom: "30%",
              left: "calc(50% - 260px)",
              background: T.surface,
              borderRadius: 999,
              padding: "8px 16px 8px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
              zIndex: 3,
            }}>
              {/* Avatars */}
              <div style={{ display: "flex" }}>
                {["seed-a1", "seed-b2", "seed-c3"].map((s, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={s}
                    src={`https://picsum.photos/seed/${s}/28/28`}
                    alt=""
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `2px solid ${T.surface}`,
                      marginLeft: i > 0 ? -8 : 0,
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: "18px" }}>250+</div>
                <div style={{ fontSize: 11, color: T.body, lineHeight: "15px" }}>Happy Customers</div>
              </div>
            </div>

            {/* Floating feature badges — right */}
            <div style={{
              position: "absolute",
              top: "10%",
              right: "calc(50% - 300px)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              zIndex: 3,
            }}>
              {heroBadges.map((b) => (
                <div key={b.label} style={{
                  background: T.surface,
                  borderRadius: 999,
                  padding: "9px 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.09)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink,
                  whiteSpace: "nowrap",
                }}>
                  <span style={{ color: T.primary }}>{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner logo strip ────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "28px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
            Trusted by tenants at
          </span>
          {partners.map((p) => (
            <span key={p} style={{ fontSize: 16, fontWeight: 700, color: T.muted, letterSpacing: "-0.02em", fontStyle: "italic" }}>
              {p}
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

          {/* Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5" style={{ gap: 12 }}>
            {services.map((svc) => (
              <div
                key={svc.num}
                className="col-span-1"
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: "3/4",
                  cursor: "pointer",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${svc.seed}/300/400`}
                  alt={svc.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Overlay gradient */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)",
                }} />
                {/* Text */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 4 }}>
                    {svc.num}/
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: "20px" }}>
                    {svc.title}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA tile */}
            <div style={{
              borderRadius: 16,
              background: T.accentW,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: "3/4",
              padding: 24,
              gap: 20,
              cursor: "pointer",
            }}>
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
                <ArrowUpRight size={18} color="#fff" strokeWidth={2.5} />
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
      <section style={{ background: T.canvas, padding: "88px 32px" }}>
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

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
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
            <p style={{ fontSize: 14, lineHeight: "22px", color: T.body, maxWidth: 300, margin: 0 }}>
              Real stories from satisfied customers who experienced exceptional cleaning and reliable service.
            </p>
          </div>

          {/* Featured quote + side cards */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

            {/* Featured */}
            {(() => {
              const t = testimonials[0];
              return (
                <div style={{
                  background: T.primary,
                  borderRadius: 20,
                  padding: "40px 40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 280,
                }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 24 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} style={{ color: T.accentW, fill: T.accentW }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: 18,
                    lineHeight: "30px",
                    color: "rgba(255,255,255,0.92)",
                    flex: 1,
                    margin: "0 0 32px",
                    fontWeight: 400,
                  }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${t.seed}/48/48`}
                      alt={t.name}
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.25)" }}
                    />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: "20px" }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", lineHeight: "18px" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Two side cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {testimonials.slice(1).map((t) => (
                <div key={t.name} style={{
                  background: T.surface,
                  borderRadius: 16,
                  padding: 24,
                  border: `1px solid ${T.border}`,
                  flex: 1,
                }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: "22px", color: T.ink, margin: "0 0 16px" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${t.seed}/40/40`}
                      alt={t.name}
                      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, lineHeight: "18px" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: T.body, lineHeight: "16px" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              © 2026 MAID. All rights reserved.
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

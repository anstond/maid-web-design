import { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "About Apartment Maid | Professional Cleaning NYC & Miami",
  description:
    "Apartment Maid is a professional apartment cleaning service founded in 2020, operating in NYC and Miami. 150,000+ cleanings completed, 1,460+ vetted professionals, 4.8★ average rating.",
  alternates: {
    canonical: "https://apartmentmaid.co/about",
  },
};

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

export default function AboutPage() {
  return (
    <div
      style={{
        background: T.canvas,
        color: T.ink,
        fontFamily: "var(--font-outfit), system-ui, sans-serif",
      }}
      className="min-h-screen flex flex-col selection:bg-[#155E63]/10 selection:text-[#155E63]"
    >
      <Navigation />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://apartmentmaid.co/#organization",
                "name": "Apartment Maid",
                "url": "https://apartmentmaid.co",
                "foundingDate": "2020",
                "description":
                  "Apartment Maid is a professional apartment cleaning service founded in 2020, currently operating in New York City and Miami. The platform has processed over 150,000 apartment cleanings with 1,460+ vetted professionals and a 4.8-star average rating.",
              },
              {
                "@type": "Person",
                "@id": "https://apartmentmaid.co/about/#founder",
                "name": "Isaac Rabinowitsch",
                "jobTitle": "Founder",
                "worksFor": {
                  "@id": "https://apartmentmaid.co/#organization",
                },
                "url": "https://apartmentmaid.co/about",
              },
            ],
          }),
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeInUp 0.8s cubic-bezier(0.32, 0.72, 0, 1) both;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `,
        }}
      />

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(21,94,99,0.05),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#155E63] bg-[#155E63]/5 animate-fade-up">
              <Sparkles size={12} />
              About Apartment Maid
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1F2937] leading-[1.1] animate-fade-up delay-100">
              We make apartment cleaning <br />
              <span className="text-[#155E63] relative inline-block">
                completely seamless.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto animate-fade-up delay-200">
              Founded in 2020, Apartment Maid is a premium apartment cleaning
              service operating in NYC and Miami. We combine cutting-edge technology
              with highly vetted professionals to elevate urban living.
            </p>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16 md:mt-24 animate-fade-up delay-300">
            {/* Stat 1 */}
            <div className="bg-[#155E63]/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:border-[#155E63]/30 transition-all duration-500">
              <div className="bg-white p-8 rounded-[16px] shadow-sm text-center">
                <span className="block text-4xl md:text-5xl font-extrabold text-[#1F2937] tracking-tight">
                  150,000+
                </span>
                <span className="block text-sm font-semibold uppercase tracking-wider text-[#155E63] mt-2">
                  Cleanings Completed
                </span>
                <p className="text-xs text-[#6B7280] mt-3">
                  Trusted by thousands of residents in major metropolises.
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#155E63]/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:border-[#155E63]/30 transition-all duration-500">
              <div className="bg-white p-8 rounded-[16px] shadow-sm text-center">
                <span className="block text-4xl md:text-5xl font-extrabold text-[#1F2937] tracking-tight">
                  1,460+
                </span>
                <span className="block text-sm font-semibold uppercase tracking-wider text-[#155E63] mt-2">
                  Vetted Professionals
                </span>
                <p className="text-xs text-[#6B7280] mt-3">
                  Background-checked and trained specialists.
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#155E63]/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:border-[#155E63]/30 transition-all duration-500">
              <div className="bg-white p-8 rounded-[16px] shadow-sm text-center">
                <span className="block text-4xl md:text-5xl font-extrabold text-[#1F2937] tracking-tight">
                  4.8★
                </span>
                <span className="block text-sm font-semibold uppercase tracking-wider text-[#155E63] mt-2">
                  Average Rating
                </span>
                <p className="text-xs text-[#6B7280] mt-3">
                  Based on over 4,800+ verified customer reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Approach Section ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F7F5F1] border-y border-[#E5DFD3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#155E63] bg-[#155E63]/10">
                Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1F2937] leading-tight">
                Our Approach to Modern Cleaning
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                We believe that maintaining a pristine living environment should be simple,
                reliable, and stress-free. By blending rigorous quality protocols with a
                user-friendly tech stack, we deliver consistency at every single visit.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-6">
              {/* Card 1 */}
              <div className="bg-black/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:border-[#155E63]/30 transition-all duration-300">
                <div className="bg-white p-6 rounded-[16px] shadow-sm flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#155E63]/10 flex items-center justify-center text-[#155E63] shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937] mb-1">
                      ✓ Seamless Integration
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      Property managers can easily implement our service as a building
                      amenity, adding value to their properties while minimizing
                      administrative overhead.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-black/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:border-[#155E63]/30 transition-all duration-300">
                <div className="bg-white p-6 rounded-[16px] shadow-sm flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#155E63]/10 flex items-center justify-center text-[#155E63] shrink-0">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937] mb-1">
                      ✓ User-Friendly Platform
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      Tenants enjoy a hassle-free booking experience through our intuitive
                      platform. Book in under 30 seconds with instant pricing and same-day availability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-black/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:border-[#155E63]/30 transition-all duration-300">
                <div className="bg-white p-6 rounded-[16px] shadow-sm flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#155E63]/10 flex items-center justify-center text-[#155E63] shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937] mb-1">
                      ✓ Quality Assurance
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      Our vetted cleaning professionals follow detailed protocols, backed by a
                      100% satisfaction guarantee. We don&apos;t cut corners – we clean them!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Audience Split Section (Bento style) ────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Managers */}
            <div className="bg-black/5 p-1 rounded-[20px] border border-[#E5DFD3]">
              <div className="bg-white p-10 rounded-[16px] h-full flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#155E63]/5 flex items-center justify-center text-[#155E63]">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F2937]">
                    For Property Managers
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">
                    Add value to your property with a premium amenity that residents actually want.
                    Our system handles scheduling, quality control, and resident communication,
                    letting you focus on what matters most.
                  </p>
                </div>
                <div>
                  <Link
                    href="/landlord/register"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#155E63] hover:text-[#124A54] transition-colors"
                  >
                    Learn more about partnerships
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Residents */}
            <div className="bg-black/5 p-1 rounded-[20px] border border-[#E5DFD3]">
              <div className="bg-white p-10 rounded-[16px] h-full flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#155E63]/5 flex items-center justify-center text-[#155E63]">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F2937]">
                    For Residents
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">
                    Enjoy the convenience of professional cleaning services integrated right into your
                    building&apos;s amenities. Schedule cleanings with a few clicks, and come home
                    to a spotless apartment every time.
                  </p>
                </div>
                <div>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#155E63] hover:text-[#124A54] transition-colors"
                  >
                    Book your first cleaning
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Section ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F7F5F1] border-t border-[#E5DFD3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#155E63] bg-[#155E63]/10">
              People
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1F2937]">
              Our Executive Team
            </h2>
            <p className="text-[#6B7280]">
              The leadership driving the next generation of professional cleaning services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-black/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:-translate-y-1 transition-all duration-300">
              <div className="bg-white rounded-[16px] overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    src="/maid-images/team-1.png"
                    alt="Executive Team"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-lg font-bold text-[#1F2937]">Apartment Maid Leadership</h4>
                  <p className="text-sm text-[#6B7280]">Operations & Business Growth</p>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-black/5 p-1 rounded-[20px] border border-[#E5DFD3] hover:-translate-y-1 transition-all duration-300">
              <div className="bg-white rounded-[16px] overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    src="/maid-images/team-2.png"
                    alt="Isaac Rabinowitsch at New York Build Expo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-lg font-bold text-[#1F2937]">Isaac Rabinowitsch</h4>
                  <p className="text-sm text-[#155E63] font-semibold">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>

          {/* Letter from Founder */}
          <div className="max-w-3xl mx-auto mt-20 bg-white p-8 md:p-12 rounded-[16px] border border-[#E5DFD3] shadow-sm relative">
            <div className="absolute -top-5 left-10 text-6xl text-[#155E63]/25 font-serif select-none">
              &ldquo;
            </div>
            <div className="space-y-6 relative z-10">
              <h3 className="text-xl font-bold text-[#1F2937]">
                A Note from Our Founder
              </h3>
              <p className="text-[#6B7280] italic leading-relaxed text-lg">
                &ldquo;We created Apartment Maid because we believe maintaining a clean home
                shouldn&apos;t be a hassle. By making professional cleaning an amenity, we&apos;re
                giving residents more time to focus on what matters most in their lives.&rdquo;
              </p>
              <div>
                <span className="block font-bold text-[#1F2937]">
                  - Isaac Rabinowitsch
                </span>
                <span className="text-xs uppercase tracking-wider text-[#6B7280] font-medium">
                  Founder, Apartment Maid
                </span>
              </div>
            </div>
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
              { heading: "Explore", links: [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "About", href: "/about" }, { label: "Blog", href: "/blog" }] },
              { heading: "Account", links: [{ label: "Log in", href: "/login" }, { label: "Sign up", href: "/login" }, { label: "Become a Maid", href: "/login" }] },
              { heading: "Contact", links: [{ label: "Support", href: "mailto:booking@apartmentmaid.co" }, { label: "Locations", href: "/" }, { label: "Pricing", href: "/services" }] },
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
                    <li key={link.label}>
                      <Link href={link.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", textDecoration: "none", lineHeight: "20px" }} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
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
                <a key={item} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none", lineHeight: "20px" }} className="hover:text-white transition-colors">
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

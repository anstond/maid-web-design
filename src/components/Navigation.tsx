"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const T = {
  primary: "#155E63",
  primaryH: "#0f4d51",
  accentW: "#D9C7A3",
  ink: "#1F2937",
  body: "#6B7280",
  canvas: "#FCFBF8",
  surface: "#FFFFFF",
  soft: "#F7F5F1",
  border: "#E5DFD3",
  onPrimary: "#FFFFFF",
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "#" },
  { label: "Subscriptions", href: "/account/subscriptions" },
  { label: "Blog", href: "/blog" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(252,251,248,0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div className="flex flex-wrap lg:flex-nowrap" style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 16px lg:px-8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 66,
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
            <span className="hidden sm:inline" style={{ fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: "-0.02em" }}>
              ApartmentMaid
            </span>
          </Link>

          <div className="hidden lg:flex order-last lg:order-none lg:flex-1 lg:shrink" style={{ alignItems: "center", gap: 2, justifyContent: "center" }}>
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link key={label} href={href} style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "#fff" : T.body,
                  textDecoration: "none",
                  padding: "7px 14px",
                  borderRadius: 999,
                  background: isActive ? T.primary : "transparent",
                  transition: "all 300ms cubic-bezier(0.32, 0.72, 0, 1)",
                  cursor: "pointer",
                }} className="hover:bg-gray-100">
                  {label}
                </Link>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/login" className="hidden md:inline" style={{
              fontSize: 14,
              fontWeight: 500,
              color: T.body,
              textDecoration: "none",
              transition: "color 300ms cubic-bezier(0.32, 0.72, 0, 1)",
            }}>
              Log in
            </Link>
            <Link href="/account/bookings" className="hidden md:inline" style={{
              fontSize: 14,
              fontWeight: 500,
              color: T.body,
              textDecoration: "none",
              transition: "color 300ms cubic-bezier(0.32, 0.72, 0, 1)",
            }}>
              Account
            </Link>
            <a href="/booking" style={{
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
              transition: "all 300ms cubic-bezier(0.32, 0.72, 0, 1)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = T.primaryH;
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = T.primary;
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}>
              Book
              <ArrowUpRight size={13} strokeWidth={2.5} className="hidden sm:inline" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.ink,
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div style={{
          position: "fixed",
          top: 66,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          background: "rgba(0, 0, 0, 0.5)",
        }} onClick={() => setMobileMenuOpen(false)} />
      )}

      <div
        style={{
          position: "fixed",
          top: 66,
          left: 0,
          right: 0,
          zIndex: 45,
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          maxHeight: "calc(100vh - 66px)",
          overflowY: "auto",
          transform: mobileMenuOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out",
          WebkitOverflowScrolling: "touch",
        }}
        className="lg:hidden"
      >
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {navLinks.map(({ label, href }, index) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`menu-item-enter menu-item-enter-${index}`}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: isActive ? T.primary : T.ink,
                  textDecoration: "none",
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: isActive ? `${T.primary}15` : "transparent",
                  transition: "all 300ms cubic-bezier(0.32, 0.72, 0, 1)",
                  cursor: "pointer",
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className={`menu-item-enter menu-item-enter-${navLinks.length}`}
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: T.ink,
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: 8,
              marginTop: 8,
              transition: "all 300ms cubic-bezier(0.32, 0.72, 0, 1)",
              cursor: "pointer",
            }}
          >
            Log in
          </Link>
          <Link
            href="/account/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={`menu-item-enter menu-item-enter-${navLinks.length + 1}`}
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: T.ink,
              transition: "all 300ms cubic-bezier(0.32, 0.72, 0, 1)",
              cursor: "pointer",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: 8,
            }}
          >
            Account
          </Link>
        </div>
      </div>
    </>
  );
}

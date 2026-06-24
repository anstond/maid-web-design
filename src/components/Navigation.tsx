"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const T = {
  primary: "#155E63",
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
  { label: "Subscriptions", href: "#" },
  { label: "Blog", href: "/blog" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
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
        padding: "0 32px",
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
          <span style={{ fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: "-0.02em" }}>
            ApartmentMaid
          </span>
        </Link>

        <div className="order-last flex basis-full shrink-0 overflow-x-auto lg:order-none lg:basis-auto lg:flex-1 lg:shrink" style={{ alignItems: "center", gap: 2, justifyContent: "center", WebkitOverflowScrolling: "touch" }}>
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
              }}>
                {label}
              </Link>
            );
          })}
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
            Check availability
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </nav>
  );
}

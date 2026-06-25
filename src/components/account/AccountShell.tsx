"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheck, Home, RefreshCw, Settings, UserRound, Menu, X, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const accountNavItems = [
  { label: "Bookings", href: "/account/bookings", icon: CalendarCheck },
  { label: "Subscriptions", href: "/account/subscriptions", icon: RefreshCw },
  { label: "Profile", href: "/account/profile", icon: UserRound },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

const marketingNavItems = [
  { label: "Home", href: "/" },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-[100dvh] bg-background text-text-primary">
      <a
        href="#account-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-40 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        Skip to account content
      </a>

      <div className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          {/* Top row: Logo + Actions */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Link href="/" className="flex min-h-11 items-center gap-2 sm:gap-3 rounded-full pr-2 sm:pr-3 text-sm font-bold text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 flex-shrink-0">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Home className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">ApartmentMaid</span>
            </Link>

            {/* Desktop: Full button row */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <Link href="/" className="min-h-11 items-center rounded-full bg-surface-muted px-4 text-sm font-bold text-text-primary transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent-soft hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 inline-flex active:scale-95">
                Explore services
              </Link>
              <Link href="/booking" className="min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-hover hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 inline-flex active:scale-95">
                Book cleaning
              </Link>
            </div>

            {/* Mobile: Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden min-h-11 inline-flex items-center justify-center rounded-full bg-surface-muted px-3 text-text-primary transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent-soft hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 flex-shrink-0 active:scale-95"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* Desktop: Account nav pills (horizontal) */}
          <nav aria-label="Account navigation" className="hidden sm:flex gap-2 mt-4 overflow-x-auto pb-1">
            {accountNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 hover:scale-105",
                    active ? "bg-primary text-primary-foreground" : "bg-surface-muted text-text-primary hover:bg-accent-soft"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[60px] z-30 bg-black/20"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu dropdown */}
      <div
        className={cn(
          "sm:hidden fixed top-[60px] left-0 right-0 z-35 bg-surface transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden",
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {/* Account Navigation */}
          {accountNavItems.map((item, index) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  `menu-item-enter menu-item-enter-${index} flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105`,
                  active ? "bg-primary text-primary-foreground" : "bg-background text-text-primary hover:bg-surface-muted"
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="h-px bg-border my-2" />

          {/* Back to Home */}
          {marketingNavItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`menu-item-enter menu-item-enter-${accountNavItems.length + index} flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-text-primary bg-background hover:bg-surface-muted transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105`}
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-px bg-border my-2" />

          {/* Book button */}
          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className={`menu-item-enter menu-item-enter-${accountNavItems.length + marketingNavItems.length} w-full text-center min-h-11 flex items-center justify-center rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-hover hover:scale-105 active:scale-95`}
          >
            Book cleaning
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <section id="account-content" className="min-w-0">
          {children}
        </section>
      </div>
    </main>
  );
}

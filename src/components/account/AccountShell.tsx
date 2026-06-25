"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheck, Home, RefreshCw, Settings, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Bookings", href: "/account/bookings", icon: CalendarCheck },
  { label: "Subscriptions", href: "/account/subscriptions", icon: RefreshCw },
  { label: "Profile", href: "/account/profile", icon: UserRound },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-[100dvh] bg-background text-text-primary">
      <a
        href="#account-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-40 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        Skip to account content
      </a>

      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="flex min-h-11 items-center gap-3 rounded-full pr-3 text-sm font-bold text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Home className="size-4" aria-hidden="true" />
              </span>
              ApartmentMaid
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/" className="hidden min-h-11 items-center rounded-full bg-surface-muted px-4 text-sm font-bold text-text-primary transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:inline-flex">
                Home
              </Link>
              <Link href="/booking" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
                Book cleaning
              </Link>
            </div>
          </div>

          <nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
                    active ? "bg-primary text-primary-foreground" : "bg-surface-muted text-text-primary hover:bg-accent-soft"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <section id="account-content" className="min-w-0">
          {children}
        </section>
      </div>
    </main>
  );
}

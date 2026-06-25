"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheck, Headphones, Home, RefreshCw, Settings, ShieldCheck, UserRound } from "lucide-react";
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
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top_left,rgba(21,94,99,0.10),transparent_32rem),var(--background)] text-text-primary">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[286px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_58px_rgba(21,94,99,0.12)]">
            <div className="bg-primary p-5 text-primary-foreground">
              <Link href="/" className="flex min-h-11 items-center gap-3 rounded-xl text-sm font-bold focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/30">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground text-primary">
                  <Home className="size-4" aria-hidden="true" />
                </span>
                ApartmentMaid
              </Link>

              <div className="mt-6">
                <p className="text-xs font-bold text-primary-foreground/70">Signed in as</p>
                <p className="mt-1 text-xl font-bold">Avery Morgan</p>
                <p className="mt-1 text-sm text-primary-foreground/75">Chelsea, New York</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-primary-foreground/10 p-3">
                  <p className="font-bold">2</p>
                  <p className="mt-1 text-primary-foreground/70">Open visits</p>
                </div>
                <div className="rounded-xl bg-primary-foreground/10 p-3">
                  <p className="font-bold">1</p>
                  <p className="mt-1 text-primary-foreground/70">Active plan</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <nav aria-label="Account navigation" className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-xl px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
                        active ? "bg-primary text-primary-foreground" : "bg-surface-muted text-text-primary hover:bg-primary/10"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="size-4" aria-hidden="true" />
                        {item.label}
                      </span>
                      <span className={cn("hidden text-xs lg:inline", active ? "text-primary-foreground/70" : "text-text-secondary")}>
                        View
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 rounded-2xl border border-border bg-surface-muted p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                  <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                  Account standing
                </div>
                <p className="mt-2 text-sm leading-5 text-text-secondary">
                  Payments are current. No unresolved quality cases.
                </p>
              </div>

              <div className="mt-3 rounded-2xl bg-primary/10 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                  <Headphones className="size-4 text-primary" aria-hidden="true" />
                  Support center
                </div>
                <p className="mt-2 text-sm leading-5 text-text-secondary">
                  Change access notes, ask about cleaner assignment, or request billing help.
                </p>
                <button className="mt-3 min-h-10 rounded-full bg-surface px-4 text-sm font-bold text-primary shadow-sm transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
                  Message support
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}

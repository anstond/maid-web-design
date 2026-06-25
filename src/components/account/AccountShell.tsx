import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheck, Home, RefreshCw } from "lucide-react";

const navItems = [
  { label: "Bookings", href: "/account/bookings", icon: CalendarCheck },
  { label: "Subscriptions", href: "/account/subscriptions", icon: RefreshCw },
];

export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-background text-text-primary">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
            <Link href="/" className="mb-5 flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-bold text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Home className="size-4" aria-hidden="true" />
              </span>
              ApartmentMaid
            </Link>

            <nav aria-label="Account navigation" className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center gap-2 rounded-xl bg-surface-muted px-3 text-sm font-bold text-text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 rounded-2xl bg-primary p-4 text-primary-foreground">
              <p className="text-sm font-bold">Need help?</p>
              <p className="mt-1 text-sm leading-5 text-primary-foreground/80">
                Message support about access, timing, cleaner assignment, or billing.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}

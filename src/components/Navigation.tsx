"use client";

import {
  ArrowUpRight,
  CalendarCheck,
  ChevronDown,
  LogOut,
  Menu,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { accountProfile } from "@/lib/mock-account-data";

const T = {
  primary: "#155E63",
  primaryH: "#0f4d51",
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
  { label: "Blog", href: "/blog" },
];

const accountLinks = [
  { label: "Profile", href: "/account/profile", icon: UserRound },
  { label: "Bookings", href: "/account/bookings", icon: CalendarCheck },
  { label: "Subscriptions", href: "/account/subscriptions", icon: RefreshCw },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const currentUser = accountProfile;
  const userInitials = getInitials(currentUser.name);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenus();
    router.push("/login");
  };

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(252,251,248,0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div
          className="mx-auto flex min-h-[66px] max-w-7xl items-center justify-between gap-3 px-4 lg:px-8"
        >
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2 rounded-full pr-2 text-decoration-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
              style={{ background: T.primary, color: T.onPrimary }}
              aria-hidden="true"
            >
              M
            </span>
            <span className="hidden text-base font-semibold tracking-[-0.02em] text-text-primary sm:inline">
              ApartmentMaid
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className="rounded-full px-3 py-2 text-sm font-medium no-underline transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 xl:px-4"
                  style={{
                    color: isActive ? T.onPrimary : T.body,
                    background: isActive ? T.primary : "transparent",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/booking"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-primary-foreground no-underline transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-0 sm:px-5"
              style={{ background: T.primary }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = T.primaryH;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = T.primary;
              }}
            >
              Book
              <ArrowUpRight size={13} strokeWidth={2.5} className="hidden sm:inline" aria-hidden="true" />
            </Link>

            <div ref={profileMenuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label="Open account menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-muted py-1.5 pl-1.5 pr-3 text-sm font-bold text-text-primary transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-[0.98]"
              >
                <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {currentUser.picture ? (
                    <Image
                      src={currentUser.picture}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 object-cover"
                    />
                  ) : (
                    <span className="flex size-8 items-center justify-center">{userInitials}</span>
                  )}
                </span>
                <span className="hidden max-w-28 truncate xl:inline">{currentUser.name.split(" ")[0]}</span>
                <ChevronDown
                  size={15}
                  strokeWidth={2.2}
                  className={`transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  aria-label="Signed-in account"
                  className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_54px_rgba(31,41,55,0.16)]"
                >
                  <div className="flex items-center gap-3 bg-surface-muted p-4">
                    <span className="relative flex size-11 shrink-0 overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {currentUser.picture ? (
                        <Image
                          src={currentUser.picture}
                          alt=""
                          width={44}
                          height={44}
                          className="size-11 object-cover"
                        />
                      ) : (
                        <span className="flex size-11 items-center justify-center">{userInitials}</span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-text-primary">{currentUser.name}</span>
                      <span className="block truncate text-xs font-medium text-text-secondary">{currentUser.email}</span>
                    </span>
                  </div>

                  <div className="flex flex-col p-2">
                    {accountLinks.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          aria-current={active ? "page" : undefined}
                          onClick={closeMenus}
                          className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold no-underline transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 ${
                            active ? "bg-primary text-primary-foreground" : "text-text-primary hover:bg-surface-muted"
                          }`}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-border p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-text-primary transition-all duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-[0.98]"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-surface-muted text-text-primary transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-[0.98] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 66,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            background: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
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
          maxHeight: "calc(100dvh - 66px)",
          overflowY: "auto",
          transform: mobileMenuOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out",
          WebkitOverflowScrolling: "touch",
        }}
        className="lg:hidden"
      >
        <div className="flex flex-col gap-2 p-4">
          {/* Mobile profile summary */}
          <div className="menu-item-enter menu-item-enter-0 rounded-2xl bg-surface-muted p-4" aria-label="Signed-in account">
            <div className="flex items-center gap-3">
              <span className="relative flex size-12 shrink-0 overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {currentUser.picture ? (
                  <Image
                    src={currentUser.picture}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 object-cover"
                  />
                ) : (
                  <span className="flex size-12 items-center justify-center">{userInitials}</span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-text-primary">{currentUser.name}</span>
                <span className="block truncate text-xs font-medium text-text-secondary">{currentUser.email}</span>
              </span>
            </div>
          </div>

          {navLinks.map(({ label, href }, index) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`menu-item-enter menu-item-enter-${index + 1} rounded-xl px-4 py-3 text-base font-semibold no-underline transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30`}
                style={{
                  color: isActive ? T.primary : T.ink,
                  background: isActive ? `${T.primary}15` : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}

          <div className="my-2 h-px bg-border" />

          {accountLinks.map((item, index) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`menu-item-enter menu-item-enter-${index + navLinks.length + 1} flex min-h-11 items-center gap-3 rounded-xl px-4 text-base font-bold no-underline transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 ${
                  active ? "bg-primary text-primary-foreground" : "text-text-primary hover:bg-surface-muted"
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}

          <div className="my-2 h-px bg-border" />

          <button
            type="button"
            onClick={handleLogout}
            className="menu-item-enter menu-item-enter-5 flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-base font-bold text-text-primary transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-[0.98]"
          >
            <LogOut className="size-5" aria-hidden="true" />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

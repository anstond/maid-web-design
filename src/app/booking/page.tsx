"use client";

import { Suspense, useMemo, useState } from "react";
import { WeeklyScheduleBuilder } from "@/components/WeeklyScheduleBuilder";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Home,
  KeyRound,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

type ServiceId = "standard" | "deep" | "move" | "office";
type FrequencyId = "once" | "weekly" | "biweekly" | "monthly" | "custom";

type BookingState = {
  zip: string;
  address: string;
  unit: string;
  city: string;
  homeType: string;
  bedrooms: number;
  bathrooms: number;
  serviceId: ServiceId;
  hours: number;
  cleaners: number;
  frequencyId: FrequencyId;
  /** Custom subscription: per-day schedule slots */
  customSchedules: Array<{ dayOfWeek: number; time: string; product: string }>;
  /** Subscription start date (ISO), applies to all recurring frequencies */
  startDate: string;
  addons: string[];
  date: string;
  arrivalWindow: string;
  cleanerPreference: string;
  access: string;
  parking: string;
  pets: string;
  supplies: string;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const SERVICES = [
  {
    id: "standard" as const,
    name: "Standard clean",
    description: "Recurring upkeep for lived-in homes.",
    rate: 42,
    minimumHours: 2.5,
    maxHours: 8,
    cleanerOptions: [1, 2],
    included: ["Kitchen and bathrooms", "Dusting and floors", "Beds made with fresh linens"],
  },
  {
    id: "deep" as const,
    name: "Deep clean",
    description: "First visit, seasonal reset, or heavier buildup.",
    rate: 54,
    minimumHours: 3.5,
    maxHours: 10,
    cleanerOptions: [1, 2, 3],
    included: ["Standard clean", "Baseboards and doors", "Heavy buildup attention"],
  },
  {
    id: "move" as const,
    name: "Move clean",
    description: "Empty-home clean before keys change hands.",
    rate: 58,
    minimumHours: 4,
    maxHours: 10,
    cleanerOptions: [2, 3, 4],
    included: ["Inside cabinets", "Appliance exteriors", "Closets and empty rooms"],
  },
  {
    id: "office" as const,
    name: "Small office",
    description: "Workspaces, studios, and storefronts.",
    rate: 50,
    minimumHours: 3,
    maxHours: 10,
    cleanerOptions: [1, 2, 3, 4],
    included: ["Desks and common areas", "Restrooms", "Trash and floors"],
  },
];

const FREQUENCIES = [
  { id: "once" as const, label: "One time", helper: "Single appointment" },
  { id: "weekly" as const, label: "Weekly", helper: "Repeat every week" },
  { id: "biweekly" as const, label: "Every 2 weeks", helper: "Repeat every other week" },
  { id: "monthly" as const, label: "Monthly", helper: "Repeat once a month" },
  { id: "custom" as const, label: "Custom schedule", helper: "Choose specific days and products" },
];

const ADDONS = [
  { id: "fridge", label: "Inside fridge", helper: "Shelves and drawers", price: 29, minutes: 25 },
  { id: "oven", label: "Inside oven", helper: "Interior racks and door", price: 34, minutes: 30 },
  { id: "cabinets", label: "Inside cabinets", helper: "Empty cabinets only", price: 39, minutes: 35 },
  { id: "windows", label: "Interior windows", helper: "Reachable interior glass", price: 45, minutes: 35 },
  { id: "laundry", label: "Laundry fold", helper: "Up to two loads", price: 32, minutes: 35 },
  { id: "walls", label: "Wall spot clean", helper: "Marks within reach", price: 28, minutes: 25 },
];

const ARRIVAL_WINDOWS = [
  { id: "9:00 AM", label: "9:00 AM", price: 0 },
  { id: "10:00 AM", label: "10:00 AM", price: 0 },
  { id: "11:00 AM", label: "11:00 AM", price: 0 },
  { id: "12:00 PM", label: "12:00 PM", price: 0 },
  { id: "1:00 PM", label: "1:00 PM", price: 0 },
  { id: "2:00 PM", label: "2:00 PM", price: 0 },
  { id: "3:00 PM", label: "3:00 PM", price: 0 },
  { id: "4:00 PM", label: "4:00 PM", price: 0 },
  { id: "5:00 PM", label: "5:00 PM", price: 0 },
  { id: "6:00 PM", label: "6:00 PM", price: 0 },
  { id: "7:00 PM", label: "7:00 PM", price: 0 },
  { id: "8:00 PM", label: "8:00 PM", price: 0 },
  { id: "9:00 PM", label: "9:00 PM", price: 0 },
];

const INITIAL_STATE: BookingState = {
  zip: "",
  address: "",
  unit: "",
  city: "New York",
  homeType: "Apartment",
  bedrooms: 1,
  bathrooms: 1,
  serviceId: "standard",
  hours: 3,
  cleaners: 1,
  frequencyId: "once",
  customSchedules: [],
  startDate: "",
  addons: [],
  date: "",
  arrivalWindow: "10:00 AM",
  cleanerPreference: "best-match",
  access: "I will be home",
  parking: "",
  pets: "No pets",
  supplies: "Bring professional supplies",
  notes: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

function tomorrowISO() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function dateToISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateOptions() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return {
      iso: dateToISO(date),
      weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      monthDay: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date),
    };
  });
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getHourOptions(minimumHours: number, maxHours: number) {
  const start = Math.max(1, Math.ceil(minimumHours));
  return Array.from({ length: maxHours - start + 1 }, (_, index) => start + index);
}

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service");
  const initialZip = searchParams.get("zip") ?? "";
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<BookingState>(() => ({
    ...INITIAL_STATE,
    serviceId: SERVICES.some((service) => service.id === initialService)
      ? (initialService as ServiceId)
      : INITIAL_STATE.serviceId,
    zip: initialZip.replace(/\D/g, "").slice(0, 5),
  }));

  const currentService = SERVICES.find((service) => service.id === state.serviceId) ?? SERVICES[0];
  const currentFrequency = FREQUENCIES.find((frequency) => frequency.id === state.frequencyId) ?? FREQUENCIES[0];
  const currentArrival = ARRIVAL_WINDOWS.find((window) => window.id === state.arrivalWindow) ?? ARRIVAL_WINDOWS[1];
  const hourOptions = getHourOptions(currentService.minimumHours, currentService.maxHours);
  const cleanerOptions = currentService.cleanerOptions;
  const dateOptions = useMemo(() => getDateOptions(), []);
  const recommendedHours = useMemo(() => {
    const homeHours = 1.6 + state.bedrooms * 0.55 + state.bathrooms * 0.65;
    const addonHours = state.addons.reduce((sum, id) => {
      const addon = ADDONS.find((item) => item.id === id);
      return sum + (addon?.minutes ?? 0) / 60;
    }, 0);
    const soloHours = Math.max(currentService.minimumHours, homeHours + addonHours);
    const visitHours = Math.ceil((soloHours / state.cleaners) * 2) / 2;
    return Math.min(currentService.maxHours, Math.max(Math.ceil(currentService.minimumHours), Math.ceil(visitHours)));
  }, [currentService, state.addons, state.bathrooms, state.bedrooms, state.cleaners]);

  const estimate = useMemo(() => {
    const visitHours = Math.max(currentService.minimumHours, state.hours);
    const laborHours = visitHours * state.cleaners;
    const labor = laborHours * currentService.rate;
    const addonTotal = state.addons.reduce((sum, id) => {
      const addon = ADDONS.find((item) => item.id === id);
      return sum + (addon?.price ?? 0);
    }, 0);
    const suppliesFee = state.supplies === "I will provide supplies" ? 0 : 12;
    const subtotal = labor + addonTotal + suppliesFee + currentArrival.price;
    const serviceFee = 8;
    const total = subtotal + serviceFee;

    return {
      estimatedHours: visitHours,
      visitHours,
      laborHours,
      cleanerCount: state.cleaners,
      labor,
      addonTotal,
      suppliesFee,
      arrivalFee: currentArrival.price,
      serviceFee,
      total,
    };
  }, [currentArrival.price, currentService, state.addons, state.cleaners, state.hours, state.supplies]);

  const errors = useMemo(() => {
    const result: string[] = [];
    if (step === 0) {
      if (state.zip.length !== 5) result.push("Enter a 5-digit ZIP code.");
      if (!state.address.trim()) result.push("Enter the street address.");
    }
    if (step === 1) {
      if (!hourOptions.includes(state.hours)) result.push(`Choose ${hourOptions[0]}-${hourOptions[hourOptions.length - 1]} hours for ${currentService.name}.`);
      if (!cleanerOptions.includes(state.cleaners)) result.push(`Choose an available cleaner count for ${currentService.name}.`);
    }
    if (step === 2) {
      if (state.frequencyId === "custom") {
        if (!state.startDate) result.push("Choose a subscription start date.");
        if (state.customSchedules.length === 0) result.push("Pick at least one day for your custom schedule.");
      } else {
        if (!state.date) result.push("Choose a date.");
      }
      if (!state.parking.trim()) result.push("Add parking or transit notes.");
    }
    if (step === 3) {
      if (!state.firstName.trim() || !state.lastName.trim()) result.push("Enter your full name.");
      if (!state.email.includes("@")) result.push("Enter a valid email.");
      if (state.phone.replace(/\D/g, "").length < 10) result.push("Enter a phone number for arrival updates.");
    }
    return result;
  }, [cleanerOptions, currentService.name, hourOptions, state, step]);

  function update<K extends keyof BookingState>(key: K, value: BookingState[K]) {
    setState((previous) => ({ ...previous, [key]: value }));
  }

  function toggleAddon(id: string) {
    setState((previous) => ({
      ...previous,
      addons: previous.addons.includes(id)
        ? previous.addons.filter((addon) => addon !== id)
        : [...previous.addons, id],
    }));
  }

  function selectService(serviceId: ServiceId) {
    const nextService = SERVICES.find((service) => service.id === serviceId) ?? SERVICES[0];
    const nextHourOptions = getHourOptions(nextService.minimumHours, nextService.maxHours);
    setState((previous) => ({
      ...previous,
      serviceId,
      hours: Math.min(nextHourOptions[nextHourOptions.length - 1], Math.max(nextHourOptions[0], previous.hours)),
      cleaners: nextService.cleanerOptions.includes(previous.cleaners) ? previous.cleaners : nextService.cleanerOptions[0],
    }));
  }

  function continueFlow() {
    setTouched(true);
    if (errors.length > 0) return;

    if (step === 3) {
      sessionStorage.setItem(
        "apartmentmaid_booking",
        JSON.stringify({
          ...state,
          serviceName: currentService.name,
          frequencyName: currentFrequency.label,
          arrivalWindowLabel: currentArrival.label,
          estimate,
        })
      );
      router.push("/booking/checkout");
      return;
    }

    setTouched(false);
    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setTouched(false);
    if (step === 0) {
      router.push("/");
      return;
    }
    setStep((current) => current - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const steps = ["Home", "Scope", "Schedule", "Review"];

  return (
    <main className="min-h-[100dvh] bg-background text-text-primary">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-primary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {step === 0 ? "Home" : "Back"}
          </button>
          <div className="hidden items-center gap-2 text-sm font-medium text-text-secondary sm:flex">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Background-checked cleaners
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-12">
        <section aria-labelledby="booking-title" className="min-w-0">
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold text-primary">Book a home cleaning</p>
            <h1 id="booking-title" className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-text-primary md:text-5xl">
              A real appointment, priced before checkout.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Tell us where, what needs attention, and how the cleaner should enter. We match the job to the right visit length before payment.
            </p>
          </div>

          <nav aria-label="Booking progress" className="mb-6 rounded-2xl border border-border bg-surface p-2">
            <ol className="grid grid-cols-4 gap-1">
              {steps.map((label, index) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= step) setStep(index);
                    }}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold transition",
                      index === step && "bg-primary text-primary-foreground",
                      index < step && "bg-surface-muted text-primary",
                      index > step && "text-text-secondary"
                    )}
                    aria-current={index === step ? "step" : undefined}
                  >
                    {index < step ? <Check className="size-4" aria-hidden="true" /> : null}
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(21,94,99,0.08)] sm:p-7">
            {step === 0 ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Where should we send the cleaner?</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Availability, parking, and building access change the real job. Start with the home.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_150px]">
                  <Field label="Street address" htmlFor="address" required>
                    <input id="address" value={state.address} onChange={(event) => update("address", event.target.value)} autoComplete="street-address" className="booking-input" placeholder="225 West 23rd Street" />
                  </Field>
                  <Field label="Apt, suite" htmlFor="unit">
                    <input id="unit" value={state.unit} onChange={(event) => update("unit", event.target.value)} autoComplete="address-line2" className="booking-input" placeholder="4B" />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_150px]">
                  <Field label="City" htmlFor="city" required>
                    <input id="city" value={state.city} onChange={(event) => update("city", event.target.value)} autoComplete="address-level2" className="booking-input" />
                  </Field>
                  <Field label="ZIP code" htmlFor="zip" helper={state.zip.length === 5 ? "We will confirm local availability before assigning a cleaner." : "Enter the 5-digit ZIP for the cleaning address."} required>
                    <input id="zip" value={state.zip} onChange={(event) => update("zip", event.target.value.replace(/\D/g, "").slice(0, 5))} autoComplete="postal-code" inputMode="numeric" className="booking-input" placeholder="10001" />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <SelectCard active={state.homeType === "Apartment"} title="Apartment" helper="Walk-up, elevator, condo" onClick={() => update("homeType", "Apartment")} icon={<Home className="size-5" />} />
                  <SelectCard active={state.homeType === "House"} title="House" helper="Townhouse or single-family" onClick={() => update("homeType", "House")} icon={<Home className="size-5" />} />
                  <SelectCard active={state.homeType === "Office"} title="Office" helper="Studio or small workplace" onClick={() => update("homeType", "Office")} icon={<Home className="size-5" />} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Counter label="Bedrooms" value={state.bedrooms} min={0} max={6} onChange={(value) => update("bedrooms", value)} />
                  <Counter label="Bathrooms" value={state.bathrooms} min={1} max={5} onChange={(value) => update("bathrooms", value)} />
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">What should this visit cover?</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Choose the cleaning type and any extra tasks. The estimate updates as work is added.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => selectService(service.id)}
                      className={cn(
                        "min-h-44 rounded-2xl border p-5 text-left transition active:translate-y-px",
                        state.serviceId === service.id
                          ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(21,94,99,0.10)]"
                          : "border-border bg-surface-muted hover:border-primary/40"
                      )}
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span>
                          <span className="block text-lg font-bold text-text-primary">{service.name}</span>
                          <span className="mt-1 block text-sm leading-6 text-text-secondary">{service.description}</span>
                        </span>
                        <span className="rounded-full bg-surface px-3 py-1 text-sm font-bold text-primary">${service.rate}/labor hr</span>
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-primary">
                        {Math.ceil(service.minimumHours)}-{service.maxHours} visit hours
                      </span>
                      <span className="mt-4 grid gap-2 text-sm text-text-secondary">
                        {service.included.map((item) => (
                          <span key={item} className="flex gap-2">
                            <Check className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                            {item}
                          </span>
                        ))}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 rounded-2xl border border-border bg-surface-muted p-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-text-primary">Visit hours</h3>
                        <p className="mt-1 text-sm leading-5 text-text-secondary">
                          {currentService.name} allows {hourOptions[0]}-{hourOptions[hourOptions.length - 1]} hours. Recommended: {recommendedHours} hours.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => update("hours", recommendedHours)}
                        className="min-h-10 rounded-full bg-surface px-4 text-sm font-bold text-primary transition hover:bg-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
                      >
                        Use recommended
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {hourOptions.map((hours) => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => update("hours", hours)}
                          className={cn(
                            "min-h-12 rounded-xl border px-3 text-sm font-bold transition active:translate-y-px",
                            state.hours === hours ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-text-primary hover:border-primary/40"
                          )}
                        >
                          {hours} hr
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-base font-bold text-text-primary">Cleaner count</h3>
                    <div className="grid gap-2">
                      {cleanerOptions.map((cleaners) => (
                        <button
                          key={cleaners}
                          type="button"
                          onClick={() => update("cleaners", cleaners)}
                          className={cn(
                            "flex min-h-12 items-center justify-between rounded-xl border px-4 text-sm font-bold transition active:translate-y-px",
                            state.cleaners === cleaners ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-text-primary hover:border-primary/40"
                          )}
                        >
                          <span>{cleaners} {cleaners === 1 ? "cleaner" : "cleaners"}</span>
                          <span className={state.cleaners === cleaners ? "text-primary-foreground/80" : "text-text-secondary"}>
                            {(state.hours * cleaners).toFixed(1).replace(".0", "")} labor hr
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-text-secondary">
                      Labor hours are visit hours multiplied by cleaner count.
                    </p>
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-3 text-base font-bold text-text-primary">Extra tasks</legend>
                  <div className="grid gap-3 md:grid-cols-2">
                    {ADDONS.map((addon) => {
                      const selected = state.addons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(addon.id)}
                          className={cn(
                            "flex min-h-20 items-start justify-between gap-4 rounded-2xl border p-4 text-left transition active:translate-y-px",
                            selected ? "border-primary bg-primary/5" : "border-border bg-surface-muted hover:border-primary/40"
                          )}
                          aria-pressed={selected}
                        >
                          <span>
                            <span className="block font-bold text-text-primary">{addon.label}</span>
                            <span className="mt-1 block text-sm text-text-secondary">{addon.helper}</span>
                          </span>
                          <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-sm font-bold text-primary">+${addon.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Choose frequency and schedule.</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Select how often you would like us to clean and set your arrival dates. Access and parking details come next on the same screen.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-base font-bold text-text-primary">How often should we clean?</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {FREQUENCIES.map((frequency) => (
                      <button
                        key={frequency.id}
                        type="button"
                        onClick={() => update("frequencyId", frequency.id)}
                        className={cn(
                          "min-h-20 rounded-2xl border p-4 text-left transition active:translate-y-px",
                          state.frequencyId === frequency.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-muted hover:border-primary/40"
                        )}
                      >
                        <span className="block font-bold">{frequency.label}</span>
                        <span className={cn("mt-1 block text-sm", state.frequencyId === frequency.id ? "text-primary-foreground/85" : "text-text-secondary")}>
                          {frequency.helper}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Standard date and time selection — hidden for custom plans */}
                  {state.frequencyId !== "custom" && (
                    <div className="mt-8 space-y-5 border-t border-border/55 pt-6">
                      <div>
                        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-text-primary">Date</h3>
                            <p className="mt-1 text-sm leading-5 text-text-secondary">Pick one of the next available dates or use the calendar.</p>
                          </div>
                          <div className="w-full sm:w-48">
                            <label htmlFor="date" className="sr-only">Choose a custom date</label>
                            <input id="date" type="date" min={tomorrowISO()} value={state.date} onChange={(event) => update("date", event.target.value)} className="booking-input" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                          {dateOptions.map((option) => (
                            <button
                              key={option.iso}
                              type="button"
                              onClick={() => update("date", option.iso)}
                              className={cn(
                                "min-h-20 rounded-2xl border p-3 text-left transition active:translate-y-px",
                                state.date === option.iso ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-muted text-text-primary hover:border-primary/40"
                              )}
                            >
                              <span className={cn("block text-xs font-bold", state.date === option.iso ? "text-primary-foreground/75" : "text-text-secondary")}>{option.weekday}</span>
                              <span className="mt-1 block text-base font-bold">{option.monthDay}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-base font-bold text-text-primary">Time</h3>
                        <div className="flex flex-wrap gap-2">
                          {ARRIVAL_WINDOWS.map((slot) => {
                            const isSelected = state.arrivalWindow === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => update("arrivalWindow", slot.id)}
                                className={cn(
                                  "flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition active:translate-y-px",
                                  isSelected
                                    ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(21,94,99,0.24)]"
                                    : "bg-surface-muted text-text-secondary hover:bg-canvas-softer hover:text-text-primary border border-border"
                                )}
                              >
                                {slot.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom schedule builder — shown when custom frequency is selected */}
                  {state.frequencyId === "custom" && (
                    <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" aria-hidden="true" />
                        <p className="text-sm font-bold text-text-primary">Build your custom schedule</p>
                      </div>
                      <WeeklyScheduleBuilder
                        value={state.customSchedules}
                        onChange={(schedules) => update("customSchedules", schedules)}
                      />
                    </div>
                  )}

                  {/* Start date picker — shown for all recurring plans */}
                  {state.frequencyId !== "once" && (
                    <div className="mt-5 rounded-2xl border border-border bg-surface-muted p-4">
                      <Field
                        label="Subscription start date"
                        htmlFor="startDate"
                        helper={
                          state.frequencyId === "custom"
                            ? "We will generate your first week of bookings from this date."
                            : `Your first ${state.frequencyId === "weekly" ? "weekly" : state.frequencyId === "biweekly" ? "biweekly" : "monthly"} cleaning will be on or after this date.`
                        }
                      >
                        <input
                          id="startDate"
                          type="date"
                          min={tomorrowISO()}
                          value={state.startDate}
                          onChange={(event) => update("startDate", event.target.value)}
                          className="booking-input"
                        />
                      </Field>
                      {state.frequencyId === "custom" && state.customSchedules.length > 0 && (
                        (() => {
                          const productGroups = state.customSchedules.reduce<Record<string, number>>((acc, s) => {
                            acc[s.product] = (acc[s.product] ?? 0) + 1;
                            return acc;
                          }, {});
                          const productCount = Object.keys(productGroups).length;
                          if (productCount <= 1) return null;
                          return (
                            <div className="mt-3 rounded-xl border border-info/20 bg-info/5 px-4 py-3">
                              <p className="text-xs font-bold text-info">MULTIPLE SERVICES SELECTED</p>
                              <p className="mt-1 text-sm text-text-secondary">
                                You have chosen {productCount} different cleaning types. We will create{" "}
                                <span className="font-bold text-text-primary">{productCount} separate plans</span> — one per
                                service type — so billing and scheduling stay clear.
                              </p>
                              <div className="mt-2 space-y-0.5">
                                {Object.entries(productGroups).map(([product, count]) => (
                                  <p key={product} className="text-xs text-text-secondary">
                                    → <span className="font-bold">{product}</span> ({count}× per week)
                                  </p>
                                ))}
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  )}
                </div>


                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Cleaner preference" htmlFor="cleanerPreference">
                    <select id="cleanerPreference" value={state.cleanerPreference} onChange={(event) => update("cleanerPreference", event.target.value)} className="booking-input">
                      <option value="best-match">Best available match</option>
                      <option value="same-cleaner">Prefer the same cleaner for recurring visits</option>
                      <option value="female-cleaner">Prefer a female cleaner when available</option>
                    </select>
                  </Field>
                  <Field label="Entry instructions" htmlFor="access" required>
                    <select id="access" value={state.access} onChange={(event) => update("access", event.target.value)} className="booking-input">
                      <option>I will be home</option>
                      <option>Doorman or front desk</option>
                      <option>Lockbox or smart lock</option>
                      <option>Call on arrival</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Parking or transit notes" htmlFor="parking" helper="Examples: loading zone, garage code, street parking, subway entrance." required>
                    <input id="parking" value={state.parking} onChange={(event) => update("parking", event.target.value)} className="booking-input" placeholder="Garage entrance on 8th Ave" />
                  </Field>
                  <Field label="Pets" htmlFor="pets">
                    <select id="pets" value={state.pets} onChange={(event) => update("pets", event.target.value)} className="booking-input">
                      <option>No pets</option>
                      <option>Cat at home</option>
                      <option>Dog at home</option>
                      <option>Multiple pets</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Cleaning supplies" htmlFor="supplies">
                    <select id="supplies" value={state.supplies} onChange={(event) => update("supplies", event.target.value)} className="booking-input">
                      <option>Bring professional supplies</option>
                      <option>I will provide supplies</option>
                    </select>
                  </Field>
                  <Field label="Priority notes" htmlFor="notes" helper="Mention fragile surfaces, heavy buildup, or rooms to skip.">
                    <textarea id="notes" value={state.notes} onChange={(event) => update("notes", event.target.value)} className="booking-input min-h-24 resize-y" placeholder="Please focus on the kitchen grout and guest bath." />
                  </Field>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Review and add contact details.</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    The cleaner gets the arrival notes after payment. You get confirmation by email and text.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="First name" htmlFor="firstName" required>
                    <input id="firstName" value={state.firstName} onChange={(event) => update("firstName", event.target.value)} autoComplete="given-name" className="booking-input" />
                  </Field>
                  <Field label="Last name" htmlFor="lastName" required>
                    <input id="lastName" value={state.lastName} onChange={(event) => update("lastName", event.target.value)} autoComplete="family-name" className="booking-input" />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Email" htmlFor="email" required>
                    <input id="email" type="email" value={state.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" className="booking-input" />
                  </Field>
                  <Field label="Mobile phone" htmlFor="phone" helper="Used only for arrival updates." required>
                    <input id="phone" type="tel" value={state.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" className="booking-input" placeholder="(212) 555-0148" />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SummaryTile icon={<MapPin className="size-5" />} title="Home" body={`${state.address}${state.unit ? `, ${state.unit}` : ""}, ${state.city} ${state.zip}`} />
                  <SummaryTile
                    icon={<CalendarDays className="size-5" />}
                    title="Schedule"
                    body={
                      state.frequencyId === "custom"
                        ? `Starts ${state.startDate || "Date not set"} (Custom weekly schedule)`
                        : `${state.date || "Date not set"} between ${currentArrival.label}`
                    }
                  />
                  <SummaryTile icon={<Sparkles className="size-5" />} title="Service" body={`${currentService.name}, ${state.hours} hr, ${state.cleaners} ${state.cleaners === 1 ? "cleaner" : "cleaners"}`} />
                  <SummaryTile icon={<KeyRound className="size-5" />} title="Arrival notes" body={`${state.access}. ${state.parking || "Parking notes missing"}`} />
                </div>
              </div>
            ) : null}

            {touched && errors.length > 0 ? (
              <div className="mt-6 rounded-2xl border border-error/30 bg-error/10 p-4 text-sm font-medium text-error" role="alert">
                {errors[0]}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={goBack} className="min-h-12 rounded-full px-5 text-sm font-bold text-text-secondary transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
                {step === 0 ? "Cancel" : "Back"}
              </button>
              <button type="button" onClick={continueFlow} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_rgba(21,94,99,0.20)] transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px">
                {step === 3 ? "Continue to payment" : "Continue"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Booking estimate">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(21,94,99,0.08)]">
            <div className="bg-primary p-5 text-primary-foreground">
              <p className="text-sm font-semibold text-primary-foreground/80">Live estimate</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-bold tracking-normal">${estimate.total.toFixed(0)}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{estimate.visitHours} visit hr × {estimate.cleanerCount} {estimate.cleanerCount === 1 ? "cleaner" : "cleaners"}</p>
                </div>
                <Clock3 className="mb-2 size-7 text-primary-foreground/80" aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-4 p-5">
              <EstimateRow label={`${currentService.name} labor`} value={`$${estimate.labor.toFixed(0)}`} />
              <EstimateRow label="Labor hours" value={`${estimate.laborHours.toFixed(1).replace(".0", "")} hr`} />
              {estimate.addonTotal > 0 ? <EstimateRow label="Extra tasks" value={`$${estimate.addonTotal.toFixed(0)}`} /> : null}
              {estimate.arrivalFee > 0 ? <EstimateRow label="Arrival window" value={`$${estimate.arrivalFee.toFixed(0)}`} /> : null}
              <EstimateRow label="Supplies" value={estimate.suppliesFee > 0 ? `$${estimate.suppliesFee}` : "Provided"} />
              <EstimateRow label="Service fee" value={`$${estimate.serviceFee}`} />
              <div className="border-t border-border pt-4">
                <EstimateRow label="Due today" value={`$${estimate.total.toFixed(2)}`} strong />
              </div>

              <div className="rounded-2xl bg-surface-muted p-4 text-sm leading-6 text-text-secondary">
                <div className="mb-2 flex items-center gap-2 font-bold text-text-primary">
                  <UserRound className="size-4 text-primary" aria-hidden="true" />
                  Cleaner match
                </div>
                A vetted cleaner is assigned after payment. If the scope changes on arrival, we confirm any price change first.
              </div>

              <Link href="/services" className="inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">
                Compare services
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  htmlFor,
  helper,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      {children}
      {helper ? <p className="mt-2 text-xs leading-5 text-text-secondary">{helper}</p> : null}
    </div>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex min-h-20 items-center justify-between rounded-2xl border border-border bg-surface-muted p-4">
      <span className="font-bold text-text-primary">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="size-11 rounded-full border border-border bg-surface text-xl font-bold text-text-primary transition hover:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30" aria-label={`Decrease ${label}`}>
          -
        </button>
        <span className="w-8 text-center text-lg font-bold tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="size-11 rounded-full border border-border bg-surface text-xl font-bold text-text-primary transition hover:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30" aria-label={`Increase ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}

function SelectCard({
  active,
  title,
  helper,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  helper: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-28 rounded-2xl border p-4 text-left transition active:translate-y-px",
        active ? "border-primary bg-primary/5" : "border-border bg-surface-muted hover:border-primary/40"
      )}
    >
      <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-surface text-primary">{icon}</span>
      <span className="block font-bold text-text-primary">{title}</span>
      <span className="mt-1 block text-sm leading-5 text-text-secondary">{helper}</span>
    </button>
  );
}

function SummaryTile({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
        {icon}
        {title}
      </div>
      <p className="text-sm leading-6 text-text-secondary">{body}</p>
    </div>
  );
}

function EstimateRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 text-sm", strong ? "font-bold text-text-primary" : "text-text-secondary")}>
      <span>{label}</span>
      <span className="text-right tabular-nums">{value}</span>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-background" />}>
      <BookingPageContent />
    </Suspense>
  );
}

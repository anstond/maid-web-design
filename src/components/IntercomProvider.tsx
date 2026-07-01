"use client";

import Intercom, { boot, showNewMessage, shutdown, trackEvent, update } from "@intercom/messenger-js-sdk";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  INTERCOM_CONTEXT_EVENT,
  INTERCOM_OPEN_COMPOSER_EVENT,
  INTERCOM_TRACK_EVENT,
  setIntercomContext,
  type IntercomConversionContext,
} from "@/lib/intercom-conversion";
import { accountProfile } from "@/lib/mock-account-data";

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "jemx2nkq";
const INTERCOM_PROMPT_STORAGE_PREFIX = "apartmentmaid_intercom_prompt_";
const BOOKING_NUDGE_IDLE_DELAY_MS = 45_000;
const CONTEXTUAL_NUDGE_DELAY_MS = 30_000;

type IntercomSettings = {
  app_id: string;
  api_base?: string;
  alignment?: "left" | "right";
  vertical_padding?: number;
  horizontal_padding?: number;
  z_index?: number;
  theme_mode?: "light" | "dark" | "system";
  action_color?: string;
  background_color?: string;
  email?: string;
  created_at?: number;
  name?: string;
  phone?: string;
  user_id?: string;
  page_title?: string;
  current_route?: string;
  funnel_stage?: string;
  selected_service?: string;
  quote_price_band?: string;
  booking_step?: number;
  city?: string;
  zip?: string;
  returning_status?: string;
};

type ConversionPrompt = {
  id: string;
  title: string;
  body: string;
  cta: string;
  prefill: string;
};

function unixSeconds(date: string) {
  return Math.floor(new Date(date).getTime() / 1000);
}

function isKnownSignedInRoute(pathname: string) {
  return pathname.startsWith("/account") || pathname.startsWith("/orders");
}

function getBaseSettings(): IntercomSettings {
  return {
    app_id: INTERCOM_APP_ID,
    alignment: "right",
    vertical_padding: 24,
    horizontal_padding: 24,
    z_index: 60,
    theme_mode: "system",
    action_color: "#155E63",
    background_color: "#155E63",
  };
}

function getIntercomSession(pathname: string) {
  if (!isKnownSignedInRoute(pathname)) {
    return {
      identityKey: "visitor",
      settings: getBaseSettings(),
    };
  }

  return {
    identityKey: `user:${accountProfile.email}`,
    settings: {
      ...getBaseSettings(),
      user_id: accountProfile.email,
      name: accountProfile.name,
      email: accountProfile.email,
      phone: accountProfile.phone,
      created_at: unixSeconds(accountProfile.memberSince),
    },
  };
}

function contextToSettings(pathname: string, context: IntercomConversionContext): Partial<IntercomSettings> {
  return {
    current_route: context.currentRoute ?? pathname,
    funnel_stage: context.funnelStage,
    selected_service: context.selectedService,
    quote_price_band: context.quotePriceBand,
    booking_step: context.bookingStep,
    city: context.city,
    zip: context.zip,
    returning_status: context.returningStatus,
  };
}

function getPromptStorageKey(id: string) {
  return `${INTERCOM_PROMPT_STORAGE_PREFIX}${id}`;
}

function hasSeenPrompt(id: string) {
  return sessionStorage.getItem(getPromptStorageKey(id));
}

function markPrompt(id: string, state: "shown" | "dismissed" | "asked") {
  sessionStorage.setItem(getPromptStorageKey(id), state);
}

function getBookingPromptCopy(step: number | undefined): ConversionPrompt {
  if (step === 0) {
    return {
      id: "booking_step_address",
      title: "Need help checking availability?",
      body: "We can help confirm your address, ZIP, and the best service area before you continue.",
      cta: "Ask about address and availability",
      prefill: "Hi, can you help me check address availability before I book?",
    };
  }

  if (step === 2) {
    return {
      id: "booking_step_timing",
      title: "Unsure about the best time?",
      body: "Ask us about arrival windows, cleaner preferences, or how long the visit should take.",
      cta: "Ask about timing",
      prefill: "Hi, I have a question about timing or cleaner preferences before booking.",
    };
  }

  if (step === 3) {
    return {
      id: "booking_step_review",
      title: "Want us to review this first?",
      body: "We can check supplies, access notes, parking, or special requests before payment.",
      cta: "Ask before review",
      prefill: "Hi, can you review my cleaning details before I continue to payment?",
    };
  }

  return {
    id: "booking_step_scope",
    title: "Need help choosing the right clean?",
    body: "Ask us about service type, extra tasks, supplies, or how many cleaners make sense.",
    cta: "Ask about supplies or access",
    prefill: "Hi, I have a question about cleaning type, supplies, or add-ons before booking.",
  };
}

function getContextualPrompt(pathname: string, context: IntercomConversionContext): ConversionPrompt | null {
  if (pathname === "/booking/checkout") return null;

  if (pathname === "/booking") {
    return getBookingPromptCopy(context.bookingStep);
  }

  if (context.funnelStage === "quote") {
    return {
      id: "quote_quote_help",
      title: "Need help choosing?",
      body: "We can sanity-check the quote, service type, and timing before you book.",
      cta: "Ask about this quote",
      prefill: "Hi, can you help me understand this cleaning quote before I book?",
    };
  }

  if (context.funnelStage === "services") {
    return {
      id: "services_pricing_timing",
      title: "Questions about pricing or timing?",
      body: "Ask us before you leave and we will help match the right cleaning plan.",
      cta: "Ask about pricing or timing",
      prefill: "Hi, I have a question about pricing or timing before booking a cleaning.",
    };
  }

  if (context.funnelStage === "homepage_hero") {
    return {
      id: "quote_homepage_hero",
      title: "Need help choosing?",
      body: "Tell us what you need cleaned and we will point you to the right option.",
      cta: "Ask a question",
      prefill: "Hi, I need help choosing the right cleaning service.",
    };
  }

  return null;
}

export function IntercomProvider() {
  const pathname = usePathname();
  const hasInitialized = useRef(false);
  const activeIdentityKey = useRef<string | null>(null);
  const [context, setContext] = useState<IntercomConversionContext>({});
  const [activePrompt, setActivePrompt] = useState<ConversionPrompt | null>(null);

  const session = useMemo(() => getIntercomSession(pathname), [pathname]);
  const settingsContext = useMemo(() => contextToSettings(pathname, context), [pathname, context]);

  useEffect(() => {
    setIntercomContext({
      currentRoute: pathname,
      funnelStage: pathname === "/booking/checkout" ? "checkout" : pathname === "/booking" ? "booking" : undefined,
      returningStatus: isKnownSignedInRoute(pathname) ? "signed_in" : "visitor",
    });
  }, [pathname]);

  useEffect(() => {
    if (!INTERCOM_APP_ID) return;

    const settings = {
      ...session.settings,
      ...settingsContext,
      page_title: document.title,
    };

    if (!hasInitialized.current) {
      Intercom(settings);
      hasInitialized.current = true;
      activeIdentityKey.current = session.identityKey;
      return;
    }

    if (activeIdentityKey.current !== session.identityKey) {
      shutdown();
      boot(settings);
      activeIdentityKey.current = session.identityKey;
      return;
    }

    update(settings);
  }, [session, settingsContext]);

  useEffect(() => {
    const handleContext = (event: Event) => {
      const nextContext = (event as CustomEvent<IntercomConversionContext>).detail;
      setContext((previous) => ({
        ...previous,
        ...nextContext,
        currentRoute: nextContext.currentRoute ?? previous.currentRoute ?? pathname,
      }));
    };

    const handleTrack = (event: Event) => {
      const detail = (event as CustomEvent<{ name: string; metadata?: Record<string, unknown> }>).detail;
      if (!detail?.name) return;
      trackEvent(detail.name, detail.metadata ?? {});
    };

    const handleOpenComposer = (event: Event) => {
      const detail = (event as CustomEvent<{ prefill: string }>).detail;
      if (!detail?.prefill) return;
      showNewMessage(detail.prefill);
    };

    window.addEventListener(INTERCOM_CONTEXT_EVENT, handleContext);
    window.addEventListener(INTERCOM_TRACK_EVENT, handleTrack);
    window.addEventListener(INTERCOM_OPEN_COMPOSER_EVENT, handleOpenComposer);

    return () => {
      window.removeEventListener(INTERCOM_CONTEXT_EVENT, handleContext);
      window.removeEventListener(INTERCOM_TRACK_EVENT, handleTrack);
      window.removeEventListener(INTERCOM_OPEN_COMPOSER_EVENT, handleOpenComposer);
    };
  }, [pathname]);

  useEffect(() => {
    const prompt = getContextualPrompt(pathname, context);
    if (!prompt) {
      queueMicrotask(() => setActivePrompt(null));
      return;
    }

    if (hasSeenPrompt(prompt.id)) return;

    let timeoutId: number | undefined;
    const delay = pathname === "/booking" ? BOOKING_NUDGE_IDLE_DELAY_MS : CONTEXTUAL_NUDGE_DELAY_MS;

    const markSeenAndShow = () => {
      if (hasSeenPrompt(prompt.id)) return;
      markPrompt(prompt.id, "shown");
      setActivePrompt(prompt);
      if (pathname === "/booking") {
        trackEvent("booking_step_idle", { prompt_id: prompt.id, booking_step: context.bookingStep ?? -1 });
      }
      trackEvent("chat_prompt_shown", { prompt_id: prompt.id, route: pathname });
    };

    const scheduleNudge = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(markSeenAndShow, delay);
    };

    scheduleNudge();

    window.addEventListener("pointerdown", scheduleNudge);
    window.addEventListener("keydown", scheduleNudge);
    window.addEventListener("scroll", scheduleNudge, { passive: true });

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("pointerdown", scheduleNudge);
      window.removeEventListener("keydown", scheduleNudge);
      window.removeEventListener("scroll", scheduleNudge);
    };
  }, [context, pathname]);

  const dismissPrompt = useCallback(() => {
    if (!activePrompt) return;
    markPrompt(activePrompt.id, "dismissed");
    setActivePrompt(null);
  }, [activePrompt]);

  const askPromptQuestion = useCallback(() => {
    if (!activePrompt) return;
    markPrompt(activePrompt.id, "asked");
    trackEvent("chat_prompt_clicked", { prompt_id: activePrompt.id, route: pathname });
    setActivePrompt(null);
    showNewMessage(activePrompt.prefill);
  }, [activePrompt, pathname]);

  return (
    <>
      {activePrompt ? (
        <aside
          aria-label="Conversion help"
          className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border bg-surface p-4 text-text-primary shadow-[0_18px_54px_rgba(31,41,55,0.16)] sm:right-6"
        >
          <button
            type="button"
            onClick={dismissPrompt}
            aria-label="Dismiss conversion help prompt"
            className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-[0.98]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>

          <div className="flex gap-3 pr-9">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold leading-5">{activePrompt.title}</p>
              <p className="mt-1 text-sm leading-5 text-text-secondary">{activePrompt.body}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={askPromptQuestion}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:scale-[0.98]"
          >
            {activePrompt.cta}
          </button>
        </aside>
      ) : null}
    </>
  );
}

export type IntercomConversionEventName =
  | "quote_started"
  | "quote_completed"
  | "booking_started"
  | "booking_step_viewed"
  | "booking_step_idle"
  | "chat_prompt_shown"
  | "chat_prompt_clicked"
  | "checkout_started";

export type IntercomConversionContext = {
  currentRoute?: string;
  funnelStage?: "homepage_hero" | "quote" | "services" | "booking" | "checkout" | "account" | "footer_contact";
  selectedService?: string;
  quotePriceBand?: string;
  bookingStep?: number;
  city?: string;
  zip?: string;
  returningStatus?: "visitor" | "signed_in";
};

export type IntercomEventMetadata = Record<string, string | number | boolean | null | undefined>;

export const INTERCOM_CONTEXT_EVENT = "apartmentmaid:intercom-context";
export const INTERCOM_TRACK_EVENT = "apartmentmaid:intercom-track";
export const INTERCOM_OPEN_COMPOSER_EVENT = "apartmentmaid:intercom-open-composer";

function dispatchBrowserEvent<T>(name: string, detail: T) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function setIntercomContext(context: IntercomConversionContext) {
  dispatchBrowserEvent(INTERCOM_CONTEXT_EVENT, context);
}

export function trackIntercomEvent(name: IntercomConversionEventName, metadata: IntercomEventMetadata = {}) {
  dispatchBrowserEvent(INTERCOM_TRACK_EVENT, { name, metadata });
}

export function openIntercomComposer(prefill: string) {
  dispatchBrowserEvent(INTERCOM_OPEN_COMPOSER_EVENT, { prefill });
}

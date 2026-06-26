"use client";

import { Suspense, useMemo, useState, useRef, useEffect } from "react";
import { WeeklyScheduleBuilder } from "@/components/WeeklyScheduleBuilder";
import { bookings, accountProfile } from "@/lib/mock-account-data";
import { MapPicker } from "@/components/MapPicker";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Briefcase,
  Home,
  KeyRound,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
  Plus,
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
  addressVerified: boolean;
  addressLabel: string;
  addressPhone: string;
};

const SERVICES = [
  {
    id: "standard" as const,
    name: "Standard clean",
    description: "Recurring upkeep for lived-in homes.",
    rate: 42,
    minimumHours: 2,
    maxHours: 9,
    cleanerOptions: [1, 2, 3, 4, 5, 6],
    included: ["Kitchen and bathrooms", "Dusting and floors", "Beds made with fresh linens"],
  },
  {
    id: "deep" as const,
    name: "Deep clean",
    description: "First visit, seasonal reset, or heavier buildup.",
    rate: 54,
    minimumHours: 2,
    maxHours: 9,
    cleanerOptions: [1, 2, 3, 4, 5, 6],
    included: ["Standard clean", "Baseboards and doors", "Heavy buildup attention"],
  },
  {
    id: "move" as const,
    name: "Move clean",
    description: "Empty-home clean before keys change hands.",
    rate: 58,
    minimumHours: 2,
    maxHours: 9,
    cleanerOptions: [1, 2, 3, 4, 5, 6],
    included: ["Inside cabinets", "Appliance exteriors", "Closets and empty rooms"],
  },
  {
    id: "office" as const,
    name: "Small office",
    description: "Workspaces, studios, and storefronts.",
    rate: 50,
    minimumHours: 2,
    maxHours: 9,
    cleanerOptions: [1, 2, 3, 4, 5, 6],
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
  addressVerified: true,
  addressLabel: "",
  addressPhone: "",
};

const SAVED_ADDRESSES = [
  { 
    label: "Home", 
    isDefault: true,
    iconType: "home",
    address: "225 West 23rd Street", 
    unit: "Apt 4B", 
    zip: "10011", 
    city: "New York",
    bedrooms: 2,
    bathrooms: 2,
    homeType: "Apartment",
    phone: "212-555-0101"
  },
  { 
    label: "Office", 
    isDefault: false,
    iconType: "office",
    address: "19 Mercer Street", 
    unit: "Floor 3", 
    zip: "10012", 
    city: "New York",
    bedrooms: 0,
    bathrooms: 1,
    homeType: "Office",
    phone: "212-555-0102"
  },
  { 
    label: "Brooklyn Loft", 
    isDefault: false,
    iconType: "home",
    address: "55 Water Street", 
    unit: "Unit 201", 
    zip: "11201", 
    city: "Brooklyn",
    bedrooms: 1,
    bathrooms: 1.5,
    homeType: "Apartment",
    phone: "718-555-0103"
  },
  { 
    label: "Parents' House", 
    isDefault: false,
    iconType: "home",
    address: "142 Elmwood Ave", 
    unit: "", 
    zip: "07030", 
    city: "Hoboken",
    bedrooms: 4,
    bathrooms: 3,
    homeType: "House",
    phone: "201-555-0104"
  },
  { 
    label: "Studio", 
    isDefault: false,
    iconType: "home",
    address: "742 Evergreen Terrace", 
    unit: "Apt 1", 
    zip: "10021", 
    city: "New York",
    bedrooms: 0,
    bathrooms: 1,
    homeType: "Apartment",
    phone: "212-555-0105"
  },
  { 
    label: "Gym Office", 
    isDefault: false,
    iconType: "office",
    address: "300 Broadway", 
    unit: "Suite 4", 
    zip: "10007", 
    city: "New York",
    bedrooms: 0,
    bathrooms: 2,
    homeType: "Office",
    phone: "212-555-0106"
  },
  { 
    label: "Vacation Rental", 
    isDefault: false,
    iconType: "home",
    address: "88 Ocean Parkway", 
    unit: "Penthouse", 
    zip: "11218", 
    city: "Brooklyn",
    bedrooms: 3,
    bathrooms: 2.5,
    homeType: "Apartment",
    phone: "718-555-0107"
  },
  { 
    label: "Manhattan Flat", 
    isDefault: false,
    iconType: "home",
    address: "12 Pine Street", 
    unit: "Apt 12A", 
    zip: "10005", 
    city: "New York",
    bedrooms: 2,
    bathrooms: 1,
    homeType: "Apartment",
    phone: "212-555-0108"
  },
  { 
    label: "Townhouse", 
    isDefault: false,
    iconType: "home",
    address: "413 West 14th Street", 
    unit: "", 
    zip: "10014", 
    city: "New York",
    bedrooms: 3,
    bathrooms: 3,
    homeType: "Townhouse",
    phone: "212-555-0109"
  },
  { 
    label: "Co-working Space", 
    isDefault: false,
    iconType: "office",
    address: "154 Grand Street", 
    unit: "Desk 42", 
    zip: "10013", 
    city: "New York",
    bedrooms: 0,
    bathrooms: 1,
    homeType: "Office",
    phone: "212-555-0110"
  }
];

const SUGGESTED_PLACES = [
  { address: "225 West 23rd Street", zip: "10011", city: "New York" },
  { address: "19 Mercer Street", zip: "10012", city: "New York" },
  { address: "55 Water Street", zip: "11201", city: "Brooklyn" },
  { address: "142 Elmwood Ave", zip: "07030", city: "Hoboken" },
  { address: "742 Evergreen Terrace", zip: "10021", city: "New York" },
  { address: "300 Broadway", zip: "10007", city: "New York" },
  { address: "88 Ocean Parkway", zip: "11218", city: "Brooklyn" },
  { address: "12 Pine Street", zip: "10005", city: "New York" },
  { address: "413 West 14th Street", zip: "10014", city: "New York" },
  { address: "154 Grand Street", zip: "10013", city: "New York" },
  { address: "109 Mercer Street", zip: "10012", city: "New York" },
  { address: "72 Central Park West", zip: "10023", city: "New York" },
  { address: "1560 Broadway", zip: "10036", city: "New York" },
  { address: "120 St Marks Place", zip: "10009", city: "New York" },
];

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
  const initialZip = searchParams.get("zip") ?? "";

  const initialStep = useMemo(() => {
    const stepVal = searchParams.get("step");
    if (!stepVal) return 0;
    const parsed = parseInt(stepVal, 10);
    return isNaN(parsed) || parsed < 0 || parsed > 3 ? 0 : parsed;
  }, [searchParams]);

  const [step, setStep] = useState(initialStep);
  const [showEditContact, setShowEditContact] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapPreQuery, setMapPreQuery] = useState("");
  const [isEditingCustomAddress, setIsEditingCustomAddress] = useState(false);
  const addressScrollRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<typeof SUGGESTED_PLACES>([]);

  const handleAddressChange = (val: string) => {
    update("address", val);
    update("addressVerified", false);

    if (val.trim().length > 1) {
      const filtered = SUGGESTED_PLACES.filter((place) =>
        place.address.toLowerCase().includes(val.toLowerCase())
      );
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (place: typeof SUGGESTED_PLACES[0]) => {
    update("address", place.address);
    update("zip", place.zip);
    update("city", place.city);
    update("addressVerified", true);
    setShowSuggestions(false);
  };

  const scrollAddresses = (direction: "left" | "right") => {
    if (addressScrollRef.current) {
      const scrollAmount = 340; // width + gap
      addressScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const pastCleaners = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      if (b.status === "completed" && b.cleaner) {
        b.cleaner.split(/ and |,/).forEach((name) => {
          const trimmed = name.trim();
          if (trimmed && trimmed !== "Assignment pending") {
            set.add(trimmed);
          }
        });
      }
    });
    return Array.from(set);
  }, []);

  const [state, setState] = useState<BookingState>(() => {
    const defaultAddr = SAVED_ADDRESSES.find((a) => a.isDefault) ?? SAVED_ADDRESSES[0];
    
    const initialServiceId = (searchParams.get("service") as ServiceId) || "standard";
    const initialFrequencyId = (searchParams.get("frequency") as FrequencyId) || "once";
    const initialHours = searchParams.get("hours") ? parseInt(searchParams.get("hours")!, 10) : 3;
    const initialCleaners = searchParams.get("cleaners") ? parseInt(searchParams.get("cleaners")!, 10) : 1;
    const initialStartDate = searchParams.get("startDate") ?? "";
    const initialDate = searchParams.get("date") ?? "";
    const initialArrivalWindow = searchParams.get("arrivalWindow") ?? "10:00 AM";
    const initialCleanerPreference = searchParams.get("cleanerPreference") ?? "best-match";
    const initialAccess = searchParams.get("access") ?? "I will be home";
    const initialParking = searchParams.get("parking") ?? "";
    const initialPets = searchParams.get("pets") ?? "No pets";
    const initialSupplies = searchParams.get("supplies") ?? "Bring professional supplies";
    const initialAddons = searchParams.get("addons") ? searchParams.get("addons")!.split(",") : [];

    return {
      ...INITIAL_STATE,
      firstName: accountProfile.name.split(" ")[0] || "",
      lastName: accountProfile.name.split(" ").slice(1).join(" ") || "",
      email: accountProfile.email || "",
      phone: accountProfile.phone || "",
      serviceId: SERVICES.some((service) => service.id === initialServiceId)
        ? (initialServiceId as ServiceId)
        : INITIAL_STATE.serviceId,
      zip: initialZip.replace(/\D/g, "").slice(0, 5) || (defaultAddr ? defaultAddr.zip : ""),
      address: defaultAddr ? defaultAddr.address : "",
      unit: defaultAddr ? defaultAddr.unit : "",
      city: defaultAddr ? defaultAddr.city : "New York",
      bedrooms: defaultAddr ? defaultAddr.bedrooms : 1,
      bathrooms: defaultAddr ? defaultAddr.bathrooms : 1,
      homeType: defaultAddr ? defaultAddr.homeType : "Apartment",
      addressVerified: defaultAddr ? true : false,
      addressLabel: defaultAddr ? defaultAddr.label : "",
      addressPhone: defaultAddr ? defaultAddr.phone : "",
      hours: initialHours,
      cleaners: initialCleaners,
      frequencyId: initialFrequencyId,
      startDate: initialStartDate,
      date: initialDate,
      arrivalWindow: initialArrivalWindow,
      cleanerPreference: initialCleanerPreference,
      access: initialAccess,
      parking: initialParking,
      pets: initialPets,
      supplies: initialSupplies,
      addons: initialAddons,
    };
  });

  // Effect to synchronize state and step to URL search params (non-PII only)
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("step", String(step));
    params.set("service", state.serviceId);
    params.set("hours", String(state.hours));
    params.set("cleaners", String(state.cleaners));
    params.set("frequency", state.frequencyId);
    if (state.startDate) params.set("startDate", state.startDate);
    if (state.date) params.set("date", state.date);
    params.set("arrivalWindow", state.arrivalWindow);
    params.set("cleanerPreference", state.cleanerPreference);
    params.set("access", state.access);
    if (state.parking) params.set("parking", state.parking);
    params.set("pets", state.pets);
    params.set("supplies", state.supplies);
    if (state.addons && state.addons.length > 0) {
      params.set("addons", state.addons.join(","));
    }
    if (state.zip) params.set("zip", state.zip);

    const newSearch = `?${params.toString()}`;
    if (typeof window !== "undefined" && window.location.search !== newSearch) {
      router.replace(`/booking${newSearch}`, { scroll: false });
    }
  }, [
    step,
    state.serviceId,
    state.hours,
    state.cleaners,
    state.frequencyId,
    state.startDate,
    state.date,
    state.arrivalWindow,
    state.cleanerPreference,
    state.access,
    state.parking,
    state.pets,
    state.supplies,
    state.addons,
    state.zip,
    router,
  ]);

  // Listen for browser navigation (back/forward) changes in searchParams
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stepVal = searchParams.get("step");
      if (stepVal !== null) {
        const parsedStep = parseInt(stepVal, 10);
        if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep <= 3 && parsedStep !== step) {
          setStep(parsedStep);
        }
      }

      setState((previous) => {
        let changed = false;
        const nextState = { ...previous };

        const serviceVal = searchParams.get("service");
        if (serviceVal && SERVICES.some(s => s.id === serviceVal) && serviceVal !== previous.serviceId) {
          nextState.serviceId = serviceVal as ServiceId;
          changed = true;
        }

        const hoursVal = searchParams.get("hours");
        if (hoursVal) {
          const parsed = parseInt(hoursVal, 10);
          if (!isNaN(parsed) && parsed !== previous.hours) {
            nextState.hours = parsed;
            changed = true;
          }
        }

        const cleanersVal = searchParams.get("cleaners");
        if (cleanersVal) {
          const parsed = parseInt(cleanersVal, 10);
          if (!isNaN(parsed) && parsed !== previous.cleaners) {
            nextState.cleaners = parsed;
            changed = true;
          }
        }

        const frequencyVal = searchParams.get("frequency");
        if (frequencyVal && FREQUENCIES.some(f => f.id === frequencyVal) && frequencyVal !== previous.frequencyId) {
          nextState.frequencyId = frequencyVal as FrequencyId;
          changed = true;
        }

        const startDateVal = searchParams.get("startDate");
        if (startDateVal !== null && startDateVal !== previous.startDate) {
          nextState.startDate = startDateVal;
          changed = true;
        }

        const dateVal = searchParams.get("date");
        if (dateVal !== null && dateVal !== previous.date) {
          nextState.date = dateVal;
          changed = true;
        }

        const arrivalWindowVal = searchParams.get("arrivalWindow");
        if (arrivalWindowVal && arrivalWindowVal !== previous.arrivalWindow) {
          nextState.arrivalWindow = arrivalWindowVal;
          changed = true;
        }

        const cleanerPrefVal = searchParams.get("cleanerPreference");
        if (cleanerPrefVal && cleanerPrefVal !== previous.cleanerPreference) {
          nextState.cleanerPreference = cleanerPrefVal;
          changed = true;
        }

        const accessVal = searchParams.get("access");
        if (accessVal && accessVal !== previous.access) {
          nextState.access = accessVal;
          changed = true;
        }

        const parkingVal = searchParams.get("parking");
        if (parkingVal !== null && parkingVal !== previous.parking) {
          nextState.parking = parkingVal;
          changed = true;
        }

        const petsVal = searchParams.get("pets");
        if (petsVal && petsVal !== previous.pets) {
          nextState.pets = petsVal;
          changed = true;
        }

        const suppliesVal = searchParams.get("supplies");
        if (suppliesVal && suppliesVal !== previous.supplies) {
          nextState.supplies = suppliesVal;
          changed = true;
        }

        const zipVal = searchParams.get("zip");
        if (zipVal && zipVal !== previous.zip) {
          nextState.zip = zipVal;
          changed = true;
        }

        const addonsVal = searchParams.get("addons");
        const nextAddons = addonsVal ? addonsVal.split(",") : [];
        if (JSON.stringify(nextAddons) !== JSON.stringify(previous.addons)) {
          nextState.addons = nextAddons;
          changed = true;
        }

        return changed ? nextState : previous;
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [searchParams, step]);

  const currentService = SERVICES.find((service) => service.id === state.serviceId) ?? SERVICES[0];
  const currentFrequency = FREQUENCIES.find((frequency) => frequency.id === state.frequencyId) ?? FREQUENCIES[0];
  const currentArrival = ARRIVAL_WINDOWS.find((window) => window.id === state.arrivalWindow) ?? ARRIVAL_WINDOWS[1];
  const currentServiceName = currentService.name;
  const currentServiceRate = currentService.rate;
  const currentServiceMinimumHours = currentService.minimumHours;
  const currentServiceMaxHours = currentService.maxHours;
  const hourOptions = getHourOptions(currentService.minimumHours, currentService.maxHours);
  const cleanerOptions = currentService.cleanerOptions;
  const dateOptions = useMemo(() => getDateOptions(), []);
  const recommendedHours = (() => {
    const homeHours = 1.6 + state.bedrooms * 0.55 + state.bathrooms * 0.65;
    const addonHours = state.addons.reduce((sum, id) => {
      const addon = ADDONS.find((item) => item.id === id);
      return sum + (addon?.minutes ?? 0) / 60;
    }, 0);
    const soloHours = Math.max(currentServiceMinimumHours, homeHours + addonHours);
    const visitHours = Math.ceil((soloHours / state.cleaners) * 2) / 2;
    return Math.min(currentServiceMaxHours, Math.max(Math.ceil(currentServiceMinimumHours), Math.ceil(visitHours)));
  })();

  const estimate = (() => {
    const visitHours = Math.max(currentServiceMinimumHours, state.hours);
    const laborHours = visitHours * state.cleaners;
    const labor = laborHours * currentServiceRate;
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
  })();

  const isSavedAddressActive = useMemo(() => {
    if (isEditingCustomAddress) return false;
    return SAVED_ADDRESSES.some(
      (addr) => state.address === addr.address && state.unit === addr.unit
    );
  }, [state.address, state.unit, isEditingCustomAddress]);

  const errors = (() => {
    const result: string[] = [];
    if (step === 0) {
      if (state.zip.length !== 5) result.push("Enter a 5-digit ZIP code.");
      if (!state.address.trim()) result.push("Enter the street address.");
    }
    if (step === 1) {
      if (!hourOptions.includes(state.hours)) result.push(`Choose ${hourOptions[0]}-${hourOptions[hourOptions.length - 1]} hours for ${currentServiceName}.`);
      if (!cleanerOptions.includes(state.cleaners)) result.push(`Choose an available cleaner count for ${currentServiceName}.`);
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
  })();

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

    if (step === 0 && !state.addressVerified) {
      setMapPreQuery(state.address);
      setIsMapOpen(true);
      return;
    }

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
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setTouched(false);
    if (step === 0) {
      router.push("/");
      return;
    }
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const steps = ["Home", "Scope", "Schedule", "Review"];
  const homeStepReady = state.zip.length === 5 && Boolean(state.address.trim());
  const homeContinueLabel = homeStepReady
    ? isSavedAddressActive
      ? "Use this address"
      : "Save and continue"
    : "Choose an address";

  return (
    <main className="min-h-[100dvh] bg-background pb-24 text-text-primary lg:pb-0">
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

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 md:gap-8 md:py-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-12">
        <section aria-labelledby="booking-title" className="min-w-0">
          <div className="mb-6 md:mb-8">
            <p className="mb-3 text-sm font-semibold text-primary">Book a home cleaning</p>
            <h1 id="booking-title" className="max-w-3xl text-3xl font-bold leading-tight tracking-normal text-text-primary sm:text-4xl md:text-5xl">
              A real appointment, priced before checkout.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Tell us where, what needs attention, and how the cleaner should enter. We match the job to the right visit length before payment.
            </p>
          </div>

          <nav aria-label="Booking progress" className="mb-4 rounded-2xl border border-border bg-surface p-1.5 sm:p-2 md:mb-6">
            <ol className="grid grid-cols-4 gap-1">
              {steps.map((label, index) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= step) setStep(index);
                    }}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl px-1.5 text-xs font-semibold transition sm:gap-2 sm:px-2 sm:text-sm",
                      index === step && "bg-primary text-primary-foreground",
                      index < step && "bg-surface-muted text-primary",
                      index > step && "text-text-secondary"
                    )}
                    aria-current={index === step ? "step" : undefined}
                  >
                    {index < step ? <Check className="size-4" aria-hidden="true" /> : null}
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mb-4 rounded-2xl border border-border bg-primary p-4 text-primary-foreground shadow-[0_12px_30px_rgba(21,94,99,0.16)] lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-normal text-primary-foreground/75">Live estimate</p>
            <div className="mt-1 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold tracking-normal">${estimate.total.toFixed(0)}</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  {estimate.visitHours} visit hr x {estimate.cleanerCount} {estimate.cleanerCount === 1 ? "cleaner" : "cleaners"}
                </p>
              </div>
              <Clock3 className="mb-1 size-6 text-primary-foreground/80" aria-hidden="true" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_40px_rgba(21,94,99,0.08)] sm:p-7">
            {step === 0 ? (
              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">1</span>
                      Choose the service address
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">Where should we send the cleaner?</h2>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      Select one saved address below, or add a new one. The selected address is what we use for availability and the next step.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary px-5 text-sm font-bold text-primary transition hover:bg-primary/5 sm:w-auto cursor-pointer"
                  >
                    <MapPin className="size-4" />
                    Select on Map
                  </button>
                </div>

                {/* Saved Addresses Section */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                      <p className="text-sm font-bold text-text-primary">Your Saved Addresses</p>
                      <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-bold text-text-secondary">
                        Swipe to see more
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          update("address", "");
                          update("unit", "");
                          update("zip", "");
                          update("city", "");
                          update("bedrooms", 1);
                          update("bathrooms", 1);
                          update("homeType", "Apartment");
                          update("addressVerified", false);
                          update("addressLabel", "");
                          update("addressPhone", "");
                          setIsEditingCustomAddress(true);
                        }}
                        className="inline-flex min-h-9 items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary transition hover:bg-primary/20 active:scale-95 cursor-pointer focus-visible:outline-none"
                      >
                        <Plus className="size-3" /> Add New
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => scrollAddresses("left")}
                        className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition hover:border-primary/45 hover:bg-surface-muted active:scale-95 cursor-pointer"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollAddresses("right")}
                        className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition hover:border-primary/45 hover:bg-surface-muted active:scale-95 cursor-pointer"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="pointer-events-none absolute bottom-4 right-0 top-0 z-10 w-12 bg-gradient-to-l from-surface to-transparent sm:hidden" aria-hidden="true" />
                    <div
                      ref={addressScrollRef}
                      className="-mx-4 flex flex-row flex-nowrap gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] sm:mx-0 sm:gap-4 sm:px-0 [&::-webkit-scrollbar]:hidden"
                    >
                      {SAVED_ADDRESSES.map((addr) => {
                        const isMatch = state.address === addr.address && state.unit === addr.unit;
                        return (
                          <button
                            key={addr.label}
                            type="button"
                            onClick={() => {
                              update("address", addr.address);
                              update("unit", addr.unit);
                              update("zip", addr.zip);
                              update("city", addr.city);
                              update("bedrooms", addr.bedrooms);
                              update("bathrooms", addr.bathrooms);
                              update("homeType", addr.homeType);
                              update("addressVerified", true);
                              update("addressLabel", addr.label);
                              update("addressPhone", addr.phone);
                              setIsEditingCustomAddress(false);
                            }}
                            className={cn(
                              "relative flex w-[min(82vw,320px)] shrink-0 snap-start items-start gap-4 rounded-2xl border p-4 text-left transition duration-200 active:translate-y-px sm:p-5 cursor-pointer",
                              isMatch
                                ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(21,94,99,0.10)]"
                                : "border-border bg-surface hover:border-primary/40 hover:bg-surface-muted"
                            )}
                          >
                            <div className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-full text-primary",
                              isMatch ? "bg-primary/15" : "bg-surface-muted"
                            )}>
                              {addr.iconType === "home" ? <Home className="size-5" /> : <Briefcase className="size-5" />}
                            </div>
                            
                            <div className="flex-1 min-w-0 pr-6">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-text-primary text-sm truncate">{addr.label}</span>
                                {addr.isDefault && (
                                  <span className="inline-block shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Default</span>
                                )}
                              </div>
                              <p className="mt-1.5 text-sm font-semibold text-text-primary truncate">
                                {addr.address}{addr.unit ? `, ${addr.unit}` : ""}
                              </p>
                              <p className="text-xs text-text-secondary mt-0.5 truncate">
                                {addr.city} {addr.zip}
                              </p>
                              <p className="text-xs text-primary font-semibold mt-2 truncate">
                                {addr.bedrooms > 0 ? `${addr.bedrooms} bed` : "Studio"} · {addr.bathrooms} bath · {addr.homeType}
                              </p>
                            </div>

                            {isMatch && (
                              <span className="absolute right-3 top-3 inline-flex min-h-7 items-center gap-1 rounded-full bg-primary px-2.5 text-[11px] font-bold text-white">
                                <Check className="size-3" strokeWidth={3} />
                                Selected
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {isSavedAddressActive ? (
                  <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 animate-fade-in sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0">
                      <p className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                        <Check className="size-3" aria-hidden="true" />
                        Ready to continue
                      </p>
                      <p className="mt-1 text-base font-bold text-text-primary">
                        {state.address}{state.unit ? `, ${state.unit}` : ""}
                      </p>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {state.city} {state.zip}
                      </p>
                      <p className="text-xs text-text-secondary mt-1.5 font-medium">
                        {state.bedrooms > 0 ? `${state.bedrooms} bedrooms` : "Studio"} · {state.bathrooms} bathrooms · {state.homeType}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingCustomAddress(true);
                      }}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-primary px-4 text-xs font-bold text-primary transition hover:bg-primary/5 active:scale-95 sm:w-auto cursor-pointer"
                    >
                      Change or Edit Details
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    <div className="rounded-2xl border border-border bg-surface-muted p-4">
                      <p className="text-sm font-bold text-text-primary">Add a new address</p>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        Fill the required address fields below. When the address is complete, Continue will move you to scope.
                      </p>
                    </div>
                    <div className="relative grid gap-4 md:grid-cols-[1fr_150px]">
                      <Field
                        label={
                          <div className="flex flex-wrap items-center gap-2">
                            <span>Street address</span>
                            {state.address.trim() && state.addressVerified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                <Check className="size-3" strokeWidth={3} /> Verified
                              </span>
                            )}
                          </div>
                        }
                        htmlFor="address"
                        required
                      >
                        <div className="relative flex items-center">
                          <input
                            id="address"
                            value={state.address}
                            onChange={(event) => handleAddressChange(event.target.value)}
                            onFocus={() => {
                              if (state.address) {
                                handleAddressChange(state.address);
                              }
                            }}
                            onBlur={() => {
                              // Allow clicking the suggestions before hiding them
                              setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            autoComplete="off"
                            className="booking-input pr-12"
                            placeholder="225 West 23rd Street"
                          />
                          <button
                            type="button"
                            onClick={() => setIsMapOpen(true)}
                            className="absolute right-2 flex size-10 items-center justify-center rounded-full text-primary transition hover:bg-surface-muted active:scale-95 cursor-pointer"
                            title="Select on map"
                          >
                            <MapPin className="size-5" />
                          </button>

                          {showSuggestions && searchSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-surface py-2 shadow-lg">
                              {searchSuggestions.map((place) => (
                                <button
                                  key={place.address}
                                  type="button"
                                  onClick={() => handleSelectSuggestion(place)}
                                  className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-surface-muted transition text-text-primary flex flex-col cursor-pointer"
                                >
                                  <span className="text-text-primary">{place.address}</span>
                                  <span className="text-xs text-text-secondary">{place.city}, {place.zip}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </Field>
                      <Field label="Apt, suite" htmlFor="unit">
                        <input id="unit" value={state.unit} onChange={(event) => update("unit", event.target.value)} autoComplete="address-line2" className="booking-input" placeholder="4B" />
                      </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_150px_200px]">
                      <Field label="City" htmlFor="city" required>
                        <input id="city" value={state.city} onChange={(event) => update("city", event.target.value)} autoComplete="address-level2" className="booking-input" />
                      </Field>
                      <Field label="ZIP code" htmlFor="zip" required>
                        <input id="zip" value={state.zip} onChange={(event) => update("zip", event.target.value.replace(/\D/g, "").slice(0, 5))} autoComplete="postal-code" inputMode="numeric" className="booking-input" placeholder="10001" />
                      </Field>
                      <Field label="Phone at address" htmlFor="addressPhone" helper="For delivery/entry updates at this location">
                        <input id="addressPhone" value={state.addressPhone} onChange={(event) => update("addressPhone", event.target.value)} autoComplete="tel" className="booking-input" placeholder="(555) 000-0000" />
                      </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_250px]">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-text-primary">Home type</label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <SelectCard active={state.homeType === "Apartment"} title="Apartment" onClick={() => update("homeType", "Apartment")} icon={<Home className="size-5" />} />
                          <SelectCard active={state.homeType === "House"} title="House" onClick={() => update("homeType", "House")} icon={<Home className="size-5" />} />
                          <SelectCard active={state.homeType === "Office"} title="Office" onClick={() => update("homeType", "Office")} icon={<Briefcase className="size-5" />} />
                        </div>
                      </div>
                      <Field label="Address label" htmlFor="addressLabel" helper="e.g. Home, Office, Beach House">
                        <input id="addressLabel" value={state.addressLabel} onChange={(event) => update("addressLabel", event.target.value)} className="booking-input" placeholder="e.g. My Loft" />
                      </Field>
                    </div>
                  </div>
                )}
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

                <div className="grid gap-3 rounded-[1.5rem] border border-border/80 bg-surface-muted/60 p-2 shadow-[0_8px_30px_rgba(21,94,99,0.03)] md:grid-cols-[1.2fr_0.8fr] md:rounded-[2rem] md:p-2.5">
                  <div className="flex flex-col justify-between gap-5 rounded-[1rem] border border-border/60 bg-surface p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85)] sm:p-6 md:rounded-[calc(2rem-0.625rem)]">
                    <div>
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold tracking-tight text-text-primary">Visit hours</h3>
                            {state.hours === recommendedHours && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary animate-fade-in">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed text-text-secondary">
                            {currentService.name} allows {hourOptions[0]}-{hourOptions[hourOptions.length - 1]} hours. Recommended: {recommendedHours} hours.
                          </p>
                        </div>
                        {state.hours !== recommendedHours && (
                          <button
                            type="button"
                            onClick={() => update("hours", recommendedHours)}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary/25 bg-surface px-4 py-1 text-xs font-bold text-primary transition-all duration-300 hover:border-primary hover:bg-primary/5 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
                          >
                            <Sparkles className="size-3" />
                            Use recommended
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {hourOptions.map((hours) => {
                          const isSelected = state.hours === hours;
                          const isRec = hours === recommendedHours;
                          return (
                            <button
                              key={hours}
                              type="button"
                              onClick={() => update("hours", hours)}
                              className={cn(
                                "min-h-12 rounded-xl border text-sm font-bold transition-all duration-300 active:scale-95 cursor-pointer relative overflow-hidden",
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10"
                                  : "border-border bg-surface text-text-primary hover:border-primary/45 hover:bg-surface-muted/30"
                              )}
                            >
                              <span>{hours} hr</span>
                              {isRec && !isSelected && (
                                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-5 rounded-[1rem] border border-border/60 bg-surface p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85)] sm:p-6 md:rounded-[calc(2rem-0.625rem)]">
                    <div>
                      <h3 className="mb-1 text-lg font-bold tracking-tight text-text-primary">Cleaner count</h3>
                      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                        Labor hours are visit hours multiplied by cleaner count.
                      </p>
                      <div className="grid gap-2">
                        {cleanerOptions.map((cleaners) => {
                          const isSelected = state.cleaners === cleaners;
                          return (
                            <button
                              key={cleaners}
                              type="button"
                              onClick={() => update("cleaners", cleaners)}
                              className={cn(
                                "flex min-h-12 items-center justify-between rounded-xl border px-4 text-sm font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer",
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10"
                                  : "border-border bg-surface text-text-primary hover:border-primary/45 hover:bg-surface-muted/30"
                              )}
                            >
                              <span>{cleaners} {cleaners === 1 ? "cleaner" : "cleaners"}</span>
                              <span className={isSelected ? "text-primary-foreground/80" : "text-text-secondary"}>
                                {(state.hours * cleaners).toFixed(1).replace(".0", "")} labor hr
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
                                    : "border border-border bg-surface-muted text-text-secondary hover:bg-accent-soft hover:text-text-primary"
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
                                    <span className="font-bold">{product}</span> ({count}x per week)
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


                {/* Cleaner Preference Section (Premium Cards) */}
                <div className="border-t border-border/55 pt-6">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-text-primary">Cleaner preference</h3>
                    {pastCleaners.length > 0 ? (
                      <p className="mt-1 text-sm text-text-secondary">
                        You have cleaned with <span className="font-semibold text-primary">{pastCleaners.join(" and ")}</span> before. Select them to request them again.
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-text-secondary">
                        Choose who you would prefer to assign to your booking.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Best available match */}
                    <button
                      type="button"
                      onClick={() => update("cleanerPreference", "best-match")}
                      className={cn(
                        "relative flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition active:translate-y-px",
                        state.cleanerPreference === "best-match"
                          ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(21,94,99,0.10)]"
                          : "border-border bg-surface hover:border-primary/40 cursor-pointer"
                      )}
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Sparkles className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="block font-bold text-text-primary text-sm">Best available match</span>
                        <span className="mt-1 block text-xs leading-normal text-text-secondary">We will match the highest-rated cleaner in your area.</span>
                      </div>
                      {state.cleanerPreference === "best-match" && (
                        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      )}
                    </button>

                    {/* Past cleaners */}
                    {pastCleaners.map((cleaner) => {
                      const cleanerValue = `prefer-${cleaner.toLowerCase().replace(/\s+/g, "-")}`;
                      const isActive = state.cleanerPreference === cleanerValue;
                      const initials = cleaner.split(" ").map(n => n[0]).join("");
                      return (
                        <button
                          key={cleaner}
                          type="button"
                          onClick={() => update("cleanerPreference", cleanerValue)}
                          className={cn(
                            "relative flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition active:translate-y-px",
                            isActive
                              ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(21,94,99,0.10)]"
                              : "border-border bg-surface hover:border-primary/40 cursor-pointer"
                          )}
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-warm/25 text-primary font-bold text-sm">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="block font-bold text-text-primary text-sm">{cleaner}</span>
                              <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary tracking-wide uppercase shrink-0">Past Cleaner</span>
                            </div>
                            <span className="mt-1 block text-xs leading-normal text-text-secondary">Assigned previously. Highly rated, knows your home setup.</span>
                          </div>
                          {isActive && (
                            <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                              <Check className="size-3" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Prefer same cleaner (only if recurring plan) */}
                    {state.frequencyId !== "once" && (
                      <button
                        type="button"
                        onClick={() => update("cleanerPreference", "same-cleaner")}
                        className={cn(
                          "relative flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition active:translate-y-px",
                          state.cleanerPreference === "same-cleaner"
                            ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(21,94,99,0.10)]"
                            : "border-border bg-surface hover:border-primary/40 cursor-pointer"
                        )}
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          <UserRound className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <span className="block font-bold text-text-primary text-sm">Keep same cleaner</span>
                          <span className="mt-1 block text-xs leading-normal text-text-secondary">Keep the same professional for subsequent recurring cleanings.</span>
                        </div>
                        {state.cleanerPreference === "same-cleaner" && (
                          <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    )}

                    {/* Prefer female cleaner */}
                    <button
                      type="button"
                      onClick={() => update("cleanerPreference", "female-cleaner")}
                      className={cn(
                        "relative flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition active:translate-y-px",
                        state.cleanerPreference === "female-cleaner"
                          ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(21,94,99,0.10)]"
                          : "border-border bg-surface hover:border-primary/40 cursor-pointer"
                      )}
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                        <UserRound className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="block font-bold text-text-primary text-sm">Female cleaner</span>
                        <span className="mt-1 block text-xs leading-normal text-text-secondary">Request a female professional, subject to scheduling availability.</span>
                      </div>
                      {state.cleanerPreference === "female-cleaner" && (
                        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 border-t border-border/55 pt-6">
                  <Field label="Entry instructions" htmlFor="access" required>
                    <select id="access" value={state.access} onChange={(event) => update("access", event.target.value)} className="booking-input">
                      <option>I will be home</option>
                      <option>Doorman or front desk</option>
                      <option>Lockbox or smart lock</option>
                      <option>Call on arrival</option>
                    </select>
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
                  <Field label="Parking or transit notes" htmlFor="parking" helper="Examples: loading zone, garage code, street parking, subway entrance." required>
                    <input id="parking" value={state.parking} onChange={(event) => update("parking", event.target.value)} className="booking-input" placeholder="Garage entrance on 8th Ave" />
                  </Field>
                  <Field label="Cleaning supplies" htmlFor="supplies">
                    <select id="supplies" value={state.supplies} onChange={(event) => update("supplies", event.target.value)} className="booking-input">
                      <option>Bring professional supplies</option>
                      <option>I will provide supplies</option>
                    </select>
                  </Field>
                </div>

                <div>
                  <Field label="Priority notes" htmlFor="notes" helper="Mention fragile surfaces, heavy buildup, or rooms to skip.">
                    <textarea id="notes" value={state.notes} onChange={(event) => update("notes", event.target.value)} className="booking-input min-h-24 resize-y" placeholder="Please focus on the kitchen grout and guest bath." />
                  </Field>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Review your plan details.</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    You are logged in. Review what is included in your plan before proceeding to payment.
                  </p>
                </div>

                {/* Logged in User Card */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <img src={accountProfile.picture} alt={accountProfile.name} className="size-12 rounded-full object-cover" />
                    <div>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider">Logged In Account</p>
                      <h3 className="text-base font-bold text-text-primary">{state.firstName} {state.lastName}</h3>
                      <p className="break-all text-sm text-text-secondary">{state.email} · {state.phone}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditContact(!showEditContact)}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-primary px-4 text-xs font-bold text-primary transition hover:bg-primary/5 active:scale-95 sm:w-auto cursor-pointer"
                  >
                    {showEditContact ? "View summary" : "Edit contact info"}
                  </button>
                </div>

                {showEditContact && (
                  <div className="grid gap-4 p-5 rounded-2xl border border-border bg-surface animate-fade-in">
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
                  </div>
                )}

                {/* Plan commitment description */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <ShieldCheck className="size-5" />
                    {state.frequencyId === "once" ? "One-Time Service Agreement" : "Subscription Plan Commitment"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {state.frequencyId === "once" ? (
                      "You are booking a single visit. No recurring commitment. Billed automatically only after the clean is completed."
                    ) : state.frequencyId === "custom" ? (
                      `You are signing up for a custom weekly cleaning plan (${state.customSchedules.length} visit${state.customSchedules.length === 1 ? "" : "s"} per week). Plan starts on ${state.startDate ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(state.startDate + "T12:00:00")) : "start date"}. Billed after each completed visit. Cancel, pause, or reschedule anytime from your customer account page.`
                    ) : (
                      `You are signing up for a recurring ${currentFrequency.label.toLowerCase()} cleaning plan. Billed after each completed visit. Cancel, pause, or reschedule any upcoming visit up to 24 hours in advance with no fees.`
                    )}
                  </p>
                </div>

                {/* Grid showing everything they are signing up for */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Service & Scope Card */}
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <h3 className="font-bold text-text-primary text-base flex items-center gap-2 mb-3">
                      <Sparkles className="size-4 text-primary" />
                      Cleaning Scope
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-text-secondary block text-xs">Service type</span>
                        <span className="font-bold text-text-primary text-base">{currentService.name}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-xs">Team size & Duration</span>
                        <span className="font-semibold text-text-primary">{state.hours} hr visit · {state.cleaners} {state.cleaners === 1 ? "cleaner" : "cleaners"} ({(state.hours * state.cleaners).toFixed(1).replace(".0", "")} labor hrs)</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-xs">Included tasks</span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {currentService.included.map((task) => (
                            <span key={task} className="inline-block rounded-full bg-surface-muted border border-border px-2.5 py-0.5 text-xs text-text-secondary">{task}</span>
                          ))}
                        </div>
                      </div>
                      {state.addons.length > 0 && (
                        <div>
                          <span className="text-text-secondary block text-xs">Selected extra tasks</span>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {state.addons.map((addonId) => {
                              const addon = ADDONS.find((a) => a.id === addonId);
                              return (
                                <span key={addonId} className="inline-block rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs text-primary font-bold">
                                  + {addon?.label || addonId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule & Timing Card */}
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <h3 className="font-bold text-text-primary text-base flex items-center gap-2 mb-3">
                      <CalendarDays className="size-4 text-primary" />
                      Schedule & Frequency
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-text-secondary block text-xs">Plan frequency</span>
                        <span className="font-bold text-text-primary text-base">{currentFrequency.label}</span>
                      </div>
                      {state.frequencyId === "custom" ? (
                        <>
                          <div>
                            <span className="text-text-secondary block text-xs">Start Date</span>
                            <span className="font-semibold text-text-primary">
                              {state.startDate ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(state.startDate + "T12:00:00")) : "Not set"}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary block text-xs">Weekly slots</span>
                            <div className="mt-1.5 space-y-1">
                              {state.customSchedules.map((slot, index) => {
                                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                return (
                                  <div key={index} className="flex justify-between text-xs border-b border-border/40 pb-1">
                                    <span className="font-bold text-text-primary">{days[slot.dayOfWeek]} @ {slot.time}</span>
                                    <span className="text-text-secondary">{slot.product}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-text-secondary block text-xs">First Visit Date</span>
                            <span className="font-semibold text-text-primary">
                              {state.date ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(state.date + "T12:00:00")) : "Not set"}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary block text-xs">Arrival Window</span>
                            <span className="font-semibold text-text-primary">{state.arrivalWindow}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Address & Home details */}
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <h3 className="font-bold text-text-primary text-base flex items-center gap-2 mb-3">
                      <MapPin className="size-4 text-primary" />
                      Location Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-text-secondary block text-xs">Service address</span>
                        <span className="font-semibold text-text-primary">{state.address}{state.unit ? `, ${state.unit}` : ""}, {state.city} {state.zip}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-xs">Home specifications</span>
                        <span className="font-semibold text-text-primary">{state.bedrooms > 0 ? `${state.bedrooms} Bed` : "Studio"} · {state.bathrooms} Bath · {state.homeType}</span>
                      </div>
                      {state.addressPhone && (
                        <div>
                          <span className="text-text-secondary block text-xs">Contact phone at address</span>
                          <span className="font-semibold text-text-primary">{state.addressPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logistics & Logistics Details */}
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <h3 className="font-bold text-text-primary text-base flex items-center gap-2 mb-3">
                      <KeyRound className="size-4 text-primary" />
                      Logistics & Access
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-text-secondary block text-xs">Vetted professional preference</span>
                        <span className="font-semibold text-text-primary capitalize">
                          {state.cleanerPreference === "best-match" ? (
                            "Best available match (highest-rated local cleaner)"
                          ) : state.cleanerPreference === "same-cleaner" ? (
                            "Keep same cleaner for subsequent visits"
                          ) : state.cleanerPreference === "female-cleaner" ? (
                            "Female cleaner requested"
                          ) : (
                            `Preferred Cleaner: ${state.cleanerPreference.replace("prefer-", "").replace(/-/g, " ")}`
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-xs">Entry instructions</span>
                        <span className="font-semibold text-text-primary">{state.access}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-xs">Parking & Transit notes</span>
                        <span className="font-semibold text-text-primary">{state.parking || "None provided"}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-xs">Pets at home</span>
                        <span className="font-semibold text-text-primary">{state.pets}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block text-xs">Supplies preference</span>
                        <span className="font-semibold text-text-primary">{state.supplies}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {state.notes && (
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <span className="text-text-secondary text-sm block mb-1">Priority cleaning notes</span>
                    <p className="text-sm font-semibold italic text-text-primary">&quot;{state.notes}&quot;</p>
                  </div>
                )}
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
                {step === 0 ? homeContinueLabel : step === 3 ? "Continue to payment" : "Continue"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start" aria-label="Booking estimate">
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
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 shadow-[0_-12px_30px_rgba(31,41,55,0.10)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-secondary">Due today</p>
            <p className="text-xl font-bold tabular-nums text-text-primary">${estimate.total.toFixed(2)}</p>
          </div>
          <button
            type="button"
            onClick={continueFlow}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_10px_24px_rgba(21,94,99,0.20)] transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px"
          >
            {step === 0 ? homeContinueLabel : step === 3 ? "Payment" : "Continue"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MapPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectAddress={(address, zip, city) => {
          update("address", address);
          update("zip", zip);
          update("city", city);
          update("addressVerified", true);
          if (mapPreQuery) {
            setMapPreQuery("");
            setStep(1);
          }
        }}
        initialSearchQuery={mapPreQuery}
      />
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
  label: ReactNode;
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
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition duration-200 active:translate-y-px cursor-pointer w-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30",
        active
          ? "border-primary bg-primary/5 text-primary shadow-[0_0_0_1px_#155e63]"
          : "border-border bg-surface hover:border-primary/40 hover:bg-surface-muted text-text-primary"
      )}
    >
      <span className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full transition",
        active ? "bg-primary/15 text-primary" : "bg-surface-muted text-text-secondary"
      )}>
        {icon}
      </span>
      <span className="font-bold text-sm leading-none">{title}</span>
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

export type BookingStatus = "scheduled" | "in_progress" | "completed" | "needs_attention" | "cancelled";
export type SubscriptionStatus = "active" | "paused" | "ending";

export type BookingRecord = {
  id: string;
  status: BookingStatus;
  service: string;
  frequency: string;
  date: string;
  arrivalWindow: string;
  address: string;
  home: string;
  team: string;
  cleaner: string;
  total: number;
  paymentStatus: string;
  supplies: string;
  access: string;
  parking: string;
  pets: string;
  notes: string;
  addons: Array<{ label: string; price: number }>;
  timeline: Array<{ label: string; time: string; state: "done" | "current" | "upcoming" }>;
};

export type SubscriptionRecord = {
  id: string;
  status: SubscriptionStatus;
  cadence: string;
  service: string;
  nextVisit: string;
  arrivalWindow: string;
  address: string;
  home: string;
  team: string;
  cleanerPreference: string;
  monthlyEstimate: number;
  paymentMethod: string;
  startedAt: string;
  pausedUntil?: string;
  scope: string[];
  upcomingVisits: Array<{ id: string; date: string; arrivalWindow: string; status: string }>;
  notes: string;
};

export type AccountProfile = {
  name: string;
  email: string;
  phone: string;
  neighborhood: string;
  memberSince: string;
  picture: string;
  defaultAddress: string;
  homeType: string;
  bedrooms: number;
  bathrooms: number;
  pets: string;
  suppliesPreference: string;
  accessPreference: string;
  parkingNotes: string;
  cleanerPreference: string;
  householdNotes: string;
};

export type AccountSettings = {
  notifications: Array<{ label: string; description: string; enabled: boolean }>;
  paymentMethods: Array<{ label: string; detail: string; default: boolean }>;
  security: Array<{ label: string; value: string; state: "good" | "review" }>;
  communication: Array<{ label: string; value: string }>;
};

export const accountProfile: AccountProfile = {
  name: "Avery Morgan",
  email: "avery.morgan@example.com",
  phone: "(212) 555-0148",
  neighborhood: "Chelsea, New York",
  memberSince: "2026-02-18",
  picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
  defaultAddress: "225 West 23rd Street, Apt 4B",
  homeType: "2 bed, 2 bath apartment",
  bedrooms: 2,
  bathrooms: 2,
  pets: "Cat at home",
  suppliesPreference: "Bring professional supplies",
  accessPreference: "Doorman or front desk",
  parkingNotes: "Use the garage entrance on 8th Ave.",
  cleanerPreference: "Prefer Maya R. or Daniel P. when available",
  householdNotes: "Use unscented products in bedrooms. Skip the office unless it is listed in visit notes.",
};

export const accountSettings: AccountSettings = {
  notifications: [
    { label: "Arrival updates", description: "Cleaner assignment, en route, and arrival-window reminders.", enabled: true },
    { label: "Schedule changes", description: "Reschedules, pauses, and recurring-plan changes.", enabled: true },
    { label: "Receipts", description: "Payment authorizations, receipts, and refunds.", enabled: true },
    { label: "Service tips", description: "Occasional prep reminders before deep or move cleanings.", enabled: false },
  ],
  paymentMethods: [
    { label: "Visa ending in 4242", detail: "Default for home cleanings", default: true },
    { label: "Amex ending in 3005", detail: "Used for small office plan", default: false },
  ],
  security: [
    { label: "Password", value: "Updated 34 days ago", state: "good" },
    { label: "Two-step verification", value: "Not enabled", state: "review" },
    { label: "Active sessions", value: "2 signed-in devices", state: "good" },
  ],
  communication: [
    { label: "Preferred channel", value: "SMS for arrival updates, email for receipts" },
    { label: "Support language", value: "English" },
    { label: "Quiet hours", value: "Do not text after 8:00 PM" },
  ],
};

export const bookings: BookingRecord[] = [
  {
    id: "BK-1048",
    status: "scheduled",
    service: "Deep clean",
    frequency: "One time",
    date: "2026-07-02",
    arrivalWindow: "10:00 AM - 12:00 PM",
    address: "225 West 23rd Street, Apt 4B",
    home: "2 bed, 2 bath apartment",
    team: "4 hr x 2 cleaners",
    cleaner: "Maya R. and team",
    total: 487,
    paymentStatus: "Authorized",
    supplies: "Bring professional supplies",
    access: "Doorman or front desk",
    parking: "Use the garage entrance on 8th Ave.",
    pets: "Cat at home",
    notes: "Focus on kitchen grout, guest bath, and dust along window sills.",
    addons: [
      { label: "Inside fridge", price: 29 },
      { label: "Interior windows", price: 45 },
    ],
    timeline: [
      { label: "Booking created", time: "Jun 25, 9:18 AM", state: "done" },
      { label: "Payment authorized", time: "Jun 25, 9:19 AM", state: "done" },
      { label: "Cleaner assignment", time: "Jun 30, by 6:00 PM", state: "current" },
      { label: "Cleaning visit", time: "Jul 2, 10:00 AM - 12:00 PM", state: "upcoming" },
    ],
  },
  {
    id: "BK-1036",
    status: "completed",
    service: "Standard clean",
    frequency: "Every 2 weeks",
    date: "2026-06-18",
    arrivalWindow: "8:00 AM - 10:00 AM",
    address: "88 Atlantic Avenue, Unit 12",
    home: "1 bed, 1 bath apartment",
    team: "3 hr x 1 cleaner",
    cleaner: "Daniel P.",
    total: 146,
    paymentStatus: "Paid",
    supplies: "Customer supplies",
    access: "I will be home",
    parking: "Street parking usually opens after 8:30 AM.",
    pets: "No pets",
    notes: "Perfect attention to detail. Apartment was spotless.",
    addons: [{ label: "Laundry fold", price: 32 }],
    timeline: [
      { label: "Booking created", time: "Jun 10, 5:42 PM", state: "done" },
      { label: "Cleaner assigned", time: "Jun 16, 1:20 PM", state: "done" },
      { label: "Cleaner arrived", time: "Jun 18, 8:05 AM", state: "done" },
      { label: "Cleaning complete", time: "Jun 18, 11:08 AM", state: "done" },
      { label: "Receipt sent", time: "Jun 18, 11:10 AM", state: "done" },
    ],
  },
  {
    id: "BK-1029",
    status: "needs_attention",
    service: "Move clean",
    frequency: "One time",
    date: "2026-06-28",
    arrivalWindow: "2:00 PM - 4:00 PM",
    address: "19 Mercer Street, Floor 3",
    home: "Empty 2 bed, 1 bath walk-up",
    team: "5 hr x 3 cleaners",
    cleaner: "Assignment pending",
    total: 914,
    paymentStatus: "Action needed",
    supplies: "Bring professional supplies",
    access: "Lockbox or smart lock",
    parking: "Commercial loading zone in front of building.",
    pets: "No pets",
    notes: "Need lockbox code before assignment can be finalized.",
    addons: [
      { label: "Inside cabinets", price: 39 },
      { label: "Inside oven", price: 34 },
    ],
    timeline: [
      { label: "Booking created", time: "Jun 24, 2:15 PM", state: "done" },
      { label: "Access details requested", time: "Jun 24, 2:18 PM", state: "current" },
      { label: "Cleaner assignment", time: "After lockbox code", state: "upcoming" },
      { label: "Cleaning visit", time: "Jun 28, 2:00 PM - 4:00 PM", state: "upcoming" },
    ],
  },
  {
    id: "BK-1023",
    status: "completed",
    service: "Deep clean",
    frequency: "One time",
    date: "2026-06-04",
    arrivalWindow: "9:00 AM - 1:00 PM",
    address: "225 West 23rd Street, Apt 4B",
    home: "2 bed, 2 bath apartment",
    team: "4 hr x 2 cleaners",
    cleaner: "Maya R. and Sofia C.",
    total: 459,
    paymentStatus: "Paid",
    supplies: "Bring professional supplies",
    access: "Doorman or front desk",
    parking: "Use the garage entrance on 8th Ave.",
    pets: "Cat at home",
    notes: "Excellent deep clean. All windows inside and out shine. Kitchen grout looks brand new.",
    addons: [
      { label: "Inside fridge", price: 29 },
      { label: "Interior windows", price: 45 },
    ],
    timeline: [
      { label: "Booking created", time: "May 28, 7:15 AM", state: "done" },
      { label: "Payment authorized", time: "May 28, 7:16 AM", state: "done" },
      { label: "Cleaner assigned", time: "Jun 1, 2:30 PM", state: "done" },
      { label: "Cleaner arrived", time: "Jun 4, 9:12 AM", state: "done" },
      { label: "Cleaning complete", time: "Jun 4, 1:45 PM", state: "done" },
      { label: "Receipt sent", time: "Jun 4, 1:47 PM", state: "done" },
    ],
  },
  {
    id: "BK-1015",
    status: "completed",
    service: "Standard clean",
    frequency: "Every 2 weeks",
    date: "2026-05-21",
    arrivalWindow: "10:00 AM - 12:00 PM",
    address: "225 West 23rd Street, Apt 4B",
    home: "2 bed, 2 bath apartment",
    team: "3 hr x 1 cleaner",
    cleaner: "Daniel P.",
    total: 178,
    paymentStatus: "Paid",
    supplies: "Bring professional supplies",
    access: "Doorman or front desk",
    parking: "Use the garage entrance on 8th Ave.",
    pets: "Cat at home",
    notes: "Quick and thorough. Everything sparkling as usual.",
    addons: [{ label: "Laundry fold", price: 32 }],
    timeline: [
      { label: "Booking created", time: "May 14, 3:20 PM", state: "done" },
      { label: "Cleaner assigned", time: "May 19, 9:45 AM", state: "done" },
      { label: "Cleaner arrived", time: "May 21, 10:08 AM", state: "done" },
      { label: "Cleaning complete", time: "May 21, 1:02 PM", state: "done" },
      { label: "Receipt sent", time: "May 21, 1:04 PM", state: "done" },
    ],
  },
  {
    id: "BK-1008",
    status: "completed",
    service: "Move-in clean",
    frequency: "One time",
    date: "2026-05-08",
    arrivalWindow: "8:00 AM - 12:00 PM",
    address: "225 West 23rd Street, Apt 4B",
    home: "2 bed, 2 bath apartment",
    team: "5 hr x 3 cleaners",
    cleaner: "Maya R., Daniel P., and Sofia C.",
    total: 892,
    paymentStatus: "Paid",
    supplies: "Bring professional supplies",
    access: "Building manager on site",
    parking: "Building loading zone reserved",
    pets: "No pets yet (cat arrived later)",
    notes: "Impeccable move-in clean. Every corner sparkles. Team was professional and efficient.",
    addons: [
      { label: "Inside cabinets", price: 39 },
      { label: "Inside oven", price: 34 },
      { label: "Baseboards and trim", price: 58 },
    ],
    timeline: [
      { label: "Booking created", time: "Apr 30, 11:45 AM", state: "done" },
      { label: "Payment authorized", time: "Apr 30, 11:46 AM", state: "done" },
      { label: "Team assigned", time: "May 5, 10:20 AM", state: "done" },
      { label: "Team arrived", time: "May 8, 8:15 AM", state: "done" },
      { label: "Cleaning complete", time: "May 8, 12:32 PM", state: "done" },
      { label: "Receipt sent", time: "May 8, 12:35 PM", state: "done" },
    ],
  },
  {
    id: "BK-0998",
    status: "completed",
    service: "Standard clean",
    frequency: "Every 2 weeks",
    date: "2026-04-15",
    arrivalWindow: "2:00 PM - 4:00 PM",
    address: "88 Atlantic Avenue, Unit 12",
    home: "1 bed, 1 bath apartment",
    team: "3 hr x 1 cleaner",
    cleaner: "Sofia C.",
    total: 146,
    paymentStatus: "Paid",
    supplies: "Customer supplies",
    access: "I will be home",
    parking: "Residential permit required",
    pets: "No pets",
    notes: "Great work as always. Apartment looks fresh and clean.",
    addons: [{ label: "Laundry fold", price: 32 }],
    timeline: [
      { label: "Booking created", time: "Apr 8, 6:10 PM", state: "done" },
      { label: "Cleaner assigned", time: "Apr 12, 11:00 AM", state: "done" },
      { label: "Cleaner arrived", time: "Apr 15, 2:05 PM", state: "done" },
      { label: "Cleaning complete", time: "Apr 15, 4:52 PM", state: "done" },
      { label: "Receipt sent", time: "Apr 15, 4:54 PM", state: "done" },
    ],
  },
];

export const subscriptions: SubscriptionRecord[] = [
  {
    id: "SUB-221",
    status: "active",
    cadence: "Every 2 weeks",
    service: "Standard clean",
    nextVisit: "2026-07-08",
    arrivalWindow: "8:00 AM - 10:00 AM",
    address: "88 Atlantic Avenue, Unit 12",
    home: "1 bed, 1 bath apartment",
    team: "3 hr x 1 cleaner",
    cleanerPreference: "Prefer Daniel P. when available",
    monthlyEstimate: 292,
    paymentMethod: "Visa ending in 4242",
    startedAt: "2026-05-07",
    scope: ["Kitchen and bathroom reset", "Floors and dusting", "Bedroom linens", "Laundry fold"],
    upcomingVisits: [
      { id: "BK-1051", date: "2026-07-08", arrivalWindow: "8:00 AM - 10:00 AM", status: "Scheduled" },
      { id: "BK-1064", date: "2026-07-22", arrivalWindow: "8:00 AM - 10:00 AM", status: "Planned" },
      { id: "BK-1076", date: "2026-08-05", arrivalWindow: "8:00 AM - 10:00 AM", status: "Planned" },
    ],
    notes: "Skip office. Use unscented products in bedroom.",
  },
  {
    id: "SUB-245",
    status: "active",
    cadence: "Weekly",
    service: "Deep clean",
    nextVisit: "2026-07-04",
    arrivalWindow: "10:00 AM - 1:00 PM",
    address: "225 West 23rd Street, Apt 4B",
    home: "2 bed, 2 bath apartment",
    team: "4 hr x 2 cleaners",
    cleanerPreference: "Prefer Maya R. when available",
    monthlyEstimate: 1856,
    paymentMethod: "Visa ending in 4242",
    startedAt: "2026-04-15",
    scope: ["Deep kitchen clean", "Bathroom grout and tile", "Interior windows", "Baseboards and trim"],
    upcomingVisits: [
      { id: "BK-1092", date: "2026-07-04", arrivalWindow: "10:00 AM - 1:00 PM", status: "Scheduled" },
      { id: "BK-1101", date: "2026-07-11", arrivalWindow: "10:00 AM - 1:00 PM", status: "Planned" },
      { id: "BK-1110", date: "2026-07-18", arrivalWindow: "10:00 AM - 1:00 PM", status: "Planned" },
    ],
    notes: "Cat at home. Use unscented products only.",
  },
  {
    id: "SUB-267",
    status: "active",
    cadence: "Every 4 weeks",
    service: "Standard office clean",
    nextVisit: "2026-07-20",
    arrivalWindow: "5:00 PM - 7:00 PM",
    address: "500 Fifth Avenue, Suite 2800",
    home: "Large office, 3 restrooms",
    team: "5 hr x 2 cleaners",
    cleanerPreference: "Miguel S. or team",
    monthlyEstimate: 680,
    paymentMethod: "Visa ending in 4242",
    startedAt: "2026-03-01",
    scope: ["Conference rooms", "All restrooms", "Kitchen area", "Common spaces and desks"],
    upcomingVisits: [
      { id: "BK-1120", date: "2026-07-20", arrivalWindow: "5:00 PM - 7:00 PM", status: "Scheduled" },
      { id: "BK-1135", date: "2026-08-17", arrivalWindow: "5:00 PM - 7:00 PM", status: "Planned" },
      { id: "BK-1148", date: "2026-09-14", arrivalWindow: "5:00 PM - 7:00 PM", status: "Planned" },
    ],
    notes: "After-hours cleaning. Building access via 5th Ave entrance.",
  },
  {
    id: "SUB-184",
    status: "paused",
    cadence: "Weekly",
    service: "Small office",
    nextVisit: "2026-07-15",
    arrivalWindow: "6:00 PM - 8:00 PM",
    address: "41 East 11th Street, Suite 6A",
    home: "Small office, 1 restroom",
    team: "3 hr x 2 cleaners",
    cleanerPreference: "Best available match",
    monthlyEstimate: 1240,
    paymentMethod: "Amex ending in 3005",
    startedAt: "2026-02-12",
    pausedUntil: "2026-07-10",
    scope: ["Desks and conference room", "Kitchenette", "Restroom", "Trash and floors"],
    upcomingVisits: [
      { id: "BK-1080", date: "2026-07-15", arrivalWindow: "6:00 PM - 8:00 PM", status: "Resumes" },
      { id: "BK-1091", date: "2026-07-22", arrivalWindow: "6:00 PM - 8:00 PM", status: "Planned" },
    ],
    notes: "Office is closed for renovation until July 10.",
  },
  {
    id: "SUB-189",
    status: "paused",
    cadence: "Every 2 weeks",
    service: "Move-out clean",
    nextVisit: "2026-08-15",
    arrivalWindow: "9:00 AM - 12:00 PM",
    address: "77 Park Avenue, Apt 15C",
    home: "2 bed, 1 bath apartment",
    team: "4 hr x 2 cleaners",
    cleanerPreference: "Maria T. if available",
    monthlyEstimate: 292,
    paymentMethod: "Visa ending in 4242",
    startedAt: "2026-06-01",
    pausedUntil: "2026-08-15",
    scope: ["All surfaces deep clean", "Appliance interiors", "Closets and storage", "Move-out standards"],
    upcomingVisits: [
      { id: "BK-1160", date: "2026-08-15", arrivalWindow: "9:00 AM - 12:00 PM", status: "Resumes" },
    ],
    notes: "Tenant is moving out mid-August. Plan resumes after move.",
  },
  {
    id: "SUB-156",
    status: "ending",
    cadence: "Every 2 weeks",
    service: "Seasonal deep clean",
    nextVisit: "2026-07-31",
    arrivalWindow: "10:00 AM - 2:00 PM",
    address: "200 Central Park South, Penthouse",
    home: "4 bed, 3 bath penthouse",
    team: "6 hr x 3 cleaners",
    cleanerPreference: "Premium team only",
    monthlyEstimate: 1456,
    paymentMethod: "Amex ending in 3005",
    startedAt: "2026-05-15",
    pausedUntil: "2026-09-01",
    scope: ["Full deep clean", "Chandelier cleaning", "Marble polishing", "All windows inside and out"],
    upcomingVisits: [
      { id: "BK-1175", date: "2026-07-31", arrivalWindow: "10:00 AM - 2:00 PM", status: "Final" },
    ],
    notes: "Seasonal service ending Sept 1. Penthouse is closed during summer.",
  },
];

export function getBooking(id: string) {
  return bookings.find((booking) => booking.id === id);
}

export function getSubscription(id: string) {
  return subscriptions.find((subscription) => subscription.id === id);
}

export function formatAccountDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function getTimelineKey(timeline: Array<{ label: string; time: string; state: "done" | "current" | "upcoming" }>, keyType: "started" | "completed"): string {
  if (keyType === "started") {
    const startItem = timeline.find((item) => item.label.toLowerCase().includes("arrived"));
    return startItem?.time || timeline[0]?.time || "";
  }
  const completeItem = timeline.find((item) => item.label.toLowerCase().includes("complete"));
  return completeItem?.time || timeline[timeline.length - 1]?.time || "";
}

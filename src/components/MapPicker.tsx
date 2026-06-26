"use client";

import React, { useState, useMemo } from "react";
import { MapPin, Search, X, Check } from "lucide-react";

type MapLocation = {
  name: string;
  address: string;
  zip: string;
  city: string;
  x: number; // percentage from left
  y: number; // percentage from top
};

const MOCK_LOCATIONS: MapLocation[] = [
  { name: "Chelsea Flat", address: "225 West 23rd Street", zip: "10011", city: "New York", x: 35, y: 55 },
  { name: "Soho Loft", address: "109 Mercer Street", zip: "10012", city: "New York", x: 45, y: 78 },
  { name: "Upper West Apt", address: "72 Central Park West", zip: "10023", city: "New York", x: 28, y: 25 },
  { name: "Times Square Hub", address: "1560 Broadway", zip: "10036", city: "New York", x: 52, y: 40 },
  { name: "East Village Walk-up", address: "120 St Marks Place", zip: "10009", city: "New York", x: 75, y: 68 },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: string, zip: string, city: string) => void;
  initialSearchQuery?: string;
};

export function MapPicker({ isOpen, onClose, onSelectAddress, initialSearchQuery = "" }: Props) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedLoc, setSelectedLoc] = useState<MapLocation>(MOCK_LOCATIONS[0]);
  const [customMarker, setCustomMarker] = useState<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      setSearchQuery(initialSearchQuery);
      if (initialSearchQuery) {
        const found = MOCK_LOCATIONS.find(
          (l) =>
            l.address.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
            l.name.toLowerCase().includes(initialSearchQuery.toLowerCase())
        );
        if (found) {
          setSelectedLoc(found);
          setCustomMarker(null);
        } else {
          setSelectedLoc(MOCK_LOCATIONS[0]);
        }
      } else {
        setSelectedLoc(MOCK_LOCATIONS[0]);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, initialSearchQuery]);

  // If a location is matched by search
  const filteredLocations = useMemo(() => {
    if (!searchQuery) return MOCK_LOCATIONS;
    return MOCK_LOCATIONS.filter(
      (l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.zip.includes(searchQuery)
    );
  }, [searchQuery]);

  // Click handler on map canvas
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Find nearest preset location to click coordinates
    let nearest = MOCK_LOCATIONS[0];
    let minDist = Infinity;

    MOCK_LOCATIONS.forEach((loc) => {
      const dist = Math.hypot(loc.x - x, loc.y - y);
      if (dist < minDist) {
        minDist = dist;
        nearest = loc;
      }
    });

    // If within 15% distance, snap to the preset. Otherwise place custom mock marker
    if (minDist < 15) {
      setSelectedLoc(nearest);
      setCustomMarker(null);
    } else {
      // Calculate a mock street address based on coordinates
      const mockStreetNum = Math.floor(100 + y * 8);
      const mockStName = x < 50 ? `${Math.floor(10 + x / 2)}th Ave` : `${Math.floor(10 + y / 2)}th St`;
      const mockAddr = `${mockStreetNum} ${mockStName}`;
      const mockZip = `100${Math.floor(10 + (x + y) / 3)}`;

      const newLoc: MapLocation = {
        name: "Pinned Location",
        address: mockAddr,
        zip: mockZip,
        city: "New York",
        x,
        y,
      };
      setSelectedLoc(newLoc);
      setCustomMarker({ x, y });
    }
  };

  const handleConfirm = () => {
    onSelectAddress(selectedLoc.address, selectedLoc.zip, selectedLoc.city);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:rounded-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-text-primary">Select Cleaning Address</h3>
            <p className="text-xs text-text-secondary font-medium mt-0.5">Click pins, click anywhere on grid streets, or search Manhattan locations</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-muted hover:text-text-primary cursor-pointer"
            aria-label="Close map picker"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(220px,1fr)_minmax(140px,0.65fr)] gap-0 md:h-[430px] md:grid-cols-[1fr_260px] md:grid-rows-none">
          
          {/* Map Section */}
          <div className="relative min-h-0 overflow-hidden bg-[#f4ebd0]/20 select-none">
            {/* Styled Mock Map Grid (streets, Central Park, Hudson River) */}
            <div
              className="absolute inset-0 cursor-crosshair"
              onClick={handleMapClick}
            >
              {/* Hudson River */}
              <div className="absolute top-0 bottom-0 left-0 w-[15%] bg-sky-200/50 border-r border-sky-300/30" />
              
              {/* Central Park */}
              <div className="absolute top-[10%] left-[25%] w-[45%] h-[20%] bg-emerald-100/60 border border-emerald-200/80 rounded-lg flex items-center justify-center">
                <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest">Central Park</span>
              </div>

              {/* Grid Streets */}
              <div className="absolute inset-0 grid grid-cols-12 gap-0 pointer-events-none opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-r border-slate-900 h-full" />
                ))}
              </div>
              <div className="absolute inset-0 grid grid-rows-12 gap-0 pointer-events-none opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-b border-slate-900 w-full" />
                ))}
              </div>

              {/* Preset Pins */}
              {MOCK_LOCATIONS.map((loc) => {
                const isSelected = selectedLoc.address === loc.address;
                return (
                  <button
                    key={loc.address}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLoc(loc);
                      setCustomMarker(null);
                    }}
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 flex size-11 items-center justify-center transition active:scale-90 cursor-pointer"
                  >
                    <span className={`absolute inset-0 rounded-full animate-ping duration-1000 opacity-20 ${isSelected ? "bg-primary" : "bg-primary/40 group-hover:block hidden"}`} />
                    <MapPin className={`size-6 transition-transform group-hover:-translate-y-0.5 ${isSelected ? "text-primary scale-110" : "text-primary/60"}`} />
                  </button>
                );
              })}

              {/* Custom Pin Marker */}
              {customMarker && (
                <div
                  style={{ left: `${customMarker.x}%`, top: `${customMarker.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center pointer-events-none animate-bounce"
                >
                  <MapPin className="size-7 text-error" />
                </div>
              )}
            </div>

            {/* Glassmorphism search input */}
            <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 z-20">
              <div className="relative flex min-h-11 items-center rounded-full border border-border bg-surface/95 px-4 py-2 shadow-lg backdrop-blur-md">
                <Search className="size-4 text-text-secondary shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search address or ZIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none placeholder-text-secondary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="flex size-8 items-center justify-center rounded-full text-text-secondary hover:bg-slate-200 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / List Section */}
          <div className="flex min-h-0 flex-col border-t border-border bg-surface-muted md:h-full md:border-l md:border-t-0">
            <div className="p-4 border-b border-border bg-surface">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Available Locations</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLoc.address === loc.address;
                return (
                  <button
                    key={loc.address}
                    type="button"
                    onClick={() => {
                      setSelectedLoc(loc);
                      setCustomMarker(null);
                    }}
                    className={`flex min-h-14 w-full flex-col justify-center rounded-2xl p-3 text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-surface text-text-primary animate-fade-in"
                    }`}
                  >
                    <span className="text-sm font-bold truncate">{loc.name}</span>
                    <span className={`text-xs mt-0.5 truncate ${isSelected ? "text-primary-foreground/80" : "text-text-secondary"}`}>
                      {loc.address}
                    </span>
                  </button>
                );
              })}
              {filteredLocations.length === 0 && (
                <p className="text-xs text-text-secondary p-4 text-center">No locations match search query.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer info & confirm */}
        <div className="flex flex-col gap-3 border-t border-border bg-surface-muted px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Selected Location</p>
              <p className="break-words text-sm font-bold text-text-primary">{selectedLoc.address}, {selectedLoc.city} {selectedLoc.zip}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary-hover active:translate-y-px sm:w-auto cursor-pointer"
          >
            <Check className="size-4" />
            Confirm Location
          </button>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const T = {
  primary:   "#155E63",
  ink:       "#1F2937",
  body:      "#6B7280",
  canvas:    "#FCFBF8",
  soft:      "#F7F5F1",
  border:    "#E5DFD3",
  onPrimary: "#FFFFFF",
};

const TESTIMONIALS = [
  {
    id: 1,
    text: "Best cleaning service we've used in five years. Professional, thorough, and they actually care.",
    author: "Sarah M.",
    role: "Homeowner",
  },
  {
    id: 2,
    text: "Booked our move-out clean last minute. They showed up on time and the apartment passed inspection.",
    author: "Marcus L.",
    role: "Tenant",
  },
  {
    id: 3,
    text: "Switched to recurring every two weeks. No more stress about cleaning, they're so reliable.",
    author: "Elena R.",
    role: "Busy Professional",
  },
  {
    id: 4,
    text: "The attention to detail is incredible. I've never seen my apartment this clean before.",
    author: "James T.",
    role: "Apartment Resident",
  },
];

export default function HeroTestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500); // Change every 4.5 seconds
    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToPrev = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const testimonial = TESTIMONIALS[current];

  return (
    <div
      style={{
        background: T.soft,
        borderRadius: 16,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        border: `1px solid ${T.border}`,
      }}
    >
      {/* Testimonial text */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: T.ink,
          lineHeight: 1.6,
          minHeight: 56,
          display: "flex",
          alignItems: "center",
        }}
      >
        "{testimonial.text}"
      </div>

      {/* Attribution */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
            {testimonial.author}
          </div>
          <div style={{ fontSize: 12, color: T.body }}>
            {testimonial.role}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={goToPrev}
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: `1px solid ${T.border}`,
              background: T.canvas,
              color: T.ink,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              fontSize: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.primary;
              e.currentTarget.style.background = T.primary;
              e.currentTarget.style.color = T.onPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background = T.canvas;
              e.currentTarget.style.color = T.ink;
            }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>

          {/* Dots */}
          <div style={{ display: "flex", gap: 4, margin: "0 4px" }}>
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAutoPlay(false);
                  setCurrent(idx);
                  setTimeout(() => setAutoPlay(true), 5000);
                }}
                style={{
                  width: idx === current ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: idx === current ? T.primary : T.border,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: `1px solid ${T.border}`,
              background: T.canvas,
              color: T.ink,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              fontSize: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.primary;
              e.currentTarget.style.background = T.primary;
              e.currentTarget.style.color = T.onPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background = T.canvas;
              e.currentTarget.style.color = T.ink;
            }}
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

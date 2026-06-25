"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/account/AccountPrimitives";
import { getSubscription, formatAccountDate } from "@/lib/mock-account-data";

export default function ReschedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const subscription = getSubscription(id);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots = [
    "8:00 AM",
    "10:00 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
  ];

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">Plan not found</p>
      </div>
    );
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAvailableDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = new Set<string>();

    // Get next 60 days
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.add(date.toISOString().split("T")[0]);
    }

    return dates;
  };

  const availableDates = getAvailableDates();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateStr = date.toISOString().split("T")[0];
      days.push(dateStr);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatFullDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr + "T12:00:00"));
  };

  const calendarDays = generateCalendarDays();
  const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentMonth);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      console.log(`Rescheduling ${subscription.service} to ${selectedDate} at ${selectedTime}`);
      router.push(`/account/subscriptions/${subscription.id}?rescheduled=true`);
    }
  };

  return (
    <>
      <Link
        href="/account/subscriptions"
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-[#155E63] hover:bg-[#F7F5F1] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#155E63]/30"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to subscriptions
      </Link>

      <PageHeader
        title="Reschedule cleaning"
        description="Choose a new date for your cleaning. Your plan and team assignment stay the same."
      />

      {/* Mobile: Show selected date and time above calendar */}
      {selectedDate && selectedTime && (
        <div className="lg:hidden rounded-[16px] bg-white p-4 border border-[#D9C7A3]/30 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-[#155E63] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-[12px] font-bold text-[#155E63] uppercase tracking-wide">New date & time selected</p>
              <p className="mt-2 text-[16px] font-bold text-[#1F2937]">{formatFullDate(selectedDate)}</p>
              <p className="mt-1 text-[14px] font-bold text-[#6B7280]">{selectedTime}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[400px_340px]">
        {/* Calendar Section */}
        <section className="rounded-[16px] bg-white p-6 sm:p-8 shadow-[0_4px_16px_rgba(21,94,99,0.08)]">
          {/* Header with month/year and navigation */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-bold text-[#1F2937]">{monthYear}</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="flex size-10 items-center justify-center rounded-full bg-[#F7F5F1] text-[#1F2937] hover:bg-[#EFE6D3] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155E63] focus-visible:ring-offset-2"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                onClick={handleNextMonth}
                className="flex size-10 items-center justify-center rounded-full bg-[#F7F5F1] text-[#1F2937] hover:bg-[#EFE6D3] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155E63] focus-visible:ring-offset-2"
                aria-label="Next month"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Day names header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-[12px] font-bold text-[#6B7280] py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 mb-8">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-10 w-full" />;
              }

              const isAvailable = availableDates.has(date);
              const isSelected = selectedDate === date;
              const dayNum = new Date(date + "T12:00:00").getDate();

              return (
                <button
                  key={date}
                  onClick={() => {
                    isAvailable && setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  disabled={!isAvailable}
                  className={`h-10 w-full rounded-lg flex items-center justify-center text-[13px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155E63] ${
                    isSelected
                      ? "bg-[#155E63] text-white shadow-[0_4px_12px_rgba(21,94,99,0.24)]"
                      : isAvailable
                        ? "bg-[#F7F5F1] text-[#1F2937] hover:bg-[#EFE6D3] hover:shadow-[0_2px_8px_rgba(21,94,99,0.12)] cursor-pointer"
                        : "bg-[#FCFBF8] text-[#B8C0C2] cursor-not-allowed"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Time slot selection */}
          {selectedDate && (
            <div className="mb-8">
              <p className="text-[14px] font-bold text-[#1F2937] mb-4">Select time</p>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-4 py-3 rounded-lg text-[13px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155E63] ${
                      selectedTime === slot
                        ? "bg-[#155E63] text-white shadow-[0_4px_12px_rgba(21,94,99,0.24)]"
                        : "bg-[#F7F5F1] text-[#1F2937] hover:bg-[#EFE6D3] hover:shadow-[0_2px_8px_rgba(21,94,99,0.12)] cursor-pointer"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={!selectedDate}
              className="w-full flex min-h-11 items-center justify-center rounded-full bg-[#155E63] px-5 text-[16px] font-bold text-white transition-all duration-200 hover:bg-[#124A54] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155E63] focus-visible:ring-offset-2 active:scale-95"
            >
              Confirm new date
            </button>
            <Link
              href="/account/subscriptions"
              className="w-full flex min-h-11 items-center justify-center rounded-full bg-[#FCFBF8] border border-[#E5DFD3] px-5 text-[16px] font-bold text-[#1F2937] transition-colors duration-200 hover:bg-[#F7F5F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155E63] focus-visible:ring-offset-2"
            >
              Cancel
            </Link>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="rounded-[16px] bg-[#F7F5F1] p-6">
          <h3 className="text-[16px] font-bold text-[#1F2937]">Current cleaning</h3>
          <div className="mt-6 space-y-5">
            {/* Service */}
            <div>
              <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wide">Service</p>
              <p className="mt-2 text-[16px] font-bold text-[#1F2937]">{subscription.service}</p>
            </div>

            {/* Current date */}
            <div>
              <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wide">Current date</p>
              <p className="mt-2 text-[16px] font-bold text-[#1F2937]">{formatAccountDate(subscription.nextVisit)}</p>
            </div>

            {/* Time window */}
            <div>
              <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wide">Time window</p>
              <p className="mt-2 text-[16px] font-bold text-[#1F2937]">{subscription.arrivalWindow}</p>
            </div>

            {/* Desktop: New date and time selection indicator */}
            {selectedDate && selectedTime && (
              <div className="hidden lg:block mt-6 pt-5 border-t border-[#E5DFD3]">
                <div className="rounded-[12px] bg-white p-4 border border-[#D9C7A3]/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-[#155E63] mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-[12px] font-bold text-[#155E63] uppercase tracking-wide">New date & time selected</p>
                      <p className="mt-2 text-[16px] font-bold text-[#1F2937]">{formatFullDate(selectedDate)}</p>
                      <p className="mt-1 text-[14px] font-bold text-[#6B7280]">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

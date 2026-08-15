"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  minDate?: string; // YYYY-MM-DD format
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Helper to format Date to YYYY-MM-DD in local timezone safely
const toDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Helper to parse YYYY-MM-DD safely without timezone shifts
const parseDateString = (str: string) => {
  if (!str) return null;
  const parts = str.split("-");
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
};

export function DatePicker({ value, onChange, placeholder = "Select Date", label, minDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial view month/year
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialDate = useMemo(() => parseDateString(value), [value]);
  
  const [viewYear, setViewYear] = useState(() => (initialDate ? initialDate.getFullYear() : today.getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (initialDate ? initialDate.getMonth() : today.getMonth()));

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync view month/year when value changes
  useEffect(() => {
    if (initialDate) {
      setViewYear(initialDate.getFullYear());
      setViewMonth(initialDate.getMonth());
    }
  }, [initialDate]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute days in grid
  const daysGrid = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(viewYear, viewMonth, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, prevMonthTotalDays - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: toDateString(d)
      });
    }

    // Days of current month
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(viewYear, viewMonth, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        dateStr: toDateString(d)
      });
    }

    // Leading days of next month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(viewYear, viewMonth + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: toDateString(d)
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDaySelect = (dateStr: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(dateStr);
    setIsOpen(false);
  };

  // Format date for display button (e.g. "Jun 23, 2026")
  const displayValue = useMemo(() => {
    if (!value) return "";
    const parsed = parseDateString(value);
    if (!parsed) return value;
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [value]);

  const minDateParsed = useMemo(() => (minDate ? parseDateString(minDate) : today), [minDate]);

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <span className={cn("text-sm font-semibold", displayValue ? "text-white" : "text-brand-400")}>
          {displayValue || placeholder}
        </span>
        <Calendar className="h-4 w-4 text-brand-400" />
      </button>

      {/* Popover panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 md:left-auto md:w-80 mt-2 p-4 rounded-2xl bg-brand-950/98 backdrop-blur-xl border border-white/10 shadow-2xl z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-white/5 text-brand-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-white/5 text-brand-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-brand-400 mb-2">
            {DAYS_SHORT.map(d => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysGrid.map((dayCell, index) => {
              const isPast = dayCell.date < minDateParsed!;
              const isSelected = value === dayCell.dateStr;
              const isCurrentDay = toDateString(today) === dayCell.dateStr;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isPast}
                  onClick={(e) => handleDaySelect(dayCell.dateStr, e)}
                  className={cn(
                    "h-8 rounded-lg text-xs font-medium transition-all select-none cursor-pointer",
                    !dayCell.isCurrentMonth && "text-brand-600/50 hover:bg-white/5",
                    dayCell.isCurrentMonth && "text-brand-300 hover:bg-white/10 hover:text-white",
                    isPast && "text-brand-700 cursor-not-allowed line-through hover:bg-transparent hover:text-brand-700",
                    isCurrentDay && !isSelected && "ring-1 ring-accent/50 text-accent",
                    isSelected && "bg-accent text-black font-bold hover:bg-accent hover:text-black"
                  )}
                >
                  {dayCell.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

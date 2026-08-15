"use client";

import { useMemo } from "react";

interface BookedRange {
  pickupDate: string;
  returnDate: string;
}

interface AvailabilityCalendarProps {
  bookedRanges: BookedRange[];
  pickupDate: string;
  returnDate: string;
  onPickupChange: (date: string) => void;
  onReturnChange: (date: string) => void;
}

function isDateInRange(date: Date, ranges: BookedRange[]): { blocked: boolean; booking?: BookedRange } {
  const dateStr = date.toISOString().split("T")[0];
  for (const range of ranges) {
    if (dateStr >= range.pickupDate && dateStr <= range.returnDate) {
      return { blocked: true, booking: range };
    }
  }
  return { blocked: false };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = getDaysInMonth(year, month);
  const grid: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  for (let i = 0; i < firstDay; i++) week.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }
  return grid;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AvailabilityCalendar({
  bookedRanges,
  pickupDate,
  returnDate,
  onPickupChange,
  onReturnChange,
}: AvailabilityCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, viewMonth] = useMemo(() => {
    const d = pickupDate ? new Date(pickupDate) : new Date();
    return [d.getFullYear(), d.getMonth()];
  }, [pickupDate]);

  const selectedRange = useMemo(() => {
    if (!pickupDate || !returnDate) return null;
    return { start: new Date(pickupDate), end: new Date(returnDate) };
  }, [pickupDate, returnDate]);

  const grid = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const handleDateClick = (date: Date) => {
    if (date < today) return;
    if (isDateInRange(date, bookedRanges).blocked) return;

    if (!pickupDate || (pickupDate && returnDate)) {
      onPickupChange(date.toISOString().split("T")[0]);
      onReturnChange("");
    } else {
      const pickup = new Date(pickupDate);
      if (date >= pickup) {
        onReturnChange(date.toISOString().split("T")[0]);
      } else {
        onPickupChange(date.toISOString().split("T")[0]);
        onReturnChange("");
      }
    }
  };

  const isInSelectedRange = (date: Date) => {
    if (!selectedRange) return false;
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const formatToINR = (date: Date) =>
    date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </h4>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900/30" /> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900/30" /> Booked
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-accent/20" /> Selected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-brand-400">
            {d}
          </div>
        ))}
        {grid.flat().map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;

          const isPast = date < today;
          const { blocked } = isDateInRange(date, bookedRanges);
          const inRange = isInSelectedRange(date);
          const isPickup = pickupDate === date.toISOString().split("T")[0];
          const isReturn = returnDate === date.toISOString().split("T")[0];
          const isToday = date.toDateString() === today.toDateString();

          let cellClass = "rounded-lg py-1.5 text-xs font-medium transition-colors cursor-pointer hover:bg-white/10 hover:text-white text-brand-300";

          if (isPast) {
            cellClass = "rounded-lg py-1.5 text-xs text-brand-700 dark:text-brand-700 cursor-not-allowed select-none";
          } else if (blocked) {
            cellClass = "rounded-lg py-1.5 text-xs text-red-500 bg-red-950/20 cursor-not-allowed line-through";
          } else if (isPickup || isReturn) {
            cellClass = "rounded-lg py-1.5 text-xs font-bold text-black bg-accent";
          } else if (inRange) {
            cellClass = "rounded-lg py-1.5 text-xs font-medium text-accent bg-accent/15";
          } else if (isToday) {
            cellClass = "rounded-lg py-1.5 text-xs font-semibold text-accent ring-1 ring-accent/30";
          }

          return (
            <button
              key={i}
              onClick={() => handleDateClick(date)}
              disabled={isPast || blocked}
              className={cellClass}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {pickupDate && (
        <div className="flex flex-wrap gap-2 text-xs text-brand-500 pt-2 border-t border-border">
          <span>Pickup: <strong className="text-foreground">{formatToINR(new Date(pickupDate))}</strong></span>
          {returnDate && (
            <span>→ Return: <strong className="text-foreground">{formatToINR(new Date(returnDate))}</strong></span>
          )}
          {!returnDate && <span className="text-brand-400">— Select return date</span>}
        </div>
      )}

      {bookedRanges.length > 0 && (
        <details className="text-xs text-brand-400">
          <summary className="cursor-pointer hover:text-foreground transition-colors">
            {bookedRanges.length} existing booking{bookedRanges.length !== 1 ? "s" : ""}
          </summary>
          <div className="mt-2 space-y-1 pl-4">
            {bookedRanges.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                {formatToINR(new Date(r.pickupDate))} → {formatToINR(new Date(r.returnDate))}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

/* ponytail: formatting helpers — ₹, dates, phone */

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  if (cleaned.length === 12 && cleaned.startsWith("91"))
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  return phone;
}

export function calcDays(pickup: string, returnD: string): number {
  const p = new Date(pickup);
  const r = new Date(returnD);
  return Math.max(1, Math.ceil((r.getTime() - p.getTime()) / (1000 * 60 * 60 * 24)));
}


import { getUSPhoneDigits } from "./phoneFormat";

// The profile API may hand back the phone as a string or { code, number }.
const phoneToString = (phone: unknown): string => {
  if (typeof phone === "string") return phone;
  if (phone && typeof phone === "object") {
    const p = phone as { code?: string; number?: string };
    return `${p.code || ""}${p.number || ""}`;
  }
  return "";
};

export type AgentContact = {
  phoneDisplay: string;
  telHref: string | null;
  smsHref: string | null;
  emailAddress: string;
};

export const getAgentContact = (phone: unknown, email: unknown): AgentContact => {
  const raw = phoneToString(phone).trim();
  const digits = getUSPhoneDigits(raw);
  const valid = digits.length === 10;
  return {
    phoneDisplay: valid
      ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
      : raw,
    telHref: valid ? `tel:+1${digits}` : raw ? `tel:${raw.replace(/[^\d+]/g, "")}` : null,
    smsHref: valid ? `sms:+1${digits}` : null,
    emailAddress: typeof email === "string" ? email.trim() : "",
  };
};

export type Availability = { online: boolean; label: string };

// Office hours match the Connect page: Mon – Fri · 8 AM – 7 PM, Pacific.
const OPEN_HOUR = 8;
const CLOSE_HOUR = 19;
const TZ = "America/Los_Angeles";

export const getAvailability = (now: Date = new Date()): Availability => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);

  const isWeekday = !["Sat", "Sun"].includes(weekday);
  if (isWeekday && hour >= OPEN_HOUR && hour < CLOSE_HOUR) {
    return { online: true, label: "Picking up now · until 7 PM PT" };
  }
  // Next open: later today before 8, otherwise the next weekday.
  if (isWeekday && hour < OPEN_HOUR) {
    return { online: false, label: "Back today at 8 AM PT" };
  }
  if (weekday === "Fri" || weekday === "Sat") {
    return { online: false, label: "Back Monday at 8 AM PT" };
  }
  if (weekday === "Sun") return { online: false, label: "Back Monday at 8 AM PT" };
  return { online: false, label: "Back tomorrow at 8 AM PT" };
};

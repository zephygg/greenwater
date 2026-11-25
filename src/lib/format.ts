import { ZONE, ZONE_LABEL } from "./zone";

export { ZONE_LABEL };

export function dayKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function clock(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function shift(current: number, earlier: number | undefined, digits = 1) {
  if (earlier === undefined) return null;
  const diff = current - earlier;
  const text = `${diff > 0 ? "+" : ""}${diff.toFixed(digits)}`;
  if (Number(text) === 0) return null;
  return text;
}

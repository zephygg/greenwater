"use client";

import { useGreenhouse } from "./provider";

export function ProfileScreen() {
  const { data } = useGreenhouse();
  if (!data) return null;
  const { settings, source, history } = data;
  const oldest = history[0]?.recordedAt;
  const newest = history[history.length - 1]?.recordedAt;
  const spanDays =
    oldest && newest ? Math.round((new Date(newest).getTime() - new Date(oldest).getTime()) / 86_400_000) : 0;

  const rows = [
    ["Greenhouse", settings.greenhouseName],
    ["Language", settings.locale],
    ["Units", settings.units],
    ["Air range", `${settings.airTempLow}–${settings.airTempHigh} °C`],
    ["Humidity high", `${settings.humidityHigh}%`],
    ["Soil moisture low", `${settings.moistureLow}%`],
    ["Water target", `${settings.waterTempTarget} °C`],
    ["History", `${history.length} readings, ${spanDays} days`],
    ["Database", source === "supabase" ? "Supabase" : "Sample data"],
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        These values come from the settings row. The language is stored, and translating the screens comes later.
      </p>
      <dl className="rounded-3xl bg-card ring-1 ring-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-right text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {source === "supabase"
          ? "Change greenhouse_name or a range in the Supabase settings table, then refresh."
          : "Connect Supabase and this list follows the settings table instead of the sample."}
      </p>
    </div>
  );
}

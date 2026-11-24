"use client";

import { clock, ZONE_LABEL } from "@/lib/format";
import { useGreenhouse } from "./provider";

export function AlertsScreen() {
  const { data } = useGreenhouse();
  if (!data) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Readings that sit outside the ranges in settings. Turning these into alerts is a later week. The list is here so the 45 °C sample is visible.
      </p>
      {data.outliers.length === 0 && (
        <p className="rounded-3xl bg-card p-4 text-sm ring-1 ring-border">Every stored reading is inside the ranges in settings.</p>
      )}
      <ul className="space-y-2">
        {data.outliers.map((item) => (
          <li key={`${item.recordedAt}-${item.parameter}`} className="rounded-3xl bg-card p-4 ring-1 ring-amber">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold">{item.parameter}</h2>
              <p className="font-display text-2xl tabular-nums">
                {item.value}
                <span className="ml-1 font-sans text-sm text-muted-foreground">{item.unit}</span>
              </p>
            </div>
            <p className="mt-1 text-sm text-amber">{item.note}</p>
            <p className="mt-1 text-xs text-muted-foreground">{clock(item.recordedAt)} · {ZONE_LABEL}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

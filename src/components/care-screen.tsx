"use client";

import { clock, dayKey, ZONE_LABEL } from "@/lib/format";
import { useGreenhouse } from "./provider";
import { TipsScreen } from "./tips-screen";

export function CareScreen() {
  const { data } = useGreenhouse();
  if (!data) return null;
  const feedings = [...data.feedings].reverse();
  const latest = feedings[0];
  const fedToday = latest ? dayKey(latest.fedAt) === dayKey(new Date().toISOString()) : false;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        The feeding log is the extra feature. Leftover food becomes ammonia. Adding a meal from the phone comes later. This list is what the database already stores.
      </p>
      <section className={`rounded-3xl p-4 ring-1 ${fedToday ? "bg-card ring-amber" : "bg-card ring-border"}`}>
        <p className="text-xs text-muted-foreground">Today · {ZONE_LABEL}</p>
        <h2 className="font-display mt-1 text-2xl">{fedToday ? "Already fed today" : "Not fed yet today"}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {fedToday
            ? "Another feeding would leave food in the tank. Wait until the next meal."
            : "The last stored meal was on another day."}
        </p>
        {latest && (
          <p className="mt-3 text-sm">
            Last meal: {latest.grams} g · {clock(latest.fedAt)}
          </p>
        )}
      </section>
      {feedings.length === 0 ? (
        <p className="rounded-3xl bg-card p-4 text-sm ring-1 ring-border">No feedings are stored yet.</p>
      ) : (
        <ul className="space-y-2">
          {feedings.map((row) => (
            <li key={row.fedAt} className="rounded-3xl bg-card px-4 py-3 ring-1 ring-border">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium">{row.grams} g</p>
                <p className="text-xs text-muted-foreground">{clock(row.fedAt)}</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{row.note}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {data.source === "supabase"
          ? "Change a row in the Supabase feedings table, then refresh."
          : "This list is the sample log. Connect Supabase to read the table instead."}
      </p>
      <TipsScreen />
    </div>
  );
}

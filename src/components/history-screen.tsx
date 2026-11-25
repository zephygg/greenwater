"use client";

import { useState } from "react";
import { clock } from "@/lib/format";
import { useGreenhouse } from "./provider";
import type { Reading } from "@/data/types";

type Period = "day" | "week";

export function HistoryScreen() {
  const { data } = useGreenhouse();
  const [period, setPeriod] = useState<Period>("week");
  if (!data) return null;

  const hours = period === "day" ? 24 : 24 * 7;
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  const rows = data.history.filter((row) => new Date(row.recordedAt).getTime() >= cutoff);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Stored readings. Day is the last 24 hours. Week is the last 7 days. A fuller chart is a later week.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <PeriodButton current={period} value="day" onPick={setPeriod} />
        <PeriodButton current={period} value="week" onPick={setPeriod} />
      </div>
      {rows.length === 0 ? (
        <p className="rounded-3xl bg-card p-4 text-sm ring-1 ring-border">No readings in this period.</p>
      ) : (
        <>
          <ChartCard title="Air temperature" unit="°C" rows={rows} pick={(row) => row.airTemp} min={15} max={50} color="#4fb3a9" />
          <ChartCard title="Humidity" unit="%" rows={rows} pick={(row) => row.humidity} min={40} max={100} color="#7ca9e0" />
          <ul className="rounded-3xl bg-card ring-1 ring-border">
            {[...rows].reverse().map((row) => (
              <li
                key={row.recordedAt}
                className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-border px-4 py-3 text-sm last:border-b-0"
              >
                <span className="text-muted-foreground">{clock(row.recordedAt)}</span>
                <span className="text-right tabular-nums">{row.airTemp.toFixed(1)} °C</span>
                <span className="text-right tabular-nums">{row.humidity.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function PeriodButton({
  current,
  value,
  onPick,
}: {
  current: Period;
  value: Period;
  onPick: (value: Period) => void;
}) {
  const on = current === value;
  return (
    <button
      type="button"
      onClick={() => onPick(value)}
      className={`rounded-2xl px-3 py-2 text-sm font-medium ring-1 ${on ? "bg-primary text-primary-foreground ring-primary" : "bg-card text-foreground ring-border"}`}
    >
      {value === "day" ? "Day" : "Week"}
    </button>
  );
}

function ChartCard({
  title,
  unit,
  rows,
  pick,
  min,
  max,
  color,
}: {
  title: string;
  unit: string;
  rows: Reading[];
  pick: (row: Reading) => number;
  min: number;
  max: number;
  color: string;
}) {
  const width = 320;
  const height = 96;
  const points = rows.map((row, index) => {
    const x = rows.length === 1 ? width / 2 : (index / (rows.length - 1)) * width;
    const y = height - ((pick(row) - min) / (max - min)) * (height - 8) - 4;
    return { x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const last = pick(rows[rows.length - 1]);

  return (
    <section className="rounded-3xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="font-display text-2xl tabular-nums">
          {Number.isInteger(last) ? last.toFixed(0) : last.toFixed(1)}
          <span className="ml-1 font-sans text-sm text-muted-foreground">{unit}</span>
        </p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-auto w-full" role="img" aria-label={`${title} chart`}>
        <path d={path} fill="none" stroke={color} strokeWidth="2" />
      </svg>
    </section>
  );
}

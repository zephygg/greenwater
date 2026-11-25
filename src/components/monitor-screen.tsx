"use client";

import Link from "next/link";
import { Droplets, Sprout, SunMedium, Thermometer } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { clock, shift, ZONE_LABEL } from "@/lib/format";
import { useGreenhouse } from "./provider";
import type { Reading } from "@/data/types";

export function MonitorScreen() {
  const { data } = useGreenhouse();
  if (!data) return null;
  const { current, history, settings, source } = data;
  const earlier = history[history.length - 2];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Updated {clock(current.recordedAt)} · {ZONE_LABEL}
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          label="Air"
          value={current.airTemp.toFixed(1)}
          unit="°C"
          tint="#9ed968"
          icon={<Thermometer className="size-3.5" />}
          warn={current.airTemp < settings.airTempLow || current.airTemp > settings.airTempHigh}
          delta={shift(current.airTemp, earlier?.airTemp)}
        />
        <Tile
          label="Humidity"
          value={current.humidity.toFixed(0)}
          unit="%"
          tint="#7ca9e0"
          icon={<Droplets className="size-3.5" />}
          warn={current.humidity > settings.humidityHigh}
          delta={shift(current.humidity, earlier?.humidity, 0)}
        />
        <Tile
          label="Soil"
          value={current.moisture.toFixed(0)}
          unit="%"
          tint="#4fb3a9"
          icon={<Sprout className="size-3.5" />}
          warn={current.moisture < settings.moistureLow}
          delta={shift(current.moisture, earlier?.moisture, 0)}
        />
        <Tile
          label="Light"
          value={current.light.toFixed(0)}
          unit="klux"
          tint="#e8a33d"
          icon={<SunMedium className="size-3.5" />}
          delta={shift(current.light, earlier?.light, 0)}
        />
      </div>
      <p className="text-xs text-muted-foreground">Soil moisture is the sensor in the grow-bed media.</p>
      <section className="rounded-3xl bg-card p-4 ring-1 ring-border">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Air temperature, last 8 days</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/history">History</Link>
          </Button>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-primary" /> Air
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber" /> Outside range
          </span>
        </div>
        <AirChart history={history} />
        <p className="text-xs text-muted-foreground">
          The amber dot is the 45 °C sample, stored on purpose so alerts can be tested later.
        </p>
      </section>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {source === "supabase"
          ? "These numbers are the newest row in the Supabase readings table. Change that row, then refresh."
          : "These numbers are the sample greenhouse in the data layer. Add Supabase keys to read the console instead."}
      </p>
    </div>
  );
}

function Tile({
  label,
  value,
  unit,
  icon,
  tint,
  warn,
  delta,
}: {
  label: string;
  value: string;
  unit: string;
  icon: ReactNode;
  tint: string;
  warn?: boolean;
  delta: string | null;
}) {
  return (
    <article className={`rounded-3xl bg-card p-3.5 ring-1 ${warn ? "ring-amber" : "ring-border"}`}>
      <div className="flex items-center gap-2">
        <span
          className="grid size-7 place-items-center rounded-lg"
          style={{ backgroundColor: `${tint}22`, color: tint }}
        >
          {icon}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-display mt-3 text-3xl leading-none tabular-nums">
        {value}
        <span className="ml-1 font-sans text-sm text-muted-foreground">{unit}</span>
      </p>
      {delta && <p className="mt-1 text-xs text-muted-foreground tabular-nums">{delta}</p>}
    </article>
  );
}

function AirChart({ history }: { history: Reading[] }) {
  const width = 320;
  const height = 112;
  const min = 15;
  const max = 50;
  const points = history.map((row, index) => {
    const x = history.length === 1 ? width / 2 : (index / (history.length - 1)) * width;
    const y = height - ((row.airTemp - min) / (max - min)) * (height - 8) - 4;
    return { x, y, hot: row.airTemp > 40, at: row.recordedAt };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-auto w-full" role="img" aria-label="Air temperature over eight days">
      <path d={path} fill="none" stroke="#4fb3a9" strokeWidth="2" />
      {points
        .filter((point) => point.hot)
        .map((point) => (
          <circle key={point.at} cx={point.x} cy={point.y} r="4" fill="#e8a33d" />
        ))}
    </svg>
  );
}

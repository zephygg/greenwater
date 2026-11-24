"use client";

import { Droplets, Fan, SunMedium, Thermometer, Wheat, type LucideIcon } from "lucide-react";
import { useGreenhouse } from "./provider";

const ICONS: Record<string, LucideIcon> = {
  irrigation: Droplets,
  ventilation: Fan,
  lights: SunMedium,
  heater: Thermometer,
  feeder: Wheat,
};

export function DevicesScreen() {
  const { data } = useGreenhouse();
  if (!data) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        On and off are stored in the devices table. Changing a switch from the phone comes in a later week.
      </p>
      {data.devices.length === 0 && (
        <p className="rounded-3xl bg-card p-4 text-sm ring-1 ring-border">No devices are stored yet.</p>
      )}
      <ul className="space-y-2">
        {data.devices.map((device) => {
          const Icon = ICONS[device.id] ?? Fan;
          return (
            <li key={device.id} className="flex items-center gap-3 rounded-3xl bg-card px-4 py-3 ring-1 ring-border">
              <span className="grid size-10 place-items-center rounded-2xl bg-accent text-primary">
                <Icon className="size-4" />
              </span>
              <span className="font-medium">{device.name}</span>
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${device.on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {device.on ? "On" : "Off"}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {data.source === "supabase"
          ? "Edit is_on in the Supabase devices table, then refresh. The pill follows that row."
          : "This list is the sample data. Connect Supabase to change it from the database console."}
      </p>
    </div>
  );
}

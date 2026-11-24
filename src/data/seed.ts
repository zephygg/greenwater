import type { Device, GreenhouseRows, Reading, Settings } from "./types";

/** Daylight for the sample follows Atyrau, the same zone as src/lib/zone.ts. */
const ZONE = "Asia/Atyrau";

export const SETTINGS: Settings = {
  greenhouseName: "AquaHydro",
  locale: "English",
  units: "metric",
  airTempLow: 18,
  airTempHigh: 28,
  humidityHigh: 85,
  moistureLow: 35,
  waterTempTarget: 24,
};

export const DEVICES: Device[] = [
  { id: "irrigation", name: "Irrigation", on: false },
  { id: "ventilation", name: "Ventilation", on: true },
  { id: "lights", name: "Grow lights", on: true },
  { id: "heater", name: "Water heater", on: false },
  { id: "feeder", name: "Feeder", on: false },
];

function hourInZone(when: Date) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: ZONE,
      hour: "numeric",
      hourCycle: "h23",
    }).format(when),
  );
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export function readingAt(when: Date, hoursAgo: number): Reading {
  const hour = hourInZone(when);
  const daylight = hour >= 7 && hour <= 19;
  const daily = Math.sin((hoursAgo / 24) * Math.PI * 2);
  const slow = Math.sin((hoursAgo / 24) * Math.PI);
  return {
    recordedAt: when.toISOString(),
    airTemp: hoursAgo === 48 ? 45 : round(23 + daily * 1.4),
    humidity: hoursAgo === 72 ? 92 : Math.round(68 + daily * 4),
    moisture: Math.round(48 + slow * 6),
    light: daylight ? 8 + (hour - 7) : 0,
  };
}

/** Eight days of readings, one row every six hours. Includes 45 °C and 92% humidity. */
export function buildSeed(now: Date): GreenhouseRows {
  const history: Reading[] = [];
  for (let hoursAgo = 192; hoursAgo >= 0; hoursAgo -= 6) {
    const when = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    history.push(readingAt(when, hoursAgo));
  }
  return { settings: SETTINGS, devices: DEVICES, history };
}

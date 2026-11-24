import "server-only";
import { createClient } from "@supabase/supabase-js";
import { DataError } from "./errors";
import type { Device, GreenhouseRows, Reading, Settings } from "./types";

export { DataError };

type SettingsRow = {
  greenhouse_name: string;
  locale: string;
  units: string;
  air_temp_low: number;
  air_temp_high: number;
  humidity_high: number;
  moisture_low: number;
  water_temp_target: number;
};

type DeviceRow = { id: string; name: string; is_on: boolean; position: number };
type ReadingRow = {
  recorded_at: string;
  air_temp: number;
  humidity: number;
  moisture: number;
  light: number;
};

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

function required(name: "SUPABASE_URL" | "SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) throw new DataError(`Missing ${name}.`);
  return value;
}

export async function fetchSupabase(): Promise<GreenhouseRows> {
  const supabase = createClient(required("SUPABASE_URL"), required("SUPABASE_ANON_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const [settingsRes, devicesRes, readingsRes] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("devices").select("id,name,is_on,position").order("position"),
    supabase
      .from("readings")
      .select("recorded_at,air_temp,humidity,moisture,light")
      .order("recorded_at", { ascending: true }),
  ]);

  for (const result of [settingsRes, devicesRes, readingsRes]) {
    if (result.error) {
      throw new DataError(
        `Supabase refused the read (${result.error.message}). Check the URL, the anon key, and that supabase/schema.sql has been run.`,
      );
    }
  }

  const settingsRow = settingsRes.data as SettingsRow | null;
  if (!settingsRow) {
    throw new DataError("The settings table has no row. Run supabase/schema.sql in the Supabase SQL editor.");
  }

  const settings: Settings = {
    greenhouseName: settingsRow.greenhouse_name,
    locale: settingsRow.locale,
    units: settingsRow.units,
    airTempLow: Number(settingsRow.air_temp_low),
    airTempHigh: Number(settingsRow.air_temp_high),
    humidityHigh: Number(settingsRow.humidity_high),
    moistureLow: Number(settingsRow.moisture_low),
    waterTempTarget: Number(settingsRow.water_temp_target),
  };

  const devices: Device[] = ((devicesRes.data ?? []) as DeviceRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    on: row.is_on,
  }));

  const history: Reading[] = ((readingsRes.data ?? []) as ReadingRow[]).map((row) => ({
    recordedAt: row.recorded_at,
    airTemp: Number(row.air_temp),
    humidity: Number(row.humidity),
    moisture: Number(row.moisture),
    light: Number(row.light),
  }));

  if (history.length === 0) {
    throw new DataError("The readings table is empty. Run supabase/schema.sql in the Supabase SQL editor.");
  }

  return { settings, devices, history };
}

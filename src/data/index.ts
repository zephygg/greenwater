import "server-only";
import { findOutliers } from "./ranges";
import { buildSeed } from "./seed";
import { DataError, fetchSupabase, isSupabaseConfigured } from "./supabase";
import type { Greenhouse, GreenhouseRows } from "./types";

export { DataError };

function assemble(rows: GreenhouseRows, source: Greenhouse["source"]): Greenhouse {
  const current = rows.history[rows.history.length - 1];
  if (!current) throw new DataError("The readings table is empty.");
  return {
    source,
    settings: rows.settings,
    current,
    devices: rows.devices,
    history: rows.history,
    outliers: findOutliers(rows.history, rows.settings),
  };
}

/** The only function the screens' API route calls. */
export async function loadGreenhouse(): Promise<Greenhouse> {
  if (!isSupabaseConfigured()) {
    return assemble(buildSeed(new Date()), "seed");
  }
  return assemble(await fetchSupabase(), "supabase");
}

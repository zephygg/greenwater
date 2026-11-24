import { findOutliers } from "./ranges";
import { DataError } from "./errors";
import type { Greenhouse, GreenhouseRows } from "./types";

export function assemble(rows: GreenhouseRows, source: Greenhouse["source"]): Greenhouse {
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

import type { Outlier, Reading, Settings } from "./types";

export function findOutliers(history: Reading[], settings: Settings): Outlier[] {
  const found: Outlier[] = [];
  for (const row of history) {
    if (row.airTemp < settings.airTempLow || row.airTemp > settings.airTempHigh) {
      found.push({
        recordedAt: row.recordedAt,
        parameter: "Air temperature",
        value: row.airTemp,
        unit: "°C",
        note:
          row.airTemp > settings.airTempHigh
            ? `Above ${settings.airTempHigh} °C`
            : `Below ${settings.airTempLow} °C`,
      });
    }
    if (row.humidity > settings.humidityHigh) {
      found.push({
        recordedAt: row.recordedAt,
        parameter: "Humidity",
        value: row.humidity,
        unit: "%",
        note: `Above ${settings.humidityHigh}%`,
      });
    }
    if (row.moisture < settings.moistureLow) {
      found.push({
        recordedAt: row.recordedAt,
        parameter: "Soil moisture",
        value: row.moisture,
        unit: "%",
        note: `Below ${settings.moistureLow}%`,
      });
    }
  }
  return found.reverse();
}

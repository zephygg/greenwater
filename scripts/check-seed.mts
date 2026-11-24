import assert from "node:assert/strict";
import { findOutliers } from "../src/data/ranges.ts";
import { buildSeed } from "../src/data/seed.ts";

const now = new Date("2026-11-24T08:00:00Z");
const rows = buildSeed(now);
const oldest = new Date(rows.history[0].recordedAt).getTime();
const newest = new Date(rows.history[rows.history.length - 1].recordedAt).getTime();
const parameters = ["airTemp", "humidity", "moisture", "light"];

assert.ok(rows.history.length >= 8, "history needs several days of rows");
assert.ok(newest - oldest >= 7 * 24 * 60 * 60 * 1000, "history spans at least 7 days");
assert.ok(rows.devices.filter((device) => typeof device.on === "boolean").length >= 3);
assert.ok(rows.settings.greenhouseName.length > 0);
assert.ok(parameters.every((key) => rows.history.every((row) => Number.isFinite(row[key]))));
assert.ok(rows.history.some((row) => row.airTemp === 45), "test data includes 45 °C");
assert.ok(rows.history.some((row) => row.humidity === 92), "test data includes a high humidity");

const outliers = findOutliers(rows.history, rows.settings);
assert.ok(outliers.some((item) => item.value === 45 && item.parameter === "Air temperature"));
assert.ok(outliers.some((item) => item.value === 92 && item.parameter === "Humidity"));
assert.notEqual(rows.history[rows.history.length - 1].airTemp, 45, "the newest row stays inside range");

console.log(`seed ok: ${rows.history.length} readings, ${rows.devices.length} devices, ${outliers.length} outliers`);

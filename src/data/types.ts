export type Reading = {
  recordedAt: string;
  airTemp: number;
  humidity: number;
  moisture: number;
  light: number;
};

export type Device = {
  id: string;
  name: string;
  on: boolean;
};

export type Settings = {
  greenhouseName: string;
  locale: string;
  units: string;
  airTempLow: number;
  airTempHigh: number;
  humidityHigh: number;
  moistureLow: number;
  waterTempTarget: number;
};

export type Outlier = {
  recordedAt: string;
  parameter: "Air temperature" | "Humidity" | "Soil moisture";
  value: number;
  unit: string;
  note: string;
};

export type Greenhouse = {
  source: "supabase" | "seed";
  settings: Settings;
  current: Reading;
  devices: Device[];
  history: Reading[];
  outliers: Outlier[];
};

export type GreenhouseRows = {
  settings: Settings;
  devices: Device[];
  history: Reading[];
};

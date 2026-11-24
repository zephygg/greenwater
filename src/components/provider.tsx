"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { assemble } from "@/data/assemble";
import { buildSeed } from "@/data/seed";
import type { Greenhouse } from "@/data/types";

const packedInApp = process.env.NEXT_PUBLIC_APK === "1";

function sampleGreenhouse(): Greenhouse {
  return assemble(buildSeed(new Date()), "seed");
}

type Status = "loading" | "ready" | "error";

type GreenhouseContextValue = {
  data: Greenhouse | null;
  status: Status;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
};

const GreenhouseContext = createContext<GreenhouseContextValue | null>(null);

export function GreenhouseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Greenhouse | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (packedInApp) {
      setData(sampleGreenhouse());
      setError(null);
      setStatus("ready");
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    try {
      const response = await fetch("/api/greenhouse", { cache: "no-store" });
      const body = (await response.json()) as Greenhouse & { error?: string };
      if (!response.ok) throw new Error(body.error || "The database did not answer.");
      setData(body);
      setError(null);
      setStatus("ready");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The database did not answer.";
      setError(message);
      setStatus((current) => (current === "ready" ? "ready" : "error"));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <GreenhouseContext.Provider value={{ data, status, error, refreshing, refresh }}>
      {children}
    </GreenhouseContext.Provider>
  );
}

export function useGreenhouse() {
  const value = useContext(GreenhouseContext);
  if (!value) throw new Error("useGreenhouse must be used inside GreenhouseProvider");
  return value;
}

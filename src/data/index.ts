import "server-only";
import { assemble } from "./assemble";
import { buildSeed } from "./seed";
import { DataError, fetchSupabase, isSupabaseConfigured } from "./supabase";
import type { Greenhouse } from "./types";

export { DataError };

/** The only function the screens' API route calls. */
export async function loadGreenhouse(): Promise<Greenhouse> {
  if (!isSupabaseConfigured()) {
    return assemble(buildSeed(new Date()), "seed");
  }
  return assemble(await fetchSupabase(), "supabase");
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useGreenhouse } from "./provider";

export function LoginScreen() {
  const { data, status, error } = useGreenhouse();
  const name = data?.settings.greenhouseName ?? "AquaHydro";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 py-10">
      <div>
        <Logo className="size-16" />
        <p className="mt-8 text-xs tracking-[0.18em] text-muted-foreground uppercase">Aquaponics</p>
        <h1 className="font-display mt-1 text-5xl text-leaf">AquaHydro</h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed">
          One greenhouse. A ranchu tank, grow beds, and the pumps between them.
        </p>
      </div>
      <section className="rounded-3xl bg-card p-5 ring-1 ring-border">
        <p className="text-xs text-muted-foreground">Greenhouse</p>
        <p className="font-display mt-1 text-2xl">{status === "loading" ? "Reading…" : name}</p>
        {error && <p className="mt-2 text-sm text-amber">{error}</p>}
        <Button asChild className="mt-5 w-full">
          <Link href="/monitor">Open the greenhouse</Link>
        </Button>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Accounts wait for a later week. This door only opens the screens, and every screen reads the same database.
        </p>
      </section>
    </main>
  );
}

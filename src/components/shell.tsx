"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Fish, LayoutDashboard, Settings, SlidersHorizontal, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useGreenhouse } from "./provider";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/devices", label: "Devices", icon: SlidersHorizontal },
  { href: "/monitor", label: "Home", icon: LayoutDashboard },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/care", label: "Care", icon: Fish },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data, status, error, refreshing, refresh } = useGreenhouse();

  if (status === "loading" && !data) {
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <div className="text-center">
          <Logo className="mx-auto size-16" />
          <p className="font-display mt-4 text-3xl text-leaf">AquaHydro</p>
          <p className="mt-2 text-sm text-muted-foreground">Reading the greenhouse…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-6">
        <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
          <p className="font-display text-2xl">The greenhouse did not load</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => void refresh()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const title = NAV.find((item) => pathname.startsWith(item.href));
  const heading = pathname.startsWith("/monitor")
    ? data.settings.greenhouseName
    : pathname.startsWith("/history")
      ? "History"
      : (title?.label ?? "AquaHydro");
  const eyebrow = pathname.startsWith("/monitor")
    ? "Dashboard"
    : pathname.startsWith("/history")
      ? "Charts"
      : data.settings.greenhouseName;

  return (
    <div className="min-h-dvh md:pl-60">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-[#101a15]/95 px-4 py-6 md:flex">
        <div className="flex items-center gap-3 px-2">
          <Logo className="size-11" />
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Aquaponics</p>
            <p className="font-display text-xl">{data.settings.greenhouseName}</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} count={data.outliers.length} />
          ))}
        </nav>
      </aside>

      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pt-5 pb-24 md:px-8 md:pb-10">
        <header className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground">{eyebrow}</p>
            <h1 className="font-display text-3xl leading-none">{heading}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
        </header>
        {error && (
          <p className="mb-3 rounded-2xl bg-[#3a2a14] px-3 py-2 text-sm text-amber" role="status">
            {error}
          </p>
        )}
        {children}
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[#101a15]/95 px-1 pt-1 backdrop-blur md:hidden"
        style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] leading-none ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                <Icon className="size-5" />
                {item.label}
                {item.href === "/alerts" && data.outliers.length > 0 && (
                  <span className="absolute top-1 right-3 size-2 rounded-full bg-amber" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function NavLink({
  item,
  active,
  count,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  count: number;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}
    >
      <Icon className="size-4" />
      <span>{item.label}</span>
      {item.href === "/alerts" && count > 0 && (
        <span className="ml-auto rounded-full bg-amber px-1.5 text-xs font-semibold text-[#1a120d]">{count}</span>
      )}
    </Link>
  );
}

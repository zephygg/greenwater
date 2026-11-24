import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { GreenhouseProvider } from "@/components/provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AquaHydro",
  description: "Monitor one aquaponics greenhouse: air, water, soil, and the devices that keep them steady.",
  applicationName: "AquaHydro",
  appleWebApp: { capable: true, title: "AquaHydro", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0e1712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${space.variable} antialiased`}>
        <GreenhouseProvider>{children}</GreenhouseProvider>
      </body>
    </html>
  );
}

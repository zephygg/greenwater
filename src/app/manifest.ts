import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AquaHydro",
    short_name: "AquaHydro",
    description: "Aquaponics greenhouse monitor",
    start_url: "/",
    display: "standalone",
    background_color: "#0e1712",
    theme_color: "#0e1712",
  };
}

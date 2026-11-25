# AquaHydro

A phone app for one aquaponics greenhouse: a ranchu tank, grow beds, and the pumps between them. This pass is the first working version. Every screen opens, and the numbers come from the database through a separate data layer.

## Install the APK

`AquaHydro.apk` can be found in Releases tab, where you can choose a version you need. The sample greenhouse is packed inside, so the app opens with no server. The anon key is not in the APK. Editing a value in the Supabase console and pressing Refresh is the website, not this file.

On Windows, copy `AquaHydro.apk` to the phone and open it. If Android asks, allow install from that source. On an emulator, drag the file onto the emulator window.

Rebuild it with the Android SDK installed and `ANDROID_HOME` set:

```bash
npm run apk
```

## Run it

```bash
npm install
npm run dev
```

Open the app on your phone or in a narrow browser window. The bottom bar is the navigation: Devices, Monitor, Alerts, Tips, Profile. The first screen is the door. **Open the greenhouse** goes to Monitor.

Without keys, the app reads the sample greenhouse in `src/data/seed.ts`. The sample is eight days of readings, five devices, one settings row, a 45 °C air reading, and a 92% humidity reading.

`npm run check` confirms that sample. `npm test` is not a separate suite.

## Connect Supabase

The brief asks for Firebase or Supabase. Supabase is a Postgres database with a table editor, which is the console you open in the defense. We use it since its better than just a bare Postgres

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql`. That creates the tables and the same sample rows.
3. In Project Settings → API, copy the project URL and the `anon` public key.
4. Put them in `.env.local` (this file is gitignored):

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

5. Restart `npm run dev`. Monitor then says the numbers come from Supabase.

Change a value in the table editor, go back to the app, and press **Refresh**. The screen follows the table. The current reading is the newest row in `readings`. A device pill follows `is_on`. The greenhouse name follows `settings.greenhouse_name`.

Use the anon key only. This project never uses the service role key.

## Screens

| Screen | What it shows |
| --- | --- |
| Door | Opens the greenhouse. Accounts are a later week. |
| Monitor | Air, humidity, soil moisture, and light from the newest reading, plus the air chart. |
| Devices | Five devices and the stored on/off state. |
| Alerts | Readings outside the ranges in settings, including the 45 °C sample. |
| Tips | Notes on the nitrogen cycle, ranchu, feeding, and a power cut. |
| Profile | The settings row: name, language, units, ranges, and how long the history is. |

## Data structure

One greenhouse. No accounts yet, so there is no user table. History is not a separate table: it is every row in `readings`. The newest row is what Monitor shows now.

```mermaid
erDiagram
  SETTINGS {
    int id
    text greenhouse_name
    text locale
    text units
    numeric air_temp_low
    numeric air_temp_high
    numeric humidity_high
    numeric moisture_low
    numeric water_temp_target
  }
  DEVICES {
    text id
    text name
    boolean is_on
    int position
  }
  READINGS {
    bigint id
    timestamptz recorded_at
    numeric air_temp
    numeric humidity
    numeric moisture
    numeric light
  }
```

| Table | What it holds | This week |
| --- | --- | --- |
| `settings` | One row: name, language, units, and the ranges | Required |
| `devices` | One row per switch, with on/off | Five rows, three or more required |
| `readings` | One row per sample: air °C, humidity %, soil moisture %, light klux | Every 6 hours for 8 days, including 45 °C |

The anon key can read these tables and cannot write them. Writes happen in the Supabase table editor, which is the right place for this week's defense.

## Where the code lives

Screens never talk to Supabase.

- `src/data/supabase.ts` is the only file that connects. It reads `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- `src/data/index.ts` chooses Supabase when those two are set, and the sample otherwise.
- `src/data/seed.ts` is the sample.
- `src/data/ranges.ts` marks readings outside the settings ranges.
- `src/app/api/greenhouse/route.ts` is what the screens call.
- `src/components/` draws the screens.

## Stack

- **Next.js, React, and TypeScript.** The phone screens and the data API live in one project, and the app runs in the phone browser. This week does not need an APK.
- **Tailwind.** One set of colors and type on every screen: the greenhouse green, the leaf mark, Space Grotesk for titles, Inter for text.
- **Supabase.** The brief asks for Firebase or Supabase. The data is rows — readings, devices, settings — and the Supabase table editor is the console the defense asks you to open.

## Project Members

- Qamay Arnur - Backend & DB
- Aruzhan Khismetova - General idea + design
- Gainidenuly Arslan - Design & backend help

## Keys

Keys stay in `.env.local`. `.env.example` lists the names and has no values. If the anon key were committed, anyone could read the greenhouse tables. If the service role key were committed, anyone could change or delete them. Neither belongs on GitHub.

## Defense

1. Launch the app and open every screen from the bottom bar.
2. In Supabase, open Table Editor and show `readings`, `devices`, and `settings`.
3. Change the newest `air_temp`, or a device `is_on`, or `greenhouse_name`. Refresh the app and show the new value.
4. Show `src/data/supabase.ts` as the connection, and `.env.local` as the place the keys live. They are not in the repository.

Spoken answers:

- The app connects in `src/data/supabase.ts`. Screens only call `/api/greenhouse`.
- History is one row per sample in `readings`, ordered by `recorded_at`. The newest row is the current reading.
- A key on GitHub is a key anyone can use. The anon key would let people read the greenhouse. A service role key would let them rewrite it.

## Prototype in Figma:
https://www.figma.com/make/2TmD8qzycOLEbRQsCAlzpo/Ranchu-Greenhouse-Mobile-App?fullscreen=1&t=nthwZ1NzSWs5bSIV-1&code-node-id=0-6

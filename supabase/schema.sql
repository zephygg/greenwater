-- AquaHydro. One greenhouse.
-- Run this whole file in the Supabase SQL editor. It replaces the tables.
-- The numbers match src/data/seed.ts: a row every 6 hours for 8 days,
-- with air at 45 °C (48 hours ago) and humidity at 92% (72 hours ago).
-- feedings holds the extra feature: when the fish were fed.

drop table if exists feedings;
drop table if exists readings;
drop table if exists devices;
drop table if exists settings;

create table settings (
  id int primary key check (id = 1),
  greenhouse_name text not null,
  locale text not null,
  units text not null,
  air_temp_low numeric not null,
  air_temp_high numeric not null,
  humidity_high numeric not null,
  moisture_low numeric not null,
  water_temp_target numeric not null
);

create table devices (
  id text primary key,
  name text not null,
  is_on boolean not null,
  position int not null
);

create table readings (
  id bigint generated always as identity primary key,
  recorded_at timestamptz not null,
  air_temp numeric not null,
  humidity numeric not null,
  moisture numeric not null,
  light numeric not null
);

create index readings_recorded_at on readings (recorded_at);

create table feedings (
  id bigint generated always as identity primary key,
  fed_at timestamptz not null,
  grams numeric not null,
  note text not null
);

alter table settings enable row level security;
alter table devices enable row level security;
alter table readings enable row level security;
alter table feedings enable row level security;

create policy "read settings" on settings for select to anon, authenticated using (true);
create policy "read devices" on devices for select to anon, authenticated using (true);
create policy "read readings" on readings for select to anon, authenticated using (true);
create policy "read feedings" on feedings for select to anon, authenticated using (true);

grant select on settings, devices, readings, feedings to anon, authenticated;

insert into settings (
  id, greenhouse_name, locale, units,
  air_temp_low, air_temp_high, humidity_high, moisture_low, water_temp_target
) values (
  1, 'AquaHydro', 'English', 'metric',
  18, 28, 85, 35, 24
);

insert into devices (id, name, is_on, position) values
  ('irrigation', 'Irrigation', false, 1),
  ('ventilation', 'Ventilation', true, 2),
  ('lights', 'Grow lights', true, 3),
  ('heater', 'Water heater', false, 4),
  ('feeder', 'Feeder', false, 5);

insert into readings (recorded_at, air_temp, humidity, moisture, light)
select
  now() - make_interval(hours => h),
  case when h = 48 then 45 else round((23 + sin(h / 24.0 * pi() * 2) * 1.4)::numeric, 1) end,
  case when h = 72 then 92 else round(68 + sin(h / 24.0 * pi() * 2) * 4) end,
  round(48 + sin(h / 24.0 * pi()) * 6),
  case
    when extract(hour from (now() - make_interval(hours => h)) at time zone 'Asia/Atyrau') between 7 and 19
    then 8 + extract(hour from (now() - make_interval(hours => h)) at time zone 'Asia/Atyrau') - 7
    else 0
  end
from generate_series(0, 192, 6) as h;

insert into feedings (fed_at, grams, note) values
  (now() - make_interval(hours => 150), 8, 'Morning feed. They finished it.'),
  (now() - make_interval(hours => 78), 8, 'Evening feed.'),
  (now() - make_interval(hours => 30), 10, 'A little extra. Watch the water.'),
  (now() - make_interval(hours => 4), 8, 'Morning feed. They finished it.');

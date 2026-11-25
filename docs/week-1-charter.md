# AquaHydro — project charter

Week 1 of the Smart Greenhouse plan. This is the idea. The screens and the database come in the next two weeks.

## Name and description

**AquaHydro** helps a small aquaponics farmer check the greenhouse and the last fish feeding from a phone.

## Target user

The user is one person who keeps a single aquaponics greenhouse in Atyrau. The greenhouse has ranchu in a tank, plants in grow beds, and pumps that move the same water between them. The farmer cannot stand in the greenhouse all day. A hot afternoon, a stopped pump, or a second feeding can spoil the water before anyone notices. The phone is already in their pocket, so the check has to be short: are the numbers normal, what is switched on, and have the fish already been fed.

## Extra feature

Our app can show the last feeding and warn if the fish were already fed today, because our user cannot see leftover food from the temperature alone, and leftover food becomes ammonia.

This is not one of the required modules. Login, the dashboard, device buttons, automatic rules, alerts, charts, settings, and the offline message stay the required work. The feeding log is the extra piece, on its own Care screen.

## Directions

The course plan says to pick one or two tracks from section 4 of the brief. That section was not in the file we have. These are the two directions this project is built on. If the brief uses different names, keep this meaning and use the brief’s names.

1. **Food from a small greenhouse.** Fish and plants share one water loop. The app watches that loop.
2. **A daily care check.** The feeding log answers a question the sensors do not: was today already fed?

## How each required module will work

| Module | In AquaHydro |
| --- | --- |
| M1 Login | A door screen opens the greenhouse now. Later, a password lets the farmer in, a wrong password shows an error, and a second account does not see this greenhouse. |
| M2 Dashboard | Four numbers: air temperature, humidity, soil moisture, and light, plus the time of the last reading. Later they update on their own. |
| M3 Control | Irrigation, ventilation, grow lights, the water heater, and the feeder. The app shows the stored on or off. Later a press writes the new state. |
| M4 Modes | A manual / automatic switch. In automatic mode, soil moisture under the saved limit turns irrigation on. |
| M5 Alerts | The Alerts screen lists readings outside the saved ranges, including the 45 °C sample. Later a new bad value raises an alert the farmer can tap. |
| M6 History | A History screen with air and humidity, and a choice of day or week. |
| M7 Settings | The greenhouse name, language, units, and the safe ranges. Later the farmer edits them, and the automatic rule uses the new numbers. |
| M8 No internet | If the database cannot be reached, the app shows a clear message and does not crash. When the connection returns, Refresh loads the greenhouse again. |

## Team and repository

| Name | Role |
| --- | --- |
| Aruzhan | Idea, screens, data, and this written plan |

The project lives in the greenwater repository. Add each teammate’s name and role on this line when the team is set, and add them to the repository. The work is not finished by one hidden person: the README lists who owns which part.

## What is not in this week

No code is required for week 1. The running app, the database, and the phone file belong to week 3. The look of the screens belongs to week 2.

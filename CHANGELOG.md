# Changelog

All notable changes and architectural updates to the **Not Today** application are documented in this file.

---

## [2026-10-13] - Football, Alpine Skiing, and Automated ISR Release

### 1. Football: Serie A and UEFA Champions League (Inter Milan)
* **Serie A (38 Matches):**
  * Integrated all 38 Inter Milan fixtures for the 2026/2027 season using the `football-data.org` API with local spreadsheet fallback.
  * Confirmed fixtures retain official kickoff dates and times scheduled by Lega Serie A.
  * Unscheduled fixtures are set with provisional weekend dates, placeholder status, and standard afternoon timing pending official league announcements.
* **UEFA Champions League (8 Matches):**
  * Integrated all 8 Inter Milan League Phase fixtures with official UEFA match times.
* **Broadcaster Assignment:**
  * Serie A:
    * `Solo DAZN`: Exclusively broadcast fixtures on DAZN slots.
    * `Sky Sport / DAZN`: Co-exclusive fixtures on designated Sky broadcast slots.
    * `DAZN o Now`: Fixtures awaiting confirmed schedule and TV slot allocation.
  * Champions League:
    * `Sky Sport / NOW`: Tuesday fixtures.
    * `Prime Video (Esclusiva)`: Selected Wednesday headline matches.

---

### 2. Finished Events and Final Scores
* **Event Persistence:** Events remain visible throughout the day rather than disappearing after their scheduled start time.
* **Status Indicators:** Added a `Terminato` badge for concluded events.
* **Final Scores in Titles:** Completed football matches automatically include the final score in the title (e.g. `Serie A: Inter 4 - 1 Monza`).
* **Persistent Sport Filter:** The sport dropdown calculates categories across the entire database so categories remain selectable even if no events occur on the active date.

---

### 3. Alpine Skiing: FIS World Cup 2026/2027
* **Dedicated Data Script:** Created `scripts/sci_bot.py` to compile the calendar.
* **Full Discipline Coverage (60 Events):**
  * Separate tracking for Men's and Women's circuits.
  * Covers all four primary disciplines: Downhill (DH), Super-G (SG), Giant Slalom (GS), and Slalom (SL).
  * Includes premier international venues (Sölden, Levi, Beaver Creek, Val Gardena, Alta Badia, Madonna di Campiglio, Bormio, Wengen, Kitzbühel, Cortina d'Ampezzo, Schladming).
* **Broadcaster:** Assigned `Rai Sport / Eurosport`.

---

### 4. Automated Score Refresh with 2-Hour ISR Cache
* **Edge Route Configuration:** Configured `/api/events/route.ts` with Next.js Incremental Static Regeneration at 7200 seconds (`revalidate = 7200`).
* **Rate Limit Protection:** Caps external API requests to a maximum of 12 requests per competition per day, remaining safely within free-tier quotas.
* **Offline Resilience:** If external endpoints are unreachable, the application falls back seamlessly to local static data in `calendario.json`.

---

### 5. Local Database Summary (`src/data/calendario.json`)
The precompiled static schedule includes 302 total sporting events:
* **Formula 1:** 110 sessions (Practice, Qualifying, Sprint, Grand Prix)
* **MotoGP:** 44 sessions (Saturday Sprints and Sunday Grands Prix)
* **Football (Inter Milan):** 46 matches (38 Serie A and 8 Champions League)
* **Alpine Skiing:** 60 races (Men's and Women's World Cup)
* **Tennis (Jannik Sinner):** 42 tournament slots (Quarterfinals, Semifinals, and Finals)

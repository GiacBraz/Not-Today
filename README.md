# Not Today

A mobile-first web application designed to track and display schedules across multiple major sports in a single, unified view. Built with Next.js, React, and Tailwind CSS.

---

## Supported Sports

* **Formula 1:** Practice sessions, qualifying, sprint races, and Sunday Grands Prix.
* **MotoGP:** Saturday sprint races and Sunday main races.
* **Football:** Serie A and UEFA Champions League schedules (Inter Milan focus).
* **Alpine Skiing:** FIS Alpine Ski World Cup for Men and Women (Downhill, Super-G, Giant Slalom, and Slalom).
* **Tennis:** Grand Slams, ATP Masters 1000, and the ATP Finals.

---

## Key Features

* **Broadcaster Information:** Displays the specific TV channel or streaming platform for every event (DAZN, Sky Sport, NOW, Amazon Prime Video, Rai Sport, Eurosport).
* **Event History & Final Scores:** Past events remain accessible rather than being hidden. Completed events include final scores and a clear status badge.
* **Interactive Date Navigation:** A monthly calendar widget allows quick date selection, with visual markers on days containing scheduled events.
* **Sport Filters:** Filter the daily agenda by sport or display all sports concurrently.
* **Offline-First Architecture:** The core calendar is precompiled into a local JSON bundle (`calendario.json`), ensuring zero-latency startup and full offline reliability.
* **Automated Cloud Refresh:** Football match results and final statuses update automatically on Vercel via Incremental Static Regeneration (2-hour cache window), avoiding rate-limit exhaustion on free-tier APIs.

---

## Repository Structure

```text
├── src/
│   ├── app/
│   │   ├── api/events/route.ts   # Edge route with 2-hour ISR for football score updates
│   │   ├── page.tsx              # Main application view with filters and event list
│   │   └── globals.css           # Styling rules and design tokens
│   ├── components/
│   │   ├── EventCard.tsx         # Event presentation component
│   │   └── CalendarWidget.tsx    # Monthly calendar selector component
│   └── data/
│       └── calendario.json       # Precompiled database containing all sport schedules
└── scripts/
    ├── calcio_bot.py             # Generates Serie A and Champions League schedules
    ├── sci_bot.py                # Generates FIS Alpine Skiing World Cup schedules
    ├── f1_bot.py                 # Generates Formula 1 season schedule
    ├── motogp_bot.py             # Generates MotoGP sprint and race schedule
    └── tennis_bot.py             # Generates ATP Tour and Grand Slam schedule
```

---

## Getting Started

### Prerequisites

* Node.js 18.x or later
* Python 3.10 or later (for running data generation scripts)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GiacBraz/Not-Today.git
   cd Not-Today
   ```

2. Configure environment variables (optional for live match score updates):
   Create a `.env.local` file in the root directory:
   ```env
   FOOTBALL_DATA_API_KEY=your_api_key_here
   ```

3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Data Management Scripts

The application uses standalone Python scripts in the `scripts/` directory to scrape, parse, and normalize official sporting calendars into the unified `calendario.json` file.

To regenerate specific sport schedules:
```bash
python scripts/calcio_bot.py
python scripts/sci_bot.py
python scripts/f1_bot.py
python scripts/motogp_bot.py
```

---

## Deployment

The application is optimized for deployment on [Vercel](https://vercel.com):
1. Import the repository in your Vercel dashboard.
2. In **Settings > Environment Variables**, add `FOOTBALL_DATA_API_KEY`.
3. Deploy. Production deployments automatically handle ISR caching and static page optimization.

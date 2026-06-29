# Not Today 🏆

A sleek, mobile-first web application designed to track and display a comprehensive schedule of multiple major sporting events in a single, unified view. Built with Next.js, React, and Tailwind CSS.

## Features ✨

*   **Multi-Sport Support:** Seamlessly integrates calendars for:
    *   🏎️ **Formula 1** (2026 Season)
    *   🏍️ **MotoGP** (2026 Season - Sprints & Races only)
    *   ⚽ **Serie A** (2026/2027 Season - Inter Milan focus)
    *   ⚽ **FIFA World Cup 2026** (With LIVE API Integration)
    *   🎾 **Tennis** (ATP Grand Slams & Masters 1000)
*   **Live Scores & Animations:** The FIFA World Cup section fetches real-time data to display live scores and a pulsating 🔴 LIVE badge for matches currently in play.
*   **Mobile-First Design:** Optimized for smartphone screens with a clean, vertical layout, intuitive navigation, and modern aesthetics.
*   **Timezone Auto-Correction:** All event times are automatically parsed and displayed in Central European Time (CET/CEST - Italy).
*   **Smart Calendar Widget:** Interactive monthly calendar to jump to specific dates, with blue dots indicating days with scheduled events.
*   **Past Event Filtering:** Automatically hides past events to keep the focus on upcoming action.

## Tech Stack 🛠️

*   **Frontend Framework:** [Next.js](https://nextjs.org/) (React App Router)
*   **Styling:** Vanilla CSS + Tailwind CSS utilities
*   **Live Data API:** [football-data.org](https://www.football-data.org/)
*   **Offline Fallback:** Local JSON generated via Python data scrapers.

## Architecture & Data Pipeline ⚙️

The application uses an advanced **Hybrid Architecture** combining static offline data with Incremental Static Regeneration (ISR) for live events.

### 1. Incremental Static Regeneration (ISR)
The World Cup API route (`/api/events/route.ts`) is configured with `revalidate = 60`. 
This allows the application to serve live match scores with lightning-fast Edge cache speeds. Vercel acts as a shield, caching the response globally and only pinging the football-data.org API once every 60 seconds (1 call/minute max) regardless of how many thousands of concurrent users are active. This ensures the app never hits the API rate limit (10 req/min).

### 2. Dual-Engine Fallback (Super-API)
For the World Cup, the application relies on a solid "Database di Emergenza" (Fallback Database) containing exact schedules and official bracket labels (e.g., `W76 vs W78`). 
When fetching from the live API:
- It enriches the static matches with Live Status and Scores.
- If the live API is unreachable or fails (e.g. missing API Key), the app elegantly falls back to the static schedule, ensuring 100% uptime.

### 3. Static Bots
Other sports (F1, MotoGP, etc.) are compiled statically via Python bots that scrape and normalize `.ics`, `.xlsx`, and JSON files into a single `calendario.json` bundle.

## Local Development 🚀

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/GiacBraz/Not-Today.git
    cd Not-Today
    ```
2.  **Environment Variables:**
    Create a `.env.local` file in the root folder and add your football-data.org API key:
    ```env
    FOOTBALL_DATA_API_KEY=your_secret_key_here
    ```
3.  **Install dependencies & Run:**
    ```bash
    npm install
    npm run dev
    ```

## Deployment on Vercel 🌐

This project is highly optimized for deployment on [Vercel](https://vercel.com).
1. Import the repository.
2. In the Vercel dashboard, go to **Settings > Environment Variables** and add `FOOTBALL_DATA_API_KEY`.
3. Deploy! The ISR architecture combined with Vercel's Edge Network guarantees enterprise-level scaling on a free Hobby tier.

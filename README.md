# Sports Calendar App 🏆

A sleek, mobile-first web application designed to track and display a comprehensive schedule of multiple major sporting events in a single, unified view. Built with Next.js, React, and Tailwind CSS.

## Features ✨

*   **Multi-Sport Support:** Seamlessly integrates calendars for:
    *   🏎️ **Formula 1** (2026 Season)
    *   🏍️ **MotoGP** (2026 Season - Sprints & Races only)
    *   ⚽ **Serie A** (2026/2027 Season - Inter Milan focus)
    *   ⚽ **FIFA World Cup** (2026)
    *   🎾 **Tennis** (ATP Grand Slams & Masters 1000)
*   **Mobile-First Design:** Optimized for smartphone screens with a clean, vertical layout, intuitive navigation, and modern aesthetics.
*   **Timezone Auto-Correction:** All event times are automatically parsed and displayed in Central European Time (CET/CEST - Italy).
*   **Smart Calendar Widget:** Interactive monthly calendar to jump to specific dates, with blue dots indicating days with scheduled events.
*   **Past Event Filtering:** Automatically hides past events to keep the focus on upcoming action.

## Tech Stack 🛠️

*   **Frontend Framework:** [Next.js](https://nextjs.org/) (React)
*   **Styling:** Vanilla CSS + [Tailwind CSS](https://tailwindcss.com/)
*   **Data Scrapers (Bots):** Python (Regex, OpenPyXL)
*   **Database:** Local JSON (`calendario.json`) generated statically.

## Architecture & Data Pipeline ⚙️

The application uses a highly efficient, static-first architecture. It does not rely on a backend database (like SQL) or live third-party APIs during runtime. 

Instead, a suite of Python "bots" run locally to extract data from various sources (Excel files, raw `.ics` calendar files, and JSON endpoints). These bots normalize the data and output a single, unified `calendario.json` file. The Next.js frontend then reads this static JSON, ensuring zero latency, 100% uptime, and zero backend hosting costs.

### The Bots (`/scripts`)
*   `calcio_bot.py`: Parses the official Serie A `.xlsx` file and the World Cup JSON endpoint.
*   `f1_bot.py`: Parses F1 events from JSON.
*   `motogp_bot.py`: Reads a local `.ics` file, extracting `SUMMARY` and `DTSTART` to isolate Sprint and Sunday races.
*   `tennis_bot.py`: Generates the ATP schedule.

## Local Development 🚀

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/calendario-sport.git
    cd calendario-sport
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    *(To test on a mobile device connected to the same Wi-Fi, run `npm run dev -- -H 0.0.0.0` and open your local IP on your phone).*

4.  **Update the Database (Optional):**
    If the schedule changes, run the Python scripts to regenerate the `calendario.json`:
    ```bash
    python scripts/calcio_bot.py
    python scripts/motogp_bot.py
    ```

## Deployment 🌐

This project is optimized for deployment on [Vercel](https://vercel.com). Simply import the GitHub repository into your Vercel dashboard. Because the data is statically bundled as JSON, Vercel's free "Hobby" tier provides incredible performance and zero-config deployment.

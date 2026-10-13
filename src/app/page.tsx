"use client"; // Necessario perché la pagina ora ha una memoria "Stato"
import { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import CalendarWidget from "@/components/CalendarWidget";
import localEvents from "@/data/calendario.json"; // RIPRISTINATO per avere gli sport base sempre offline

// Funzione per normalizzare qualsiasi orario/timestamp al giorno effettivo italiano (fuso Europe/Rome)
function getItalianDateString(dateTimeStr: string): string {
  try {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return dateTimeStr.split('T')[0];
    return d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
  } catch {
    return dateTimeStr.split('T')[0];
  }
}

export default function Home() {
  // La base di partenza è il nostro file locale (Zero attesa, sempre online)
  const [eventsData, setEventsData] = useState<any[]>(localEvents);
  const [isLoading, setIsLoading] = useState(false);

  // Questo useEffect viene eseguito una volta sola quando l'app si avvia
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events', { cache: 'no-store' });
        const apiData = await res.json();
        if (Array.isArray(apiData) && apiData.length > 0) {
          const map = new Map();
          localEvents.forEach((ev: any) => map.set(ev.id, ev));
          apiData.forEach((ev: any) => map.set(ev.id, ev));
          setEventsData(Array.from(map.values()));
        }
      } catch (error) {
        console.error("Nessuna connessione internet. Mantengo i dati locali:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);
  // 1. Definiamo la data di default all'apertura (Oggi nel fuso orario italiano)
  const todayStr = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
  
  // 2. Lo Stato: la memoria che conserva il giorno cliccato dall'utente.
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // NUOVO STATO: la memoria che conserva lo sport selezionato.
  const [selectedSport, setSelectedSport] = useState("Tutti");

  // Estraiamo tutti gli sport unici disponibili per popolare la tendina da TUTTO il database
  const uniqueSports = ["Tutti", ...new Set(eventsData.map(e => e.sport))];

  // Filtriamo gli eventi in base allo sport selezionato (senza escludere il passato)
  const sportFilteredEvents = selectedSport === "Tutti" 
    ? eventsData 
    : eventsData.filter(e => e.sport === selectedSport);

  // 3. Estraiamo dai dati filtrati per sport solo le date che hanno eventi, normalizzate sul giorno italiano per i pallini
  const eventDatesWithEvents = sportFilteredEvents.map(event => getItalianDateString(event.dateTime));
  const uniqueEventDates = [...new Set(eventDatesWithEvents)];

  // 4. Prendiamo gli eventi filtrati per sport e teniamo quelli della data selezionata
  const now = new Date();
  
  const filteredEvents = sportFilteredEvents.filter(event => {
    return getItalianDateString(event.dateTime) === selectedDate;
  });

  // 5. Ordiniamo gli eventi filtrati in modo cronologico (dal mattino alla sera)
  const sortedFilteredEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });

  // Cambiamo il formato della data da YYYY-MM-DD a DD/MM/YYYY per mostrarlo nel titolo in italiano
  const dataFormattataItaliana = selectedDate.split('-').reverse().join('/');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-xl mx-auto">
        
        {/* Titolo Principale */}
        <header className="mb-6 text-center mt-2 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            Not Today
          </h1>
          <p className="text-slate-400 text-sm mt-2 mb-4">The ultimate sports calendar</p>

          {/* Tendina Filtro Sport */}
          <div className="relative w-full max-w-xs mx-auto">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full appearance-none bg-slate-800/80 border border-slate-700 text-slate-200 py-3 px-4 pr-8 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer transition-all hover:bg-slate-700/80"
            >
              {uniqueSports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport === "Tutti" ? "Tutti gli Sport" : sport}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </header>

        {/* IL NOSTRO NUOVO CALENDARIO INTERATTIVO */}
        {/* Gli passiamo: la data attuale, l'interruttore per cambiarla, e la lista dei pallini */}
        <CalendarWidget 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
          eventDates={uniqueEventDates}
        />

        {/* LISTA DEGLI EVENTI DEL GIORNO */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-300 mb-4 px-1">
            Programma del {dataFormattataItaliana}
          </h2>

          {/* LOADER - Mostriamo una rotella mentre Vercel unisce i dati in RAM */}
          {isLoading ? (
            <div className="text-center p-10 mt-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 animate-pulse">Connessione ai server sportivi in corso...</p>
            </div>
          ) : sortedFilteredEvents.length === 0 ? (
            // Caso A: Nessun evento
            <div className="text-center p-10 bg-slate-900/40 rounded-3xl border border-dashed border-slate-700/50 mt-8">
              <p className="text-slate-500 italic">Non ci sono eventi sportivi in programma per questa data.</p>
            </div>
          ) : (
            // Caso B: Ci sono eventi, stampiamo le card!
            <div className="space-y-3">
              {sortedFilteredEvents.map((event) => {
                const eventTime = new Date(event.dateTime).getTime();
                // Consideriamo terminato se lo status è esplicitamente FINISHED oppure se sono trascorse più di 2 ore e mezza dall'inizio
                const isFinished = event.status === "FINISHED" || (
                  event.status !== "IN_PLAY" &&
                  event.status !== "PAUSED" &&
                  (eventTime + (2.5 * 60 * 60 * 1000) < now.getTime())
                );

                return (
                  <EventCard 
                    key={event.id}
                    sport={event.sport}
                    competition={event.competition}
                    eventName={event.eventName}
                    dateTime={event.dateTime}
                    broadcaster={event.broadcaster}
                    status={event.status}
                    isFinished={isFinished}
                  />
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

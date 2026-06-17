"use client"; // Necessario perché la pagina ora ha una memoria "Stato"
import { useState } from "react";
import EventCard from "@/components/EventCard";
import CalendarWidget from "@/components/CalendarWidget";
import eventsData from "@/data/calendario.json";

export default function Home() {
  // 1. Definiamo la data di default all'apertura (Oggi) - Formato es. 2026-06-17
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // 2. Lo Stato: la memoria che conserva il giorno cliccato dall'utente.
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // NUOVO STATO: la memoria che conserva lo sport selezionato.
  const [selectedSport, setSelectedSport] = useState("Tutti");

  // 2.5 FILTRO EVENTI PASSATI
  const futureEventsData = eventsData.filter(event => {
    const eventDate = event.dateTime.split('T')[0];
    return eventDate >= todayStr;
  });

  // Estraiamo tutti gli sport unici disponibili per popolare la tendina
  const uniqueSports = ["Tutti", ...new Set(futureEventsData.map(e => e.sport))];

  // Filtriamo gli eventi futuri anche in base allo sport selezionato
  const sportFilteredEvents = selectedSport === "Tutti" 
    ? futureEventsData 
    : futureEventsData.filter(e => e.sport === selectedSport);

  // 3. Estraiamo dai dati filtrati per sport solo le date che hanno eventi, per i "Pallini" azzurri.
  const eventDatesWithEvents = sportFilteredEvents.map(event => event.dateTime.split('T')[0]);
  const uniqueEventDates = [...new Set(eventDatesWithEvents)];

  // 4. IL FILTRO MAGICO: prendiamo gli eventi filtrati per sport e teniamo SOLO quelli della data selezionata.
  const filteredEvents = sportFilteredEvents.filter(event => {
    return event.dateTime.startsWith(selectedDate);
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

          {/* LA SCELTA BIVIO: Se la lista filtrata è vuota o no */}
          {sortedFilteredEvents.length === 0 ? (
            // Caso A: Nessun evento
            <div className="text-center p-10 bg-slate-900/40 rounded-3xl border border-dashed border-slate-700/50 mt-8">
              <p className="text-slate-500 italic">Non ci sono eventi sportivi in programma per questa data.</p>
            </div>
          ) : (
            // Caso B: Ci sono eventi, stampiamo le card!
            <div className="space-y-3">
              {sortedFilteredEvents.map((event) => (
                <EventCard 
                  key={event.id}
                  sport={event.sport}
                  competition={event.competition}
                  eventName={event.eventName}
                  dateTime={event.dateTime}
                  broadcaster={event.broadcaster}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

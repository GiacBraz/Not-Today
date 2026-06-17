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
  // Inizialmente vale "Oggi", ma se l'utente clicca sul calendario, questo valore cambierà automaticamente!
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // 2.5 FILTRO EVENTI PASSATI: eliminiamo dal JSON tutti gli eventi che sono precedenti a "Oggi"
  const futureEventsData = eventsData.filter(event => {
    const eventDate = event.dateTime.split('T')[0];
    return eventDate >= todayStr;
  });

  // 3. Estraiamo dal JSON "futuro" solo le date che hanno eventi, per i "Pallini" azzurri.
  const eventDatesWithEvents = futureEventsData.map(event => event.dateTime.split('T')[0]);
  const uniqueEventDates = [...new Set(eventDatesWithEvents)];

  // 4. IL FILTRO MAGICO: prendiamo gli eventi futuri e teniamo SOLO quelli della data selezionata.
  const filteredEvents = futureEventsData.filter(event => {
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
        <header className="mb-8 text-center mt-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            Calendario Sport
          </h1>
          <p className="text-slate-400 text-sm mt-2">Tutti gli eventi, nel palmo della tua mano</p>
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

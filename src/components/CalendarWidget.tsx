"use client"; // Deve essere client-side perché usiamo la "memoria" (State) di React
import React, { useState } from 'react';

// Questa interfaccia ci serve solo per far capire a TypeScript la forma dei dati in entrata
interface CalendarProps {
  selectedDate: string; // Formato: YYYY-MM-DD
  onSelectDate: (date: string) => void; // La funzione che useremo per dire al genitore "Ehi, hanno cliccato un giorno nuovo!"
  eventDates: string[]; // Lista di date (YYYY-MM-DD) che contengono almeno un evento per mostrare il pallino
}

export default function CalendarWidget({ selectedDate, onSelectDate, eventDates }: CalendarProps) {
  // Lo Stato: Ricordiamo il mese/anno che l'utente sta visualizzando attualmente nel calendario (potrebbe scorrere ai mesi successivi)
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  // MATEMATICA DEL CALENDARIO
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Quanti giorni ha questo mese in particolare?
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // In che giorno della settimana inizia il mese? (0 = Domenica, 1 = Lunedì...)
  // Lo aggiustiamo in modo che 0 = Lunedì, perché in Europa la settimana inizia di lunedì
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  // Funzioni per cambiare mese cliccando le frecce < e >
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // I nomi belli da stampare in alto
  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

  // 1. Creiamo dei quadratini vuoti per i giorni precedenti all'inizio del mese (se il mese inizia di mercoledì, lun/mar sono vuoti)
  const blanks = Array.from({ length: startDay }, (_, i) => <div key={`blank-${i}`} className="p-2"></div>);
  
  // 2. Creiamo i quadratini per i giorni veri (da 1 a 30/31)
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    // Formattiamo la data per farla uguale al nostro JSON (es. 2026-06-05 invece di 2026-6-5)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    // Questo giorno è quello selezionato al momento?
    const isSelected = dateStr === selectedDate;
    
    // Questo giorno è "oggi"?
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;

    // C'è almeno una gara/partita in questo giorno?
    const hasEvent = eventDates.includes(dateStr);
    
    // Disegniamo il quadratino del giorno
    return (
      <div 
        key={dayNum} 
        onClick={() => onSelectDate(dateStr)} // Quando l'utente clicca, avvisiamo la pagina principale
        className={`relative p-2 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200
          ${isSelected ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20' : 
            isToday ? 'border-2 border-blue-500 text-blue-400 font-bold hover:bg-slate-800' :
            'hover:bg-slate-800 text-slate-300'}
        `}
      >
        <span>{dayNum}</span>
        
        {/* Il Pallino indicatore degli eventi! */}
        {hasEvent && !isSelected && (
          <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
        )}
        {hasEvent && isSelected && (
          <div className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full"></div>
        )}
      </div>
    );
  });

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-5 mb-8 shadow-xl border border-slate-800/50">
      {/* Intestazione (Mese, Anno, Frecce) */}
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">&lt;</button>
        <h2 className="text-xl font-bold text-white tracking-wide">{monthNames[month]} {year}</h2>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">&gt;</button>
      </div>

      {/* Nomi dei giorni della settimana */}
      <div className="grid grid-cols-7 gap-1 mb-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <div>Lun</div><div>Mar</div><div>Mer</div><div>Gio</div><div>Ven</div><div>Sab</div><div>Dom</div>
      </div>

      {/* La griglia finale dei giorni che contiene i blocchi vuoti e quelli veri creati in alto */}
      <div className="grid grid-cols-7 gap-1 text-sm font-medium">
        {blanks}
        {days}
      </div>
    </div>
  );
}

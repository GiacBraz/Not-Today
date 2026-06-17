import React from 'react';

// --- PRINCIPIO SOLID (I - Interface Segregation) ---
// Dichiariamo esattamente quali pezzi di informazione servono a questo componente.
// In questo modo, se in futuro il database avrà 100 campi in più, questa Card continuerà 
// a chiedere solo questi 5, senza appesantirsi.
interface EventCardProps {
  sport: string;
  competition: string;
  eventName: string;
  dateTime: string;
  broadcaster: string;
}

// --- PRINCIPIO SOLID (S - Single Responsibility) ---
// Questo "Componente" ha UNA SOLA responsabilità: prendere dei dati e disegnarli in un rettangolo estetico.
// Non fa calcoli strani, non scarica dati da internet, disegna e basta.
export default function EventCard({ sport, competition, eventName, dateTime, broadcaster }: EventCardProps) {
  
  // Trasformiamo la data del computer ("2026-09-06T15:00:00") in formato umano
  const dateObj = new Date(dateTime);
  
  // Estraiamo solo l'ora (es. "15:00")
  const timeString = dateObj.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  
  // Estraiamo solo il giorno e mese (es. "06 settembre")
  const dateString = dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: 'long' });

  // Qui sotto usiamo "className" per collegare i pezzetti di codice allo stile CSS che scriveremo dopo
  return (
    <div className="card">
      <div className="card-header">
        {/* Il Badge colorato per lo sport e accanto il nome della competizione */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="sport-badge">{sport}</span>
          <span className="competition-inline">{competition}</span>
        </div>
        {/* L'orario bello grande, che è la cosa più importante */}
        <span className="time">{timeString}</span>
      </div>
      <div className="card-body">
        {/* Chi gioca (es. Milan - Juve) diventa il titolo principale della card */}
        <h3 className="event-name-main">{eventName}</h3>
      </div>
      <div className="card-footer">
        {/* Giorno ed Emittente televisiva posizionati in basso */}
        <span className="date">{dateString}</span>
        <span className="broadcaster">📺 {broadcaster}</span>
      </div>
    </div>
  );
}

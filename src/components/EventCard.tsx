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
  status?: string;
}

// --- PRINCIPIO SOLID (S - Single Responsibility) ---
// Questo "Componente" ha UNA SOLA responsabilità: prendere dei dati e disegnarli in un rettangolo estetico.
// Non fa calcoli strani, non scarica dati da internet, disegna e basta.
export default function EventCard({ sport, competition, eventName, dateTime, broadcaster, status }: EventCardProps) {
  
  // Trasformiamo la data del computer ("2026-09-06T15:00:00") in formato umano
  const dateObj = new Date(dateTime);
  
  // Estraiamo solo l'ora (es. "15:00")
  const timeString = dateObj.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  
  // Estraiamo solo il giorno e mese (es. "06 settembre")
  const dateString = dateObj.toLocaleDateString('it-IT', { day: '2-digit', month: 'long' });

  // Determina il colore del badge e l'emoji in base allo sport
  let badgeColor = "var(--accent)"; // Default (Blu)
  let emoji = "🏆";
  const s = sport.toLowerCase();
  if (s.includes("f1") || s.includes("formula")) {
    badgeColor = "#ef4444"; // Rosso
    emoji = "🏎️";
  } else if (s.includes("moto")) {
    badgeColor = "#eab308"; // Giallo
    emoji = "🏍️";
  } else if (s.includes("calcio") || s.includes("serie") || s.includes("mondiali")) {
    badgeColor = "#f97316"; // Arancio
    emoji = "⚽";
  } else if (s.includes("tennis")) {
    badgeColor = "#22c55e"; // Verde
    emoji = "🎾";
  }

  // Qui sotto usiamo "className" per collegare i pezzetti di codice allo stile CSS che scriveremo dopo
  return (
    <div className="card">
      <div className="card-header">
        {/* Il Badge colorato per lo sport e accanto il nome della competizione */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="sport-badge" style={{ backgroundColor: badgeColor }}>
            {emoji} {sport}
          </span>
          <span className="competition-inline">{competition}</span>
        </div>
        {/* L'orario bello grande, che è la cosa più importante */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(status === "IN_PLAY" || status === "PAUSED") && (
            <span className="live-badge" style={{
              color: '#ef4444', 
              fontWeight: 'bold', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#ef4444', 
                borderRadius: '50%', 
                display: 'inline-block' 
              }}></span>
              LIVE
            </span>
          )}
          <span className="time">{timeString}</span>
        </div>
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

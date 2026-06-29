import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Chiamata alla VERA API Open-Source (Usiamo il JSON raw di GitHub per massima affidabilità)
    // Impostiamo la tag per permettere a Vercel di invalidare la cache
    const res = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json', {
      next: { tags: ['football-data'] }
    });

    if (!res.ok) {
      throw new Error(`Impossibile contattare l'API: HTTP ${res.status}`);
    }

    const rawData = await res.json();
    const apiMatches: any[] = [];

    // 2. Il Motore di Traduzione (Data Mapper)
    // L'API di OpenFootball organizza i dati per "Giornate" (Rounds) e poi "Partite" (Matches).
    // Dobbiamo scorrere tutto e tradurlo nel nostro formato.
    if (rawData && rawData.rounds) {
      rawData.rounds.forEach((round: any, roundIndex: number) => {
        if (round.matches) {
          round.matches.forEach((match: any, matchIndex: number) => {
            
            // Estrarre in modo sicuro i nomi delle squadre (o "TBD" se non ancora sorteggiate)
            const team1 = match.team1?.name || match.team1 || "Da Definire";
            const team2 = match.team2?.name || match.team2 || "Da Definire";
            
            // Unire data e orario. Se l'orario non è ancora ufficiale, mettiamo un default (es. 16:00).
            const matchTime = match.time ? `${match.time}:00Z` : "16:00:00Z";
            
            apiMatches.push({
              id: `wc_2026_${roundIndex}_${matchIndex}`,
              sport: "Calcio",
              competition: "Mondiali 2026",
              eventName: `${round.name || 'Fase Finale'}: ${team1} vs ${team2}`,
              dateTime: `${match.date}T${matchTime}`,
              broadcaster: "Rai 1" // Il marchio Rai 1 forzato come richiesto
            });
          });
        }
      });
    }

    // Restituiamo ESCLUSIVAMENTE le partite del mondiale tradotte pulite
    return NextResponse.json(apiMatches);

  } catch (error) {
    // Se l'API esterna è giù, o i dati cambiano formato improvvisamente, restituiamo un array vuoto.
    // L'app continuerà a funzionare mostrando solo la F1 in locale.
    console.error("Errore API Calcio (Risolto con Fallback vuoto):", error);
    return NextResponse.json([]);
  }
}

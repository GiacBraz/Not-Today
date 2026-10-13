import { NextResponse } from 'next/server';

// ==============================================================================
// INCREMENTAL STATIC REGENERATION (ISR): 7200 secondi (2 Ore)
// Vercel memorizza la risposta sulla sua rete Edge globale.
// Per 2 ore serve i dati dalla memoria ultra-veloce a costo zero (0 chiamate API).
// Solo dopo 2 ore, alla prima visita utile, effettua 1 chiamata in background
// per controllare se ci sono risultati freschi di partite finite.
// ==============================================================================
export const revalidate = 7200;

const TEAM_NAMES: Record<string, string> = {
  "FC Internazionale Milano": "Inter",
  "AC Monza": "Monza",
  "Cagliari Calcio": "Cagliari",
  "SSC Napoli": "Napoli",
  "Udinese Calcio": "Udinese",
  "AS Roma": "Roma",
  "Juventus FC": "Juventus",
  "AC Milan": "Milan",
  "Atalanta BC": "Atalanta",
  "SS Lazio": "Lazio",
  "ACF Fiorentina": "Fiorentina",
  "Bologna FC 1909": "Bologna",
  "Torino FC": "Torino",
  "Genoa CFC": "Genoa",
  "Parma Calcio 1913": "Parma",
  "Hellas Verona FC": "Verona",
  "US Lecce": "Lecce",
  "Empoli FC": "Empoli",
  "Venezia FC": "Venezia",
  "Como 1907": "Como",
  "US Sassuolo Calcio": "Sassuolo",
  "Frosinone Calcio": "Frosinone",
  "Real Madrid CF": "Real Madrid",
  "Club Brugge KV": "Club Brugge",
  "FK Shakhtar Donetsk": "Shakhtar Donetsk",
  "Feyenoord Rotterdam": "Feyenoord",
  "VfB Stuttgart": "Stoccarda",
  "Borussia Dortmund": "Borussia Dortmund",
  "Liverpool FC": "Liverpool",
  "ŠK Slovan Bratislava": "Slovan Bratislava"
};

function cleanTeamName(name?: string): string {
  if (!name) return "TBD";
  return TEAM_NAMES[name] || name.replace(" FC", "").replace(" Calcio", "").trim();
}

function isoUtcToRome(utcStr: string): string {
  try {
    const d = new Date(utcStr);
    // Formattatore per l'ora italiana
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    // Inverte o sostituisce per creare ISO con offset
    const parts = formatter.formatToParts(d);
    const map: Record<string, string> = {};
    parts.forEach(p => { map[p.type] = p.value; });
    
    // Calcoliamo l'offset (+01:00 o +02:00 a seconda dell'ora legale)
    const localDate = new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
    const utcDate = new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }));
    const diffHours = Math.round((localDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60));
    const offsetStr = diffHours >= 0 ? `+0${diffHours}:00` : `-0${Math.abs(diffHours)}:00`;
    
    return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}${offsetStr}`;
  } catch {
    return utcStr;
  }
}

function calcolaBroadcasterSerieA(utcDateStr?: string): string {
  if (!utcDateStr) return "DAZN (In attesa orario Lega)";
  try {
    const d = new Date(utcDateStr);
    // Convertiamo in ora locale Roma per verificare slot
    const romeTimeStr = d.toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', hour12: false });
    const romeDayStr = d.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', weekday: 'short' }).toLowerCase();
    
    // Se mezzanotte (placeholder per gare 2027 da calendarizzare)
    if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) {
      return "DAZN (In attesa orario Lega)";
    }

    // Slot Co-esclusiva Sky:
    // Sabato 20:45, Domenica 18:00, Lunedì 20:45, Venerdì 20:45, Mercoledì 20:45
    if (romeTimeStr === "20:45" && ["sab", "lun", "ven", "mer"].some(w => romeDayStr.startsWith(w))) {
      return "Sky Sport / DAZN";
    }
    if (romeTimeStr === "18:00" && romeDayStr.startsWith("dom")) {
      return "Sky Sport / DAZN";
    }

    return "Solo DAZN";
  } catch {
    return "Solo DAZN";
  }
}

function calcolaBroadcasterChampions(utcDateStr: string, home: string, away: string): string {
  try {
    const d = new Date(utcDateStr);
    const dayOfWeek = d.getUTCDay(); // 2 = Martedì, 3 = Mercoledì
    
    // Martedì -> sempre Sky Sport / NOW
    if (dayOfWeek === 2) {
      return "Sky Sport / NOW";
    }

    // Mercoledì -> Prime Video per le sfide di cartello
    const matchStr = `${home} ${away}`.toLowerCase();
    if (["shakhtar", "stuttgart", "stoccarda", "dortmund"].some(k => matchStr.includes(k))) {
      return "Prime Video (Esclusiva)";
    }

    return "Sky Sport / NOW";
  } catch {
    return "Sky Sport / NOW";
  }
}

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json([]);
  }

  try {
    const headers = { 'X-Auth-Token': apiKey };

    // Fetch con cache ISR di 7200s (2 ore)
    const [saRes, clRes] = await Promise.all([
      fetch('https://api.football-data.org/v4/competitions/SA/matches', {
        headers,
        next: { revalidate: 7200, tags: ['football-scores-sa'] }
      }),
      fetch('https://api.football-data.org/v4/competitions/CL/matches', {
        headers,
        next: { revalidate: 7200, tags: ['football-scores-cl'] }
      })
    ]);

    const events: any[] = [];

    // 1. Elaborazione Serie A
    if (saRes.ok) {
      const saData = await saRes.json();
      const interMatches = (saData.matches || []).filter((m: any) =>
        (m.homeTeam?.name && m.homeTeam.name.toLowerCase().includes('inter')) ||
        (m.awayTeam?.name && m.awayTeam.name.toLowerCase().includes('inter'))
      );

      for (const m of interMatches) {
        const home = cleanTeamName(m.homeTeam?.name);
        const away = cleanTeamName(m.awayTeam?.name);
        const status = m.status || 'TIMED';
        const score = m.score?.fullTime;
        const hScore = score?.home;
        const aScore = score?.away;

        let title = `Serie A: ${home} vs ${away}`;
        if (status === 'FINISHED' && hScore !== null && aScore !== null && hScore !== undefined && aScore !== undefined) {
          title = `Serie A: ${home} ${hScore} - ${aScore} ${away}`;
        }

        events.push({
          id: `sa_2627_${m.id}`,
          sport: "Calcio",
          competition: "Serie A",
          eventName: title,
          dateTime: isoUtcToRome(m.utcDate),
          broadcaster: calcolaBroadcasterSerieA(m.utcDate),
          status: status
        });
      }
    }

    // 2. Elaborazione Champions League
    if (clRes.ok) {
      const clData = await clRes.json();
      const interMatches = (clData.matches || []).filter((m: any) =>
        (m.homeTeam?.name && m.homeTeam.name.toLowerCase().includes('inter')) ||
        (m.awayTeam?.name && m.awayTeam.name.toLowerCase().includes('inter'))
      );

      for (const m of interMatches) {
        const home = cleanTeamName(m.homeTeam?.name);
        const away = cleanTeamName(m.awayTeam?.name);
        const status = m.status || 'TIMED';
        const score = m.score?.fullTime;
        const hScore = score?.home;
        const aScore = score?.away;

        let title = `Champions League: ${home} vs ${away}`;
        if (status === 'FINISHED' && hScore !== null && aScore !== null && hScore !== undefined && aScore !== undefined) {
          title = `Champions League: ${home} ${hScore} - ${aScore} ${away}`;
        }

        events.push({
          id: `cl_2627_${m.id}`,
          sport: "Calcio",
          competition: "Champions League",
          eventName: title,
          dateTime: isoUtcToRome(m.utcDate),
          broadcaster: calcolaBroadcasterChampions(m.utcDate, home, away),
          status: status
        });
      }
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error("Errore recupero punteggi live da football-data.org:", error);
    // In caso di errore di rete o temporaneo dell'API, restituiamo array vuoto per non rompere l'app
    return NextResponse.json([]);
  }
}

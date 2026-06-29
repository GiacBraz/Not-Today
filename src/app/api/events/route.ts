import { NextResponse } from 'next/server';

const todaysMatches = [
      {
        id: "wc_2026_16_1",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Brasile vs Giappone",
        dateTime: "2026-06-29T19:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_2",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Germania vs Paraguay",
        dateTime: "2026-06-29T22:30:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_missing_1", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Sedicesimi: Olanda vs Marocco", dateTime: "2026-06-30T03:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_missing_2", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Sedicesimi: Costa d'Avorio vs Norvegia", dateTime: "2026-06-30T19:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_missing_3", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Sedicesimi: Francia vs Svezia", dateTime: "2026-06-30T23:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_missing_4", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Sedicesimi: Messico vs Ecuador", dateTime: "2026-07-01T03:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_missing_5", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Sedicesimi: Inghilterra vs Repubblica Democratica del Congo", dateTime: "2026-07-01T18:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_3",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Belgio vs Senegal",
        dateTime: "2026-07-01T22:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_4",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Stati Uniti vs Bosnia ed Erzegovina",
        dateTime: "2026-07-02T02:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_5",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Spagna vs Austria",
        dateTime: "2026-07-02T21:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_6",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Portogallo vs Croazia",
        dateTime: "2026-07-03T01:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_7",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Svizzera vs Algeria",
        dateTime: "2026-07-03T05:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_8",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Australia vs Egitto",
        dateTime: "2026-07-03T20:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_9",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Argentina vs Capo Verde",
        dateTime: "2026-07-04T00:00:00+02:00",
        broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_16_10",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Colombia vs Ghana",
        dateTime: "2026-07-04T03:30:00+02:00",
        broadcaster: "Rai 1"
      }
,
      {
        id: "wc_2026_future_0", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W76 vs W78 (Round of 16)", dateTime: "2026-07-05T22:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_1", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W79 vs W80 (Round of 16)", dateTime: "2026-07-06T02:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_2", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W83 vs W84 (Round of 16)", dateTime: "2026-07-06T21:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_3", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W81 vs W82 (Round of 16)", dateTime: "2026-07-07T02:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_4", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W86 vs W88 (Round of 16)", dateTime: "2026-07-07T18:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_5", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W85 vs W87 (Round of 16)", dateTime: "2026-07-07T22:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_6", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W89 vs W90 (Quarter-final)", dateTime: "2026-07-09T22:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_7", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W93 vs W94 (Quarter-final)", dateTime: "2026-07-10T21:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_8", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W91 vs W92 (Quarter-final)", dateTime: "2026-07-11T23:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_9", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W95 vs W96 (Quarter-final)", dateTime: "2026-07-12T03:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_10", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W97 vs W98 (Semi-final)", dateTime: "2026-07-14T21:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_11", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W99 vs W100 (Semi-final)", dateTime: "2026-07-15T21:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_12", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: L101 vs L102 (Match for third place)", dateTime: "2026-07-18T23:00:00+02:00", broadcaster: "Rai 1"
      },
      {
        id: "wc_2026_future_13", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Fase Finale: W101 vs W102 (Final)", dateTime: "2026-07-19T21:00:00+02:00", broadcaster: "Rai 1"
      }
,{
        id: "wc_2026_future_m89", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Ottavi di Finale: W74 vs W77", dateTime: "2026-07-04T23:00:00+02:00", broadcaster: "Rai 1"
      },{
        id: "wc_2026_future_m90", sport: "Calcio", competition: "Mondiali 2026",
        eventName: "Ottavi di Finale: W73 vs W75", dateTime: "2026-07-04T19:00:00+02:00", broadcaster: "Rai 1"
      }
    ];



export async function GET() {
  try {
    // 1. Chiamata all'API Professionale (football-data.org)
    // Passiamo l'API Key in modo sicuro tramite le variabili d'ambiente (il file .env.local)
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key mancante nel file .env.local");
    }

    const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: {
        'X-Auth-Token': apiKey
      },
      // Cache gestita da Vercel tramite Tag, per invalidarla con il Cron Job
      next: { tags: ['football-data'] }
    });

    if (!res.ok) {
      throw new Error(`Impossibile contattare l'API: HTTP ${res.status}`);
    }

    const rawData = await res.json();
    const apiMatches: any[] = [];
    const processedApiDates = new Set();

    // SUPER-API V3: Il Database Locale è la roccia (Garantisce che non sparisca MAI nulla)
    todaysMatches.forEach(localMatch => {
      // Cerchiamo se l'API reale ha questa partita per prendere lo status LIVE
      const realMatch = (rawData && rawData.matches) 
        ? rawData.matches.find((m: any) => new Date(m.utcDate).getTime() === new Date(localMatch.dateTime).getTime()) 
        : null;

      let finalEventName = localMatch.eventName;
      let finalStatus = "TIMED";

      if (realMatch) {
         processedApiDates.add(new Date(realMatch.utcDate).getTime());
         finalStatus = realMatch.status || "TIMED";
         
         // Se l'API ha i nomi veri e non sono vuoti, sovrascriviamo i nostri placeholder
         const homeTeam = realMatch.homeTeam?.name || realMatch.homeTeam?.shortName || "Da Definire";
         const awayTeam = realMatch.awayTeam?.name || realMatch.awayTeam?.shortName || "Da Definire";
         
         if (homeTeam !== "Da Definire" && awayTeam !== "Da Definire") {
            let stageName = realMatch.stage || realMatch.group || "Fase Finale";
            if (stageName === "LAST_32" || stageName === "LAST_16") stageName = "Sedicesimi";
            if (stageName === "QUARTER_FINALS") stageName = "Quarti di Finale";
            if (stageName === "SEMI_FINALS") stageName = "Semifinali";
            if (stageName === "FINAL") stageName = "Finale";
            finalEventName = `${stageName}: ${homeTeam} vs ${awayTeam}`;
         }
      }

      apiMatches.push({
        id: localMatch.id,
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: finalEventName,
        dateTime: localMatch.dateTime,
        broadcaster: "Rai 1",
        status: finalStatus
      });
    });

    // Aggiungiamo eventuali altre partite dall'API reale che NON erano nel nostro database locale
    if (rawData && rawData.matches) {
      rawData.matches.forEach((match: any) => {
        const matchTime = new Date(match.utcDate).getTime();
        if (!processedApiDates.has(matchTime)) {
          const homeTeam = match.homeTeam?.name || match.homeTeam?.shortName || "Da Definire";
          const awayTeam = match.awayTeam?.name || match.awayTeam?.shortName || "Da Definire";
          let stageName = match.stage || match.group || "Fase Finale";
          if (stageName === "LAST_32" || stageName === "LAST_16") stageName = "Sedicesimi";
          if (stageName === "QUARTER_FINALS") stageName = "Quarti di Finale";
          if (stageName === "SEMI_FINALS") stageName = "Semifinali";
          if (stageName === "FINAL") stageName = "Finale";
          
          apiMatches.push({
            id: `wc_2026_${match.id || Math.random()}`,
            sport: "Calcio",
            competition: "Mondiali 2026",
            eventName: `${stageName}: ${homeTeam} vs ${awayTeam}`,
            dateTime: match.utcDate,
            broadcaster: "Rai 1",
            status: match.status || "TIMED"
          });
        }
      });
    }

    // Restituiamo ESCLUSIVAMENTE le partite del mondiale tradotte pulite
    if (apiMatches.length > 0) {
      return NextResponse.json(apiMatches);
    } else {
      throw new Error("L'API ha risposto ma non contiene partite.");
    }

  } catch (error) {
    // IL DATABASE DI EMERGENZA (Fallback)
    // In caso di API Key scaduta, problemi di rete, o se il torneo non è ancora caricato
    // restituiamo questo blocco di partite fisse.
    console.warn("Problema API Calcio. Attivazione Fallback Dati 2026:", error);
    
    

    return NextResponse.json(todaysMatches);
  }
}

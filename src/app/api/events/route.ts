import { NextResponse } from 'next/server';
import localEvents from '@/data/calendario.json';

export async function GET() {
  try {
    // 1. Facciamo finta di collegarci all'API esterna.
    // Usiamo una cache policy con la tag "football-data"
    // Questo permette a Vercel di sapere quale "pezzo di memoria" deve cancellare quando scatta il Cron Job
    const res = await fetch('https://dummyjson.com/c/79ab-a123-4567-89ab', {
      next: { tags: ['football-data'] }
    });

    // 2. Simuliamo le partite che abbiamo estratto dall'API
    // Come richiesto, l'emittente è sempre forzata su "Rai 1"
    const apiMatches = [
      {
        id: "mondiali_sedicesimi_1",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: USA vs Olanda",
        dateTime: "2026-06-28T16:00:00Z", // 18:00 in Italia (+2)
        broadcaster: "Rai 1"
      },
      {
        id: "mondiali_sedicesimi_2",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Germania vs Danimarca",
        dateTime: "2026-06-28T20:00:00Z", // 22:00 in Italia
        broadcaster: "Rai 1"
      },
      {
        id: "mondiali_sedicesimi_3",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Inghilterra vs Slovacchia",
        dateTime: "2026-06-29T16:00:00Z",
        broadcaster: "Rai 1"
      },
      {
        id: "mondiali_sedicesimi_4",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Spagna vs Georgia",
        dateTime: "2026-06-29T20:00:00Z",
        broadcaster: "Rai 1"
      },
      {
        id: "mondiali_sedicesimi_5",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Francia vs Belgio",
        dateTime: "2026-06-30T16:00:00Z",
        broadcaster: "Rai 1"
      },
      {
        id: "mondiali_sedicesimi_6",
        sport: "Calcio",
        competition: "Mondiali 2026",
        eventName: "Sedicesimi: Portogallo vs Slovenia",
        dateTime: "2026-06-30T20:00:00Z",
        broadcaster: "Rai 1"
      }
    ];

    // 3. UNIONE DEI DUE MONDI (Il CD-ROM e la RAM si fondono)
    const combinedEvents = [...localEvents, ...apiMatches];

    return NextResponse.json(combinedEvents);

  } catch (error) {
    // IL PIANO B (Fallback): Se l'API cade o scoppia internet,
    // restituiamo senza fare domande il nostro solido file locale. L'app non muore mai.
    console.error("API Calcio irraggiungibile, uso Fallback locale:", error);
    return NextResponse.json(localEvents);
  }
}

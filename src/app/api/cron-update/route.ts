import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET() {
  // Questo endpoint invisibile viene richiamato automaticamente 
  // dal Cron Job di Vercel ogni mattina alle 09:30.
  
  // Questa singola riga compie la magia descritta nell'architettura: 
  // ordina a Vercel di "distruggere" la memoria RAM etichettata come "football-data".
  // Al prossimo utente che apre l'app, Vercel sarà costretto a scaricare le partite fresche.
  revalidateTag('football-data');
  
  return NextResponse.json({ 
    success: true, 
    message: "Memoria Cache svuotata con successo. L'app ora scaricherà dati freschi!",
    timestamp: new Date().toISOString()
  });
}

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  // Questo endpoint invisibile viene richiamato automaticamente 
  // dal Cron Job di Vercel ogni mattina alle 09:30.
  
  // Usiamo revalidatePath invece di revalidateTag per compatibilità TS
  revalidatePath('/api/events');
  
  return NextResponse.json({ 
    success: true, 
    message: "Memoria Cache svuotata con successo. L'app ora scaricherà dati freschi!",
    timestamp: new Date().toISOString()
  });
}

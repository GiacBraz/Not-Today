import { NextResponse } from 'next/server';

export async function GET() {
  // Modalità statica/offline protetta: i dati sono gestiti direttamente dal database locale
  // Zero chiamate esterne verso football-data.org a runtime per evitare rate limiting
  return NextResponse.json([]);
}

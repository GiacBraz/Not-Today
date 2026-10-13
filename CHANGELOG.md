# Changelog & Documentazione Modifiche 📋

Questo documento tiene traccia in modo dettagliato di tutte le modifiche, scelte architetturali e integrazioni sportive implementate nell'applicazione **Not Today**.

---

## [Aggiornamento 13 Ottobre 2026] - Release Calcio, Sci Alpino & ISR Automatico

### 1. Calcio: Serie A e Champions League (Solo Inter) ⚽
* **Serie A (38 Giornate):**
  * Recuperate le 38 giornate dell'Inter dal calendario ufficiale tramite l'API `football-data.org`, con fallback locale su [Calendario_SerieA_2026-27.xlsx](src/data/Calendario_SerieA_2026-27.xlsx).
  * Le prime 19 giornate presentano gli orari e i giorni effettivi stabiliti dagli anticipi/posticipi ufficiali della Lega Serie A.
  * Le giornate dalla 20 alla 38 presentano data provvisoria domenicale in attesa dei futuri comunicati di Lega.
* **Champions League (8 Partite):**
  * Integrate tutte le 8 gare della League Phase della UEFA Champions League per l'Inter con orari ufficiali UEFA.
* **Mappatura Puntuale dei Broadcaster TV:**
  * Serie A: 
    * `Solo DAZN`: per gli slot in esclusiva assoluta DAZN (sabato 15:00/18:00, domenica 12:30/15:00/20:45).
    * `Sky Sport / DAZN`: per i 3 slot a giornata in co-esclusiva Sky (sabato 20:45, domenica 18:00, lunedì 20:45).
    * `DAZN (In attesa orario Lega)`: per le gare del 2027 da calendarizzare.
  * Champions League:
    * `Sky Sport / NOW`: per tutte le gare del martedì sera (esclusiva Sky).
    * `Prime Video (Esclusiva)`: per i big match del mercoledì sera dell'Inter selezionati da Amazon.

---

### 2. Gestione Eventi Terminati & Punteggi Finali ⏱️
* **Non cancellazione degli eventi:** Rimossa la vecchia logica che nascondeva gli eventi 3 ore dopo l'orario di inizio. Le partite e le gare rimangono consultabili nello storico del giorno.
* **Badge `(Terminato)`:** Introdotto un badge discreto in stile grigio/slate per tutti gli eventi con orario trascorso o con status ufficiale `FINISHED`.
* **Punteggio fuso nel titolo:** Per le partite disputate, il risultato finale viene incorporato automaticamente nel titolo dell'evento (es. `Serie A: Inter 4 - 1 Monza`, `Champions League: Real Madrid 2 - 1 Inter`).
* **Filtro Sport Permanente:** Il menu a tendina calcola gli sport unici da tutto il database (`Tutti`, `Calcio`, `F1`, `MotoGP`, `Tennis`, `Sci Alpino`), evitando che uno sport scompaia se non ha eventi nella giornata selezionata.

---

### 3. Sci Alpino: Coppa del Mondo FIS 2026/2027 ⛷️
* **Nuovo Bot Dedicato:** Creato lo script autonomo [scripts/sci_bot.py](scripts/sci_bot.py).
* **Copertura Completa (60 Gare):**
  * Uomini e Donne chiaramente distinti.
  * Tutte le 4 discipline classiche: Discesa Libera (DH), Super-G (SG), Slalom Gigante (GS), Slalom Speciale (SL).
  * Tappe storiche mondiali incluse: Sölden, Levi, Gurgl, Killington, Beaver Creek, Tremblant, St. Moritz, Val d'Isère, Val Gardena (Saslong), Alta Badia (Gran Risa), Madonna di Campiglio (3-Tre notturna), Bormio (Stelvio), Adelboden, Wengen (Lauberhorn), Kitzbühel (Streif), Cortina d'Ampezzo (Tofane), Kronplatz, Schladming (The Nightrace), Garmisch, e Finali di Coppa.
* **Broadcaster TV:** Assegnato `Rai Sport / Eurosport` (in chiaro su Rai, per abbonati su Eurosport/Discovery+).
* **UI:** Badge con colore ciano `#06b6d4` ed emoji `⛷️`.

---

### 4. Architettura: Aggiornamento Automatico Risultati (ISR a 2 Ore) 🔄
* **Funzionamento su Vercel:**
  * L'endpoint [/api/events/route.ts](src/app/api/events/route.ts) è stato configurato con cache Next.js ISR a 7200 secondi (`revalidate = 7200`).
  * Per 2 ore, Vercel consegna la risposta dalla sua memoria Edge ultra-rapida a costo zero (0 chiamate verso l'API esterna).
  * Trascorsa la finestra di 2 ore, alla prima visita dell'app viene effettuata 1 singola chiamata in background per verificare se ci sono nuovi risultati di partite concluse.
* **Protezione Rate Limit:** Il consumo stimato è di sole 24 chiamate nelle 24 ore (su un limite consentito di 14.400 giornaliere), garantendo piena conformità al piano free di *football-data.org*.
* **Resilienza Offline:** Se la rete esterna o l'API hanno un disservizio temporaneo, il blocco di fallback restituisce un array vuoto e l'app continua a funzionare regolarmente mostrando i dati locali di `calendario.json`.

---

### 5. Struttura del Database Locale (`src/data/calendario.json`)
Al termine di questo aggiornamento, il database statico unificato contiene **302 eventi sportivi totali**:
* 🏎️ **Formula 1:** 110 sessioni (Prove, Qualifiche, Sprint, Gara)
* 🏍️ **MotoGP:** 44 gare (Sprint del sabato e Gare della domenica)
* ⚽ **Calcio (Inter):** 46 partite (38 Serie A + 8 Champions League)
* ⛷️ **Sci Alpino:** 60 gare (Coppa del Mondo Maschile e Femminile)
* 🎾 **Tennis (Sinner):** 42 appuntamenti (Quarti, Semifinali e Finali dei tornei maggiori)

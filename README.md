# Not Today 🏆

Applicazione web mobile-first pensata per consultare in un'unica interfaccia il calendario dei principali eventi sportivi. Sviluppata con Next.js, React e Tailwind CSS.

---

## Sport Supportati 🏅

* 🏎️ **Formula 1:** Prove libere, qualifiche, sprint e gare domenicali.
* 🏍️ **MotoGP:** Gare sprint del sabato e gare domenicali.
* ⚽ **Calcio:** Campionato di Serie A e UEFA Champions League (focus Inter).
* ⛷️ **Sci Alpino:** Coppa del Mondo FIS maschile e femminile (Discesa, Super-G, Gigante e Slalom).
* 🎾 **Tennis:** Tornei del Grande Slam, Masters 1000 e ATP Finals.

---

## Caratteristiche Principali ✨

* **Guida TV Integrata:** Indicazione chiara dell'emittente televisiva o della piattaforma streaming per ogni evento (DAZN, Sky Sport, NOW, Amazon Prime Video, Rai Sport, Eurosport).
* **Risultati e Storico Eventi:** Gli eventi conclusi non vengono rimossi dal calendario; rimangono consultabili con il punteggio finale e l'indicatore **Terminato**.
* **Navigazione con Calendario:** Widget mensile interattivo per selezionare rapidamente le date d'interesse, con indicatori visivi per i giorni che contengono eventi in programma.
* **Filtro per Sport:** Possibilità di isolare una singola disciplina o visualizzare il programma giornaliero completo.
* **Architettura Offline-First:** L'applicazione si avvia istantaneamente leggendo un database locale pre-compilato (`calendario.json`), garantendo piena funzionalità anche in assenza di rete.
* **Aggiornamento Risultati in Cloud:** Le partite di calcio vengono aggiornate automaticamente su Vercel tramite cache programmata (ISR ogni 2 ore), senza richiedere interventi manuali e nel pieno rispetto dei limiti delle API gratuite.

---

## Struttura del Progetto 📁

```text
├── src/
│   ├── app/
│   │   ├── api/events/route.ts   # Endpoint per l'aggiornamento automatico dei punteggi
│   │   ├── page.tsx              # Pagina principale con filtri e vista giornaliera
│   │   └── globals.css           # Stili e variabili grafiche
│   ├── components/
│   │   ├── EventCard.tsx         # Scheda del singolo evento sportivo
│   │   └── CalendarWidget.tsx    # Calendario mensile interattivo
│   └── data/
│       └── calendario.json       # Database unificato di tutti gli eventi
└── scripts/
    ├── calcio_bot.py             # Generazione calendario Serie A e Champions League
    ├── sci_bot.py                # Generazione calendario Coppa del Mondo Sci Alpino
    ├── f1_bot.py                 # Generazione calendario Formula 1
    ├── motogp_bot.py             # Generazione calendario MotoGP
    └── tennis_bot.py             # Generazione calendario ATP / Tennis
```

---

## Sviluppo Locale 💻

1. **Clona il repository:**
   ```bash
   git clone https://github.com/GiacBraz/Not-Today.git
   cd Not-Today
   ```

2. **Configura le variabili d'ambiente (opzionale per aggiornamenti live):**
   Crea un file `.env.local` nella cartella principale:
   ```env
   FOOTBALL_DATA_API_KEY=la_tua_chiave_api
   ```

3. **Installa le dipendenze e avvia il server:**
   ```bash
   npm install
   npm run dev
   ```
   L'applicazione sarà accessibile all'indirizzo `http://localhost:3000`.

4. **Rigenerazione dei calendari (opzionale):**
   Per aggiornare o ricalcolare gli eventi sportivi nel database locale, puoi eseguire singolarmente gli script Python:
   ```bash
   python scripts/calcio_bot.py
   python scripts/sci_bot.py
   python scripts/f1_bot.py
   python scripts/motogp_bot.py
   ```

---

## Distribuzione (Deploy) 🚀

Il progetto è configurato per il rilascio continuo su [Vercel](https://vercel.com).
* È sufficiente importare il repository GitHub nella dashboard di Vercel.
* Nella sezione **Settings > Environment Variables**, aggiungi la variabile `FOOTBALL_DATA_API_KEY`.
* Ogni nuovo commit o merge su `main` avvia automaticamente il rilascio della nuova versione.

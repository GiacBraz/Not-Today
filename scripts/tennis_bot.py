import json
import os
from datetime import datetime, timedelta

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'calendario.json')

# Le date ufficiali dei grandi tornei ATP 2026 (I più importanti per Sinner)
TORNEI_ATP_2026 = [
    {"nome": "Australian Open", "inizio": "2026-01-12", "fine": "2026-01-25", "broadcaster": "Eurosport / Discovery+"},
    {"nome": "Indian Wells Masters", "inizio": "2026-03-04", "fine": "2026-03-15", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Miami Open", "inizio": "2026-03-18", "fine": "2026-03-29", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Monte-Carlo Masters", "inizio": "2026-04-05", "fine": "2026-04-12", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Madrid Open", "inizio": "2026-04-22", "fine": "2026-05-03", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Internazionali d'Italia (Roma)", "inizio": "2026-05-06", "fine": "2026-05-17", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Roland Garros", "inizio": "2026-05-24", "fine": "2026-06-07", "broadcaster": "Eurosport / Discovery+"},
    {"nome": "Wimbledon", "inizio": "2026-06-29", "fine": "2026-07-12", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Canadian Open", "inizio": "2026-08-03", "fine": "2026-08-09", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Cincinnati Masters", "inizio": "2026-08-10", "fine": "2026-08-16", "broadcaster": "Sky Sport / NOW"},
    {"nome": "US Open", "inizio": "2026-08-31", "fine": "2026-09-13", "broadcaster": "SuperTennis / Sky Sport"},
    {"nome": "Shanghai Masters", "inizio": "2026-10-07", "fine": "2026-10-18", "broadcaster": "Sky Sport / NOW"},
    {"nome": "Paris Masters", "inizio": "2026-10-26", "fine": "2026-11-01", "broadcaster": "Sky Sport / NOW"},
    {"nome": "ATP Finals (Torino)", "inizio": "2026-11-15", "fine": "2026-11-22", "broadcaster": "Sky Sport / Rai / NOW"}
]

def genera_eventi_tennis():
    print("Generazione calendario Tornei ATP 2026 (Focus Sinner)...")
    eventi = []
    
    for torneo in TORNEI_ATP_2026:
        start_date = datetime.strptime(torneo["inizio"], "%Y-%m-%d")
        end_date = datetime.strptime(torneo["fine"], "%Y-%m-%d")
        
        delta = end_date - start_date
        
        # Sinner ci interessa dalle fasi finali in poi!
        # Prendiamo solo gli ultimi 3 giorni del torneo (solitamente coprono Quarti, Semifinali e Finale)
        giorni_finali = [
            (end_date - timedelta(days=2), "Quarti/Semifinali"),
            (end_date - timedelta(days=1), "Semifinale"),
            (end_date, "Finale")
        ]
        
        for current_day, fase in giorni_finali:
            if current_day >= start_date:
                # Fissiamo un orario indicativo pomeridiano per le fasi finali (es. 15:00)
                iso_date = f"{current_day.strftime('%Y-%m-%d')}T15:00:00+02:00"
                
                eventi.append({
                    "id": f"atp_{torneo['nome'][:4].lower()}_{current_day.strftime('%Y%m%d')}",
                    "sport": "Tennis",
                    "competition": "Circuito ATP",
                    "eventName": f"{torneo['nome']} - {fase} (Sinner?)",
                    "dateTime": iso_date,
                    "broadcaster": torneo["broadcaster"]
                })
            
    return eventi

def salva_tennis(nuovi_eventi):
    if not os.path.exists(DATA_FILE):
        dati_esistenti = []
    else:
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            try:
                dati_esistenti = json.load(file)
            except json.JSONDecodeError:
                dati_esistenti = []
                
    # Puliamo il vecchio tennis per evitare doppioni
    dati_puliti = [e for e in dati_esistenti if e.get('sport') != 'Tennis']
    dati_finali = dati_puliti + nuovi_eventi
    
    with open(DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(dati_finali, file, indent=2, ensure_ascii=False)
    print(f"Lavoro completato! Inseriti {len(nuovi_eventi)} giorni di tornei Tennis!")

if __name__ == "__main__":
    ev = genera_eventi_tennis()
    salva_tennis(ev)

import json
import os
import re
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'calendario.json')
LOCAL_ICS_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'MotoGP_sprint-and-race_2026_calendar.ics')

def parse_ics_date(dt_str):
    # Converte '20260816T120000Z' in '2026-08-16T14:00:00+02:00'
    try:
        clean_str = dt_str.replace('Z', '').strip()
        dt = datetime.strptime(clean_str, "%Y%m%dT%H%M%S")
        from datetime import timedelta
        # Trasforma l'orario internazionale in orario italiano (+2 ore)
        dt = dt + timedelta(hours=2) 
        return dt.strftime("%Y-%m-%dT%H:%M:00+02:00")
    except:
        return ""

def estrai_motogp_ics_locale():
    print("MotoGP 2026: Lettura del tuo file ICS locale in corso...")
    
    if not os.path.exists(LOCAL_ICS_FILE):
        print(f"Errore: File ICS non trovato in {LOCAL_ICS_FILE}")
        return []

    with open(LOCAL_ICS_FILE, 'r', encoding='utf-8') as f:
        ics_data = f.read()

    eventi_finali = []
    
    # Il file è già filtrato dall'utente, quindi estraiamo tutto quello che c'è
    blocchi_eventi = ics_data.split("BEGIN:VEVENT")
    for blocco in blocchi_eventi:
        if "END:VEVENT" not in blocco:
            continue
            
        summary_match = re.search(r"SUMMARY:(.+)", blocco)
        dtstart_match = re.search(r"DTSTART.*:([A-Z0-9]+)", blocco)
        
        if summary_match and dtstart_match:
            titolo = summary_match.group(1).strip()
            data_raw = dtstart_match.group(1).strip()
            
            data_iso = parse_ics_date(data_raw)
            if data_iso:
                eventi_finali.append({
                    "id": "motogp_" + str(abs(hash(titolo))),
                    "sport": "MotoGP",
                    "competition": "MotoGP 2026",
                    "eventName": titolo,
                    "dateTime": data_iso,
                    "broadcaster": "Sky Sport MotoGP / TV8 / NOW"
                })
            
    return eventi_finali

def salva_motogp(nuovi_eventi):
    if not os.path.exists(DATA_FILE):
        dati_esistenti = []
    else:
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            try:
                dati_esistenti = json.load(file)
            except json.JSONDecodeError:
                dati_esistenti = []
                
    # Puliamo lo sporco vecchio
    dati_puliti = [e for e in dati_esistenti if e.get('sport') != 'MotoGP']
    dati_finali = dati_puliti + nuovi_eventi
    
    with open(DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(dati_finali, file, indent=2, ensure_ascii=False)
    print(f"Lavoro completato! Inserite {len(nuovi_eventi)} gare di MotoGP dal file ICS fornito.")

if __name__ == "__main__":
    ev = estrai_motogp_ics_locale()
    salva_motogp(ev)

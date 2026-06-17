import json
import os
import urllib.request # Libreria INTERNA di Python per connettersi a internet
from datetime import datetime

# Percorso del nostro database locale
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'calendario.json')

# L'indirizzo del repository pubblico che contiene tutti i dati mondiali della F1 2026
F1_API_URL = "https://raw.githubusercontent.com/sportstimes/f1/main/_db/f1/2026.json"

# Un dizionario (mappa) per tradurre i nomi inglesi tecnici in italiano pulito per l'app
NOMI_SESSIONI = {
    "fp1": "Prove Libere 1",
    "fp2": "Prove Libere 2",
    "fp3": "Prove Libere 3",
    "qualifying": "Qualifiche",
    "sprintQualifying": "Qualifiche Sprint",
    "sprint": "Sprint Race",
    "gp": "Gara"
}

def estrai_dati_f1_reali():
    print(f"Scaricando il calendario reale F1 2026 da internet...")
    
    # 1. Bussiamo alla porta del server usando 'urllib' e leggiamo la risposta
    req = urllib.request.Request(F1_API_URL, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            # Traduciamo il testo grezzo scaricato in una struttura Python leggibile
            dati_grezzi = json.loads(response.read().decode())
    except Exception as e:
        print(f"Errore durante il download da internet: {e}")
        return []
        
    eventi_estratti = []
    
    # 2. Facciamo un Loop (ciclo) per visitare ogni singolo Gran Premio (le 22 gare dell'anno)
    for gara in dati_grezzi.get('races', []):
        nome_gp = f"GP {gara['name']} - {gara['location']}"
        sessioni = gara.get('sessions', {}) # Prende la scatola con dentro FP1, Qualy, ecc.
        
        # 3. Facciamo un secondo Loop interno per ogni sessione di quel Gran Premio
        for codice_sessione, orario_iso in sessioni.items():
            # Chiediamo al dizionario: "Sai come si traduce 'fp1'?"
            nome_evento = NOMI_SESSIONI.get(codice_sessione, codice_sessione)
            
            # Creiamo un codice ID unico (es. f1_monza_fp1) per evitare doppioni
            id_univoco = f"f1_{gara['slug']}_{codice_sessione}"
            
            # Assembliamo il pacchettino standard della nostra app
            nuovo_evento = {
                "id": id_univoco,
                "sport": "F1",
                "competition": nome_gp,
                "eventName": nome_evento,
                "dateTime": orario_iso,
                "broadcaster": "Sky Sport F1"
            }
            eventi_estratti.append(nuovo_evento)
            
    return eventi_estratti

def salva_nel_database_locale(nuovi_eventi):
    # Protezione: se per colpa di internet non ha scaricato nulla, ci fermiamo qui
    if not nuovi_eventi:
        print("Nessun evento estratto, interrompo il salvataggio per sicurezza.")
        return

    # Leggiamo il calendario esistente (calcio, tennis)
    dati_esistenti = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            try:
                dati_esistenti = json.load(file)
            except json.JSONDecodeError:
                pass 
            
    # Come prima, isoliamo e rimuoviamo gli eventi F1 vecchi per fare spazio ai nuovi
    dati_puliti = [evento for evento in dati_esistenti if evento.get('sport') != 'F1']
    
    # Uniamo la nuova F1 appena estratta
    dati_finali = dati_puliti + nuovi_eventi
    
    # Sovrascriviamo il file per aggiornare l'app
    with open(DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(dati_finali, file, indent=2, ensure_ascii=False)
        
    print(f"Lavoro completato! Inserite {len(nuovi_eventi)} sessioni reali di F1 nel database.")

if __name__ == "__main__":
    eventi_f1 = estrai_dati_f1_reali()
    salva_nel_database_locale(eventi_f1)

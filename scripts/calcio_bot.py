import json
import os
import urllib.request
import re
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import openpyxl

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'calendario.json')
EXCEL_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'Calendario_SerieA_2026-27.xlsx')
ENV_FILE = os.path.join(os.path.dirname(__file__), '..', '.env.local')

# Mappa per normalizzare i nomi delle squadre in italiano pulito
TEAM_NAMES = {
    "FC Internazionale Milano": "Inter",
    "AC Monza": "Monza",
    "Cagliari Calcio": "Cagliari",
    "SSC Napoli": "Napoli",
    "Udinese Calcio": "Udinese",
    "AS Roma": "Roma",
    "Juventus FC": "Juventus",
    "AC Milan": "Milan",
    "Atalanta BC": "Atalanta",
    "SS Lazio": "Lazio",
    "ACF Fiorentina": "Fiorentina",
    "Bologna FC 1909": "Bologna",
    "Torino FC": "Torino",
    "Genoa CFC": "Genoa",
    "Parma Calcio 1913": "Parma",
    "Hellas Verona FC": "Verona",
    "US Lecce": "Lecce",
    "Empoli FC": "Empoli",
    "Venezia FC": "Venezia",
    "Como 1907": "Como",
    "US Sassuolo Calcio": "Sassuolo",
    "Frosinone Calcio": "Frosinone",
    "Real Madrid CF": "Real Madrid",
    "Club Brugge KV": "Club Brugge",
    "FK Shakhtar Donetsk": "Shakhtar Donetsk",
    "Feyenoord Rotterdam": "Feyenoord",
    "VfB Stuttgart": "Stoccarda",
    "Borussia Dortmund": "Borussia Dortmund",
    "Liverpool FC": "Liverpool",
    "ŠK Slovan Bratislava": "Slovan Bratislava"
}

def clean_team_name(name):
    if not name:
        return "TBD"
    return TEAM_NAMES.get(name, name.replace(" FC", "").replace(" Calcio", "").strip())

def get_api_key():
    if os.path.exists(ENV_FILE):
        try:
            with open(ENV_FILE, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.startswith('FOOTBALL_DATA_API_KEY='):
                        return line.split('=', 1)[1].strip()
        except Exception:
            pass
    return os.environ.get('FOOTBALL_DATA_API_KEY', '')

def fetch_api_matches(competition_code, api_key):
    if not api_key:
        return []
    url = f"https://api.football-data.org/v4/competitions/{competition_code}/matches"
    req = urllib.request.Request(url, headers={'X-Auth-Token': api_key})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('matches', [])
    except Exception as e:
        print(f"Errore download API {competition_code}: {e}")
        return []

def iso_utc_to_rome(utc_str):
    """Converte un timestamp UTC ISO (es. 2026-08-22T16:30:00Z) nel fuso orario di Roma (+02:00 o +01:00)."""
    try:
        dt = datetime.fromisoformat(utc_str.replace('Z', '+00:00'))
        rome_dt = dt.astimezone(ZoneInfo('Europe/Rome'))
        return rome_dt.isoformat()
    except Exception:
        return utc_str

def estrai_serie_a_inter(api_key):
    print("Recupero Serie A (Solo Inter)...")
    matches = fetch_api_matches("SA", api_key)
    eventi = []

    if matches:
        for m in matches:
            home = m.get('homeTeam', {}).get('name', '')
            away = m.get('awayTeam', {}).get('name', '')
            if 'inter' in home.lower() or 'inter' in away.lower():
                h_name = clean_team_name(home)
                a_name = clean_team_name(away)
                status = m.get('status', 'TIMED')
                utc_date = m.get('utcDate', '')
                local_date = iso_utc_to_rome(utc_date)
                
                # Controllo eventuale punteggio
                score = m.get('score', {}).get('fullTime', {})
                h_score = score.get('home')
                a_score = score.get('away')
                
                if status == 'FINISHED' and h_score is not None and a_score is not None:
                    event_title = f"Serie A: {h_name} {h_score} - {a_score} {a_name}"
                else:
                    event_title = f"Serie A: {h_name} vs {a_name}"

                eventi.append({
                    "id": f"sa_2627_{m.get('id', len(eventi))}",
                    "sport": "Calcio",
                    "competition": "Serie A",
                    "eventName": event_title,
                    "dateTime": local_date,
                    "broadcaster": "DAZN / Sky",
                    "status": status
                })
        print(f"Estrattele da API: {len(eventi)} partite dell'Inter in Serie A.")
        return eventi

    # Fallback su file Excel se l'API non risponde
    print("Uso fallback Excel per la Serie A...")
    return estrai_serie_a_da_excel()

def estrai_serie_a_da_excel():
    if not os.path.exists(EXCEL_FILE):
        return []
    wb = openpyxl.load_workbook(EXCEL_FILE, data_only=True)
    eventi = []
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        for row_idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
            for col_idx, cell_value in enumerate(row):
                if cell_value and isinstance(cell_value, str) and "inter" in cell_value.lower() and "-" in cell_value:
                    partita_nome = cell_value.strip().replace('-', ' vs ')
                    data_trovata = None
                    for r_up in range(row_idx - 1, 0, -1):
                        cella_sopra = ws.cell(row=r_up, column=col_idx+1).value
                        if cella_sopra and isinstance(cella_sopra, str) and "(" in cella_sopra and ")" in cella_sopra:
                            match = re.search(r'\((\d{2}/\d{2}/\d{2,4})\)', cella_sopra)
                            if match:
                                data_trovata = match.group(1)
                                break
                    if data_trovata:
                        g, m, a = data_trovata.split('/')
                        if len(a) == 2:
                            a = f"20{a}"
                        slug = re.sub(r'[^a-z0-9]', '_', partita_nome.lower())
                        eventi.append({
                            "id": f"sa_2627_excel_{a}{m}{g}_{slug}",
                            "sport": "Calcio",
                            "competition": "Serie A",
                            "eventName": f"Serie A: {partita_nome}",
                            "dateTime": f"{a}-{m}-{g}T15:00:00+02:00",
                            "broadcaster": "DAZN / Sky",
                            "status": "TIMED"
                        })
    return eventi

def estrai_champions_league_inter(api_key):
    print("Recupero Champions League (Solo Inter)...")
    matches = fetch_api_matches("CL", api_key)
    eventi = []
    for m in matches:
        home = m.get('homeTeam', {}).get('name', '')
        away = m.get('awayTeam', {}).get('name', '')
        if 'inter' in home.lower() or 'inter' in away.lower():
            h_name = clean_team_name(home)
            a_name = clean_team_name(away)
            status = m.get('status', 'TIMED')
            utc_date = m.get('utcDate', '')
            local_date = iso_utc_to_rome(utc_date)

            score = m.get('score', {}).get('fullTime', {})
            h_score = score.get('home')
            a_score = score.get('away')

            if status == 'FINISHED' and h_score is not None and a_score is not None:
                event_title = f"Champions League: {h_name} {h_score} - {a_score} {a_name}"
            else:
                event_title = f"Champions League: {h_name} vs {a_name}"

            eventi.append({
                "id": f"cl_2627_{m.get('id', len(eventi))}",
                "sport": "Calcio",
                "competition": "Champions League",
                "eventName": event_title,
                "dateTime": local_date,
                "broadcaster": "Sky Sport / NOW / Prime Video",
                "status": status
            })
    print(f"Estrattele da API: {len(eventi)} partite dell'Inter in Champions League.")
    return eventi

def salva_nel_database_locale(nuovi_eventi):
    if not nuovi_eventi:
        print("Nessun evento calcio estratto.")
        return

    dati_esistenti = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as file:
            try:
                dati_esistenti = json.load(file)
            except json.JSONDecodeError:
                pass
            
    # Manteniamo intatti F1, MotoGP, Tennis e sostituiamo solo il Calcio
    dati_senza_calcio = [evento for evento in dati_esistenti if evento.get('sport') != 'Calcio']
    dati_finali = dati_senza_calcio + nuovi_eventi
    
    # Ordiniamo per data cronologica
    dati_finali.sort(key=lambda x: x.get('dateTime', ''))

    with open(DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(dati_finali, file, indent=2, ensure_ascii=False)
        
    print(f"Database aggiornato con successo: {len(nuovi_eventi)} eventi di Calcio inseriti (Totale globale: {len(dati_finali)}).")

if __name__ == "__main__":
    key = get_api_key()
    serie_a = estrai_serie_a_inter(key)
    champions = estrai_champions_league_inter(key)
    salva_nel_database_locale(serie_a + champions)

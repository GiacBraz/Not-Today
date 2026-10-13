import json
import os
import urllib.request
import re
from datetime import datetime
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
    """Converte un timestamp UTC ISO nel fuso orario di Roma (+02:00 o +01:00)."""
    try:
        dt = datetime.fromisoformat(utc_str.replace('Z', '+00:00'))
        rome_dt = dt.astimezone(ZoneInfo('Europe/Rome'))
        return rome_dt.isoformat()
    except Exception:
        return utc_str

def is_placeholder_match(utc_date_str, status="TIMED"):
    if not utc_date_str or status == "SCHEDULED":
        return True
    try:
        dt_utc = datetime.fromisoformat(utc_date_str.replace('Z', '+00:00'))
        if dt_utc.hour == 0 and dt_utc.minute == 0:
            return True
    except Exception:
        pass
    return False

def calcola_broadcaster_serie_a(utc_date_str, status="TIMED"):
    """
    Regole ufficiali Bando Diritti TV Lega Serie A (2024-2029):
    - DAZN trasmette tutte le 10 partite a giornata (38 su 38 dell'Inter).
    - Sky trasmette 3 partite in co-esclusiva negli slot prefissati:
      * Sabato 20:45
      * Domenica 18:00
      * Lunedì 20:45 (o Venerdì 20:45)
      * Turno infrasettimanale slot serale Sky
    - Tutti gli altri slot (sabato 15:00/18:00, domenica 12:30/15:00/20:45): Solo DAZN.
    - Se l'orario non è ancora fissato dalla Lega: DAZN o Now.
    """
    if is_placeholder_match(utc_date_str, status):
        return "DAZN o Now"

    try:
        dt = datetime.fromisoformat(utc_date_str.replace('Z', '+00:00')).astimezone(ZoneInfo('Europe/Rome'))
    except Exception:
        return "DAZN o Now"

    wd = dt.weekday() # 0=Lun, 1=Mar, 2=Mer, 3=Gio, 4=Ven, 5=Sab, 6=Dom
    h = dt.hour
    m = dt.minute

    # Sabato 20:45
    if wd == 5 and h == 20 and m == 45:
        return "Sky Sport / DAZN"
    # Domenica 18:00
    if wd == 6 and h == 18 and m == 0:
        return "Sky Sport / DAZN"
    # Lunedì 20:45
    if wd == 0 and h == 20 and m == 45:
        return "Sky Sport / DAZN"
    # Venerdì 20:45
    if wd == 4 and h == 20 and m == 45:
        return "Sky Sport / DAZN"
    # Mercoledì 20:45 (infrasettimanale slot Sky)
    if wd == 2 and h == 20 and m == 45:
        return "Sky Sport / DAZN"

    return "Solo DAZN"

def calcola_broadcaster_champions(utc_date_str, home, away):
    """
    Regole ufficiali Diritti TV UEFA Champions League in Italia:
    - Tutte le partite del MARTEDÌ: 100% Sky Sport / NOW (MAI su Prime Video).
    - Mercoledì: Amazon Prime Video ha la migliore partita delle italiane in ESCLUSIVA ASSOLUTA.
    - Le altre partite del mercoledì vanno su Sky Sport / NOW.
    """
    if not utc_date_str:
        return "Sky Sport / NOW"
    try:
        dt = datetime.fromisoformat(utc_date_str.replace('Z', '+00:00')).astimezone(ZoneInfo('Europe/Rome'))
        wd = dt.weekday() # 1 = Martedì, 2 = Mercoledì
    except Exception:
        return "Sky Sport / NOW"

    # Martedì -> Sempre e solo Sky Sport / NOW
    if wd == 1:
        return "Sky Sport / NOW"

    # Mercoledì -> Prime Video per le sfide di cartello dell'Inter
    nomi = f"{home} {away}".lower()
    if any(k in nomi for k in ["shakhtar", "stuttgart", "stoccarda", "dortmund"]):
        return "Prime Video (Esclusiva)"

    return "Sky Sport / NOW"

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
                
                is_placeholder = is_placeholder_match(utc_date, status)
                if is_placeholder:
                    date_part = utc_date.split('T')[0] if utc_date else "2027-01-01"
                    local_date = f"{date_part}T15:00:00+01:00"
                    status = "SCHEDULED"
                    broadcaster = "DAZN o Now"
                else:
                    local_date = iso_utc_to_rome(utc_date)
                    broadcaster = calcola_broadcaster_serie_a(utc_date, status)

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
                    "broadcaster": broadcaster,
                    "status": status
                })
        print(f"Estrattele da API: {len(eventi)} partite dell'Inter in Serie A.")
        return eventi

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
                            "dateTime": f"{a}-{m}-{g}T15:00:00+01:00",
                            "broadcaster": "DAZN o Now",
                            "status": "SCHEDULED"
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

            # Assegnazione broadcaster puntuale (Sky vs Prime Video)
            broadcaster = calcola_broadcaster_champions(utc_date, home, away)

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
                "broadcaster": broadcaster,
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

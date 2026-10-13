import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'calendario.json')

# ==============================================================================
# CALENDARIO UFFICIALE COPPA DEL MONDO SCI ALPINO 2026/2027 (FIS WORLD CUP)
# Comprende: Uomini (M) e Donne (F)
# Discipline: Discesa Libera (DH), Super-G (SG), Slalom Gigante (GS), Slalom Speciale (SL)
# Broadcaster: Rai Sport / Eurosport (Discovery+)
# ==============================================================================

GARE_SCI_ALPINO = [
    # --- OTTOBRE 2026: SÖLDEN (AUT) ---
    {
        "id": "sci_2026_solden_gs_f",
        "competition": "Coppa del Mondo - Sölden",
        "eventName": "Gigante Femminile (1ª m. 10:00 / 2ª m. 13:00)",
        "dateTime": "2026-10-24T10:00:00+02:00"
    },
    {
        "id": "sci_2026_solden_gs_m",
        "competition": "Coppa del Mondo - Sölden",
        "eventName": "Gigante Maschile (1ª m. 10:00 / 2ª m. 13:00)",
        "dateTime": "2026-10-25T10:00:00+02:00"
    },

    # --- NOVEMBRE 2026: LEVI (FIN) ---
    {
        "id": "sci_2026_levi_sl_f",
        "competition": "Coppa del Mondo - Levi",
        "eventName": "Slalom Speciale Femminile (1ª m. 10:00 / 2ª m. 13:00)",
        "dateTime": "2026-11-14T10:00:00+01:00"
    },
    {
        "id": "sci_2026_levi_sl_m",
        "competition": "Coppa del Mondo - Levi",
        "eventName": "Slalom Speciale Maschile (1ª m. 10:00 / 2ª m. 13:00)",
        "dateTime": "2026-11-15T10:00:00+01:00"
    },

    # --- NOVEMBRE 2026: GURGL (AUT) ---
    {
        "id": "sci_2026_gurgl_sl_f",
        "competition": "Coppa del Mondo - Gurgl",
        "eventName": "Slalom Speciale Femminile",
        "dateTime": "2026-11-21T10:30:00+01:00"
    },
    {
        "id": "sci_2026_gurgl_sl_m",
        "competition": "Coppa del Mondo - Gurgl",
        "eventName": "Slalom Speciale Maschile",
        "dateTime": "2026-11-22T10:30:00+01:00"
    },

    # --- NOVEMBRE 2026: KILLINGTON (USA) - DONNE ---
    {
        "id": "sci_2026_killington_gs_f",
        "competition": "Coppa del Mondo - Killington",
        "eventName": "Gigante Femminile",
        "dateTime": "2026-11-28T16:00:00+01:00"
    },
    {
        "id": "sci_2026_killington_sl_f",
        "competition": "Coppa del Mondo - Killington",
        "eventName": "Slalom Speciale Femminile",
        "dateTime": "2026-11-29T16:00:00+01:00"
    },

    # --- DICEMBRE 2026: BEAVER CREEK (USA) - UOMINI ---
    {
        "id": "sci_2026_beaver_dh_m",
        "competition": "Coppa del Mondo - Beaver Creek",
        "eventName": "Discesa Libera Maschile (Birds of Prey)",
        "dateTime": "2026-12-04T18:45:00+01:00"
    },
    {
        "id": "sci_2026_beaver_sg_m",
        "competition": "Coppa del Mondo - Beaver Creek",
        "eventName": "Super-G Maschile (Birds of Prey)",
        "dateTime": "2026-12-05T18:45:00+01:00"
    },
    {
        "id": "sci_2026_beaver_gs_m",
        "competition": "Coppa del Mondo - Beaver Creek",
        "eventName": "Gigante Maschile",
        "dateTime": "2026-12-06T18:00:00+01:00"
    },

    # --- DICEMBRE 2026: TREMBLANT (CAN) - DONNE ---
    {
        "id": "sci_2026_tremblant_gs1_f",
        "competition": "Coppa del Mondo - Mont Tremblant",
        "eventName": "Gigante Femminile - Gara 1",
        "dateTime": "2026-12-05T17:00:00+01:00"
    },
    {
        "id": "sci_2026_tremblant_gs2_f",
        "competition": "Coppa del Mondo - Mont Tremblant",
        "eventName": "Gigante Femminile - Gara 2",
        "dateTime": "2026-12-06T17:00:00+01:00"
    },

    # --- DICEMBRE 2026: ST. MORITZ (SUI) - DONNE ---
    {
        "id": "sci_2026_stmoritz_dh_f",
        "competition": "Coppa del Mondo - St. Moritz",
        "eventName": "Discesa Libera Femminile (Corviglia)",
        "dateTime": "2026-12-12T10:30:00+01:00"
    },
    {
        "id": "sci_2026_stmoritz_sg_f",
        "competition": "Coppa del Mondo - St. Moritz",
        "eventName": "Super-G Femminile (Corviglia)",
        "dateTime": "2026-12-13T10:30:00+01:00"
    },

    # --- DICEMBRE 2026: VAL D'ISÈRE (FRA) - UOMINI ---
    {
        "id": "sci_2026_valdisere_gs_m",
        "competition": "Coppa del Mondo - Val d'Isère",
        "eventName": "Gigante Maschile (Face de Bellevarde)",
        "dateTime": "2026-12-12T09:30:00+01:00"
    },
    {
        "id": "sci_2026_valdisere_sl_m",
        "competition": "Coppa del Mondo - Val d'Isère",
        "eventName": "Slalom Speciale Maschile",
        "dateTime": "2026-12-13T09:30:00+01:00"
    },

    # --- DICEMBRE 2026: VAL GARDENA (ITA) - UOMINI (SASLONG) ---
    {
        "id": "sci_2026_gardena_sg_m",
        "competition": "Coppa del Mondo - Val Gardena",
        "eventName": "Super-G Maschile (Saslong)",
        "dateTime": "2026-12-18T11:45:00+01:00"
    },
    {
        "id": "sci_2026_gardena_dh_m",
        "competition": "Coppa del Mondo - Val Gardena",
        "eventName": "Discesa Libera Maschile (Saslong)",
        "dateTime": "2026-12-19T11:45:00+01:00"
    },

    # --- DICEMBRE 2026: VAL D'ISÈRE (FRA) - DONNE ---
    {
        "id": "sci_2026_valdisere_dh_f",
        "competition": "Coppa del Mondo - Val d'Isère",
        "eventName": "Discesa Libera Femminile",
        "dateTime": "2026-12-19T10:30:00+01:00"
    },
    {
        "id": "sci_2026_valdisere_sg_f",
        "competition": "Coppa del Mondo - Val d'Isère",
        "eventName": "Super-G Femminile",
        "dateTime": "2026-12-20T11:00:00+01:00"
    },

    # --- DICEMBRE 2026: ALTA BADIA (ITA) - UOMINI (GRAN RISA) ---
    {
        "id": "sci_2026_altabadia_gs1_m",
        "competition": "Coppa del Mondo - Alta Badia",
        "eventName": "Gigante Maschile - Gara 1 (Gran Risa)",
        "dateTime": "2026-12-20T10:00:00+01:00"
    },
    {
        "id": "sci_2026_altabadia_gs2_m",
        "competition": "Coppa del Mondo - Alta Badia",
        "eventName": "Gigante Maschile - Gara 2 (Gran Risa)",
        "dateTime": "2026-12-21T10:00:00+01:00"
    },

    # --- DICEMBRE 2026: MADONNA DI CAMPIGLIO (ITA) - UOMINI (3-TRE) ---
    {
        "id": "sci_2026_campiglio_sl_m",
        "competition": "Coppa del Mondo - Madonna di Campiglio",
        "eventName": "Slalom Speciale Maschile Notturno (Canalone Miramonti)",
        "dateTime": "2026-12-22T17:45:00+01:00"
    },

    # --- DICEMBRE 2026: SEMMERING (AUT) - DONNE ---
    {
        "id": "sci_2026_semmering_gs_f",
        "competition": "Coppa del Mondo - Semmering",
        "eventName": "Gigante Femminile",
        "dateTime": "2026-12-28T10:00:00+01:00"
    },
    {
        "id": "sci_2026_semmering_sl_f",
        "competition": "Coppa del Mondo - Semmering",
        "eventName": "Slalom Speciale Femminile",
        "dateTime": "2026-12-29T15:00:00+01:00"
    },

    # --- DICEMBRE 2026: BORMIO (ITA) - UOMINI (STELVIO) ---
    {
        "id": "sci_2026_bormio_dh_m",
        "competition": "Coppa del Mondo - Bormio",
        "eventName": "Discesa Libera Maschile (Stelvio)",
        "dateTime": "2026-12-28T11:30:00+01:00"
    },
    {
        "id": "sci_2026_bormio_sg_m",
        "competition": "Coppa del Mondo - Bormio",
        "eventName": "Super-G Maschile (Stelvio)",
        "dateTime": "2026-12-29T11:30:00+01:00"
    },

    # --- GENNAIO 2027: KRANJSKA GORA (SLO) - DONNE ---
    {
        "id": "sci_2027_kranjska_gs_f",
        "competition": "Coppa del Mondo - Kranjska Gora",
        "eventName": "Gigante Femminile (Podkoren)",
        "dateTime": "2027-01-02T09:30:00+01:00"
    },
    {
        "id": "sci_2027_kranjska_sl_f",
        "competition": "Coppa del Mondo - Kranjska Gora",
        "eventName": "Slalom Speciale Femminile",
        "dateTime": "2027-01-03T09:30:00+01:00"
    },

    # --- GENNAIO 2027: ADELBODEN (SUI) - UOMINI (CHUENISBÄRGLI) ---
    {
        "id": "sci_2027_adelboden_gs_m",
        "competition": "Coppa del Mondo - Adelboden",
        "eventName": "Gigante Maschile (Chuenisbärgli)",
        "dateTime": "2027-01-09T10:30:00+01:00"
    },
    {
        "id": "sci_2027_adelboden_sl_m",
        "competition": "Coppa del Mondo - Adelboden",
        "eventName": "Slalom Speciale Maschile",
        "dateTime": "2027-01-10T10:30:00+01:00"
    },

    # --- GENNAIO 2027: ZAUCHENSEE (AUT) - DONNE ---
    {
        "id": "sci_2027_zauchensee_dh_f",
        "competition": "Coppa del Mondo - Zauchensee",
        "eventName": "Discesa Libera Femminile",
        "dateTime": "2027-01-09T10:45:00+01:00"
    },
    {
        "id": "sci_2027_zauchensee_sg_f",
        "competition": "Coppa del Mondo - Zauchensee",
        "eventName": "Super-G Femminile",
        "dateTime": "2027-01-10T11:00:00+01:00"
    },

    # --- GENNAIO 2027: FLACHAU (AUT) - DONNE ---
    {
        "id": "sci_2027_flachau_sl_f",
        "competition": "Coppa del Mondo - Flachau",
        "eventName": "Slalom Speciale Femminile Notturno",
        "dateTime": "2027-01-12T18:00:00+01:00"
    },

    # --- GENNAIO 2027: WENGEN (SUI) - UOMINI (LAUBERHORN) ---
    {
        "id": "sci_2027_wengen_sg_m",
        "competition": "Coppa del Mondo - Wengen",
        "eventName": "Super-G Maschile (Lauberhorn)",
        "dateTime": "2027-01-15T12:30:00+01:00"
    },
    {
        "id": "sci_2027_wengen_dh_m",
        "competition": "Coppa del Mondo - Wengen",
        "eventName": "Discesa Libera Maschile (Lauberhorn)",
        "dateTime": "2027-01-16T12:30:00+01:00"
    },
    {
        "id": "sci_2027_wengen_sl_m",
        "competition": "Coppa del Mondo - Wengen",
        "eventName": "Slalom Speciale Maschile",
        "dateTime": "2027-01-17T10:15:00+01:00"
    },

    # --- GENNAIO 2027: KITZBÜHEL (AUT) - UOMINI (STREIF & GANSLERN) ---
    {
        "id": "sci_2027_kitz_sg_m",
        "competition": "Coppa del Mondo - Kitzbühel",
        "eventName": "Super-G Maschile (Streifalm)",
        "dateTime": "2027-01-22T11:30:00+01:00"
    },
    {
        "id": "sci_2027_kitz_dh_m",
        "competition": "Coppa del Mondo - Kitzbühel",
        "eventName": "Discesa Libera Maschile (Hahnenkamm Streif)",
        "dateTime": "2027-01-23T11:30:00+01:00"
    },
    {
        "id": "sci_2027_kitz_sl_m",
        "competition": "Coppa del Mondo - Kitzbühel",
        "eventName": "Slalom Speciale Maschile (Ganslern)",
        "dateTime": "2027-01-24T10:30:00+01:00"
    },

    # --- GENNAIO 2027: CORTINA D'AMPEZZO (ITA) - DONNE (TOFANE) ---
    {
        "id": "sci_2027_cortina_dh_f",
        "competition": "Coppa del Mondo - Cortina",
        "eventName": "Discesa Libera Femminile (Olympia delle Tofane)",
        "dateTime": "2027-01-23T10:30:00+01:00"
    },
    {
        "id": "sci_2027_cortina_sg_f",
        "competition": "Coppa del Mondo - Cortina",
        "eventName": "Super-G Femminile (Olympia delle Tofane)",
        "dateTime": "2027-01-24T10:30:00+01:00"
    },

    # --- GENNAIO 2027: KRONPLATZ / PLAN DE CORONES (ITA) - DONNE ---
    {
        "id": "sci_2027_kronplatz_gs_f",
        "competition": "Coppa del Mondo - Kronplatz",
        "eventName": "Gigante Femminile (Pista Erta)",
        "dateTime": "2027-01-26T10:30:00+01:00"
    },

    # --- GENNAIO 2027: SCHLADMING (AUT) - UOMINI (PLANAI NIGHT RACE) ---
    {
        "id": "sci_2027_schladming_gs_m",
        "competition": "Coppa del Mondo - Schladming",
        "eventName": "Gigante Maschile Notturno (Planai)",
        "dateTime": "2027-01-26T17:45:00+01:00"
    },
    {
        "id": "sci_2027_schladming_sl_m",
        "competition": "Coppa del Mondo - Schladming",
        "eventName": "Slalom Speciale Maschile Notturno (The Nightrace)",
        "dateTime": "2027-01-27T17:45:00+01:00"
    },

    # --- GENNAIO 2027: GARMISCH-PARTENKIRCHEN (GER) - UOMINI ---
    {
        "id": "sci_2027_garmisch_dh_m",
        "competition": "Coppa del Mondo - Garmisch",
        "eventName": "Discesa Libera Maschile (Kandahar)",
        "dateTime": "2027-01-30T11:30:00+01:00"
    },
    {
        "id": "sci_2027_garmisch_sg_m",
        "competition": "Coppa del Mondo - Garmisch",
        "eventName": "Super-G Maschile (Kandahar)",
        "dateTime": "2027-01-31T11:30:00+01:00"
    },

    # --- FEBBRAIO/MARZO 2027: CRANS-MONTANA (SUI) - UOMINI ---
    {
        "id": "sci_2027_crans_dh_m",
        "competition": "Coppa del Mondo - Crans-Montana",
        "eventName": "Discesa Libera Maschile",
        "dateTime": "2027-02-27T10:00:00+01:00"
    },
    {
        "id": "sci_2027_crans_sg_m",
        "competition": "Coppa del Mondo - Crans-Montana",
        "eventName": "Super-G Maschile",
        "dateTime": "2027-02-28T10:30:00+01:00"
    },

    # --- MARZO 2027: KVITFJELL (NOR) - UOMINI ---
    {
        "id": "sci_2027_kvitfjell_dh_m",
        "competition": "Coppa del Mondo - Kvitfjell",
        "eventName": "Discesa Libera Maschile (Olympiabakken)",
        "dateTime": "2027-03-06T10:30:00+01:00"
    },
    {
        "id": "sci_2027_kvitfjell_sg_m",
        "competition": "Coppa del Mondo - Kvitfjell",
        "eventName": "Super-G Maschile (Olympiabakken)",
        "dateTime": "2027-03-07T10:30:00+01:00"
    },

    # --- MARZO 2027: ÅRE (SWE) - DONNE ---
    {
        "id": "sci_2027_are_gs_f",
        "competition": "Coppa del Mondo - Åre",
        "eventName": "Gigante Femminile",
        "dateTime": "2027-03-06T10:00:00+01:00"
    },
    {
        "id": "sci_2027_are_sl_f",
        "competition": "Coppa del Mondo - Åre",
        "eventName": "Slalom Speciale Femminile",
        "dateTime": "2027-03-07T10:00:00+01:00"
    },

    # --- MARZO 2027: KRANJSKA GORA (SLO) - UOMINI (VITRANC) ---
    {
        "id": "sci_2027_kranjska_gs_m",
        "competition": "Coppa del Mondo - Kranjska Gora",
        "eventName": "Gigante Maschile (Podkoren)",
        "dateTime": "2027-03-13T09:30:00+01:00"
    },
    {
        "id": "sci_2027_kranjska_sl_m",
        "competition": "Coppa del Mondo - Kranjska Gora",
        "eventName": "Slalom Speciale Maschile (Podkoren)",
        "dateTime": "2027-03-14T09:30:00+01:00"
    },

    # --- MARZO 2027: FINALI DI COPPA DEL MONDO ---
    {
        "id": "sci_2027_finals_dh_mf",
        "competition": "Coppa del Mondo - Finali",
        "eventName": "Discesa Libera Maschile e Femminile (Finali)",
        "dateTime": "2027-03-20T10:00:00+01:00"
    },
    {
        "id": "sci_2027_finals_sg_mf",
        "competition": "Coppa del Mondo - Finali",
        "eventName": "Super-G Maschile e Femminile (Finali)",
        "dateTime": "2027-03-21T10:00:00+01:00"
    },
    {
        "id": "sci_2027_finals_tech1_mf",
        "competition": "Coppa del Mondo - Finali",
        "eventName": "Gigante M & Slalom F (Finali)",
        "dateTime": "2027-03-27T09:30:00+01:00"
    },
    {
        "id": "sci_2027_finals_tech2_mf",
        "competition": "Coppa del Mondo - Finali",
        "eventName": "Slalom M & Gigante F (Finali)",
        "dateTime": "2027-03-28T09:30:00+01:00"
    }
]

def salva_sci_nel_database():
    print(f"Elaborazione di {len(GARE_SCI_ALPINO)} gare di Sci Alpino...")
    
    eventi_formattati = []
    for gara in GARE_SCI_ALPINO:
        eventi_formattati.append({
            "id": gara["id"],
            "sport": "Sci Alpino",
            "competition": gara["competition"],
            "eventName": gara["eventName"],
            "dateTime": gara["dateTime"],
            "broadcaster": "Rai Sport / Eurosport",
            "status": "TIMED"
        })

    dati_esistenti = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            try:
                dati_esistenti = json.load(f)
            except json.JSONDecodeError:
                pass

    # Rimuoviamo eventuali vecchi eventi Sci Alpino per garantire idempotenza
    dati_puliti = [e for e in dati_esistenti if e.get('sport') != 'Sci Alpino']
    dati_finali = dati_puliti + eventi_formattati
    
    # Ordiniamo cronologicamente
    dati_finali.sort(key=lambda x: x.get('dateTime', ''))

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(dati_finali, f, indent=2, ensure_ascii=False)

    print(f"Salvataggio completato! Inserite {len(eventi_formattati)} gare di Sci Alpino.")
    print(f"Totale eventi nel database: {len(dati_finali)}.")

if __name__ == "__main__":
    salva_sci_nel_database()

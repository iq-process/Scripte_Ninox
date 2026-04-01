let _info := "BESCHREIBUNG: Dieses Script erstellt Gutschrifts- und Rechnungspositionen basierend auf Kostenarten.";
let _logik_laden := "LADEN: Lieferant erhaelt Auslage + Wartezeit. Kunde erhaelt Auslage + Ladepauschale 15 EUR + Wartezeit Std x 30 EUR.";
let _logik_wartezeit := "WARTEZEIT: Lieferant erhaelt NUR Wartezeit (vorberechnet). Kunde erhaelt NUR Wartezeit Std x 30 EUR.";
let _logik_sonstige := "SONSTIGE KOSTENARTEN: Lieferant und Kunde erhalten jeweils nur die Auslage-Position.";
let _version := "Version: 2026-04-01";

if SP_Gutschrift = 1 and 'Mit Lieferanten abgerechnet ?' = 2 then
    let vKosten_Art := text(Kostenart);
    let vBetrag_Auslage := Betrag_netto_Auslage;
    let vServicepartner := Servicepartner;
    let vAuftragsnummer := Auftragsnr;
    let vRouting := 'Ueberführungen'.KM_Gesamt;
    let vTourenart := Tour;
    let vFahrzeug := AKZ;
    let vStatus := number('Ueberführungen'.Status);
    let vUebernahme_Ort := 'Ueberführungen'.'Ort-A';
    let vUebergabe_Ort := 'Ueberführungen'.'Ort-B';
    let vDatum_Uebergabe := 'Ueberführungen'.'Datum der Übergabe-B';
    let vWartezeit_Li := Wartezeit_Ko;
    let vAnzahl := Wartezeit_Std;
    let vBezeichnung_Ko := "Auslage " + " " + text(Kostenart);
    let vUst := extractx(text('Ueberführungen'.Servicepartner.Besteuerung), "\d+");

    'Mit Lieferanten abgerechnet ?' := 1;

    do as database Abrechnungen

        if vKosten_Art != "Wartezeit" then
            let newrec := (create Gutschriftspositionen);
            newrec.(
                Verguetungsleistung := 2;
                Status_Posten := 1;
                'Touren-Art' := vTourenart;
                Lieferant := vServicepartner;
                'Position wurde erstellt am' := timestamp(now());
                'Auftragsnummer Oscar' := vAuftragsnummer;
                Status_Ueberf := vStatus;
                Datum_Ueberfuehrung := vDatum_Uebergabe;
                'Position wurde erstellt von:' := text(userFullName());
                Bezeichnung := vBezeichnung_Ko;
                AKZ_Fahrzeug_AB := vFahrzeug;
                'Ort-Uebernahme' := vUebernahme_Ort;
                'Ort-Uebergabe' := vUebergabe_Ort;
                Geroutete_KM := vRouting;
                Betrag := vBetrag_Auslage;
                Ust_Satz := vUst;
                Kostenart := vKosten_Art
            );
            popupRecord(newrec)
        end;

        if (vKosten_Art = "Laden" or vKosten_Art = "Wartezeit") and vWartezeit_Li > 0 then
            let recWarte := (create Gutschriftspositionen);
            recWarte.(
                Verguetungsleistung := 3;
                Status_Posten := 1;
                'Touren-Art' := vTourenart;
                Lieferant := vServicepartner;
                'Position wurde erstellt am' := timestamp(now());
                'Auftragsnummer Oscar' := vAuftragsnummer;
                Status_Ueberf := vStatus;
                Datum_Ueberfuehrung := vDatum_Uebergabe;
                'Position wurde erstellt von:' := text(userFullName());
                Bezeichnung := "Wartezeit " + text(vAnzahl) + " Std";
                AKZ_Fahrzeug_AB := vFahrzeug;
                'Ort-Uebernahme' := vUebernahme_Ort;
                'Ort-Uebergabe' := vUebergabe_Ort;
                Geroutete_KM := vRouting;
                Betrag := vWartezeit_Li;
                Ust_Satz := vUst;
                Kostenart := 12
            );
            if vKosten_Art = "Wartezeit" then
                popupRecord(recWarte)
            end
        end

    end
end;

if 'Kunden belasten' = 1 and 'Mit Kunden abgerechnet ?' = 2 then
    let vKosten_Art := text(Kostenart);
    let vBetrag_Auslage := Betrag_netto_Auslage;
    let vAuftragsnummer := Auftragsnr;
    let vTourenart := Tour;
    let vFahrzeug := AKZ;
    let vStatus := number('Ueberführungen'.Status);
    let vUebernahme_Ort := 'Ueberführungen'.'Ort-A';
    let vUebergabe_Ort := 'Ueberführungen'.'Ort-B';
    let vDatum_Uebergabe := 'Ueberführungen'.'Datum der Übergabe-B';
    let vKunde := 'Ueberführungen'.Kunde.'Unternehmen Kurzname';
    let vFIN := FIN;
    let vAnzahl := Wartezeit_Std;
    let vBezeichnung_Ko := "Auslage " + " " + text(Kostenart);
    let vKundenref1 := 'Ueberführungen'.'Kundenref.1';
    let vKundenref2 := 'Ueberführungen'.'Kundenref.2';
    let vUrl_Quittung := shareFile(Quittung);
    let vRouting := 'Ueberführungen'.KM_Gesamt;
    let vBeauftragung := 'Ueberführungen'.'Beauftragt am';
    let vBeauftragt := 'Ueberführungen'.'Überführung beauftragt durch';

    'Mit Kunden abgerechnet ?' := 1;

    do as database Abrechnungen

        if vKosten_Art != "Wartezeit" then
            let newrec := (create Rechnungspositionen);
            newrec.(
                Leistungsart := 2;
                Status_Pos := 1;
                Kunde := vKunde;
                Tourenart := vTourenart;
                Status_Ueberf := vStatus;
                'Position wurde erstellt von:' := text(userFullName());
                'Position wurde erstellt am:' := timestamp(now());
                Auftragsnummer_Oscar := vAuftragsnummer;
                Bezeichnung := vBezeichnung_Ko;
                AKZ_Fahrzeug := vFahrzeug;
                VIN := vFIN;
                Datum_Ueberf := vDatum_Uebergabe;
                Kundenref_1 := vKundenref1;
                Kundenref_2 := vKundenref2;
                Ort_A := vUebernahme_Ort;
                Ort_B := vUebergabe_Ort;
                Datum_Beauftragung := vBeauftragung;
                Ueberfuehrung_beauftragt_durch := vBeauftragt;
                Geroutete_KM := vRouting;
                Preis := vBetrag_Auslage;
                Quittung_URL := vUrl_Quittung;
                Ust_Satz := 19
            );
            popupRecord(newrec)
        end;

        if vKosten_Art = "Laden" then
            let recLadeKunde := (create Rechnungspositionen);
            recLadeKunde.(
                Leistungsart := 3;
                Status_Pos := 1;
                Kunde := vKunde;
                Tourenart := vTourenart;
                Status_Ueberf := vStatus;
                'Position wurde erstellt von:' := text(userFullName());
                'Position wurde erstellt am:' := timestamp(now());
                Auftragsnummer_Oscar := vAuftragsnummer;
                Bezeichnung := "Ladepauschale";
                AKZ_Fahrzeug := vFahrzeug;
                VIN := vFIN;
                Datum_Ueberf := vDatum_Uebergabe;
                Kundenref_1 := vKundenref1;
                Kundenref_2 := vKundenref2;
                Ort_A := vUebernahme_Ort;
                Ort_B := vUebergabe_Ort;
                Datum_Beauftragung := vBeauftragung;
                Ueberfuehrung_beauftragt_durch := vBeauftragt;
                Geroutete_KM := vRouting;
                Preis := 15;
                Ust_Satz := 19
            )
        end;

        if (vKosten_Art = "Laden" or vKosten_Art = "Wartezeit") and vAnzahl > 0 then
            let recWarteKunde := (create Rechnungspositionen);
            recWarteKunde.(
                Leistungsart := 3;
                Status_Pos := 1;
                Kunde := vKunde;
                Tourenart := vTourenart;
                Status_Ueberf := vStatus;
                'Position wurde erstellt von:' := text(userFullName());
                'Position wurde erstellt am:' := timestamp(now());
                Auftragsnummer_Oscar := vAuftragsnummer;
                Bezeichnung := "Wartezeit " + text(vAnzahl) + " Std";
                AKZ_Fahrzeug := vFahrzeug;
                VIN := vFIN;
                Datum_Ueberf := vDatum_Uebergabe;
                Kundenref_1 := vKundenref1;
                Kundenref_2 := vKundenref2;
                Ort_A := vUebernahme_Ort;
                Ort_B := vUebergabe_Ort;
                Datum_Beauftragung := vBeauftragung;
                Ueberfuehrung_beauftragt_durch := vBeauftragt;
                Geroutete_KM := vRouting;
                Preis := vAnzahl * 30;
                Ust_Satz := 19
            );
            if vKosten_Art = "Wartezeit" then
                popupRecord(recWarteKunde)
            end
        end

    end
end

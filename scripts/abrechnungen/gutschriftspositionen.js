// =============================================================
// Button: Gutschriftsposition anlegen
// Quelle: Datenbank A (Quelldatenbank)
// Ziel:   Datenbank B → "Abrechnungen"
// Tabelle: Gutschriftspositionen
// =============================================================
// Beschreibung:
//   Erstellt einen neuen Datensatz in der Tabelle
//   "Gutschriftspositionen" der verknüpften Datenbank
//   "Abrechnungen" und überträgt Auftragsdaten.
//   Wenn Vorholung = 2, wird nur die Vorholung-Position
//   (Verguetungsleistung := 3) angelegt.
//   Wenn Vorholung != 2, wird die reguläre
//   Lieferanten-Position (Verguetungsleistung := 1) angelegt.
// =============================================================
// Letzte Änderung: 2026-04-13
// =============================================================

let vServicepartner := this.Servicepartner.'Kurzname Lieferant';
let vProduktnummerL := this.Artikelnummer_Lieferant;
let vVerguetung := this.'EK-Preis';
let vTourenart := this.'Touren Art';
let vFahrzeug := this.'AKZ-Fahrzeug AB';
let vUebernahme_Ort := this.'Ort-A';
let vUebergabe_Ort := this.'Ort-B';
let vAuftragsnummer := this.'Auftragsnummer Oscar';
let vDatum_Uebergabe := this.'Datum der Übergabe-B';
let vZone_Lieferant := this.Zone_Lief;
let vUst := extractx(text(Servicepartner.Besteuerung), "\d+");
let vStatus := number(Status);
let vArtikelbezeichnung := Artikelbezeichnung;
let vRouting := KM_Gesamt;
if Vorholung != 2 then
	do as database Abrechnungen
		let newrec := (create Gutschriftspositionen);
		newrec.(
			Verguetungsleistung := 1;
			Status_Posten := 1;
			'Touren-Art' := vTourenart;
			Lieferant := vServicepartner;
			'Position wurde erstellt am' := timestamp(now());
			'Auftragsnummer Oscar' := vAuftragsnummer;
			Status_Ueberf := vStatus;
			Datum_Ueberfuehrung := vDatum_Uebergabe;
			'Position wurde erstellt von:' := text(userFullName());
			Bezeichnung := vArtikelbezeichnung;
			AKZ_Fahrzeug_AB := vFahrzeug;
			'Ort-Uebernahme' := vUebernahme_Ort;
			'Ort-Uebergabe' := vUebergabe_Ort;
			Geroutete_KM := vRouting;
			Artikelnummer := vProduktnummerL;
			Zone := vZone_Lieferant;
			Betrag := vVerguetung;
			Ust_Satz := vUst
		);
		popupRecord(newrec)
	end
end;
if Vorholung = 2 then
	let vBeschreibung := "Vorholung " + 'AKZ-Fahrzeug AB';
	do as database Abrechnungen
		let newrec := (create Gutschriftspositionen);
		newrec.(
			'Auftragsnummer Oscar' := vAuftragsnummer;
			Verguetungsleistung := 3;
			Status_Posten := 1;
			'Touren-Art' := vTourenart;
			Lieferant := vServicepartner;
			'Position wurde erstellt am' := timestamp(now());
			Status_Ueberf := vStatus;
			Datum_Ueberfuehrung := vDatum_Uebergabe;
			'Position wurde erstellt von:' := text(userFullName());
			Bezeichnung := vBeschreibung;
			AKZ_Fahrzeug_AB := vFahrzeug;
			'Ort-Uebernahme' := vUebernahme_Ort;
			'Ort-Uebergabe' := vUebergabe_Ort;
			Geroutete_KM := vRouting;
			Artikelnummer := vProduktnummerL;
			Zone := vZone_Lieferant;
			Betrag := 10;
			Ust_Satz := vUst
		);
		popupRecord(newrec)
	end
end

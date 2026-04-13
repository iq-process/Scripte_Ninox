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
//   (Verguetungsleistung := 3) angelegt, nicht die reguläre
//   Lieferanten-Position (Verguetungsleistung := 1).
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
let vAuftrag_Beschreibung := Zusammenfassung_Ueberfuehrung;
let vUst := extractx(text(Servicepartner.Besteuerung), "\d+");
let vStatus := number(Status);
let vArtikelbezeichnung := Artikelbezeichnung;
let vRouting := KM_Gesamt;
let vUser := userName();
let vZeit := timestamp(format(now(), "x"));
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
let vArtikelbezeichnung := this.Artikelbezeichnung;
let vProduktnummerK := this.'Artikelnummer-Kunde';
let vPreis := this.'VK-Preis';
let vTourenart := this.'Touren Art';
let vFahrzeug := this.'AKZ-Fahrzeug AB';
let vUebernahme_Ort := this.'Ort-A';
let vUebergabe_Ort := this.'Ort-B';
let vAuftragsnummer := this.'Auftragsnummer Oscar';
let vDatum_Uebergabe := this.'Datum der Übergabe-B';
let vZone_Kunde := this.Zone_Kunde;
let vKunde := Kunde.'Unternehmen Kurzname';
let vKundenref1 := this.'Kundenref.1';
let vKundenref2 := this.'Kundenref.2';
let vAuftrag_Beschreibung := Zusammenfassung_Ueberfuehrung;
let vUst := extractx(text(Ust_Satz), "\d+");
let vStatus := number(Status);
let vArtikelbezeichnung := Artikelbezeichnung;
let vRouting := KM_Gesamt;
let vBeauftragt := 'Überführung beauftragt durch';
let vFIN := 'FIN Fahrzeug AB';
let vBeauftragung := 'Beauftragt am';
let vPOBestellung := Kunde.PO_Bestellnr;
let vUser := userName();
let vZeit := timestamp(format(now(), "x"));
do as database Abrechnungen
	let newrec := (create Rechnungspositionen);
	newrec.(
		Leistungsart := 1;
		Status_Pos := 1;
		Kunde := vKunde;
		PO_Bestellung := vPOBestellung;
		Tourenart := vTourenart;
		Status_Ueberf := vStatus;
		'Position wurde erstellt von:' := text(userFullName());
		'Position wurde erstellt am:' := timestamp(now());
		Auftragsnummer_Oscar := vAuftragsnummer;
		Bezeichnung := vArtikelbezeichnung;
		AKZ_Fahrzeug := vFahrzeug;
		VIN := vFIN;
		Datum_Ueberf := vDatum_Uebergabe;
		Kundenref_1 := vKundenref1;
		Kundenref_2 := vKundenref2;
		Ort_A := vUebernahme_Ort;
		Ort_B := vUebergabe_Ort;
		Status_Ueberf := vStatus;
		Datum_Beauftragung := vBeauftragung;
		Ueberfuehrung_beauftragt_durch := vBeauftragt;
		Artikelnr := vProduktnummerK;
		Geroutete_KM := vRouting;
		Zone := vZone_Kunde;
		Preis := vPreis;
		Ust_Satz := vUst
	);
	popupRecord(newrec)
end;
if Vorholung = 2 and 'Mit Lieferanten abgerechnet_Vo' = 2 and
	'Mit Lieferanten abrechnen_Vo' = 1 then
	let vServicepartner := this.Servicepartner.'Kurzname Lieferant';
	let vTourenart := this.'Touren Art';
	let vFahrzeug := this.'AKZ-Fahrzeug AB';
	let vUebernahme_Ort := this.'Ort-A';
	let vUebergabe_Ort := this.'Ort-B';
	let vAuftragsnummer := this.'Auftragsnummer Oscar';
	let vDatum_Uebergabe := this.'Datum der Übergabe-B';
	let vZone_Lieferant := this.Zone_Lief;
	let vUst := extractx(text(Ust_Satz), "\d+");
	let vStatus := number(Status);
	let vBeschreibung := "Vorholung " + 'AKZ-Fahrzeug AB';
	let vRouting := KM_Gesamt;
	let vUser := userName();
	let vZeit := timestamp(format(now(), "x"));
	do as database Abrechnungen
		let newrec := (create Gutschriftspositionen);
		newrec.(
			'Auftragsnummer Oscar' := vAuftragsnummer;
			Verguetungsleistung := 3;
			Status_Posten := 1;
			'Touren-Art' := vTourenart;
			Lieferant := vServicepartner;
			'Position wurde erstellt am' := timestamp(now());
			'Auftragsnummer Oscar' := vAuftragsnummer;
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
end;
Vorholung := 6;
'Mit Lieferanten abgerechnet_Vo' := 1;
Erledigungsvermerk := html("" +
	"<p>" +
	"Abrechnung erfolgt durch: " +
	user() +
	" am " +
	format(now(), "DD.MM.YYYY HH:mm") +
	"</p>");
Status := 6;
alert("Abrechnung erfolgt !" + " " + "durch" + " " + user())

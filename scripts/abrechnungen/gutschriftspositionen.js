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
// =============================================================
// Variablen (müssen vor dem Aufruf gesetzt sein):
//   vAuftragsnummer  → Auftragsnummer Oscar
//   vStatus          → Status der Überführung
//   vDatum_Uebergabe → Datum der Überführung/Übergabe
// =============================================================
// Letzte Änderung: 2026-04-01
// =============================================================

do as database Abrechnungen
	let newrec := (create Gutschriftspositionen);
	newrec.(
		'Auftragsnummer Oscar' := vAuftragsnummer;
		Status_Ueberf := vStatus;
		Datum_Ueberfuehrung := vDatum_Uebergabe
	);

// =============================================================
// Dashboard: Gutschriften Übersicht (Badges)
// Zeigt Anzahl und Gesamtsumme der Gutschriften je Status-Gruppe
// =============================================================
// Letzte Änderung: 2026-04-13
// =============================================================

let gNicht := (select Gutschriften where Status = null or Status = 1 or Status = 2);
let gVers := (select Gutschriften where Status = 3);
let gUeber := (select Gutschriften where 'Fälligkeit Gutschrift' < today() and Status = 6);

// --- Gruppe: Nicht versendet ---
let rowsGNicht := "";
let totalGNicht := 0;
for g in gNicht do
    let versendetTxt := "-";
    if g.'Gutschrift versendet am' != null then
        versendetTxt := g.'Gutschrift versendet am' + ""
    end;
    let bruttoTxt := "0.00";
    let bruttoSum := sum(g.Positionen.'Betrag-brutto');
    if bruttoSum != null then
        bruttoTxt := format(bruttoSum, "#,##0.00");
        totalGNicht := totalGNicht + bruttoSum
    end;
    let kontaktTxt := "";
    if g.Kontakt != null then
        kontaktTxt := text(g.Kontakt.'Firmen Kurzname')
    end;
    let row := "<tr><td>" + kontaktTxt + "</td><td>" + bruttoTxt + " EUR</td><td>" +
        versendetTxt +
        "</td></tr>";
    rowsGNicht := rowsGNicht + row
end;
if rowsGNicht = "" then
    rowsGNicht := "<tr><td colspan='3'>Keine Datensätze</td></tr>"
end;
let totalGNichtTxt := format(totalGNicht, "#,##0.00");

// --- Gruppe: Versendet ---
let rowsGVers := "";
let totalGVers := 0;
for g in gVers do
    let versendetTxt := "-";
    if g.'Gutschrift versendet am' != null then
        versendetTxt := g.'Gutschrift versendet am' + ""
    end;
    let bruttoTxt := "0.00";
    let bruttoSum := sum(g.Positionen.'Betrag-brutto');
    if bruttoSum != null then
        bruttoTxt := format(bruttoSum, "#,##0.00");
        totalGVers := totalGVers + bruttoSum
    end;
    let kontaktTxt := "";
    if g.Kontakt != null then
        kontaktTxt := text(g.Kontakt.'Firmen Kurzname')
    end;
    let row := "<tr><td>" + kontaktTxt + "</td><td>" + bruttoTxt + " EUR</td><td>" +
        versendetTxt +
        "</td></tr>";
    rowsGVers := rowsGVers + row
end;
if rowsGVers = "" then
    rowsGVers := "<tr><td colspan='3'>Keine Datensätze</td></tr>"
end;
let totalGVersTxt := format(totalGVers, "#,##0.00");

// --- Gruppe: Überfällig ---
let rowsGUeber := "";
let totalGUeber := 0;
for g in gUeber do
    let versendetTxt := "-";
    if g.'Gutschrift versendet am' != null then
        versendetTxt := g.'Gutschrift versendet am' + ""
    end;
    let bruttoTxt := "0.00";
    let bruttoSum := sum(g.Positionen.'Betrag-brutto');
    if bruttoSum != null then
        bruttoTxt := format(bruttoSum, "#,##0.00");
        totalGUeber := totalGUeber + bruttoSum
    end;
    let kontaktTxt := "";
    if g.Kontakt != null then
        kontaktTxt := text(g.Kontakt.'Firmen Kurzname')
    end;
    let row := "<tr><td>" + kontaktTxt + "</td><td>" + bruttoTxt + " EUR</td><td>" +
        versendetTxt +
        "</td></tr>";
    rowsGUeber := rowsGUeber + row
end;
if rowsGUeber = "" then
    rowsGUeber := "<tr><td colspan='3'>Keine Datensätze</td></tr>"
end;
let totalGUeberTxt := format(totalGUeber, "#,##0.00");

html("
<style>
  .badges { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
  .badge {
    border-radius: 8px;
    padding: 12px 20px;
    min-width: 180px;
    color: #fff;
    font-family: sans-serif;
  }
  .badge-warning  { background: #e67e22; }
  .badge-success  { background: #27ae60; }
  .badge-danger   { background: #c0392b; }
  .badge h3 { margin: 0 0 4px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; opacity: 0.85; }
  .badge .count   { font-size: 28px; font-weight: 700; line-height: 1.1; }
  .badge .total   { font-size: 13px; margin-top: 4px; opacity: 0.9; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-family: sans-serif; font-size: 13px; }
  th { background: #f0f0f0; text-align: left; padding: 6px 10px; border-bottom: 2px solid #ccc; }
  td { padding: 5px 10px; border-bottom: 1px solid #e0e0e0; }
  h2 { font-family: sans-serif; font-size: 15px; margin: 20px 0 6px 0; color: #333; }
</style>

<div class='badges'>
  <div class='badge badge-warning'>
    <h3>Nicht versendet</h3>
    <div class='count'>" + cnt(gNicht) + "</div>
    <div class='total'>Gesamt: " + totalGNichtTxt + " EUR</div>
  </div>
  <div class='badge badge-success'>
    <h3>Versendet</h3>
    <div class='count'>" + cnt(gVers) + "</div>
    <div class='total'>Gesamt: " + totalGVersTxt + " EUR</div>
  </div>
  <div class='badge badge-danger'>
    <h3>Überfällig</h3>
    <div class='count'>" + cnt(gUeber) + "</div>
    <div class='total'>Gesamt: " + totalGUeberTxt + " EUR</div>
  </div>
</div>

<h2>Nicht versendete Gutschriften</h2>
<table>
  <tr><th>Kontakt</th><th>Betrag (Brutto)</th><th>Versendet am</th></tr>
  " + rowsGNicht + "
</table>

<h2>Versendete Gutschriften</h2>
<table>
  <tr><th>Kontakt</th><th>Betrag (Brutto)</th><th>Versendet am</th></tr>
  " + rowsGVers + "
</table>

<h2>Überfällige Gutschriften</h2>
<table>
  <tr><th>Kontakt</th><th>Betrag (Brutto)</th><th>Versendet am</th></tr>
  " + rowsGUeber + "
</table>
")

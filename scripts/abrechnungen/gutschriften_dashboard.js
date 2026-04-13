let gNicht := (select Gutschriften where Status = null or Status = 1 or Status = 2);
let gVers := (select Gutschriften where Status = 3);
let gUeber := (select Gutschriften where 'Fälligkeit Gutschrift' < today() and Status = 6);

let totalGNicht := sum(gNicht.sum(Positionen.'Betrag-brutto'));
let totalGVers := sum(gVers.sum(Positionen.'Betrag-brutto'));
let totalGUeber := sum(gUeber.sum(Positionen.'Betrag-brutto'));

html("
<style>
  .badges { display: flex; gap: 16px; flex-wrap: wrap; }
  .badge { border-radius: 8px; padding: 12px 20px; min-width: 180px; color: #fff; font-family: sans-serif; }
  .badge-warning { background: #e67e22; }
  .badge-success { background: #27ae60; }
  .badge-danger  { background: #c0392b; }
  .badge h3 { margin: 0 0 4px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; opacity: 0.85; }
  .badge .count { font-size: 28px; font-weight: 700; line-height: 1.1; }
  .badge .total { font-size: 13px; margin-top: 4px; opacity: 0.9; }
</style>
<div class='badges'>
  <div class='badge badge-warning'>
    <h3>Nicht versendet</h3>
    <div class='count'>" + cnt(gNicht) + "</div>
    <div class='total'>Gesamt: " + format(totalGNicht, "#,##0.00") + " EUR</div>
  </div>
  <div class='badge badge-success'>
    <h3>Versendet</h3>
    <div class='count'>" + cnt(gVers) + "</div>
    <div class='total'>Gesamt: " + format(totalGVers, "#,##0.00") + " EUR</div>
  </div>
  <div class='badge badge-danger'>
    <h3>Überfällig</h3>
    <div class='count'>" + cnt(gUeber) + "</div>
    <div class='total'>Gesamt: " + format(totalGUeber, "#,##0.00") + " EUR</div>
  </div>
</div>
")

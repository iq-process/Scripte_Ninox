# Scripte_Ninox

Dokumentation und Sicherung aller Ninox Button-Skripte.

## Zweck

Dieses Repository dient als **Ninox-unabhängige Sicherung** aller Skripte, die in Ninox-Datenbanken verwendet werden. So können Skripte jederzeit wiederhergestellt werden, auch wenn Ninox bei einem Backup-Restore die Skript-Zeilen automatisch entfernt.

## Struktur

```
scripts/
└── abrechnungen/
    └── gutschriftspositionen.js   ← Gutschriftspositionen anlegen
```

## Datenbank-Verknüpfungen

| Quelldatenbank | Zieldatenbank | Skript |
|---|---|---|
| Datenbank A | Abrechnungen (Datenbank B) | `scripts/abrechnungen/gutschriftspositionen.js` |

## Hinweise

- Jedes Skript enthält im Header: Quelle, Ziel, Tabelle, benötigte Variablen
- Bei neuen Buttons: Skript hier dokumentieren und committen
- **Vor dem Löschen einer Datenbank:** Pr��fen ob Verknüpfungen in anderen Datenbanken bestehen

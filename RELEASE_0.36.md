# SBauAkte 0.36.0 – Entwicklungsstand (nicht produktionsfreigegeben)

## Umgesetzt im Quellcode
- Eigenständige Bauwerksverwaltung mit Lang- und Kurzbezeichnung.
- Bauteilverwaltung mit Bauwerkszuordnung, Kurzbezeichnung (1–5 Zeichen), Kategorie und Pinform/Deckkraft.
- Pläne-Dropdown mit vier Ebenen; Planattribute, Status und revisionssichere Historie.
- Planviewer: Polygonflächen für Bauwerke/Bauteile, Pinverschiebung, konstante Pin-Bildschirmgröße und Transparenz.
- Projekt-/Bauwerks-/Bauteildokumentation als PDF mit Deckblatt, Inhaltsübersicht, Fotos und darstellbaren PDF-/Bildnachweisen.
- Foto-Metadaten Ort/Lage und Bauwerkszuordnung; Kategorie aus Bauteil.
- Bearbeitbare Dokumentenarten mit Archivierung bei bestehender Verwendung.
- Sicherung und Wiederherstellung der neuen Entitäten im JSON-Projektexport.
- IndexedDB Schema v8; bestehende Bauteile erhalten automatisch ein zugeordnetes Bauwerk anhand des bisherigen Freitextfelds.
- Korrektur des fehlenden downloadBlob aus der bereitgestellten BillingWorkspace.tsx.

## Noch offen / Einschränkungen
- Keine vollständige npm-/TypeScript-/Vite-Buildprüfung: Abhängigkeiten konnten in dieser Umgebung nicht installiert werden.
- Planrevisionen übernehmen die Koordinaten; eine halbtransparente Alt/Neu-Überlagerung mit Kalibrierung fehlt.
- Polygonflächen werden gezeichnet und gespeichert, aber noch nicht über Griffpunkte verschoben.
- PDF-Gesamtdokumentation rastert vorhandene PDF-Anlagen; eingebettete Originaldateien und klickbare Seitenzahlen fehlen.
- Mehrseitige große Exporte können hohen Speicherbedarf haben.
- Noch keine ZIP-Originaldatei-Sammelablage und keine globalen Suchindizes.
- Bauwerk/Foto-Zuordnung bestehender Daten sollte vor produktivem Einsatz getestet werden.

## Deployment
Das Paket enthält die bisherige GitHub-Actions-Konfiguration unverändert. Dateien müssen im Repository-Stamm liegen. Vor Veröffentlichung `npm install` und `npm run build` ausführen und Browser-Funktionstests vornehmen.

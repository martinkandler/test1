# SBauAkte 0.36.2 – Markierungsworkflow und Startseite

## Änderungen
- Planviewer: zentraler Button „Markierung hinzufügen“ mit Auswahl Bauwerk/Bauteil, vorhandenes Objekt oder Neuanlage und Pin/Fläche.
- Neuanlage eines Bauwerks oder Bauteils unmittelbar im Viewer; Bauteile benötigen ein Bauwerk.
- Flächen: Kurzbezeichnung als kleiner, zoomstabiler Button statt skalierter SVG-Schrift; Klick aktiviert Eckpunktbearbeitung, Speichern/Abbrechen und Entfernen.
- Pins: Auswahl mit sichtbarer Aktion „Pin entfernen“; Bauwerks-Pins sind separate Markierungen, die das Bauwerk nicht löschen.
- Flächen und Pins werden getrennt von Bauwerken/Bauteilen gespeichert; Entfernen einer Markierung löscht nicht das Objekt.
- Navigation: linksbündige Menüpunkte; Firmenlogo links in der Kopfleiste größer und mit passendem weißem Hintergrund.
- Startseite: großes zentriertes Firmenlogo und typografischer SBauAkte-Schriftzug oberhalb der Projektverwaltung.

## Prüfung und Grenzen
- TypeScript-TSX-Syntaxprüfung über `transpileModule`: erfolgreich.
- ZIP-Integrität: erfolgreich.
- Vollständiger Build **nicht** möglich: npm-Registry im Container nicht erreichbar (`EAI_AGAIN`); daher noch keine Freigabe.
- Die Verschiebung von Polygon-Eckpunkten und das Verhalten bei Touch-Gesten müssen im Browser getestet werden.
- Bestehende Daten bleiben im Dexie-Schema erhalten; `markerType` ist ein optionales Feld in der vorhandenen Planflächen-Tabelle.

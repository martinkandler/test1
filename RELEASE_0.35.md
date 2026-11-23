# SBauAkte 0.35.0 – Abrechnung & Aufmaß

## Neuer Arbeitsbereich
- LV-Positionen manuell anlegen; CSV- und XLSX-Import mit Spaltennamen OZ/Position, Kurztext/Bezeichnung, Einheit, Menge, Einheitspreis.
- Rechnerische Aufmaßansätze mit Grundrechenarten, Klammern und negativen Mengen.
- Grafisches Aufmaß (Strecke, Rechteck, Polygon), Referenzstrecken-Kalibrierung je Planseite, Abzüge, optionale Dicke für m³.
- Kumulative Abschlagsabrechnung mit unveränderlichen Mengen-/Preis-Snapshots.
- CSV- und PDF-Übersicht; Projektsicherung enthält auch LV, Aufmaße und Abrechnungsstände.
- SVG-Firmenlogo im Kopfbereich aus bereitgestellter PDF-Vektorgrafik.
- Freie Zeichenfarbe in der Bestandsplanung; alte Markierungen bleiben in ihrer bisherigen Kategoriefarbe.

## Wichtige Grenzen
- Das grafische Aufmaß ist ein Hilfsmittel und erfordert eine geprüfte Maßstabskalibrierung. Kalibrierungen werden derzeit nur für die laufende Sitzung gehalten; gespeicherte Aufmaße enthalten ihren verwendeten Faktor.
- Abrechnungsstände werden als unveränderliche Datensätze abgelegt. Keine Rechnungsprüfung, Zahlungsbuchhaltung, GAEB oder REB/DA11.
- PDF-Abrechnung ist eine kompakte Übersicht, kein formell vollständiges Rechnungsdokument.
- Es gibt keine Mehrbenutzer-Synchronisation. Projektsicherungen regelmäßig exportieren.
- Die XLSX-Verarbeitung benötigt das neue npm-Paket `xlsx`.

# sbau.akte 0.38.0 – LV und Abrechnungsvorbereitung

- Eigenständiges Menü **Leistungsverzeichnis** für Hauptvertrag und Nachträge.
- Direkter Import von iTWO-GAEB-DA-XML (.RIBX81/.x81/.x83/.x84/.xml), CSV und XLSX. Titel-/Untertitelhierarchie, Suche nach OZ/Kurz-/Langtext und Langtextanzeige.
- Importvorschau, Ersatzimport und Löschung je Vertragsart. Gleiche OZ behalten ihre ID, verknüpfte entfernte Positionen werden archiviert.
- Eigenständiges Menü **Abrechnung** mit frei datierten, fortlaufend ergänzbaren Abrechnungszetteln.
- Einträge je LV-Position mit Mehrfachzuordnung von Bauteilen, optionalen Mengen, Rechenansätzen, Plänen, Dokumenten, Fotos und Rückfragen.
- Status der Zettel und Einträge, Übernahme offener Einträge, PDF-Zuarbeit und strukturierter JSON-Export.
- Dexie Schema v9, bestehende Projekte und frühere Abrechnungsdaten bleiben gespeichert.

## Grenzen dieser ersten Umsetzung

- Keine direkte iTWO-Synchronisierung, keine rechtsverbindlichen Aufmaßblätter und keine Abschlagsrechnung.
- Keine automatische Abrechnungsprognose: Dafür ist ein belastbarer importierter Ist-Abrechnungsstand aus iTWO erforderlich.
- Planmarkierungen/Feldaufmaßblatt sind noch nicht direkt im neuen Abrechnungszettel zeichnend bearbeitbar; vorhandene Pläne können verknüpft werden.
- Der PDF-Zettel enthält Verweise auf Anlagen, aber die binären Anlagen werden nicht eingebettet.
- GAEB-Import muss bei abweichenden Exportvarianten kontrolliert werden.
- Vollständiger Vite-Build wurde mangels verfügbarer npm-Abhängigkeiten in dieser Umgebung nicht ausgeführt; TypeScript-Transpilierung der geänderten Dateien war ohne Syntaxdiagnosen.

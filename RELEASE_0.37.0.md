# SBauAkte 0.37.0 – Einführungstour

## Umfang

- Ein Musterprojekt **DEMO · EÜ Lindenstraße – Neustadt** wird beim ersten Start der Tour lokal in IndexedDB erzeugt. Es ist **kein reales Bauprojekt**.
- 4 Bauwerke, 18 Bauteile, 12 schematische SVG-Pläne über alle vier Ebenen, 24 schematische Bildillustrationen (keine realen Baustellenfotos), 12 SVG-Musterprüfunterlagen, 30 LV-Positionen, 20 Aufmaße und 2 Abschlagsstände.
- 19-Schritte-Tour mit Navigation, hervorgehobenen Elementen, Weiter/Zurück und lokal gespeichertem Fortschritt.
- Freies Erkunden und Zurücksetzen des Musterprojekts.

## Wichtige Grenzen

- Die Bilder sind generierte **SVG-Illustrationen**, keine fotorealistischen Baustellenaufnahmen. Die Musterunterlagen sind SVG-Bilddateien, keine originalen PDF-Prüfberichte. Der PDF-Gesamtexport kann die SVG-Unterlagen je nach Browser als Bilder übernehmen.
- Die Tour führt durch die vorhandenen Ansichten und erklärt die Funktionen. Sie überprüft die Ausführung einzelner Übungsaufgaben noch nicht automatisch.
- Die Tour wird im bestehenden Projekt gespeichert und kann durch Benutzeränderungen verändert werden; Zurücksetzen stellt die Musterdaten wieder her.
- Ein vollständiger npm-/Vite-Build konnte in dieser Umgebung wegen eines npm-Installations-Timeouts nicht ausgeführt werden. Die neuen TypeScript-/TSX-Dateien wurden syntaktisch transpiliert.

## GitHub

Die Dateien aus dem Archiv gehören direkt ins Repository-Hauptverzeichnis, insbesondere `package.json`, `src/` und `public/`. Die GitHub-Workflowdatei wurde nicht verändert.

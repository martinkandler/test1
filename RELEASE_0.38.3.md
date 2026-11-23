# sbau.akte 0.38.3 – Projekt-Dashboard, Startseite, Bauteil-Details

## Projekt-Dashboard
- Öffnen eines Projekts (Projektkarte, Musterprojekt, Tour) führt auf die neue Seite **Dashboard**; sie ist auch der erste Eintrag im Menü „Bereiche“.
- Inhalt: Projektkopf (Bauherr, Ort, Kostenstelle, Vertrag, Bauzeit mit Fortschrittsbalken), 5 Kennzahl-Kacheln mit Sprung in den Bereich, Dokumentationsstand (gleiche Berechnung wie Nachweisübersicht), „Braucht Aufmerksamkeit“, Abrechnung, „Zuletzt hinzugefügt“.
- „Braucht Aufmerksamkeit“ nennt: fehlendes Bauwerk/Bauteile/Plan, Bauteile ohne jeden Nachweis, die drei größten Lücken je Nachweisart, Fotos/Dokumente ohne Bauteilzuordnung, Abrechnungszettel im Entwurf. „Keine offenen Punkte“ erscheint nur, wenn nichts offen ist.
- Keine Änderung am Datenbankschema; alle Zahlen stammen aus vorhandenen Tabellen.

## Startseite
- Mit mindestens einem echten Projekt ist der Demo-Block eine schmale Zeile mit Umschalter (`aria-expanded`); ohne echtes Projekt bleibt er wie bisher groß.

## Bauteil-Details
- Hauptaktion „Bearbeiten“; „Bauteil löschen“ abgesetzt unter einer Trennlinie. Fotos/Dokumente/Plan erreichst du weiter über das Bauteil-Dossier.

## Tour
- Start im Dashboard, neuer Schritt „Projekt-Dashboard“ (der gespeicherte Tour-Fortschritt kann dadurch um einen Schritt verschoben sein).

## Fehlerbehebungen
- Helles Design: dunkle Schrift auf dunklem Grund bei „Zeichenfarbe“ (Bestandsplanung), Sammelaktions-Panel und Auswahlfeld in der Dokumentenverwaltung.
- Entfernt: toter Platzhalter-Zweig in `main.tsx`, ungenutzter Import.

## Prüfung
- Syntax aller Dateien ohne Diagnosen. Echte App (`main.tsx`) mit In-Memory-Datenbank-Attrappe in Chromium: Dashboard-Inhalt und Zahlen (19 %, Vertragssumme), Navigation und Zurück, Wiedereinstieg, neues leeres Projekt, kompakter Demo-Block, komplette Tour (20 Schritte), Bauteil-Details und Löschen, Handy-Layout (390 px).
- Kontrast-/Schriftaudit über alle Bereiche, hell und dunkel: 0 Verstöße; Schriften unter 12 px nur bei Pin-/Flächenbeschriftungen im Plan.

## Grenzen
- Vollständiger Vite-Build, PDF-/Excel-Funktionen und echte iPad-/iPhone-Tests stehen weiter aus (hier keine npm-Pakete; Dexie/PDF/XLSX waren Attrappen).
- Dashboard zählt Abrechnungswerte wie die Abrechnung selbst (alle LV-Positionen ohne Titelzeilen, ungeprüft auf Archivierung).
- Die Werkzeugleiste im Planviewer überdeckt bei schmalen Fenstern weiterhin den oberen Planrand (nicht Teil dieser Version).

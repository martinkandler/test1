# sbau.akte 0.38.2 – Navigation und Lesbarkeit

## Navigation
- Zwei Menüknöpfe statt drei: **Projekte** und **Bereiche**. „Pläne“ ist in „Bereiche“ aufgegangen (Planviewer und Planverwaltung stehen jetzt unter *Planen*).
- Gruppen im Bereichsmenü: Planen (Planviewer, Planverwaltung, Bestandsplanung, Bauwerke, Bauteile), Dokumentieren (Fotodokumentation, Qualitätsnachweise, Nachweisübersicht, Gesamtdokumentation), Abrechnen (Leistungsverzeichnis, Abrechnung), Projekt (Projekteinstellungen).
- Der Menüknopf zeigt den aktuellen Bereich; im Menü ist er hervorgehoben (`aria-current`).
- Klick/Tippen außerhalb und Escape schließen die Menüs.
- Behoben: Das Bauteil-Panel im Planviewer (`menu==='parts'`) klappte zusätzlich das Bereichsmenü auf.

## Lesbarkeit
- Mindestschrift 12 px außer bei Plan-Beschriftungen (`.plan-pin`, `.area-label`).
- Neue Farbvariablen `--ok-text`, `--warn-text`, `--bad-text`, `--faint-text`, `--plan-empty-text`, `--link-text`, `--text` (hell/dunkel getrennt); `--muted` im hellen Design abgedunkelt (4,5:1 auch auf dem Seitenhintergrund).
- Pin-Textfarbe passt sich der Kategoriefarbe an (`readableOn()` in `PlanViewer.tsx`).
- Behoben (dunkles Design): Pin-Zähler im Planviewer unlesbar, weil `--text` nirgends definiert war.

## Sonstiges
- Fotodokumentation: `src` bleibt leer-frei, bis die Bild-URL vorliegt.
- Tourtext „Projektnavigation“ angepasst.

## Prüfung
- Syntax aller TypeScript-Dateien ohne Diagnosen; keine `await`-Fehler.
- Echte App (`main.tsx`) mit In-Memory-Datenbank-Attrappe in Chromium: Menü-Verhalten, Löschdialog, Handy-Layout (390 px), Warnungen.
- Kontrast- und Schriftaudit über alle Bereiche, hell und dunkel: Kontrastverstöße 40 → 0 (hell) bzw. 12 → 0 (dunkel).

## Grenzen
- Vollständiger Vite-Build und PDF-/Excel-Funktionen wurden hier nicht ausgeführt (keine npm-Pakete, PDF/XLSX/Dexie waren Attrappen).
- Nicht auf echtem iPad/iPhone getestet.
- Das Bereichsmenü ist auf dem Handy höher als der Bildschirm und scrollt.

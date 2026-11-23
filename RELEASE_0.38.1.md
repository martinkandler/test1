# sbau.akte 0.38.1 – Größere Touch-Ziele und einheitliche Dialoge

- Schaltflächen, Auswahl- und Eingabefelder sind auf Tablet/Handy (`pointer: coarse` oder Breite ≤ 650 px) mindestens 44 px hoch. Die Werkzeugleiste im Planviewer bricht bei wenig Platz in eine zweite Zeile um.
- Plan-Pins und Eckpunkte von Flächenmarkierungen behalten ihre Größe, die tippbare Fläche ist aber um 9 px erweitert.
- Neues Modul `src/dialogs.tsx` mit `confirmDialog()` und `notify()`; `<DialogHost/>` ist in `main.tsx` eingebunden.
  - Löschdialoge: roter Bestätigen-Button, Fokus zunächst auf „Abbrechen“, Escape/Klick daneben bricht ab, Fokus kehrt zum auslösenden Element zurück.
  - Mehrere Rückfragen hintereinander werden nacheinander angezeigt.
  - Erfolgs-, Info- und Fehlermeldungen erscheinen als Hinweis am unteren Rand (Fehler bleiben länger sichtbar).
- Entfernt: alle nativen `confirm()`/`alert()`-Aufrufe (20 Rückfragen, 3 Hinweise).
- Behoben: Pin eines Bauwerks im Plan entfernen fragte zweimal nach.
- Sichtbarer Tastaturfokus (`:focus-visible`) für Schaltflächen, Felder und Auswahllisten.
- Versionsanzeige im Kopfbereich korrigiert.

## Grenzen / Hinweise

- Vollständiger Vite-Build wurde mangels npm-Abhängigkeiten in dieser Umgebung nicht ausgeführt. Geprüft wurden TypeScript-Syntax aller Dateien (keine Diagnosen) sowie Dialog, Meldungen und Touch-Größen in einem Chromium-Test mit dem echten `dialogs.tsx` und `style.css`.
- Nicht auf echtem iPad/iPhone getestet. Bei 360 px Breite kann die Kopfzeile durch die breitere Zurück-Schaltfläche knapp werden.

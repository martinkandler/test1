# SBauAkte 0.36.2 – Buildfix (Prüfstand)

- pdfjs-dist: nicht unterstützten `canvas`-Parameter bei `page.render()` in PlanViewer, AsBuiltWorkspace und BillingWorkspace entfernt; `canvasContext` und `viewport` bleiben erhalten.
- PlanViewer: Pins mit ungültigen negativen Koordinaten werden nicht mehr angezeigt.
- Kein Funktionsumfang hinzugefügt, keine Datenbankmigration.
- Achtung: npm-Abhängigkeiten waren in der Umgebung nicht installierbar; ein vollständiger `npm run build` ist noch nicht bestätigt.

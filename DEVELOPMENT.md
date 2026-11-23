# SBauAkte Entwicklungsstand

## 0.34.0 – Funktionsstand und offene Arbeiten

Implementiert:
- Menünamen Fotodokumentation, Qualitätsnachweise, Nachweisübersicht
- Gemeinsame Icon-Werkzeugleiste für Foto- und Bestandsplaneditor
- Direkter, offline erzeugter PDF-Fotobericht mit zwei Fotos je A4-Seite
- Direkter PDF-Export der aktuell geöffneten Bestandsplanseite einschließlich sichtbarer Markierungen
- Mobile Icon-Werkzeugleiste und beschriftete Desktop-Werkzeuge

Einschränkungen / nächste Schritte:
- Bestandsplan-PDF wird aus einer gerasterten Ansicht erzeugt, nicht als maßstabsgetreue Vektor-PDF. Nur aktuelle Seite.
- Bestehende Fotoannotationen sind rasterbasiert; einzelne frühere Striche lassen sich nicht nachträglich als Objekte auswählen.
- Konfigurierbare Nachweismatrix und Planversionsverwaltung noch nicht umgesetzt.
- Vollständiger npm-Build und Browser-/Mobiltests stehen aus (npm install Timeout in der Entwicklungsumgebung).
- Vor einem produktiven Einsatz Projekt-Backup anlegen und PDF-Ausgaben fachlich prüfen.

## Nächster Schwerpunkt
Abrechnung (LV, Aufmaß, Mengen, Nachträge) erst nach Stabilisierung und Abnahme von 0.34.

### Version 0.34.3
Gruppierte Bestandsänderungen mit mehreren Zeichenelementen. Vorhandene Datensätze bleiben erhalten. Vollständiger npm-Build war in dieser Umgebung wegen nicht verfügbarer Abhängigkeiten nicht verifizierbar.

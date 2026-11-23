# sbau.akte 0.38.4 – Planviewer

## Werkzeugleiste
- Eigene Zeile über der Plan-Fläche statt Overlay: Der obere Planrand (Plantitel) bleibt sichtbar, der Plan wird in die verbleibende Fläche eingepasst.
- Gruppen: **Markieren** · **Ansicht** (Pins verschieben, Transparenz, Pins an/aus, Kategorie) · **Zoom** (−, %, +, Einpassen, Vollbild).
- Responsiv über Container-Query (`viewer`): ≤ 1180 px Plan-Breite nur Icons (Tooltip + `aria-label`), darüber mit Beschriftung. Handy (≤ 650 px): zwei Zeilen (Markieren + Filter / Icon-Werkzeuge).
- Wirkungslose Zoom-Knöpfe in der oberen Leiste entfernt (steuerten nur einen ungenutzten `zoom`-State in `App`).

## Vollbild
- Beenden-Knopf in der Plan-Werkzeugleiste (bleibt im Vollbild sichtbar) und Escape. Vorher war der einzige Knopf von der Plan-Fläche verdeckt.

## Zoom per Mausrad/Trackpad
- Nativer, nicht-passiver `wheel`-Listener; Strg+Wheel/Trackpad-Pinch skaliert stufenlos.

## Barrierefreiheit und Touch
- `role="toolbar"`, `aria-pressed` bei Zustandsknöpfen, `aria-label` bei Icon-Knöpfen; Touch-Ziele ≥ 44 px.

## Prüfung
- Syntax aller Dateien ohne Diagnosen. Echte App in Chromium mit In-Memory-Datenbank-Attrappe, 1000/1500 px Desktop, iPad (820 px) und Handy (390 px): keine Überdeckung des Plans, Zoom (Knöpfe, Mausrad), Ziehen, Pins ein/aus, Markierungsmodus, Pin-Klick, Vollbild an/aus (Knopf und Escape), keine Konsolenfehler.

## Grenzen
- Vollbild-Layout nur in Chromium geprüft; Container-Queries benötigen Safari ≥ 16 (iPadOS ≥ 16). In älteren Browsern bleiben die Beschriftungen sichtbar und die Leiste bricht in mehrere Zeilen um.
- Nicht auf echtem iPad/iPhone getestet; PDF-Pläne wurden hier nicht gerendert (pdf.js war eine Attrappe, Demo-Pläne sind SVG/Bild).
- Zwei rasche Klicks an derselben Stelle gelten dem Browser als Doppelklick und zoomen den Plan (bestehendes Verhalten, jetzt nicht mehr durch Werkzeug-Knöpfe auslösbar).

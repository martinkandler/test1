# SBauAkte 0.36.1 – Planverwaltung und Markierungen

- Planmenü: nur Planverwaltung und Planviewer.
- Planauswahl im Viewer nach vier Planebenen gruppiert.
- Planimport als geführter Ablauf mit Ebene, Bauwerk, Bauteil und Datei.
- Plan löschen einschließlich Revisionen und Flächenmarkierungen (mit Bestätigung).
- Markierungen: Bauwerk oder Bauteil, Pin oder geschlossene Fläche. Doppelklick schließt die Fläche; Escape bricht ab.
- Vollständige Namen in der Auswahl; passende Menüicons; Programmübersicht auf der Startseite.
- Firmenlogo `sbau-logo.svg` in der oberen linken Leiste.

## Prüfstatus
Die Syntax wurde mit globalem TypeScript auf Parserfehler untersucht. Ein vollständiger Build ist **nicht** bestätigt, da `npm install` in dieser Umgebung am Zeitlimit scheiterte. Die ZIP-Datei ist deshalb ein Entwicklungsstand und muss vor dem produktiven Einsatz über GitHub Actions gebaut und im Browser getestet werden.

## Hinweise
Bestehende Markierungen bleiben bei Revisionen erhalten; eine automatische Geometrieanpassung an geänderte Planmaßstäbe findet nicht statt. Der Löschvorgang für Pläne entfernt die Planrevisionen und Flächen, lässt zugeordnete Bauteile selbst bestehen.

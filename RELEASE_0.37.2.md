# SBauAkte 0.37.2 – LV-Import-Hotfix

## Importformat
Excel `.xlsx` (erstes Tabellenblatt), CSV mit Semikolon, Komma oder Tab und GAEB DA XML `.x83` / `.x84` / `.xml` (Basisunterstützung).

Empfohlene Kopfzeile: `OZ;Typ;Kurztext;Einheit;Menge;Einheitspreis;Langtext;Vertragsart`.
Typ: `Titel`, `Untertitel`, `Position`; Vertragsart: `Vertrag` oder `Nachtrag`.
Bei fehlender Typ-Spalte erkennt die Anwendung Titel an leeren Mengen-/Preis- und Einheitsfeldern; dies ist eine Heuristik, die in der Vorschau zu prüfen ist.

## Funktionen
- Vorschau der ersten 100 Importzeilen, Anzahl Positionen/Titel, Warnungen und Bestätigung.
- Doppelte Ordnungszahlen werden nicht übernommen.
- Aufklappbare Titel und Untertitel, Titelsummen und Anzeige von Langtexten.
- Kumulative Abrechnung und Vertragssumme ohne Titelzeilen.
- Manuelles Hinzufügen von Titel-/Untertitelzeilen möglich.

## Grenzen
- GAEB DA XML ist ein best-effort Parser und keine vollständige GAEB-Zertifizierung. Unterschiedliche GAEB-Strukturen, insbesondere komplexe Text- und OZ-Kodierungen, können eine externe Konvertierung erfordern.
- Titelhierarchie setzt durch Punkte gegliederte OZ voraus (z. B. `01`, `01.02`, `01.02.0010`).
- Der vollständige Vite-/TypeScript-Build konnte hier mangels npm-Registry-Verbindung nicht durchgeführt werden. Syntaxprüfung der geänderten TS/TSX-Dateien wurde durchgeführt.

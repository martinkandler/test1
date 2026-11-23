> Entwicklungsstand 0.34.1: Bitte Hinweise und offene Tests in [DEVELOPMENT.md](DEVELOPMENT.md) beachten.

### Version 0.27.0
- Importvorschau mit überprüfbaren Dokumentarten und Bauteilvorschlägen.
- Mehrfachzuordnung bereits vor dem Speichern, einzelne Dateien aus Import entfernen.
- Konservative Kennungserkennung, keine automatischen Zuordnungen durch Teiltreffer.
- Nach Fehlern bleiben noch nicht gespeicherte Dateien in der Importwarteschlange.

# SBauAkte 0.14.2 – Build-Korrekturen

Die Version korrigiert den Dokumenten-State, die Dexie-Transaktion beim Import und den PDF.js-Worker. Die GitHub-Pages-Basis ist auf `/SBau-/` eingestellt.

**Hinweis:** Der Produktionsbuild konnte in der Bearbeitungsumgebung nicht ausgeführt werden, da die npm-Paketinstallation nicht abgeschlossen werden konnte. Bitte den GitHub-Actions-Build nach dem Hochladen prüfen.

# SBauAkte 0.14.1 – GitHub Pages Fix

## Veröffentlichung über GitHub Pages

1. Entpacke die ZIP-Datei. Lade **alle Dateien und Ordner inklusive `.github/workflows/deploy.yml`** in das Stammverzeichnis deines GitHub-Repositories hoch. (Bei GitHub Upload files werden versteckte Ordner möglicherweise nicht einfach ausgewählt; überprüfe, dass `.github/workflows/deploy.yml` wirklich vorhanden ist.)
2. Der Standardbranch muss `main` heißen. Bei anderem Branchnamen `branches: [main]` in `.github/workflows/deploy.yml` anpassen.
3. Unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen.
4. Unter **Actions** den Workflow `Build and deploy SBauAkte to GitHub Pages` prüfen. Er muss erfolgreich durchlaufen.
5. Website unter `https://BENUTZER.github.io/REPOSITORY/` aufrufen (oder der in Pages angezeigten Adresse). Bei einem Repository namens `BENUTZER.github.io` ist es die Root-Domain.

Wichtig: `index.html` ist eine Entwicklungsdatei und funktioniert nicht als direkt veröffentlichte HTML-Seite. GitHub Actions erzeugt und veröffentlicht `dist/`. Die relative Vite-Basis `./` berücksichtigt GitHub-Pages-Unterpfade.

## Lokal

```sh
npm install
npm run dev
```

Produktionsbuild: `npm run build`; anschließend `npm run preview`.

## Daten und Sicherheit

IndexedDB speichert Daten nur im jeweiligen Browser und unter derselben Website-Adresse. Ein Wechsel der Repository-Adresse, Browserdaten-Löschung oder privater Modus kann den Zugriff auf lokale Daten verhindern. Vor Änderungen an produktiven Daten unbedingt Sicherungen anlegen.

## Status

Dieser Patch korrigiert die Veröffentlichungs-Konfiguration, ersetzt aber keine vollständigen Funktionstests auf iPad und Windows.

## Version 0.15 – Bestandsplanung
Im Projektmenü **Bereiche → Bestandsplanung** öffnen. Zuerst einen Übersichtsplan im Bereich **Übersichtspläne** importieren. Im Bestandsplan ein Werkzeug auswählen und auf dem Plan zeichnen. Nach dem Loslassen Bezeichnung, Datum, Bauteil, Kategorien und Status erfassen und speichern. Die Änderungen werden lokal in IndexedDB abgelegt. Die Kategorieauswahl filtert Liste und Zeichnungen gemeinsam. Der CSV-Export gibt die Änderungsliste des gewählten Plans aus. Die Projektsicherung enthält nun auch die Bestandsänderungen.

**GitHub Pages:** Bestehenden Repository-Inhalt durch die Dateien dieses Pakets aktualisieren, `.github/workflows/deploy.yml` beibehalten, anschließend GitHub Actions prüfen. Die Vite-Base ist weiterhin auf `/SBau-/` eingestellt und muss bei abweichendem Repository-Namen angepasst werden.

**Hinweis:** Ein erfolgreicher GitHub-Actions-Build ist vor der Nutzung erforderlich. Diese Fassung wurde hier nicht vollständig gebaut oder auf iPad getestet. Vor Updates eine Projektsicherung anlegen.


## Version 0.16 – Bestandsplanung
Im Bereich Bestandsplanung sind jetzt Navigation, Auswahl/Verschieben, Text, Rückgängig/Wiederholen und eine Browser-Druckansicht enthalten. Für PDF: **Plan drucken / PDF** auswählen und im Druckdialog **Als PDF sichern**. Dies ist noch kein maßstabsgetreuer Export. Originalpläne werden nicht verändert.

**Achtung:** Neue Funktionen wurden noch nicht vollständig gebaut und auf iPad getestet. Bitte vor Verwendung eine Sicherung anlegen.


### Version 0.24.0
Automatische Nachweiserkennung anhand von Bauteilzuordnung und Dokumentart. In der Dokumentationsübersicht kann zwischen automatischer und manueller Auswertung gewechselt werden. Die Erkennung ist keine fachliche Prüfung.


### Version 0.26.0
Dokumente können in der Dokumentenverwaltung über **Bearbeiten** mehreren Bauteilen zugeordnet werden. Eine Datei wird nur einmal gespeichert. Die automatische Nachweiserkennung berücksichtigt alle zugeordneten Bauteile.

## Hinweise zu 0.33.0

**Fotobericht:** In der Fotodokumentation Fotos auswählen (ohne Auswahl werden die aktuell gefilterten Fotos verwendet), anschließend „Fotobericht (2 je Seite)“ anklicken. Die erzeugte HTML-Datei lokal im Browser öffnen und über **Drucken → Als PDF sichern** exportieren. Das Bildmaterial bleibt auf dem Gerät. Der Bericht kann bei vielen Fotos sehr groß werden.

**Bestandsplan:** „Plan als PNG“ exportiert die aktuelle Seite inklusive sichtbarer Markierungen. „Änderungen sichern (JSON)“ exportiert Metadaten und Vektor-Koordinaten für spätere Nachbearbeitung. Diese JSON-Sicherung ist noch kein Importformat. Der Druckdialog ist weiterhin für PDF-Ausgaben verfügbar.

**Datenschutz und Datensicherung:** Fotos und Dokumente liegen lokal in IndexedDB. Browserdaten nicht ohne vorherigen Projektexport löschen. Vor jeder Aktualisierung ein Backup erstellen. Neue Funktionen zunächst mit einem Testprojekt ausprobieren.

**Build-Status:** Die TypeScript-Syntax wurde geprüft, aber ein vollständiger `npm run build` konnte ohne verfügbare npm-Pakete nicht ausgeführt werden. GitHub Actions muss den Produktions-Build bestätigen.

### PDF-Kopfzeilen (0.35.3)
Die aktiven PDF-Exporte nutzen `public/sbau-logo.svg` als Firmenlogo. Jede A4-Seite zeigt Dokumententitel, Erstellungsdatum und Seitenzahl. `public/icon.svg` bleibt das Anwendungssymbol.


## Projekt-Dashboard (0.38.3)
Beim Öffnen eines Projekts erscheint zuerst das Dashboard mit Dokumentationsstand, offenen Punkten, Abrechnungsüberblick und den zuletzt hinzugefügten Fotos und Dokumenten. Von dort führen Kacheln und Listeneinträge direkt in die Arbeitsbereiche; das Menü „Bereiche“ ist nach Planen, Dokumentieren, Abrechnen und Projekt gegliedert.

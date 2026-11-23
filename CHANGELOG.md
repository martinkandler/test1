## 0.38.4 – Planviewer
- Die Werkzeugleiste des Planviewers ist keine schwebende Overlay-Leiste mehr, sondern eine eigene Zeile über der Plan-Fläche. Sie verdeckt den oberen Planrand nicht mehr (vorher 87 px und mehr bei 1000 px Breite, jetzt einzeilig mit 51 px); der Plan wird in die verbleibende Fläche eingepasst.
- Die Leiste ist in drei Gruppen gegliedert: Markieren, Ansicht (Pins verschieben, Transparenz, Pins an/aus, Kategorie), Zoom (−, %, +, Einpassen, Vollbild). Bei schmaler Plan-Fläche zeigt sie nur Icons mit Tooltip und `aria-label` (Container-Query), bei breiter Fläche Icons mit Beschriftung. Auf dem Handy: zwei Zeilen.
- Entfernt: die Zoom-Knöpfe in der oberen Leiste. Sie veränderten nur ihren eigenen Prozentwert, nicht den Plan.
- Behoben: Im Vollbild lag der Plan über der oberen Leiste und damit über dem einzigen Knopf zum Beenden. Der Vollbild-Knopf sitzt jetzt in der Plan-Werkzeugleiste, Escape beendet das Vollbild ebenfalls.
- Behoben: Mausrad- und Trackpad-Zoom nutzen jetzt einen nicht-passiven Listener (Konsolenfehler „Unable to preventDefault inside passive event listener“); Trackpad-Pinch zoomt fein statt in festen Schritten und lässt nicht mehr die ganze Seite zoomen.
- Zustandsknöpfe (Pins verschieben, Transparenz, Pins an/aus, Vollbild) melden `aria-pressed`; die Leiste hat `role="toolbar"`.
- Touch: Auswahlfelder und Knöpfe in der Plan-Leiste sind auf Tablet/Handy mindestens 44 px hoch.

## 0.38.3 – Projekt-Dashboard, Startseite, Bauteil-Details
- Neu: **Projekt-Dashboard** (`src/Dashboard.tsx`). Beim Öffnen eines Projekts landet man jetzt dort statt im Planviewer. Es zeigt Projektkopf mit Bauzeit-Balken, Kennzahl-Kacheln (Bauwerke, Bauteile, Pläne, Fotos, Dokumente) als Sprungziele, den Dokumentationsstand je Nachweisart, „Braucht Aufmerksamkeit“ (fehlende Bauwerke/Pläne, größte Nachweislücken, nicht zugeordnete Fotos/Dokumente, Abrechnungszettel im Entwurf), Abrechnung (Vertragssumme, letzte Abschlagsrechnung, abgerechneter Anteil) und die zuletzt hinzugefügten Fotos und Dokumente.
- Dashboard ist der erste Eintrag im Menü „Bereiche“; Zurück vom Dashboard führt zur Projektliste.
- Startseite: Der Demo-Block klappt zu einer schmalen Zeile ein, sobald echte Projekte existieren („Musterprojekt & Tour“ öffnet ihn wieder).
- Bauteil-Details: eine Hauptaktion („Bearbeiten“); „Bauteil löschen“ ist abgesetzt. Die doppelten Sprünge zu Fotos, Dokumenten und Plan entfallen, sie bleiben im Bauteil-Dossier.
- Einführungstour: startet im Dashboard, neuer Schritt „Projekt-Dashboard“.
- Behoben (helles Design): „Zeichenfarbe“ in der Bestandsplanung sowie Sammelaktionen und Auswahlfeld in der Dokumentenverwaltung hatten dunkle Schrift auf dunklem Grund (Variable `--panel` war nie definiert).
- Aufgeräumt: toter Platzhalter-Zweig „noch nicht implementiert“ und ungenutzter Import entfernt.

## 0.38.2 – Navigation und Lesbarkeit
- Kopfmenü: „Pläne“ ist in „Bereiche“ aufgegangen. Die Bereiche sind nach Planen, Dokumentieren, Abrechnen und Projekt gegliedert; der Menüknopf zeigt den aktuellen Bereich, der Eintrag ist markiert.
- Menüs schließen per Klick daneben und mit Escape (Fokus kehrt zum Menüknopf zurück); Menüknöpfe melden `aria-expanded`.
- Fehler behoben: Das Bauteil-Panel im Planviewer öffnete gleichzeitig das Bereichsmenü.
- Lesbarkeit: Schriften unter 12 px auf 12 px angehoben (Pin- und Flächenbeschriftungen im Plan bleiben bewusst klein). Status-, Hinweis- und Linkfarben haben im hellen Design mindestens 4,5:1 Kontrast; im dunklen Design bleiben sie hell.
- Plan-Pins: Textfarbe (weiß oder dunkel) richtet sich nach der Kategoriefarbe.
- Dunkles Design: Pin-Zähler im Planviewer war unlesbar (Variable `--text` fehlte), rote „Löschen“-Texte und Versionsanzeige sind jetzt besser lesbar.
- Fotodokumentation: Keine leeren `src`-Attribute mehr, bevor die Bild-URLs bereitstehen.
- Einführungstour: Text zur Projektnavigation angepasst.

## 0.38.1 – Größere Touch-Ziele und einheitliche Dialoge
- Auf Tablet und Handy sind Schaltflächen, Auswahlfelder und Eingabefelder mindestens 44 px hoch; Plan-Pins und Eckpunkte behalten ihr Aussehen, bekommen aber eine größere Treffer­fläche.
- Neue Datei `src/dialogs.tsx`: eigener Bestätigungsdialog statt `confirm()` (Löschen: Fokus auf „Abbrechen“, Escape bricht ab, Tastatur-Fokusfalle) und kurze Meldungen statt `alert()`.
- Alle 20 Rückfragen und 3 Hinweise der App umgestellt; Beschriftung der Bestätigen-Schaltfläche nennt die Aktion („Löschen“, „Speichern“, „Wiederherstellen“).
- Fehler behoben: Das Entfernen eines Bauwerks-Pins im Plan fragte doppelt nach.
- Sichtbarer Tastaturfokus für alle Bedienelemente.
- Versionsanzeige im Kopfbereich korrigiert (zeigte 0.37.3).

## 0.36.2
- Zentraler Markierungsdialog, Pin-/Flächenbearbeitung und neue Startseite. Siehe RELEASE_0.36.2.md.

## 0.35.3 – Einheitliche Firmenkopfzeilen
- Alle aktiven PDF-Exporte (Fotodokumentation, Bestandsplanung, Abrechnung) verwenden das offizielle `public/sbau-logo.svg` statt `icon.svg`.
- Das breite Logo wird proportional in die Kopfzeile eingepasst; Titel, Erstellungsdatum und „Seite X von Y“ erscheinen auf jeder PDF-Seite.
- Die gemeinsame PDF-Vorlage wurde vereinheitlicht; `icon.svg` bleibt unverändert als Anwendungssymbol.

## 0.35.2 – Einheitliches PDF-/Drucklayout
- Einheitliche A4-Kopfzeile mit `public/icon.svg`, Dokumententitel, Datum und Seitenzahl auf allen generierten PDF-Seiten.
- Fotodokumentation, Bestandsplan und Abrechnungsübersicht verwenden dieselbe Vorlage.
- Abrechnungsübersicht auf mehrere A4-Seiten verteilt.
- Bestandsplan-Druck über identisches Druck-PDF statt abweichender Popup-Druckansicht.

## 0.35.1 – Zeichenwerkzeuge und Programmübersicht
- Strichstärke für Bestandsplan- und Fotoeditor (1–16 px); Bestandsplan-Markierungen speichern ihre Strichstärke.
- Rückgängig/Wiederholen als Office-Icons in beiden Editoren; Fotoeditor mit Bildzustands-Historie.
- Kompakte Funktionsübersicht unter Einstellungen einschließlich der Änderungen von 0.35.0 und 0.35.1.
- Vite-ImportMeta-Typen durch `src/vite-env.d.ts` ergänzt.

## 0.34.2 - Fotoeditor-Laufzeitfix
- Zeigerposition vor asynchroner React-State-Aktualisierung ermitteln, damit `currentTarget` nicht null ist.
- Generische EditorTools-Typisierung und explizite LucideIcon-Zuordnung beibehalten.
- GitHub Pages Workflow unveraendert.

## 0.34.1 – TypeScript-Hotfix
- Gemeinsame Editor-Icons als `Record<EditorTool, LucideIcon>` typisiert, um den JSX-Prop-Typkonflikt in `EditorTools.tsx` zu vermeiden.
- `deploy.yml` unverändert.
- Build noch nicht verifiziert: `npm install` hat in der Ausführungsumgebung das Zeitlimit überschritten.

## 0.33.3 – Build-Hotfix
- Null-sichere Bauteildetailansicht: selectedPart statt nullable focused.
- GitHub Actions: npm install beibehalten, da kein package-lock.json vorhanden ist.
- Keine Datenbankmigration und keine Funktionsänderungen.

## 0.27.0 – Kontrollierter Dokumentenimport
- Vorschau vor dem Speichern mit Dateigröße und vorgeschlagener Dokumentart.
- Vorschläge zur Bauteilzuordnung anhand vollständiger Kennungen im Dateinamen; manuell korrigierbar.
- Mehrfachzuordnung beim Import, Suche und Entfernung einzelner Dateien.
- Bei Teilfehlern bleiben nicht importierte Dateien zur erneuten Bearbeitung erhalten.

## 0.26.0 – Dokumentenverwaltung und Stapelbearbeitung
- Dokumente mehrfach auswählen, auch über gefilterte Ansichten hinweg.
- Dokumentart und Bauteilzuordnung in einem Schritt für mehrere Dokumente ändern.
- Zuordnung hinzufügen, entfernen oder vollständig ersetzen.
- Mehrere Dokumente nach Sicherheitsabfrage löschen.
- Sortierung, Filter für nicht zugeordnete Dokumente und Trefferzähler.
- Dokumentart-Vorschlag anhand des Dateinamens (muss geprüft werden).

## 0.26.0 – Mehrfachzuordnung von Dokumenten

- Dokumente können mehreren Bauteilen zugeordnet werden; Checkbox-Auswahl im Bearbeitungsdialog.
- Kompatibilität mit vorhandenen Einzelzuordnungen durch Datenbankmigration auf Schema 6.
- Bauteilakte, automatische Nachweiserkennung, Dokumentenfilter und Zähler berücksichtigen Mehrfachzuordnungen.
- Projekt-Export/Import auf Format 0.26 erweitert, ältere Formate bleiben zulässig.
- Projektweite Dokumente ohne Bauteilzuordnung bleiben erhalten.

## 0.23.0 – Projektweite Dokumentationsübersicht
- Ampelstatus und Fortschritt je Bauteil
- Kennzahlen für vollständige, teilweise und nicht bestätigte Bauteile
- Filter nach Kategorie, Status, fehlendem Nachweis und Suchbegriff
- Direkter Sprung in die Bauteilakte
- CSV-Export der gefilterten Übersicht
- Weiterhin manuelle Nachweisbestätigung; keine automatische Dokumentenprüfung

## 0.22.0 – Dokumentationsstatus
- Manuelle Nachweis-Checkliste je Bauteil mit Fortschrittsanzeige.
- Persistente Speicherung in IndexedDB (Dexie Schema v5).
- Projekt-Export und -Import einschließlich Nachweisstatus.
- Versionsanzeige aktualisiert.

## 0.20.0 – Fotodokumentation
- Filter nach Kategorie und Aufnahmedatum (von/bis)
- Sortierung nach Datum oder Dateiname
- Anzeige ausschließlich annotierter Fotos
- Filter zurücksetzen und Ergebniszähler
- Download der unveränderten Originaldatei aus den Fotodetails
- Responsive Filterleiste mit Dark-Mode-kompatiblen Eingabefeldern

## 0.19.0
- Bauteilliste alphabetisch sortiert, scrollbar und mit Trefferzähler.
- Vorheriges/nächstes Bauteil direkt in der Detailansicht.
- Fotovorschau mit bis zu sechs zugeordneten Fotos; Klick öffnet Original/Annotation.
- Responsive Layout für Mobilgeräte.
- Exportformat 0.19; Import älterer Versionen bleibt möglich.

## 0.18.0
- Planansicht: Bauteilmarkierungen ein-/ausblenden und nach Kategorie filtern.
- Anzahl der sichtbaren Bauteile pro PDF-Seite anzeigen.
- Bauteilsuche direkt im ausklappbaren Plan-Bauteilmenü.
- Escape beendet den Markierungsmodus; kompaktere mobile Werkzeugleiste.

## 0.17.0 – UI- und Dark-Mode-Verbesserungen
- Einheitliche Farbvariablen für dunkle und helle Darstellung, insbesondere Bauteilliste und Bearbeitungsdialoge.
- Bessere Lesbarkeit und Tastatur-Fokusmarkierungen.
- Optimierte mobile Bauteilansicht und Dialoge.
- Leerer Suchzustand bei Bauteilfiltern.
- Versionsanzeige und Projektexportformat aktualisiert; ältere Exporte bleiben importierbar.

# Änderungsprotokoll

## 0.16.0 (Entwicklung)
- Bestandsplanung: Navigation, Auswahl und Verschieben von Zeichnungen
- Rückgängig und Wiederholen für Änderungen innerhalb der laufenden Sitzung
- Textanmerkungen als eigenständige Bestandsänderungen
- Druckansicht des aktuellen Plans mit sichtbaren Annotationen (Browser: als PDF speichern)
- Originalpläne bleiben unverändert

### Bekannte Einschränkungen
- Browser-Druck ist noch kein maßstabsgetreuer PDF-Export mit originalem PDF-Seitenformat.
- Keine vollwertige Zwei-Finger-Gestensteuerung im Zeichenmodus; für Pan Navigation wählen.
- Rückgängig-Verlauf wird nach Neuladen nicht beibehalten.
- Build und iPad-Praxistest sind nicht verifiziert.

## 0.21.0 – Zentrale Bauteilakte
- Bauteildetailansicht mit zusammengeführter Foto-, Dokumenten- und Bestandsänderungsübersicht.
- Registerkarten, Zähler, Fotogalerie, Dokumentendownload und Schnellnavigation.
- Projekt-Exportformat 0.21; bisherige Formate bleiben importierbar.

## 0.24.0 – Automatische Nachweiserkennung
- Erkennt bauteilbezogene Fotos, Bestandsänderungen und Dokumente anhand der hinterlegten Dokumentart.
- Dokumentationsübersicht mit Umschaltung zwischen automatisch erkannten und manuell bestätigten Nachweisen.
- Bauteilakte zeigt pro Nachweisart den Erkennungsstatus, ohne manuelle Bestätigungen zu überschreiben.
- Projektweite Dokumente werden nicht ungeprüft einzelnen Bauteilen zugerechnet; keine inhaltliche Qualitätsprüfung.

## 0.28.0–0.33.0 – Fotodokumentation und Bestandsplanung (gebündelter Entwicklungsstand)

### 0.28 – Fotoverwaltung
- Auswahl einzelner oder aller gefilterten Fotos; Stapelzuordnung zu Bauteilen und Kategorien.
- Gemeinsames Löschen mit Sicherheitsabfrage; Ergebnis- und Fehlermeldungen.

### 0.29 – Fotoberichte
- Lokaler Fotobericht mit zwei Fotos pro A4-Seite, Datum, Bauteil, Beschreibung und Seitenzuordnung.
- Export als eigenständige HTML-Datei; PDF über Browser-Druckdialog (Drucken > Als PDF sichern).
- Vorhandene transparente Annotationen können über dem Original dargestellt werden.

### 0.30 – Fotoeditor
- Erweiterung um Linie, Rechteck, Pfeil und Text zusätzlich zur Freihandzeichnung.
- Originalbilder bleiben unverändert, Annotationen werden separat gespeichert.

### 0.31 – Bestandsplan-Export
- PNG-Export der aktuell angezeigten Planseite einschließlich Markierungen.
- Export der Änderungen als JSON mit Plan-, Revisions- und Projektbezug.
- Browser-Druck/PDF bleibt als ergänzender Weg erhalten.

### 0.32 – Bedienung
- Kompaktere Stapelaktionen, mobile Schaltflächen und scrollbare Werkzeugleiste.
- Escape beendet das Zeichnen beziehungsweise schließt die Eingabemaske.

### 0.33 – Konsolidierung
- Versionierung vereinheitlicht, TypeScript-Transpilation aller Quelldateien ohne Syntaxfehler geprüft.
- Einschränkungen: kein nativer Vektor-PDF-Export, kein automatischer Abgleich von Planrevisionen, keine automatische Bild-/PDF-Inhaltsanalyse. Vollständiger Vite-Produktions-Build mangels installierbarer npm-Abhängigkeiten nicht verifiziert.

## 0.33.1 – GitHub Pages Hotfix
- GitHub-Pages-Basispfad aus `GITHUB_REPOSITORY` statt festem Repositorynamen.
- PWA-Service-Worker vorübergehend deaktiviert, um veraltete Cache-Bundles zu vermeiden.
- Sichtbare Fehlermeldung bei JavaScript-Laufzeitfehlern statt leerer Seite.

## 0.34.0 (Entwicklungsstand)
- Navigation: Fotodokumentation, Qualitätsnachweise und Nachweisübersicht vereinheitlicht.
- Gemeinsame Icon-Werkzeugleiste für beide Editoren.
- PDF-Fotobericht direkt aus dem Browser (zwei Fotos je A4-Seite).
- PDF-Export der aktuellen Bestandsplanseite mit sichtbaren Markierungen.
- Technische Grenzen und offene Prüfungen in DEVELOPMENT.md dokumentiert.

## 0.34.3 – Gruppierte Bestandsänderungen
- Eine Bestandsänderung kann mehrere Zeichenelemente enthalten (groupId).
- Neue Änderung anlegen, bestehende aktivieren und weitere Elemente zuordnen.
- Vorhandene Einzeländerungen lassen sich mit der aktiven Änderung zusammenführen.
- Bearbeitung der Stammdaten wirkt auf alle Gruppenelemente; Löschen entfernt die gesamte Gruppe.
- CSV-Export und Seitenliste führen jede Änderung nur einmal auf.
- Alte Datensätze bleiben ohne Datenbankmigration als Einzelgruppen nutzbar.

## 0.35.0
- Neuer Bereich Abrechnung & Aufmaß mit LV, Aufmaßen und kumulativen Abrechnungsständen.
- CSV-/XLSX-LV-Import und PDF-/CSV-Abrechnungsübersicht.
- Firmenlogo als SVG und Farbwahl für neue Bestandsplanmarkierungen.
- Projektexport und -import um Abrechnungsdaten erweitert.

## 0.36.0 (Entwicklungsstand)
- Bauwerke und Bauteile als eigenständige Projektstruktur; Planhierarchie und Revisionsverwaltung.
- Polygonflächen, Pinformen, Transparenz, Pinverschiebung, Dokumentenarten und Gesamt-PDF-Export.
- Datenbankschema 8 und erweitertes Projektsicherungsformat.
- Noch keine vollständige Buildfreigabe.

## 0.37.0 – Interaktive Einführung und fiktives Musterprojekt
- Startseite: Einführungstour starten, Musterprojekt frei erkunden, Demo zurücksetzen.
- Automatische lokale Bereitstellung eines fiktiven Ingenieurbauprojekts mit 4 Bauwerken, 18 Bauteilen, 12 schematischen SVG-Plänen, 24 synthetischen Baustellenillustrationen, 12 Beispielnachweisen, 30 LV-Positionen, 20 Musteraufmaßen und 2 Abschlagsständen.
- Kontextbezogene, fortsetzbare Einführung mit 19 Schritten, Hervorhebung von UI-Bereichen und Zurück-/Weiter-Steuerung.
- Demo-Datensätze eindeutig gekennzeichnet und von normalen Projekt-IDs getrennt.
- Hinweis: Grafiken und Dokumente sind synthetische Muster und keine fachlich gültigen Planunterlagen oder echten Baustellenfotos.

## 0.37.2 – LV-Import und Titelhierarchie
- Importvorschau mit Warnungen und Bestätigung für Excel (.xlsx), CSV sowie grundlegende GAEB-DA-XML-Dateien (.x83/.x84/.xml).
- Spalten Typ, Langtext und Vertragsart; automatische Titelerkennung bei leeren Mengen-/Preisfeldern.
- Titel und Untertitel als aufklappbare Gliederung, inklusive Titelsummen.
- Titel werden nicht als abrechenbare LV-Positionen in Vertrags- und Abschlagssummen gerechnet.
- Nachtragspositionen werden als solche gekennzeichnet; bestehende Daten bleiben erhalten.
- Einschränkung: GAEB DA XML ist nur für unterstützte Strukturvarianten umgesetzt, keine vollständige GAEB-Konformität; Importvorschau sorgfältig prüfen.

## 0.37.3 – sbau.akte und mobile Navigation
- Umbenennung der sichtbaren Wortmarke, Systemthema und zweizeilige Mobilnavigation.

## 0.38.0 – LV und Abrechnungsvorbereitung
- LV-Hauptvertrag und Nachträge getrennt, schreibgeschützt, direkt aus RIBX81 importierbar.
- Fortlaufende, frei datierbare Abrechnungszettel als Zuarbeit des Bauleiters für iTWO.
- Positionsbezogene Einträge mit mehreren Bauteilen, Mengenhinweisen und verknüpften Nachweisen.
- PDF-/JSON-Übergabe, Status und kontrollierter LV-Ersatzimport.

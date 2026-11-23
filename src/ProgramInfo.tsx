import React from 'react';
import {Info,CheckCircle2,History} from 'lucide-react';
const modules=[
 ['Projekte und Navigation','Projekte anlegen, bearbeiten, auswählen und sichern; Bauwerksbereiche und Kategorien verwalten.'],
 ['Übersichtspläne','Pläne hinterlegen, zoomen, Bauteile markieren und direkt zu Bauteilakten wechseln.'],
 ['Bauteilakte','Bauteildaten, zugeordnete Fotos, Nachweise und Dokumentationsstatus zusammenführen.'],
 ['Fotodokumentation','Fotos importieren, filtern, zuordnen, farbig annotieren und als PDF-Fotobericht ausgeben.'],
 ['Bestandsplanung','Mehrere Zeichenelemente zu einer Bestandsänderung gruppieren, nachträglich bearbeiten, exportieren und farbig markieren.'],
 ['Qualitätsnachweise','Lieferscheine, Material- und Prüfunterlagen importieren, klassifizieren und Bauteilen zuordnen.'],
 ['Nachweisübersicht','Dokumentationsstand und fehlende Nachweise bauteilbezogen prüfen.'],
 ['Abrechnung und Aufmaß','LV-Positionen erfassen oder aus Excel/CSV importieren; rechnerische und grafische Aufmaße, Maßstabskalibrierung, kumulative Abschlagsstände und Exporte.'],
 ['Datensicherung','Projektdaten lokal im Browser speichern und über die Projekteinstellungen exportieren. Regelmäßig externe Sicherung anlegen.'],
];
export default function ProgramInfo(){return <section className="program-info" aria-label="Programmübersicht"><div className="program-info-heading"><Info size={21}/><div><h3>SBauAkte – Funktionen im Überblick</h3><p>Version 0.36.2 · Stand: November 2026</p></div></div><div className="program-info-update"><History size={19}/><div><strong>Neu in Version 0.36.2 – Markierungsworkflow und Startseite</strong><p>Geschlossene Flächen per Doppelklick, vereinfachte Markierung von Bauwerken und Bauteilen, geführtes Plan-Hinzufügen, Planlöschung, Planverwaltung und Planviewer als getrennte Ansichten, Firmenlogo links oben und übersichtlichere Navigation.</p><strong>Vorheriges großes Update: 0.35.0 – Abrechnung & Aufmaß</strong><p>Neuer Abrechnungsbereich mit LV-Import (Excel/CSV), rechnerischen und grafischen Aufmaßen, Kalibrierung und kumulativen Abschlagsabrechnungen. Ergänzt wurden die Zeichenfarbe in der Bestandsplanung und das SVG-Firmenlogo.</p></div></div><div className="program-info-grid">{modules.map(([name,description])=><article key={name}><CheckCircle2 size={17}/><div><strong>{name}</strong><p>{description}</p></div></article>)}</div><p className="program-info-note">Hinweis: SBauAkte ersetzt keine fachliche Prüfung von Aufmaßen, Nachweisen oder Abrechnungen. GAEB/REB und eine zentrale Mehrbenutzer-Synchronisierung sind derzeit nicht Bestandteil der Anwendung.</p></section>}

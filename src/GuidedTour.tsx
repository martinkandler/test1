import React,{useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,X} from 'lucide-react';
export type TourStep={title:string;description:string;area:string;selector?:string;task?:string};
export const TOUR_STEPS:TourStep[]=[
 {title:'Willkommen in SBauAkte',description:'Dieses Projekt ist vollständig fiktiv. Du kannst alle Funktionen gefahrlos ausprobieren. Deine echten Projekte bleiben unverändert.',area:'Dashboard',selector:'.topbar'},
  {title:'Projekt-Dashboard',description:'Beim Öffnen eines Projekts landest du hier: Dokumentationsstand, offene Punkte, Abrechnung und die zuletzt hinzugefügten Fotos und Dokumente. Mit den Kacheln und Listeneinträgen springst du direkt in den passenden Bereich.',area:'Dashboard',selector:'.dash'},
 {title:'Projektnavigation',description:'Über die obere Leiste wechselst du zwischen Projekten und Arbeitsbereichen. „Bereiche“ ist nach Planen, Dokumentieren und Abrechnen gegliedert und zeigt, wo du gerade bist. Der Zurück-Button führt zum vorherigen Arbeitsbereich.',area:'Dashboard',selector:'header'},
 {title:'Bauwerke',description:'Vier fiktive Bauwerke bilden die Struktur dieser Eisenbahnüberführung. Öffne ein Bauwerk, um seine Stammdaten zu prüfen.',area:'Bauwerke',selector:'.section'},
 {title:'Bauteile',description:'18 Bauteile sind Bauwerken zugeordnet. Kurzbezeichnungen erscheinen auf Markierungen, vollständige Namen in der Liste.',area:'Bauteile',selector:'.parts-layout'},
 {title:'Bauteil hinzufügen',description:'Hier kannst du neue Bauteile erstellen. Weise jedem Bauteil ein Bauwerk und eine Kategorie zu.',area:'Bauteile',selector:'.parts-heading .primary',task:'Übung: Öffne „Bauteil hinzufügen“ und schließe den Dialog danach ohne Speichern.'},
 {title:'Planverwaltung',description:'Die vier Planebenen sind Übersichts-, Bauwerks-, Bauteil- und Detailpläne. Prüfe Plantyp, Status und Revisionsstand.',area:'Planverwaltung',selector:'.section'},
 {title:'Planrevisionen',description:'Eine neue Revision ersetzt die aktuelle Planfassung, während die ältere Revision für die Nachvollziehbarkeit erhalten bleibt.',area:'Planverwaltung',selector:'.section'},
 {title:'Planviewer',description:'Hier lassen sich Pläne öffnen, verschieben und zoomen. Das Muster enthält schematische Zeichnungen auf allen vier Ebenen.',area:'Übersichtspläne',selector:'.workspace'},
 {title:'Bauwerksfläche',description:'Mit „Markierung hinzufügen“ wählst du ein Bauwerk und die Markierungsart Fläche. Einzelklicks setzen Eckpunkte; Doppelklick schließt die Fläche.',area:'Übersichtspläne',selector:'.workspace',task:'Übung: Wähle eine bestehende Bauwerksfläche und prüfe ihre Farbe.'},
 {title:'Bauteil-Pins',description:'Pins sind mit Kurzbezeichnungen versehen. Du kannst sie verschieben, bearbeiten oder vom Plan entfernen, ohne das Bauteil zu löschen.',area:'Übersichtspläne',selector:'.workspace'},
 {title:'Fotodokumentation',description:'Die Demo enthält 24 schematische Bildillustrationen mit Aufnahmedatum, Bauwerks- und Bauteilzuordnung. Erzeuge einen Fotobericht.',area:'Fotodokumentation',selector:'.workspace'},
 {title:'Qualitätsnachweise',description:'12 fiktive Unterlagen zeigen die Zuordnung von Prüfberichten, Lieferscheinen und Protokollen. Sie sind keine gültigen Nachweise.',area:'Qualitätsnachweise',selector:'.workspace'},
 {title:'Nachweisübersicht',description:'Hier erkennst du, welche Unterlagen je Bauteil vorhanden sind und wo Dokumentationslücken bestehen.',area:'Nachweisübersicht',selector:'.workspace'},
 {title:'Bestandsplanung',description:'Bestandsänderungen lassen sich grafisch auf dem Plan dokumentieren, gruppieren und später exportieren.',area:'Bestandsplanung',selector:'.workspace'},
 {title:'Leistungsverzeichnis',description:'Das Muster-LV enthält 30 Positionen mit fiktiven Mengen und Preisen. In eigenen Projekten kannst du Excel- oder CSV-Dateien importieren.',area:'Abrechnung',selector:'.workspace'},
 {title:'Aufmaß und Abschlagsrechnung',description:'20 Musteraufmaße und zwei kumulative Abschlagsstände zeigen den Abrechnungsablauf. Alle Beträge sind erfunden.',area:'Abrechnung',selector:'.workspace'},
 {title:'Gesamtdokumentation',description:'Erzeuge eine Bauteil-, Bauwerks- oder Projektdokumentation mit Deckblatt, Inhaltsverzeichnis, Fotos und Nachweisen.',area:'Gesamtdokumentation',selector:'.workspace'},
 {title:'Einstellungen und Datensicherung',description:'In Einstellungen verwaltest du Kategorien, Dokumentenarten und Darstellung. Erstelle regelmäßig eine externe Projektsicherung.',area:'Einstellungen',selector:'.workspace'},
 {title:'Einführung abgeschlossen',description:'Du kannst die Demo jetzt frei erkunden, die Tour erneut starten oder zur normalen Projektübersicht zurückkehren.',area:'Übersichtspläne',selector:'.workspace'}
];
const STORAGE='sbau-tour-037-step';
export default function GuidedTour({onArea,onExit}:{onArea:(area:string)=>void;onExit:()=>void}){
 const [step,setStep]=useState(()=>{const v=Number(localStorage.getItem(STORAGE)||'0');return Number.isInteger(v)&&v>=0&&v<TOUR_STEPS.length?v:0});
 const [position,setPosition]=useState<React.CSSProperties>({top:'20%',left:'50%',transform:'translateX(-50%)'});
 const current=TOUR_STEPS[step];
 useEffect(()=>{onArea(current.area);localStorage.setItem(STORAGE,String(step))},[step,current.area,onArea]);
 useEffect(()=>{
  const update=()=>{
   document.querySelectorAll('[data-tour-focus]').forEach(el=>el.removeAttribute('data-tour-focus'));
   const target=current.selector?document.querySelector(current.selector):null;
   const margin=16;
   const width=Math.min(370,window.innerWidth-2*margin);
   const height=Math.min(350,window.innerHeight-2*margin);
   if(!target){setPosition({top:margin,left:Math.max(margin,window.innerWidth-width-margin),transform:'none'});return}
   target.setAttribute('data-tour-focus','true');
   const r=target.getBoundingClientRect();
   // Large workspace panels must never be used as a popup's vertical anchor.
   // In particular, the Planverwaltung step used to put the popup behind its panel.
   const preferredTop=r.height>window.innerHeight*.45?margin:(r.bottom+height+margin<window.innerHeight?r.bottom+12:r.top-height-12);
   const top=Math.max(margin,Math.min(window.innerHeight-height-margin,preferredTop));
   const left=Math.max(margin,Math.min(window.innerWidth-width-margin,r.left));
   setPosition({top,left,transform:'none'});
  };
  const id=window.setTimeout(update,180);
  window.addEventListener('resize',update);
  return()=>{window.clearTimeout(id);window.removeEventListener('resize',update);document.querySelectorAll('[data-tour-focus]').forEach(el=>el.removeAttribute('data-tour-focus'))};
 },[step,current.selector,current.area]);
 return createPortal(<div className="tour-root" aria-live="polite"><div className="tour-shade"/><section className="tour-popover" role="dialog" aria-modal="false" aria-label="Interaktive Einführung" style={position}><div className="tour-top"><span><BookOpen size={17}/> Einführung · Schritt {step+1} von {TOUR_STEPS.length}</span><button title="Tour beenden" aria-label="Tour beenden" onClick={onExit}><X size={17}/></button></div><div className="tour-progress"><span style={{width:`${(step+1)/TOUR_STEPS.length*100}%`}}/></div><h3>{current.title}</h3><p>{current.description}</p>{current.task&&<p className="tour-task">{current.task}</p>}<div className="tour-controls"><button disabled={step===0} onClick={()=>setStep(i=>i-1)}><ArrowLeft size={16}/> Zurück</button>{step===TOUR_STEPS.length-1?<button className="primary" onClick={()=>{localStorage.removeItem(STORAGE);onExit()}}><CheckCircle2 size={16}/> Abschließen</button>:<button className="primary" onClick={()=>setStep(i=>i+1)}>Weiter <ArrowRight size={16}/></button>}</div><small>Du kannst jederzeit die Tour schließen und später fortsetzen.</small></section></div>,document.body);
}

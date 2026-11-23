import {documentMatchesPart} from './documentLinks';
import React,{useEffect,useState} from 'react';
import {db,type Part,type Photo,type ConstructionDocument,type AsBuiltChange,type Plan,type PartCheck} from './db';
import {detectEvidence} from './evidence';

type Props={part:Part;photos:Photo[];documents:ConstructionDocument[];plans:Plan[];onOpenPhotos:()=>void;onOpenDocuments:()=>void;onOpenPlan:()=>void};
export default function PartDossier({part,photos,documents,plans,onOpenPhotos,onOpenDocuments,onOpenPlan}:Props){
 const [tab,setTab]=useState<'status'|'photos'|'documents'|'changes'>('status');
 const [checks,setChecks]=useState<PartCheck[]>([]);
 const [saving,setSaving]=useState(false);
 const checklist=[['photos','Fotodokumentation'],['delivery','Lieferscheine'],['quality','Prüfzeugnisse / Qualitätsnachweise'],['materials','Leistungserklärungen / CE-Nachweise'],['asbuilt','Bestandsdokumentation'],['acceptance','Abnahme / Freigabe']] as const;
 useEffect(()=>{let active=true;db.partChecks.where('partId').equals(part.id).toArray().then(rows=>{if(active)setChecks(rows)});return()=>{active=false}},[part.id]);
 const toggle=async(key:string,done:boolean)=>{setSaving(true);try{const old=checks.find(c=>c.key===key);const item:PartCheck={id:old?.id||part.id+':'+key,projectId:part.projectId,partId:part.id,key,done,note:old?.note||'',updated:Date.now()};await db.partChecks.put(item);setChecks(rows=>[...rows.filter(c=>c.key!==key),item])}finally{setSaving(false)}};
 const completed=checklist.filter(([key])=>checks.some(c=>c.key===key&&c.done)).length;
 const percentage=Math.round(completed/checklist.length*100);
 const [changes,setChanges]=useState<AsBuiltChange[]>([]);
 const [urls,setUrls]=useState<Record<string,string>>({});
 const partPhotos=photos.filter(p=>p.partId===part.id).sort((a,b)=>b.created-a.created);
 const automatic=detectEvidence(part.id,photos,documents,changes);
 const partDocs=documents.filter(d=>documentMatchesPart(d,part.id)).sort((a,b)=>b.created-a.created);
 useEffect(()=>{let alive=true;db.asBuilt.where('partId').equals(part.id).toArray().then(data=>{if(alive)setChanges(data.sort((a,b)=>b.created-a.created))});return()=>{alive=false}},[part.id]);
 useEffect(()=>{const next:Record<string,string>={};for(const p of partPhotos)next[p.id]=URL.createObjectURL(p.annotation||p.original);for(const d of partDocs)next[d.id]=URL.createObjectURL(d.original);setUrls(next);return()=>Object.values(next).forEach(URL.revokeObjectURL)},[photos,documents,part.id]);
 return <section className="dossier"><div className="dossier-heading"><div><h3>Digitale Bauteilakte</h3><p>Alle zugeordneten Nachweise an einem Ort</p></div><button type="button" onClick={onOpenPlan}>Im Übersichtsplan</button></div>
 <div className="dossier-progress" aria-label={`Dokumentationsstand ${percentage} Prozent`}><div><strong>Dokumentationsstand: {percentage}%</strong><span>{completed} von {checklist.length} Nachweisen bestätigt</span></div><progress value={completed} max={checklist.length}/></div>
 <p className="dossier-status-hint">Automatisch erkannt: {automatic.size} von 6 Nachweisarten. Die Erkennung basiert auf Zuordnung und Dokumentart, nicht auf einer fachlichen Prüfung. Manuelle Häkchen bleiben unabhängig davon.</p><div className="dossier-stats"><span><strong>{partPhotos.length}</strong> Fotos</span><span><strong>{partDocs.length}</strong> Dokumente</span><span><strong>{changes.length}</strong> Bestandsänderungen</span></div>
 <div className="dossier-tabs" role="tablist" aria-label="Inhalt der Bauteilakte">{([['status','Status'],['photos','Fotos'],['documents','Dokumente'],['changes','Bestandsänderungen']] as const).map(([id,label])=><button type="button" role="tab" aria-selected={tab===id} className={tab===id?'active':''} key={id} onClick={()=>setTab(id)}>{label}</button>)}</div>
 {tab==='status'&&<div className="dossier-content"><p className="dossier-status-hint">Bestätige die vorhandenen Nachweise manuell. Die Häkchen sind eine Dokumentationshilfe und keine automatische Qualitäts- oder Vollständigkeitsprüfung.</p><div className="dossier-checklist">{checklist.map(([key,label])=><label key={key} className="dossier-check"><input type="checkbox" checked={!!checks.find(c=>c.key===key)?.done} disabled={saving} onChange={e=>toggle(key,e.target.checked)}/><span>{label} {automatic.has(key)?' · Datei erkannt':' · kein zugeordneter Nachweis erkannt'}</span></label>)}</div></div>}
 {tab==='photos'&&<div className="dossier-content">{partPhotos.length?<div className="dossier-photo-grid">{partPhotos.map(p=><a key={p.id} href={urls[p.id]} target="_blank" rel="noreferrer" title={p.name}><img src={urls[p.id]} alt={p.name||'Bauteilfoto'} loading="lazy"/><span>{p.name||'Foto'}{p.captured?' · '+p.captured:''}</span></a>)}</div>:<p className="dossier-empty">Noch keine Fotos zugeordnet.</p>}<button type="button" onClick={onOpenPhotos}>Fotodokumentation öffnen</button></div>}
 {tab==='documents'&&<div className="dossier-content">{partDocs.length?<div className="dossier-file-list">{partDocs.map(d=><a key={d.id} href={urls[d.id]} download={d.name||'Dokument'}><span><strong>{d.name}</strong><small>{d.kind||'Dokument'} · {new Date(d.created).toLocaleDateString('de-DE')}</small></span><span>Herunterladen ↓</span></a>)}</div>:<p className="dossier-empty">Noch keine Dokumente zugeordnet.</p>}<button type="button" onClick={onOpenDocuments}>Dokumentenverwaltung öffnen</button></div>}
 {tab==='changes'&&<div className="dossier-content">{changes.length?<div className="dossier-file-list">{changes.map(c=><div className="dossier-change" key={c.id}><strong>{c.number?c.number+' · ':''}{c.name||'Bestandsänderung'}</strong><small>{c.status||'Ohne Status'} · {c.date||new Date(c.created).toLocaleDateString('de-DE')} · {plans.find(p=>p.id===c.planId)?.name||'Plan nicht vorhanden'}</small><p>{c.description}</p></div>)}</div>:<p className="dossier-empty">Noch keine Bestandsänderungen mit diesem Bauteil verknüpft.</p>}</div>}
 </section>
}

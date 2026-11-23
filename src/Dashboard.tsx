import {useEffect,useMemo,useState,type ReactElement} from 'react';
import {AlertTriangle,Building2,Calculator,Camera,CheckCircle2,ChevronRight,FileCheck2,FileText,HardHat,Map,Pencil} from 'lucide-react';
import {db,type Project,type Part,type Building,type Plan,type Photo,type ConstructionDocument,type AsBuiltChange,type LVPosition,type BillingSnapshot,type AccountingSheet} from './db';
import {evidence,detectEvidence} from './evidence';

type Props={
  project:Project;
  parts:Part[];
  buildings:Building[];
  plans:Plan[];
  photos:Photo[];
  documents:ConstructionDocument[];
  onNavigate:(area:string)=>void;
  onEdit:()=>void;
};
type Extra={changes:AsBuiltChange[];positions:LVPosition[];snapshots:BillingSnapshot[];sheets:AccountingSheet[]};
type Attention={key:string;text:string;count?:number;area:string;tone:'todo'|'warn'};

const money=(v:number)=>v.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2});
const day=(ms:number)=>new Date(ms).toLocaleDateString('de-DE');
const isHeading=(p:LVPosition)=>p.rowType==='Titel'||p.rowType==='Untertitel';
const parseDay=(v:string)=>{const t=Date.parse(v);return Number.isFinite(t)?t:NaN};
const plural=(n:number,one:string,many:string)=>n===1?one:many;
const GAP_AREA:Record<string,string>={photos:'Fotodokumentation',asbuilt:'Bestandsplanung'};

/** Projekt-Dashboard: Überblick über Stand, offene Punkte, Abrechnung und letzte Änderungen. */
export default function Dashboard({project,parts,buildings,plans,photos,documents,onNavigate,onEdit}:Props){
  const [extra,setExtra]=useState<Extra|null>(null);

  useEffect(()=>{
    let alive=true;
    Promise.all([
      db.asBuilt.where('projectId').equals(project.id).toArray(),
      db.lvPositions.where('projectId').equals(project.id).toArray(),
      db.billingSnapshots.where('projectId').equals(project.id).toArray(),
      db.accountingSheets.where('projectId').equals(project.id).toArray()
    ]).then(([changes,positions,snapshots,sheets])=>{if(alive)setExtra({changes,positions,snapshots,sheets})});
    return()=>{alive=false};
  },[project.id]);

  const rows=useMemo(()=>parts.map(part=>({part,done:detectEvidence(part.id,photos,documents,extra?.changes||[])})),[parts,photos,documents,extra]);
  const total=evidence.length;
  const complete=rows.filter(r=>r.done.size===total).length;
  const started=rows.filter(r=>r.done.size>0&&r.done.size<total).length;
  const empty=rows.length-complete-started;
  const percent=rows.length?Math.round(rows.reduce((sum,r)=>sum+r.done.size,0)/(rows.length*total)*100):0;
  const coverage=useMemo(()=>evidence.map(([key,label])=>({key,label,count:rows.filter(r=>r.done.has(key)).length})),[rows]);

  const attention=useMemo<Attention[]>(()=>{
    const items:Attention[]=[];
    if(!buildings.length)items.push({key:'no-buildings',text:'Noch kein Bauwerk angelegt',area:'Bauwerke',tone:'todo'});
    if(buildings.length&&!parts.length)items.push({key:'no-parts',text:'Noch keine Bauteile angelegt',area:'Bauteile',tone:'todo'});
    if(!plans.length)items.push({key:'no-plans',text:'Noch kein Plan importiert',area:'Planverwaltung',tone:'todo'});
    if(rows.length&&empty)items.push({key:'no-evidence',text:plural(empty,'Bauteil ohne jeden Nachweis','Bauteile ohne jeden Nachweis'),count:empty,area:'Nachweisübersicht',tone:'warn'});
    // die drei größten Lücken je Nachweisart
    coverage.map(c=>({...c,missing:rows.length-c.count})).filter(c=>c.missing>0).sort((a,b)=>b.missing-a.missing).slice(0,3)
      .forEach(g=>items.push({key:'gap-'+g.key,text:g.label+': bei '+g.missing+' von '+rows.length+' '+plural(rows.length,'Bauteil','Bauteilen')+' noch offen',area:GAP_AREA[g.key]||'Qualitätsnachweise',tone:'warn'}));
    const looseDocs=documents.filter(d=>!d.partId&&!(d.partIds&&d.partIds.length)).length;
    if(looseDocs)items.push({key:'loose-docs',text:plural(looseDocs,'Dokument ohne Bauteilzuordnung','Dokumente ohne Bauteilzuordnung'),count:looseDocs,area:'Qualitätsnachweise',tone:'warn'});
    const loosePhotos=photos.filter(p=>!p.partId).length;
    if(loosePhotos)items.push({key:'loose-photos',text:plural(loosePhotos,'Foto ohne Bauteilzuordnung','Fotos ohne Bauteilzuordnung'),count:loosePhotos,area:'Fotodokumentation',tone:'warn'});
    const drafts=(extra?.sheets||[]).filter(s=>s.status==='Entwurf').length;
    if(drafts)items.push({key:'draft-sheets',text:plural(drafts,'Abrechnungszettel im Entwurf','Abrechnungszettel im Entwurf'),count:drafts,area:'Abrechnung',tone:'warn'});
    return items;
  },[buildings,parts,plans,rows,empty,coverage,documents,photos,extra]);

  const billing=useMemo(()=>{
    if(!extra||!extra.positions.length)return null;
    const contract=extra.positions.filter(p=>!isHeading(p)).reduce((s,p)=>s+p.contractQty*p.unitPrice,0);
    const last=(()=>{const sorted=extra.snapshots.slice().sort((a,b)=>a.number-b.number);return sorted[sorted.length-1]})();
    return {contract,count:extra.positions.filter(p=>!isHeading(p)).length,last,share:last&&contract?Math.min(100,Math.round(last.total/contract*100)):0};
  },[extra]);

  const recent=useMemo(()=>[
    ...photos.map(p=>({id:p.id,kind:'photo' as const,name:p.name,sub:p.captured?'Aufnahme '+new Date(p.captured).toLocaleDateString('de-DE'):'Foto',created:p.created})),
    ...documents.map(d=>({id:d.id,kind:'doc' as const,name:d.name,sub:d.kind||'Dokument',created:d.created}))
  ].sort((a,b)=>b.created-a.created).slice(0,6),[photos,documents]);

  const span=useMemo(()=>{
    const start=parseDay(project.start),end=parseDay(project.end);
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return null;
    const now=Date.now();
    const share=Math.max(0,Math.min(100,Math.round((now-start)/(end-start)*100)));
    const left=Math.ceil((end-now)/86400000);
    return {share,text:now<start?'Beginnt am '+day(start):left>=0?'Noch '+left+' '+plural(left,'Tag','Tage'):'Bauzeit seit '+Math.abs(left)+' '+plural(Math.abs(left),'Tag','Tagen')+' überschritten'};
  },[project.start,project.end]);

  const tiles:{area:string;icon:ReactElement;count:number;label:string}[]=[
    {area:'Bauwerke',icon:<Building2 size={20}/>,count:buildings.length,label:plural(buildings.length,'Bauwerk','Bauwerke')},
    {area:'Bauteile',icon:<HardHat size={20}/>,count:parts.length,label:plural(parts.length,'Bauteil','Bauteile')},
    {area:'Planverwaltung',icon:<Map size={20}/>,count:plans.length,label:plural(plans.length,'Plan','Pläne')},
    {area:'Fotodokumentation',icon:<Camera size={20}/>,count:photos.length,label:plural(photos.length,'Foto','Fotos')},
    {area:'Qualitätsnachweise',icon:<FileCheck2 size={20}/>,count:documents.length,label:plural(documents.length,'Dokument','Dokumente')}
  ];
  const meta=[project.client,project.location,project.costCenter&&'Kostenstelle '+project.costCenter,project.contract&&'Vertrag '+project.contract].filter(Boolean) as string[];

  return <div className="dash" aria-label="Projekt-Dashboard">
    <div className="dash-head">
      <div className="dash-title">
        <div className="eyebrow">PROJEKT-DASHBOARD</div>
        <h1>{project.name}</h1>
        {meta.length>0&&<div className="dash-meta">{meta.map(m=><span key={m}>{m}</span>)}</div>}
        {span&&<div className="dash-span"><div className="dash-bar" role="progressbar" aria-label="Verstrichene Bauzeit" aria-valuemin={0} aria-valuemax={100} aria-valuenow={span.share}><span style={{width:span.share+'%'}}/></div><small>{day(parseDay(project.start))} – {day(parseDay(project.end))} · {span.text}</small></div>}
      </div>
      <div className="dash-actions">
        <button type="button" onClick={onEdit}><Pencil size={16}/> Projekt bearbeiten</button>
        <button type="button" className="primary" onClick={()=>onNavigate('Übersichtspläne')}><Map size={16}/> Plan öffnen</button>
      </div>
    </div>

    <div className="dash-tiles">
      {tiles.map(t=><button type="button" key={t.area} className="dash-tile" onClick={()=>onNavigate(t.area)}><span className="dash-ico" aria-hidden="true">{t.icon}</span><strong>{t.count}</strong><span>{t.label}</span></button>)}
    </div>

    <div className="dash-grid">
      <section className="dash-card" aria-labelledby="dash-h-doc">
        <h2 id="dash-h-doc">Dokumentationsstand</h2>
        {rows.length?<>
          <div className="dash-percent"><strong>{percent}%</strong><span>Gesamtfortschritt über {rows.length} {plural(rows.length,'Bauteil','Bauteile')}</span></div>
          <div className="dash-bar" role="progressbar" aria-label="Gesamtfortschritt" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width:percent+'%'}}/></div>
          <div className="dash-counts"><span><b>{complete}</b> vollständig</span><span><b>{started}</b> teilweise</span><span><b>{empty}</b> ohne Nachweis</span></div>
          <ul className="dash-list">
            {coverage.map(c=><li key={c.key}><button type="button" className="dash-row" onClick={()=>onNavigate('Nachweisübersicht')}>
              <span className="dash-row-label">{c.label}</span>
              <span className="dash-bar small" aria-hidden="true"><span style={{width:Math.round(c.count/rows.length*100)+'%'}}/></span>
              <span className="dash-row-count">{c.count}/{rows.length}</span>
            </button></li>)}
          </ul>
        </>:<p className="dash-empty">Sobald Bauteile angelegt sind, erscheint hier der Dokumentationsstand.</p>}
      </section>

      <section className="dash-card" aria-labelledby="dash-h-att">
        <h2 id="dash-h-att">Braucht Aufmerksamkeit</h2>
        {attention.length?<ul className="dash-list">
          {attention.map(a=><li key={a.key}><button type="button" className="dash-row dash-att" onClick={()=>onNavigate(a.area)}>
            <span className={'dash-att-icon '+a.tone} aria-hidden="true">{a.tone==='warn'?<AlertTriangle size={17}/>:<FileText size={17}/>}</span>
            <span className="dash-row-label">{a.count!==undefined&&<b>{a.count} </b>}{a.text}</span>
            <ChevronRight size={16} aria-hidden="true"/>
          </button></li>)}
        </ul>:<p className="dash-ok"><CheckCircle2 size={20} aria-hidden="true"/> Keine offenen Punkte. Alle Nachweise sind vollständig und zugeordnet.</p>}
      </section>

      <section className="dash-card" aria-labelledby="dash-h-bill">
        <h2 id="dash-h-bill">Abrechnung</h2>
        {billing?<>
          <dl className="dash-facts">
            <div><dt>Vertragssumme netto</dt><dd>{money(billing.contract)} €</dd></div>
            <div><dt>LV-Positionen</dt><dd>{billing.count}</dd></div>
            {billing.last&&<div><dt>Letzte Abschlagsrechnung</dt><dd>Nr. {billing.last.number} vom {day(billing.last.created)}</dd></div>}
            {billing.last&&<div><dt>Abgerechnet (kumuliert)</dt><dd>{money(billing.last.total)} € ({billing.share} %)</dd></div>}
          </dl>
          {billing.last&&<div className="dash-bar" role="progressbar" aria-label="Abgerechneter Anteil der Vertragssumme" aria-valuemin={0} aria-valuemax={100} aria-valuenow={billing.share}><span style={{width:billing.share+'%'}}/></div>}
          <button type="button" className="dash-link" onClick={()=>onNavigate('Abrechnung')}><Calculator size={16}/> Zur Abrechnung</button>
        </>:<>
          <p className="dash-empty">{extra?'Noch kein Leistungsverzeichnis importiert.':'Wird geladen …'}</p>
          {extra&&<button type="button" className="dash-link" onClick={()=>onNavigate('Leistungsverzeichnis')}><Calculator size={16}/> Zum Leistungsverzeichnis</button>}
        </>}
      </section>

      <section className="dash-card" aria-labelledby="dash-h-recent">
        <h2 id="dash-h-recent">Zuletzt hinzugefügt</h2>
        {recent.length?<ul className="dash-list">
          {recent.map(r=><li key={r.kind+r.id}><button type="button" className="dash-row dash-att" onClick={()=>onNavigate(r.kind==='photo'?'Fotodokumentation':'Qualitätsnachweise')}>
            <span className="dash-att-icon info" aria-hidden="true">{r.kind==='photo'?<Camera size={17}/>:<FileCheck2 size={17}/>}</span>
            <span className="dash-row-label"><span className="dash-recent-name">{r.name}</span><small>{r.sub} · hinzugefügt am {day(r.created)}</small></span>
            <ChevronRight size={16} aria-hidden="true"/>
          </button></li>)}
        </ul>:<p className="dash-empty">Noch keine Fotos oder Dokumente.</p>}
      </section>
    </div>
  </div>;
}

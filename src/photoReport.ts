import type {Photo,Part,Project} from './db';

const escapeHtml=(value:unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const dataUrl=async(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob)});
/** Printable, self-contained photo report. Images stay local and never leave the browser. */
export async function createPhotoReport(photos:Photo[],parts:Part[],project?:Project,includeAnnotations=true){
 if(!photos.length)throw new Error('Keine Fotos für den Bericht ausgewählt.');
 const sections:string[]=[];
 for(let i=0;i<photos.length;i+=2){
  const cards=await Promise.all(photos.slice(i,i+2).map(async ph=>{
   const original=await dataUrl(ph.original);
   const annotation=includeAnnotations&&ph.annotation?await dataUrl(ph.annotation):'';
   const part=parts.find(p=>p.id===ph.partId);
   return `<article><div class="photo"><img src="${original}" alt="Foto"/>${annotation?`<img class="overlay" src="${annotation}" alt="Annotation"/>`:''}</div><div class="meta"><strong>${escapeHtml(ph.name)}</strong><span>${escapeHtml(ph.captured)} · ${escapeHtml(part?.name||'Ohne Bauteil')}</span><p>${escapeHtml(ph.description)}</p></div></article>`;
  }));
  sections.push(`<section class="sheet"><header><strong>${escapeHtml(project?.name||'SBauAkte · Fotodokumentation')}</strong><span>${escapeHtml(project?.contract||'')} · ${i+1}–${Math.min(i+2,photos.length)} / ${photos.length}</span></header>${cards.join('')}<footer>SBauAkte · Fotobericht · ${escapeHtml(new Date().toLocaleDateString('de-DE'))}</footer></section>`);
 }
 const html=`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Fotodokumentation – ${escapeHtml(project?.name||'SBauAkte')}</title><style>@page{size:A4 portrait;margin:10mm}*{box-sizing:border-box}body{font:12px Arial,sans-serif;color:#172235;margin:0;background:#eee}.sheet{background:#fff;width:190mm;min-height:277mm;margin:10mm auto;padding:7mm;display:flex;flex-direction:column;gap:5mm;break-after:page}header,footer{display:flex;justify-content:space-between;gap:10mm;border-bottom:1px solid #aeb8c5;padding-bottom:3mm}footer{border:0;border-top:1px solid #aeb8c5;margin-top:auto;padding-top:3mm;color:#64748b}article{height:116mm;display:flex;flex-direction:column;break-inside:avoid}.photo{position:relative;height:95mm;display:flex;justify-content:center;align-items:center;background:#f2f4f7;overflow:hidden}.photo img{width:100%;height:100%;object-fit:contain}.photo img.overlay{position:absolute;inset:0}.meta{display:flex;flex-direction:column;gap:2mm;padding-top:2mm}.meta span{color:#536174}.meta p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}@media print{body{background:white}.sheet{margin:0;padding:0;width:auto;min-height:277mm}}</style></head><body>${sections.join('')}</body></html>`;
 const blob=new Blob([html],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='SBauAkte_Fotobericht.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
 return photos.length;
}

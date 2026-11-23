import {documentMatchesPart} from './documentLinks';
import type {Photo,ConstructionDocument,AsBuiltChange} from './db';
export const evidence=[['photos','Fotodokumentation'],['delivery','Lieferscheine'],['quality','Prüfzeugnisse / Qualitätsnachweise'],['materials','Leistungserklärungen / CE-Nachweise'],['asbuilt','Bestandsdokumentation'],['acceptance','Abnahme / Freigabe']] as const;
export type EvidenceKey=typeof evidence[number][0];
export function detectEvidence(partId:string,photos:Photo[],documents:ConstructionDocument[],changes:AsBuiltChange[]):Set<EvidenceKey>{
 const found=new Set<EvidenceKey>();
 if(photos.some(p=>p.partId===partId))found.add('photos');
 if(changes.some(c=>c.partId===partId))found.add('asbuilt');
 for(const d of documents.filter(d=>documentMatchesPart(d,partId))){
  const kind=d.kind.toLocaleLowerCase('de');
  if(kind==='lieferschein'||kind==='betonlieferschein')found.add('delivery');
  if(kind==='prüfprotokoll')found.add('quality');
  if(kind==='materialnachweis'||kind==='leistungserklärung'||kind==='ce-dokument')found.add('materials');
  if(kind==='abnahmeprotokoll')found.add('acceptance');
 }
 return found;
}

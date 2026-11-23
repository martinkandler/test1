import type {ConstructionDocument} from './db';
/** Backward-compatible association: legacy partId and new multi-assignment. */
export const documentPartIds=(d:ConstructionDocument):string[]=>Array.from(new Set([...(d.partIds||[]),...(d.partId?[d.partId]:[])]));
export const documentMatchesPart=(d:ConstructionDocument,partId:string)=>documentPartIds(d).includes(partId);
export const assignDocumentParts=(d:ConstructionDocument,ids:string[]):ConstructionDocument=>{const partIds=Array.from(new Set(ids.filter(Boolean)));return {...d,partId:partIds[0]||'',partIds};};

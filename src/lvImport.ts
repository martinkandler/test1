/** Local LV import. No server upload. */
export type LVRow={oz:string;text:string;unit:string;qty:number;price:number;kind:string;rowType:'Titel'|'Untertitel'|'Position';longText:string;level:number};
export type LVImportResult={rows:LVRow[];warnings:string[]};
const clean=(s:unknown)=>String(s??'').trim();
export const numberDE=(value:unknown):number=>{let s=clean(value).replace(/\s|€/g,'');if(!s)return 0;if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');else if(s.includes(','))s=s.replace(',','.');else if(/^[-+]?\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');return Number(s)};
export const parseCSV=(text:string):string[][]=>{const first=text.split(/\r?\n/)[0]||'';const sep=[';','\t',','].sort((a,b)=>first.split(b).length-first.split(a).length)[0];const rows:string[][]=[];let row:string[]=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else quoted=!quoted}else if(c===sep&&!quoted){row.push(field);field=''}else if((c==='\r'||c==='\n')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field=''}else field+=c}row.push(field);if(row.some(x=>x.trim()))rows.push(row);return rows};
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9äöüß]/g,'');
export function parseLVTable(rows:string[][]):LVImportResult{const warnings:string[]=[];const headerIndex=rows.findIndex(r=>r.some(x=>/^(oz|ordnungszahl|positionsnummer|position)$/i.test(clean(x))));if(headerIndex<0)throw Error('Keine Kopfzeile mit OZ / Ordnungszahl gefunden');const headers=rows[headerIndex].map(norm);const col=(...aliases:string[])=>headers.findIndex(h=>aliases.some(a=>h===norm(a)||h.includes(norm(a))));const idx={oz:col('oz','ordnungszahl','positionsnummer','position'),text:col('kurztext','bezeichnung','leistung','beschreibung'),unit:col('einheit','mengeneinheit','me'),qty:col('vertragsmenge','menge','quantity'),price:col('einheitspreis','ep','preis'),type:col('typ','zeilentyp','positionsart'),kind:col('positionskategorie','vertragsart','nachtrag'),long:col('langtext','langbeschreibung')};if(idx.oz<0||idx.text<0)throw Error('Spalten OZ und Kurztext fehlen');const result:LVRow[]=[];const seen=new Set<string>();rows.slice(headerIndex+1).forEach((r,offset)=>{const line=headerIndex+offset+2;const get=(i:number)=>i<0?'':clean(r[i]);const oz=get(idx.oz),text=get(idx.text);if(!oz&&!text)return;if(!oz||!text){warnings.push(`Zeile ${line}: OZ oder Bezeichnung fehlt`);return}if(seen.has(oz)){warnings.push(`Zeile ${line}: doppelte OZ ${oz}`);return}const explicit=norm(get(idx.type));const unit=get(idx.unit),qtyText=get(idx.qty),priceText=get(idx.price);let rowType:LVRow['rowType'];if(['titel','haupttitel','obergruppe','los'].includes(explicit))rowType='Titel';else if(['untertitel','bereich','gruppe','untergruppe'].includes(explicit))rowType='Untertitel';else if(['position','lvposition','leistung'].includes(explicit))rowType='Position';else if(!unit&&!qtyText&&!priceText)rowType=oz.split('.').filter(Boolean).length<=1?'Titel':'Untertitel';else rowType='Position';const qty=numberDE(qtyText),price=numberDE(priceText);if(rowType==='Position'&&(!Number.isFinite(qty)||!Number.isFinite(price)||price<0)){warnings.push(`Zeile ${line}: ungültige Menge / Einheitspreis`);return}if(rowType==='Position'&&!unit)warnings.push(`Zeile ${line}: keine Einheit`);seen.add(oz);result.push({oz,text,unit,qty:rowType==='Position'?qty:0,price:rowType==='Position'?price:0,kind:/nachtrag|nt/i.test(get(idx.kind))?'Nachtrag':'Vertrag',rowType,longText:get(idx.long),level:oz.split('.').filter(Boolean).length})});return {rows:result,warnings}};
const descendants=(root:Element,tag:string)=>Array.from(root.getElementsByTagName('*')).filter(e=>e.localName===tag);
const firstText=(root:Element,names:string[])=>{for(const name of names){const e=descendants(root,name)[0];if(e?.textContent?.trim())return e.textContent.trim()}return ''};
/** GAEB DA XML including iTWO .RIBX81 (BoQCtgy + Item). */
export function parseGAEB(xml:string):LVImportResult{
 const doc=new DOMParser().parseFromString(xml,'application/xml');
 if(doc.getElementsByTagName('parsererror').length)throw Error('Ungültige GAEB-XML-Datei');
 if(doc.documentElement.localName!=='GAEB')throw Error('Keine GAEB-DA-XML-Datei');
 const warnings:string[]=[],rows:LVRow[]=[],seen=new Set<string>();
 const child=(el:Element,name:string)=>Array.from(el.children).find(c=>c.localName===name);
 const nested=(el:Element,name:string)=>Array.from(el.getElementsByTagName('*')).find(c=>c.localName===name);
 const txt=(el:Element|undefined)=>el?.textContent?.replace(/\s+/g,' ').trim()||'';
 const number=(el:Element)=>el.getAttribute('RNoPart')||txt(child(el,'RNoPart'))||txt(child(el,'No'));
 const description=(el:Element)=>{const d=child(el,'Description');return {short:txt(nested(d||el,'OutlTxt'))||txt(nested(d||el,'OutlineText'))||txt(nested(d||el,'ShortText')),long:txt(nested(d||el,'DetailTxt'))}};
 const walk=(el:Element,parents:string[])=>{
  for(const c of Array.from(el.children)){
   if(c.localName==='BoQCtgy'||c.localName==='BoQLevel'){
    const no=number(c),path=no?[...parents,no]:parents,oz=path.join('.');
    const label=txt(child(c,'LblTx'))||txt(nested(c,'OutlTxt'))||txt(nested(c,'OutlineText'))||`Titel ${oz}`;
    if(oz&&!seen.has(oz)){rows.push({oz,text:label,unit:'',qty:0,price:0,kind:'Vertrag',rowType:parents.length?'Untertitel':'Titel',longText:'',level:path.length});seen.add(oz)}
    walk(c,path);
   }else if(c.localName==='Item'){
    const no=number(c),oz=txt(child(c,'RNo'))||[...parents,no].filter(Boolean).join('.');
    const d=description(c);const text=d.short||d.long.slice(0,150)||`Position ${oz}`;
    if(!oz){warnings.push('Position ohne OZ übersprungen');continue}
    if(seen.has(oz)){warnings.push(`Doppelte OZ ${oz}`);continue}
    const qty=numberDE(txt(child(c,'Qty'))),price=numberDE(txt(child(c,'UP'))||txt(child(c,'UnitPrice')));
    if(!Number.isFinite(qty)||!Number.isFinite(price)){warnings.push(`Ungültige Menge oder EP bei ${oz}`);continue}
    rows.push({oz,text,unit:txt(child(c,'QU'))||txt(child(c,'Unit')),qty,price,kind:'Vertrag',rowType:'Position',longText:d.long,level:parents.length+1});seen.add(oz);
   }else if(c.localName==='BoQBody'||c.localName==='BoQ'||c.localName==='Award'||c.localName==='Itemlist')walk(c,parents);
  }
 };
 walk(doc.documentElement,[]);
 if(!rows.some(r=>r.rowType==='Position'))throw Error('Keine GAEB-Positionen gefunden. Bitte DA-XML-Datei prüfen.');
 return {rows,warnings};
}

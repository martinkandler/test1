import type {Photo,Part,Building} from './db';
import {imageFromBlob} from './pdfExport';
import {newA4Page,exportA4Canvases} from './printLayout';
function wrap(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,max:number,size=21){ctx.font=`${size}px Arial`;let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>max&&line){ctx.fillText(line,x,y);y+=size*1.25;line=word}else line=next}if(line)ctx.fillText(line,x,y)}
export async function createPhotoPdf(photos:Photo[],parts:Part[],buildings:Building[]=[]){
 if(!photos.length)throw new Error('Keine Fotos ausgewählt');const pages:HTMLCanvasElement[]=[];
 for(let i=0;i<photos.length;i+=2){const {canvas,ctx}=newA4Page();for(let j=0;j<2&&i+j<photos.length;j++){
 const ph=photos[i+j],top=190+j*730;ctx.fillStyle='#f0f3f8';ctx.fillRect(64,top,1112,530);
 const img=await imageFromBlob(ph.original);const scale=Math.min(1112/img.naturalWidth,530/img.naturalHeight);const w=img.naturalWidth*scale,h=img.naturalHeight*scale,x=64+(1112-w)/2,y=top+(530-h)/2;
 ctx.drawImage(img,x,y,w,h);if(ph.annotation){const ann=await imageFromBlob(ph.annotation);ctx.drawImage(ann,x,y,w,h)}
 ctx.fillStyle='#172c40';ctx.font='bold 24px Arial';wrap(ctx,ph.name,64,top+565,1100,24);
 ctx.fillStyle='#53677c';wrap(ctx,`${ph.captured||''} | ${parts.find(p=>p.id===ph.partId)?.name||'Ohne Bauteil'}`,64,top+601,1100,20);
 wrap(ctx,[buildings.find(b=>b.id===(ph.buildingId||parts.find(p=>p.id===ph.partId)?.buildingId))?.name,ph.location,ph.description].filter(Boolean).join(' · '),64,top+634,1100,20);
 }pages.push(canvas)}
 await exportA4Canvases(pages,'Fotodokumentation','SBauAkte_Fotodokumentation.pdf');return photos.length;
}

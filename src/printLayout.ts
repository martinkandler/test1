/** Shared A4 PDF layout. The official company logo is public/sbau-logo.svg. */
import {canvasPage,downloadBlob,pdfFromPages,type PdfPage} from './pdfExport';
export const PAGE_WIDTH=1240;
export const PAGE_HEIGHT=1754;
const LEFT=64;
const HEADER_BOTTOM=160;
const LOGO_MAX_WIDTH=330;
const LOGO_MAX_HEIGHT=79;
let logoPromise:Promise<HTMLImageElement>|undefined;
function logoImage():Promise<HTMLImageElement>{
 return logoPromise??=(async()=>{
  const img=new Image();
  img.src=`${import.meta.env.BASE_URL}sbau-logo.svg`;
  await img.decode();
  if(!img.naturalWidth||!img.naturalHeight)throw new Error('Firmenlogo konnte nicht geladen werden');
  return img;
 })().catch(error=>{logoPromise=undefined;throw error});
}
export function newA4Page(){const canvas=document.createElement('canvas');canvas.width=PAGE_WIDTH;canvas.height=PAGE_HEIGHT;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas nicht verfügbar');ctx.fillStyle='#fff';ctx.fillRect(0,0,PAGE_WIDTH,PAGE_HEIGHT);return {canvas,ctx};}
export async function printHeader(ctx:CanvasRenderingContext2D,title:string,page:number,total:number,date=new Date()){
 ctx.save();
 ctx.fillStyle='#fff';ctx.fillRect(0,0,PAGE_WIDTH,HEADER_BOTTOM);
 let textLeft=LEFT;
 try{
  const logo=await logoImage();
  const scale=Math.min(LOGO_MAX_WIDTH/logo.naturalWidth,LOGO_MAX_HEIGHT/logo.naturalHeight);
  const width=logo.naturalWidth*scale,height=logo.naturalHeight*scale;
  ctx.drawImage(logo,LEFT,36+(LOGO_MAX_HEIGHT-height)/2,width,height);
  textLeft=LEFT+LOGO_MAX_WIDTH+24;
 }catch{
  // Keep the export usable even if an SVG decoder cannot load the company logo.
  ctx.fillStyle='#172c40';ctx.font='bold 24px Arial';ctx.fillText('Sächsische Bau GmbH',LEFT,82);
  textLeft=LEFT+LOGO_MAX_WIDTH+24;
 }
 const right=PAGE_WIDTH-LEFT;
 const available=right-textLeft;
 ctx.fillStyle='#172c40';ctx.textAlign='left';ctx.font='bold 28px Arial';
 const name=title.trim()||'Dokument';
 let shown=name;
 while(shown.length>1&&ctx.measureText(shown).width>available){shown=shown.slice(0,-1)}
 if(shown!==name)shown=shown.replace(/\s+$/,'')+'…';
 ctx.fillText(shown,textLeft,72,available);
 ctx.font='19px Arial';ctx.fillStyle='#53677c';
 ctx.fillText(`Datum: ${date.toLocaleDateString('de-DE')}`,textLeft,109);
 ctx.textAlign='right';ctx.fillText(`Seite ${page} von ${total}`,right,135);ctx.textAlign='left';
 ctx.fillStyle='#0874b7';ctx.fillRect(LEFT,149,PAGE_WIDTH-2*LEFT,4);
 ctx.restore();
}
export function printFooter(ctx:CanvasRenderingContext2D){ctx.save();ctx.fillStyle='#d9e1ea';ctx.fillRect(LEFT,1693,PAGE_WIDTH-2*LEFT,2);ctx.fillStyle='#53677c';ctx.font='17px Arial';ctx.fillText('SBauAkte · Sächsische Bau GmbH',LEFT,1723);ctx.restore()}
export async function exportA4Canvases(pages:HTMLCanvasElement[],title:string,fileName:string){const pdfPages:PdfPage[]=[];const created=new Date();for(let i=0;i<pages.length;i++){const ctx=pages[i].getContext('2d');if(!ctx)throw new Error('Canvas nicht verfügbar');await printHeader(ctx,title,i+1,pages.length,created);printFooter(ctx);pdfPages.push(await canvasPage(pages[i]))}downloadBlob(pdfFromPages(pdfPages),fileName)}
export function drawContained(ctx:CanvasRenderingContext2D,image:CanvasImageSource,width:number,height:number,top=190,bottom=1640){const availableWidth=PAGE_WIDTH-2*LEFT,availableHeight=bottom-top;const scale=Math.min(availableWidth/width,availableHeight/height);const w=width*scale,h=height*scale;ctx.drawImage(image,(PAGE_WIDTH-w)/2,top+(availableHeight-h)/2,w,h)}

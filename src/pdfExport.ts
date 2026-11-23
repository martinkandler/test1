/** Offline PDF writer for JPEG-backed pages. No server, popups or additional packages. */
export type PdfPage={jpeg:Uint8Array;width:number;height:number};
const enc=new TextEncoder();
export function downloadBlob(blob:Blob,name:string){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),15000)}
export async function canvasPage(canvas:HTMLCanvasElement):Promise<PdfPage>{const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r,'image/jpeg',.9));if(!blob)throw new Error('Bild konnte nicht erzeugt werden');return {jpeg:new Uint8Array(await blob.arrayBuffer()),width:canvas.width,height:canvas.height}}
export function pdfFromPages(pages:PdfPage[]):Blob{
 if(!pages.length)throw new Error('Keine Seiten vorhanden');
 const chunks:Uint8Array[]=[];let length=0;const offsets:number[]=[0];
 const write=(data:string|Uint8Array)=>{const bytes=typeof data==='string'?enc.encode(data):data;chunks.push(bytes);length+=bytes.length};
 const object=(id:number,body:string|Uint8Array)=>{offsets[id]=length;write(`${id} 0 obj\n`);write(body);write('\nendobj\n')};
 write('%PDF-1.4\n');
 const kids=pages.map((_,i)=>`${3+i*3} 0 R`).join(' ');
 object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`);
 pages.forEach((p,i)=>{const id=3+i*3;const w=595.28,h=841.89;const scale=Math.min(w/p.width,h/p.height);const dw=p.width*scale,dh=p.height*scale,x=(w-dw)/2,y=(h-dh)/2;
 object(id,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im${i} ${id+1} 0 R >> >> /Contents ${id+2} 0 R >>`);
 offsets[id+1]=length;write(`${id+1} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`);write(p.jpeg);write('\nendstream\nendobj\n');
 const content=`q ${dw.toFixed(3)} 0 0 ${dh.toFixed(3)} ${x.toFixed(3)} ${y.toFixed(3)} cm /Im${i} Do Q\n`;object(id+2,`<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream`);
 });
 const xref=length;write(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);for(let i=1;i<offsets.length;i++)write(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);write(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
 return new Blob(chunks as BlobPart[],{type:'application/pdf'});
}
export async function imageFromBlob(blob:Blob):Promise<HTMLImageElement>{const url=URL.createObjectURL(blob);try{const img=new Image();img.src=url;await img.decode();return img}finally{setTimeout(()=>URL.revokeObjectURL(url),15000)}}

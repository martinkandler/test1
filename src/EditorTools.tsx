import React from 'react';
import {type LucideIcon,Hand,MousePointer2,Pencil,Minus,Square,ArrowUpRight,Type,Undo2,Redo2,Download} from 'lucide-react';
export type EditorTool='navigate'|'select'|'pen'|'line'|'rectangle'|'arrow'|'text';
const labels:Record<EditorTool,string>={navigate:'Verschieben',select:'Auswählen',pen:'Freihand',line:'Linie',rectangle:'Rechteck',arrow:'Pfeil',text:'Text'};
const icons:Record<EditorTool,LucideIcon>={navigate:Hand,select:MousePointer2,pen:Pencil,line:Minus,rectangle:Square,arrow:ArrowUpRight,text:Type};
export function EditorTools<T extends EditorTool>({tools,value,onChange}:{tools:readonly T[];value:T;onChange:(tool:T)=>void}){return <div className="editor-tools" role="toolbar" aria-label="Zeichenwerkzeuge">{tools.map(t=>{const Icon:LucideIcon=icons[t];return <button type="button" key={t} className={value===t?'selected':''} aria-pressed={value===t} title={labels[t]} aria-label={labels[t]} onClick={()=>onChange(t)}><Icon size={17}/><span>{labels[t]}</span></button>})}</div>}
export {Undo2,Redo2,Download};

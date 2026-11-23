import {useCallback,useEffect,useRef,useState} from 'react';
import {AlertTriangle,CheckCircle2,Info,X,XCircle} from 'lucide-react';

/*
 * Einheitliche Dialoge für sbau.akte.
 *
 *   if(!(await confirmDialog('Foto endgültig löschen?')))return;
 *   notify('Projekt importiert.','success');
 *
 * <DialogHost/> muss einmal in der App eingebunden sein. Ohne Host fällt das Modul
 * auf window.confirm / window.alert zurück, damit nie eine Rückfrage verloren geht.
 */

export type ConfirmOptions={confirmLabel?:string;cancelLabel?:string;danger?:boolean};
export type ToastKind='success'|'error'|'info';

type ConfirmRequest={id:number;message:string;options:ConfirmOptions;resolve:(value:boolean)=>void};
type ToastItem={id:number;message:string;kind:ToastKind};

let nextId=1;
let confirmListener:((request:ConfirmRequest)=>void)|null=null;
let toastListener:((toast:ToastItem)=>void)|null=null;

/** Fragt vor einer Aktion nach. Löst mit true (bestätigt) oder false (abgebrochen/Escape) auf. */
export function confirmDialog(message:string,options:ConfirmOptions={}):Promise<boolean>{
  const listener=confirmListener;
  if(!listener)return Promise.resolve(window.confirm(message));
  return new Promise<boolean>(resolve=>listener({id:nextId++,message,options,resolve}));
}

/** Zeigt eine kurze, nicht blockierende Meldung. */
export function notify(message:string,kind:ToastKind='info'){
  const listener=toastListener;
  if(!listener){window.alert(message);return}
  listener({id:nextId++,message,kind});
}

const destructive=/löschen|entfern|überschreib/i;
function defaultLabel(message:string){
  if(/löschen/i.test(message))return 'Löschen';
  if(/entfern/i.test(message))return 'Entfernen';
  if(/überschreib/i.test(message))return 'Überschreiben';
  return 'Bestätigen';
}

function ConfirmView({request,onClose}:{request:ConfirmRequest;onClose:(value:boolean)=>void}){
  const {id,message,options}=request;
  const danger=options.danger??destructive.test(message);
  const confirmLabel=options.confirmLabel??defaultLabel(message);
  // „Frage? Zusatzhinweis.“ -> Frage als Überschrift, Hinweis als Absatz
  const split=message.indexOf('? ');
  const heading=split>=0?message.slice(0,split+1):message;
  const detail=split>=0?message.slice(split+2):'';
  const cancelRef=useRef<HTMLButtonElement>(null);
  const okRef=useRef<HTMLButtonElement>(null);
  const closeRef=useRef(onClose);
  closeRef.current=onClose;

  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    // Bei Löschvorgängen liegt der Fokus auf „Abbrechen“, damit Enter nichts Unwiderrufliches auslöst.
    (danger?cancelRef:okRef).current?.focus();
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeRef.current(false);return}
      if(e.key!=='Tab')return;
      const first=cancelRef.current,last=okRef.current;
      if(!first||!last)return;
      const current=document.activeElement;
      if(e.shiftKey&&current===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&current===last){e.preventDefault();first.focus()}
      else if(current!==first&&current!==last){e.preventDefault();first.focus()}
    };
    document.addEventListener('keydown',onKey,true);
    return()=>{document.removeEventListener('keydown',onKey,true);previous?.focus?.()};
  },[danger]);

  return <div className="dlg-back" onClick={e=>{if(e.target===e.currentTarget)onClose(false)}}>
    <div className={'dlg'+(danger?' dlg--danger':'')} role="alertdialog" aria-modal="true" aria-labelledby={'dlg-title-'+id} aria-describedby={detail?'dlg-detail-'+id:undefined}>
      <div className="dlg-head">
        <span className="dlg-icon" aria-hidden="true">{danger?<AlertTriangle size={22}/>:<Info size={22}/>}</span>
        <div className="dlg-text">
          <h2 id={'dlg-title-'+id}>{heading}</h2>
          {detail&&<p id={'dlg-detail-'+id} className="dlg-detail">{detail}</p>}
        </div>
      </div>
      <div className="dlg-actions">
        <button type="button" ref={cancelRef} onClick={()=>onClose(false)}>{options.cancelLabel??'Abbrechen'}</button>
        <button type="button" ref={okRef} className={'dlg-confirm'+(danger?' is-danger':'')} onClick={()=>onClose(true)}>{confirmLabel}</button>
      </div>
    </div>
  </div>;
}

const toastIcons={success:CheckCircle2,error:XCircle,info:Info};

export function DialogHost(){
  const [queue,setQueue]=useState<ConfirmRequest[]>([]);
  const [toasts,setToasts]=useState<ToastItem[]>([]);

  const dismiss=useCallback((id:number)=>setToasts(items=>items.filter(t=>t.id!==id)),[]);

  useEffect(()=>{
    confirmListener=request=>setQueue(items=>[...items,request]);
    toastListener=toast=>{
      setToasts(items=>[...items.slice(-2),toast]);
      window.setTimeout(()=>dismiss(toast.id),toast.kind==='error'?9000:4500);
    };
    return()=>{confirmListener=null;toastListener=null};
  },[dismiss]);

  const active=queue[0];
  const close=(value:boolean)=>{
    if(!active)return;
    active.resolve(value);
    setQueue(items=>items.slice(1));
  };

  return <>
    {active&&<ConfirmView key={active.id} request={active} onClose={close}/>}
    <div className="toast-stack" aria-live="polite">
      {toasts.map(t=>{
        const Icon=toastIcons[t.kind];
        return <div key={t.id} className={'toast toast--'+t.kind} role={t.kind==='error'?'alert':'status'}>
          <span className="toast-icon" aria-hidden="true"><Icon size={20}/></span>
          <span className="toast-msg">{t.message}</span>
          <button type="button" aria-label="Meldung schließen" onClick={()=>dismiss(t.id)}><X size={18}/></button>
        </div>;
      })}
    </div>
  </>;
}

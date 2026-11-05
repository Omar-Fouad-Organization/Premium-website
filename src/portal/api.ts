let csrf='';
export class PortalError extends Error { constructor(message:string,public status:number){super(message);} }
export async function portal<T=Record<string,unknown>>(path:string,body?:unknown):Promise<T>{
 if(body!==undefined&&!csrf){const r=await fetch('/api/portal/csrf',{credentials:'same-origin',headers:{Accept:'application/json'}});const j=await r.json();if(!r.ok)throw new PortalError(j.message||'Participant portal unavailable',r.status);csrf=j.token;}
 const r=await fetch('/api/portal/'+path,{method:body===undefined?'GET':'POST',credentials:'same-origin',headers:{Accept:'application/json',...(body===undefined?{}:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const j=await r.json();if(!r.ok){if(r.status===419)csrf='';throw new PortalError(j.message||'Request could not be confirmed',r.status);}if(['login','logout','activate','reset-password','revoke-sessions'].includes(path))csrf='';return j;
}
export async function portalUpload(file:File,membership_id:string,exhibition_id:number,kind:'image'|'evidence'='image'):Promise<{id:string}>{
 if(!csrf){const r=await portal<{token:string}>('csrf');csrf=r.token;}
 const body=new FormData();body.set('file',file);body.set('kind',kind);body.set('membership_id',membership_id);body.set('exhibition_id',String(exhibition_id));
 const r=await fetch('/api/portal/media',{method:'POST',credentials:'same-origin',headers:{Accept:'application/json','X-CSRF-TOKEN':csrf},body});const j=await r.json();if(!r.ok)throw new PortalError(j.message||'Upload failed',r.status);return j;
}

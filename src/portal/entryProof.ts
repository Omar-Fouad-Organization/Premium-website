type Proof = {kind:'activate'|'reset-password';email:string;token:string};
let proof:Proof|null=null;
export function captureProof(location:Pick<Location,'hash'|'pathname'|'search'>,history:Pick<History,'replaceState'|'state'>):Proof|null {
 const match=location.hash.match(/^#\/portal\/(activate|reset-password)\?(.+)$/);
 if(!match)return null;
 const params=new URLSearchParams(match[2]);
 const token=params.get('token')||'',email=params.get('email')||'';
 // Strip all query values, including malformed secrets, before parsing/rendering the app.
 history.replaceState(history.state,'',location.pathname+location.search+'#/portal/'+match[1]);
 return token.length>=40&&token.length<=255&&email.length<=255?{kind:match[1] as Proof['kind'],email,token}:null;
}
if(typeof window!=='undefined')proof=captureProof(window.location,window.history);
export function entryProof():Proof|null {return proof;}
export function clearEntryProof():void {proof=null;}

export function rememberInvitation(email:string,token:string):void {proof={kind:'activate',email,token};}

import {useState} from 'react';
import PremiumHeader from '@/components/PremiumHeader';
import PremiumFooter from '@/components/PremiumFooter';
import RegistrationForm from '@/components/RegistrationForm';
import {useLanguage} from '@/contexts/LanguageContext';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {request} from '@/integrations/api/client';

export default function PremiumRegistration({kind}:{kind:'buyer'|'visitor'|'status'}){
 const {isRTL}=useLanguage(),tr=(en:string,ar:string)=>isRTL?ar:en;
 const [id,setId]=useState(''),[token,setToken]=useState(''),[result,setResult]=useState(''),[busy,setBusy]=useState(false);
 const title=kind==='buyer'?tr('Buyer Registration','تسجيل المشترين'):kind==='visitor'?tr('Visitor Registration','تسجيل الزوار'):tr('Manage your registration','إدارة التسجيل');
 const manage=async(action:string)=>{setBusy(true);const response=await request('/registrations/'+action,'POST',{id,token});setResult(response.error?response.error.message:response.data.status.replaceAll('_',' '));setBusy(false);};
 return <div className="min-h-screen bg-background"><PremiumHeader/><section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-primary/5 to-background"><div className="container-premium"><div className="max-w-4xl mx-auto text-center"><h1 className="text-premium-heading mb-6">{title}</h1><p className="text-xl text-muted-foreground leading-relaxed">{kind==='visitor'?tr('Register for the linked exhibition. Registration is separate from venue check-in.','سجل للمعرض المرتبط. التسجيل منفصل عن تسجيل الدخول إلى مقر المعرض.'):tr('Applications are reviewed for the linked exhibition. Submission does not guarantee admission or program acceptance.','تتم مراجعة الطلبات للمعرض المرتبط. إرسال الطلب لا يضمن الدخول أو القبول في أي برنامج.')}</p></div></div></section><section className="section-premium bg-white"><div className="container-premium"><div className="card-premium max-w-3xl mx-auto">{kind!=='status'?<RegistrationForm kind={kind}/>:<form className="space-y-6" dir={isRTL?'rtl':'ltr'} onSubmit={e=>{e.preventDefault();void manage('status');}}><Label htmlFor="receipt-id">{tr('Reference','المرجع')}</Label><Input id="receipt-id" value={id} onChange={e=>setId(e.target.value)} required/><Label htmlFor="receipt-token">{tr('Private receipt key','مفتاح الإيصال الخاص')}</Label><Input id="receipt-token" type="password" autoComplete="off" value={token} onChange={e=>setToken(e.target.value)} required/><div className="flex gap-3"><Button disabled={busy} type="submit">{tr('Check status','متابعة الحالة')}</Button><Button disabled={busy||!id||!token} type="button" variant="outline" onClick={()=>manage('withdraw')}>{tr('Withdraw request','سحب الطلب')}</Button></div><p role="status">{result}</p></form>}</div></div></section><PremiumFooter/></div>;
}

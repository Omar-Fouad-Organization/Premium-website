/** Overview/discovery projections must never become editable authoritative profiles. */
export function editableProfile<T extends object>(value:T|undefined):T|null{
 if(!value)return null;
 const p=value as Record<string,unknown>;
 if(!['categories','products','required_products','preferred_origins','required_certifications','meeting_interests','certifications'].every(k=>Array.isArray(p[k])))return null;
 return structuredClone(value);
}
export function screenKey(membership:string,operation:string,page:number):string{return `${membership}:${operation}:${page}`;}
export function answerState(profile:object,key:string):string{
 const p=profile as Record<string,unknown>,states=p.requirement_states as Record<string,string>|undefined;
 if(states?.[key])return states[key];
 if(key==='capacity')return Number(p.quantity||0)>0?'applicable':'unknown';
 const fields:Record<string,string>={products:'required_products',origin:'preferred_origins',documentation:'required_certifications'};
 return Array.isArray(p[fields[key]])&&(p[fields[key]] as unknown[]).length>0?'applicable':'unknown';
}
export function deliveryState(state:string,arabic:boolean):string{
 const labels:Record<string,[string,string]>={confirmed:['ERP acknowledged — business review remains separate','أكد النظام الاستلام — مراجعة الأعمال إجراء منفصل'],pending:['Pending authority acknowledgment','بانتظار تأكيد النظام المعتمد'],rejected:['Authority rejected this command','رفض النظام هذا الطلب'],review_required:['Organizer reconciliation required','تتطلب مراجعة المنظم']};
 return labels[state]?.[arabic?1:0]||(arabic?'حالة التسليم غير معروفة':'Delivery state unknown');
}
export function participantState(state:string|undefined,arabic:boolean):string{
 const labels:Record<string,[string,string]>={
  draft:['Private draft','مسودة خاصة'],'profile.draft':['Private draft saved','تم حفظ المسودة الخاصة'],'profile.submitted':['Amendment awaiting review','تعديل بانتظار المراجعة'],
  acknowledged:['Organizer acknowledged','اطلع المنظم على الطلب'],coordinated:['Coordination recorded — check the live schedule','تم تسجيل التنسيق — تحقق من الجدول الحالي'],
  active:['Active','ساري'],revoked:['Access revoked','تم إلغاء الصلاحية'],withdrawn:['Withdrawn','منسحب'],
  owner:['Organization owner','مالك المؤسسة'],editor:['Profile editor','محرر الملف'],coordinator:['Meeting coordinator','منسق الاجتماعات'],reader:['Read-only representative','ممثل للقراءة فقط'],
  standard:['Standard Networking','التواصل الأساسي'],approved:['Approved','معتمد'],submitted:['Submitted for organizer review','أُرسل لمراجعة المنظم'],changes_requested:['Changes requested','طُلبت تعديلات'],rejected:['Rejected','مرفوض'],
  invitation_pending:['Awaiting independent responses','بانتظار الردود المستقلة'],mutually_accepted:['Both parties accepted — scheduling is separate','وافق الطرفان — الجدولة إجراء منفصل'],declined:['Declined','مرفوض'],expired:['Expired','منتهي الصلاحية'],
  scheduled:['Scheduled','مجدول'],confirmed:['Confirmed','مؤكد'],completed:['Completed','مكتمل'],cancelled:['Cancelled','ملغى'],no_show:['Did not attend','لم يحضر'],in_progress:['In progress','جارٍ التنفيذ'],
  pending:['Pending authority acknowledgment','بانتظار تأكيد النظام المعتمد'],review_required:['Organizer reconciliation required','تتطلب مراجعة المنظم'],
  'match.mutually_accepted':['Both parties accepted; organizer scheduling remains separate','وافق الطرفان؛ الجدولة لدى المنظم إجراء منفصل'],'meeting.scheduled':['Meeting scheduled','تمت جدولة اجتماع'],'meeting.confirmed':['Meeting confirmed by organizer','أكد المنظم الاجتماع'],'meeting.cancelled':['Meeting cancelled','تم إلغاء الاجتماع'],'request.acknowledged':['Organizer acknowledged your request','اطلع المنظم على طلبك'],'request.coordinated':['Organizer processed your coordination request','سجل المنظم معالجة طلب التنسيق'],
  'account.activate':['Account activated','تم تفعيل الحساب'],'profile.submit':['Profile amendment submitted','تم إرسال تعديل الملف'],'profile.approved':['Profile approved','تم اعتماد الملف'],'profile.changes_requested':['Profile changes requested','طُلبت تعديلات على الملف'],'profile.rejected':['Profile rejected','تم رفض الملف'],
  'invitation.pending':['New introduction invitation','دعوة تعارف جديدة'],'invitation.accepted':['Your introduction response was recorded','تم تسجيل رد التعارف'],'invitation.declined':['Introduction declined','تم رفض التعارف'],'invitation.respond':['Introduction response recorded','تم تسجيل رد التعارف'],'request.submit':['Organizer request submitted','تم إرسال طلب إلى المنظم'],'team.revoke':['Membership revoked','تم إلغاء العضوية'],
 };
 return labels[state||'']?.[arabic?1:0]||(arabic?'تحديث معتمد من المنظم':'Organizer record updated');
}

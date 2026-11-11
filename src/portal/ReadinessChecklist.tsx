import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';

type Item = {
  id:number; version:number; requirement_version:number; title_en:string; title_ar?:string;
  description_en?:string; description_ar?:string; status:string; type:string; required:boolean;
  due_date?:string; feedback?:string; response?:string;
};
export type Readiness = {status:string; last_page:number; booth?:{name:string;hall?:string;size_sqm?:string}; items:Item[]; completed:number; applicable:number};

const statusLabels:Record<string,[string,string]> = {
  not_configured:['Operational requirements not configured.','لم تُحدَّد متطلبات التشغيل.'],
  pending:['Requirements pending','متطلبات قيد الاستكمال'],
  ready:['Operationally ready','جاهز للتشغيل'],
  not_started:['Not started','لم يبدأ'],
  awaiting_information:['Awaiting exhibitor information','بانتظار معلومات العارض'],
  submitted:['Submitted','تم الإرسال'],
  under_review:['Under organizer review','قيد مراجعة المنظم'],
  changes_requested:['Changes requested','مطلوب تعديل'],
  approved:['Approved','معتمد'],
  not_applicable:['Not applicable','غير منطبق'],
};

export default function ReadinessChecklist({data, arabic, editable, busy, submit}:{
  data:Readiness; arabic:boolean; editable:boolean; busy:boolean; submit:(payload:unknown)=>void;
}) {
  const [responses,setResponses] = useState<Record<number,string>>({});
  const tr = (en:string,ar:string) => arabic ? ar : en;
  const status = (key:string) => statusLabels[key]?.[arabic?1:0] ?? key;
  return <section className="space-y-4">
    <div className="card-premium space-y-2">
      <h2 className="text-xl">{tr('Operational readiness','الجاهزية التشغيلية')}</h2>
      {data.booth && <p>{tr('Confirmed booth','الجناح المؤكد')} {data.booth.name} {data.booth.hall}</p>}
      <p>{status(data.status)}</p>
      {data.status!=='not_configured' && <p>{data.completed}/{data.applicable} {tr('applicable requirements approved','من المتطلبات المنطبقة معتمدة')}</p>}
    </div>
    {data.items.map(item => <article className="card-premium space-y-3 break-words" key={item.id}>
      <h3 className="text-lg">{arabic ? item.title_ar || item.title_en : item.title_en}</h3>
      <p>{arabic ? item.description_ar || item.description_en : item.description_en}</p>
      <p>{status(item.status)} · {item.required ? tr('Required','إلزامي') : tr('Optional','اختياري')}</p>
      {item.due_date && <p>{tr('Due date','تاريخ الاستحقاق')} <time dateTime={item.due_date}>{item.due_date}</time></p>}
      {item.feedback && <p className="whitespace-pre-wrap">{item.feedback}</p>}
      {item.response && <p className="whitespace-pre-wrap">{item.response}</p>}
      {item.type==='document' && <p>{tr('Document submission is unavailable. Contact the organizer.','إرسال المستندات غير متاح. تواصل مع المنظم.')}</p>}
      {editable && item.type==='information' && ['awaiting_information','changes_requested'].includes(item.status) &&
        <form className="space-y-3" onSubmit={event => {
          event.preventDefault();
          const response = responses[item.id]?.trim();
          if (response) submit({requirement_id:item.id, requirement_version:item.requirement_version, version:item.version, response});
        }}>
          <label className="block">{tr('Your response','ردك')}
            <Textarea required maxLength={1000} value={responses[item.id]??''} onChange={event => setResponses({...responses,[item.id]:event.target.value})}/>
          </label>
          <Button disabled={busy}>{tr('Submit for review','إرسال للمراجعة')}</Button>
        </form>}
    </article>)}
  </section>;
}

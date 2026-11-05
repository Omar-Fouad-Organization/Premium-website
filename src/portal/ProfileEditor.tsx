import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {useLanguage} from '@/contexts/LanguageContext';
import {answerState} from './state';
import type {Category,Profile} from './types';

type Props={value:Profile;onChange:(profile:Profile)=>void;kind:'buyer'|'exhibitor';mode:'company'|'products'|'sourcing';categories:Category[];busy:boolean;editable:boolean;onSave:(intent:'draft'|'submit')=>void;onUpload:(file:File,kind:'image'|'evidence',saved:(id:string)=>void)=>void};
const terms=(text:string)=>text.split(/[,،\n]/).map(s=>s.trim()).filter(Boolean);

export default function PortalProfileEditor({value:p,onChange,kind,mode,categories,busy,editable,onSave,onUpload}:Props){
 const {isRTL}=useLanguage(),tr=(en:string,ar:string)=>isRTL?ar:en;
 const set=(key:keyof Profile,value:unknown)=>onChange({...p,[key]:value});
 const text=(key:keyof Profile,en:string,ar:string,max=255,required=false)=><div className="space-y-2" key={key}><Label htmlFor={'profile-'+key}>{tr(en,ar)}</Label><Input id={'profile-'+key} maxLength={max} required={required} value={String(p[key]??'')} onChange={e=>set(key,e.target.value)}/></div>;
 const paragraph=(key:keyof Profile,en:string,ar:string,max=4000)=><div className="space-y-2" key={key}><Label htmlFor={'profile-'+key}>{tr(en,ar)}</Label><Textarea id={'profile-'+key} maxLength={max} value={String(p[key]??'')} onChange={e=>set(key,e.target.value)}/></div>;
 const list=(key:keyof Profile,en:string,ar:string)=><div className="space-y-2" key={key}><Label htmlFor={'profile-'+key}>{tr(en,ar)}</Label><Textarea id={'profile-'+key} value={((p[key]||[])as string[]).join(', ')} onChange={e=>set(key,terms(e.target.value))}/></div>;
 const upload=(id:string,en:string,ar:string,kind:'image'|'evidence',saved:(id:string)=>void)=><div className="space-y-2"><Label htmlFor={id}>{tr(en,ar)}</Label><Input id={id} type="file" accept={kind==='image'?'image/jpeg,image/png,image/webp':'application/pdf'} disabled={busy||!editable} onChange={e=>{const file=e.target.files?.[0];if(file)onUpload(file,kind,saved);}}/></div>;
 return <form className="card-premium space-y-6" onSubmit={e=>{e.preventDefault();onSave('submit');}}>
  <p>{tr('Edit a private draft. Saving or submitting never replaces approved information; only the organizer can approve facts or publish them.','عدّل مسودة خاصة. الحفظ أو الإرسال لا يستبدل المعلومات المعتمدة؛ المنظم وحده يعتمد البيانات وينشرها.')}</p>
  <fieldset disabled={busy||!editable} className="space-y-5">
  {mode==='company'?<>
   {text('name_en','Company display name — English','اسم المؤسسة للعرض بالإنجليزية',255,true)}
   {text('name_ar','Company display name — Arabic','اسم المؤسسة للعرض بالعربية',255,true)}
   {paragraph('description_en','Company description — English','وصف المؤسسة بالإنجليزية')}
   {paragraph('description_ar','Company description — Arabic','وصف المؤسسة بالعربية')}
   {text('industry','Business sector','قطاع الأعمال',150)}{text('classification','Business classification','تصنيف الأعمال',150)}
   {text('country','Company country','دولة المؤسسة',100)}{text('city','City','المدينة',150)}{text('website','Official website (https://…)','الموقع الرسمي (https://…)',500)}
   {paragraph('business_capabilities','Business capabilities','قدرات المؤسسة',2000)}{paragraph('export_interests','Export interests','اهتمامات التصدير',2000)}
   {list('supported_markets','Supported markets (comma-separated)','الأسواق المستهدفة (مفصولة بفواصل)')}{list('business_languages','Business languages','لغات الأعمال')}
   {upload('profile-logo','Company logo — maximum 2 MB','شعار المؤسسة — بحد أقصى ٢ ميجابايت','image',id=>set('logo_media_id',id))}
   {p.logo_media_id&&<p>{tr('Logo stored privately; publication requires review.','حُفظ الشعار بشكل خاص؛ النشر يتطلب المراجعة.')}</p>}
   {kind==='exhibitor'&&<>{text('public_email','Optional public business email','البريد التجاري العام (اختياري)',255)}{text('public_phone','Optional public business phone','هاتف الأعمال العام (اختياري)',50)}
   <label className="flex items-start gap-3"><input type="checkbox" checked={!!p.public_contact_consent} onChange={e=>set('public_contact_consent',e.target.checked)}/>{tr('Request publication of these business contacts to authorized exhibition participants. Organizer approval is required.','أطلب نشر بيانات الاتصال التجارية هذه للمشاركين المصرح لهم بالمعرض. يلزم اعتماد المنظم.')}</label></>}
  </>:<>
   <fieldset className="space-y-3"><legend>{tr('Exhibition product categories','فئات منتجات المعرض')}</legend>{categories.map(c=><label className="flex gap-3 items-center" key={c.id}><input type="checkbox" checked={p.categories.includes(c.id)} onChange={e=>set('categories',e.target.checked?[...p.categories,c.id]:p.categories.filter(id=>id!==c.id))}/>{isRTL?c.name_ar:c.name_en}</label>)}</fieldset>
   {list('meeting_interests','Business meeting interests','اهتمامات الاجتماعات التجارية')}
   {mode==='sourcing'?<>
    {list('required_products','Products sought','المنتجات المطلوبة')}{list('preferred_origins','Required origin countries','بلدان المنشأ المطلوبة')}{list('required_certifications','Required supplier certifications','شهادات المورد المطلوبة')}
    <Label htmlFor="profile-quantity">{tr('Quantity requirement (optional)','الكمية المطلوبة (اختياري)')}</Label><Input id="profile-quantity" type="number" min="0" max="1000000000000" value={p.quantity??''} onChange={e=>set('quantity',e.target.value===''?null:Number(e.target.value))}/>
    {text('unit','Procurement unit','وحدة الشراء',50)}{paragraph('procurement_criteria','Sourcing criteria / notes','معايير وملاحظات التوريد')}
    {(['products','origin','capacity','documentation']as const).map(key=><div className="space-y-2" key={key}><Label htmlFor={'answer-'+key}>{tr(({products:'Product requirement',origin:'Origin requirement',capacity:'Quantity requirement',documentation:'Certification requirement'})[key],({products:'متطلب المنتج',origin:'متطلب المنشأ',capacity:'متطلب الكمية',documentation:'متطلب الشهادات'})[key])}</Label><select className="w-full border rounded-lg p-3" id={'answer-'+key} value={answerState(p,key)} onChange={e=>set('requirement_states',{...p.requirement_states,[key]:e.target.value})}><option value="unknown">{tr('Unknown / not yet provided','غير معروف / لم يقدم بعد')}</option><option value="applicable">{tr('Requirement specified','متطلب محدد')}</option><option value="not_applicable">{tr('Explicitly no restriction','لا يوجد قيد بشكل صريح')}</option></select></div>)}
    <p>{tr('Blank information remains unknown. Choosing no restriction does not verify a supplier’s origin, capacity or certification. Remove contradictory requirements before submitting.','المعلومات الفارغة تظل غير معروفة. اختيار عدم وجود قيود لا يثبت منشأ المورد أو قدرته أو شهاداته. أزل المتطلبات المتعارضة قبل الإرسال.')}</p>
   </>:<>
    {text('origin','Product origin','منشأ المنتجات',100)}<Label htmlFor="profile-capacity">{tr('Claimed supply capacity (unverified)','القدرة التوريدية المعلنة (غير موثقة)')}</Label><Input id="profile-capacity" type="number" min="0" max="1000000000000" value={p.capacity??''} onChange={e=>set('capacity',e.target.value===''?null:Number(e.target.value))}/>{text('unit','Supply unit','وحدة التوريد',50)}
    {p.products.map((product,i)=><section className="border rounded-lg p-4 space-y-4" key={i}>
     {(['name_en','name_ar','description_en','description_ar','origin','specifications','packaging']as const).map(key=><div key={key}><Label htmlFor={'product-'+i+'-'+key}>{tr(({name_en:'Product name — English',name_ar:'Product name — Arabic',description_en:'Description — English',description_ar:'Description — Arabic',origin:'Product origin',specifications:'Specifications',packaging:'Packaging formats'})[key],({name_en:'اسم المنتج بالإنجليزية',name_ar:'اسم المنتج بالعربية',description_en:'الوصف بالإنجليزية',description_ar:'الوصف بالعربية',origin:'منشأ المنتج',specifications:'المواصفات',packaging:'أشكال التعبئة'})[key])}</Label><Input id={'product-'+i+'-'+key} required={key==='name_en'||key==='name_ar'} maxLength={key.startsWith('description')||key==='specifications'?2000:key==='packaging'?1000:255} value={product[key]||''} onChange={e=>set('products',p.products.map((row,j)=>i===j?{...row,[key]:e.target.value}:row))}/></div>)}
     {upload('product-image-'+i,'Product image — maximum 2 MB','صورة المنتج — بحد أقصى ٢ ميجابايت','image',id=>set('products',p.products.map((row,j)=>i===j?{...row,media_id:id}:row)))}
     <Label htmlFor={'product-visibility-'+i}>{tr('Requested catalogue visibility (requires approval)','ظهور المنتج المطلوب (يتطلب الاعتماد)')}</Label><select className="w-full border rounded-lg p-3" id={'product-visibility-'+i} value={product.visibility||'published'} onChange={e=>set('products',p.products.map((row,j)=>i===j?{...row,visibility:e.target.value as 'published'|'hidden'}:row))}><option value="published">{tr('Visible after organizer publication','ظاهر بعد نشر المنظم')}</option><option value="hidden">{tr('Hidden from discovery','مخفي من الاستكشاف')}</option></select>
     <Button type="button" variant="outline" onClick={()=>set('products',p.products.filter((_,j)=>i!==j))}>{tr('Remove product from proposal','حذف المنتج من المقترح')}</Button>
    </section>)}
    <Button type="button" variant="outline" disabled={p.products.length>=50} onClick={()=>set('products',[...p.products,{name_en:'',name_ar:'',visibility:'hidden'}])}>{tr('Add product','إضافة منتج')}</Button>
    {p.certifications.map((cert,i)=><section className="border rounded-lg p-4 space-y-3" key={i}><Label htmlFor={'cert-name-'+i}>{tr('Claimed certification','الشهادة المعلنة')}</Label><Input id={'cert-name-'+i} required maxLength={100} value={cert.name} onChange={e=>set('certifications',p.certifications.map((row,j)=>i===j?{...row,name:e.target.value,verified:false}:row))}/>{upload('cert-file-'+i,'Private PDF evidence — maximum 2 MB','إثبات PDF خاص — بحد أقصى ٢ ميجابايت','evidence',id=>set('certifications',p.certifications.map((row,j)=>i===j?{...row,media_id:id,verified:false}:row)))}<p>{tr('Only the organizer can verify a certification.','المنظم وحده يستطيع توثيق الشهادة.')}</p><Button type="button" variant="outline" onClick={()=>set('certifications',p.certifications.filter((_,j)=>i!==j))}>{tr('Remove certification claim','حذف ادعاء الشهادة')}</Button></section>)}
    <Button type="button" variant="outline" disabled={p.certifications.length>=30} onClick={()=>set('certifications',[...p.certifications,{name:'',verified:false}])}>{tr('Add certification claim','إضافة ادعاء شهادة')}</Button>
   </>}
  </>}
  </fieldset>
  <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" disabled={busy||!editable} onClick={()=>onSave('draft')}>{tr('Save private draft','حفظ مسودة خاصة')}</Button><Button disabled={busy||!editable}>{tr('Submit amendment for review','إرسال التعديل للمراجعة')}</Button></div>
 </form>;
}

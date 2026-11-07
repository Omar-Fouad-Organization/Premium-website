<?php
namespace App\Http\Controllers;
use App\Services\PortalTransport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Storage};
use Illuminate\Support\Str;
class PortalMediaController extends Controller
{
    public function __construct(private \App\Services\PortalEvidence $evidence) {}

    private function context(Request $r,PortalTransport $t):array
    {
        $v=$r->validate(['membership_id'=>'required|uuid','exhibition_id'=>'required|integer']);return [$v,$t->send('command',[...$v,'identity_id'=>$r->attributes->get('portal_identity')->id,'operation'=>'overview','payload'=>[]])];
    }
    public function store(Request $r,PortalTransport $t)
    {
        [$v,$context]=$this->context($r,$t);abort_unless(in_array('profile.submit',$context['capabilities']??[],true),403);abort_unless(is_int($context['participant']['id']??null)&&$context['participant']['id']>0,502);
        $a=$r->validate(['file'=>'required|file|max:2048','kind'=>'required|in:image,evidence']);$f=$a['file'];$mime=$f->getMimeType();$raw=file_get_contents($f->getRealPath());
        if($a['kind']==='image'){
            abort_unless(in_array($mime,['image/jpeg','image/png','image/webp'],true),422,'Use a JPEG, PNG or WebP image.');
            $size=@getimagesizefromstring($raw);abort_unless($size && $size[0]>0 && $size[1]>0 && $size[0]<=4096 && $size[1]<=4096 && $size[0]*$size[1]<=12000000 && $size['mime']===$mime,422,'Image dimensions or content are invalid.');
            abort_unless(function_exists('imagecreatefromstring'),503,'Safe image processing is not available.');
            $image=@imagecreatefromstring($raw);abort_unless($image,422);ob_start();imagepng($image);$raw=ob_get_clean();imagedestroy($image);$mime='image/png';
        }else{$this->evidence->assertUploadReady();abort_unless($mime==='application/pdf' && str_starts_with($raw,'%PDF-'),422,'Evidence must be a PDF document.');}
        abort_if(strlen($raw)>8*1024*1024,422,'Processed image is too large.');$id=(string)Str::uuid();$path=($a['kind']==='evidence'?'quarantine/':'objects/').$id;
        abort_unless(Storage::disk('participant_portal')->put($path,$raw),503,'Upload could not be stored.');
        try{DB::table('portal_media')->insert(['id'=>$id,'identity_id'=>$r->attributes->get('portal_identity')->id,'membership_id'=>$v['membership_id'],'exhibition_id'=>$v['exhibition_id'],'participant_id'=>$context['participant']['id'],'kind'=>$a['kind'],'path'=>$path,'mime'=>$mime,'bytes'=>strlen($raw),'sha256'=>hash('sha256',$raw),'scan_status'=>$a['kind']==='evidence'?'pending':null,'scan_attempts'=>0,'created_at'=>now(),'updated_at'=>now()]);}catch(\Throwable $e){Storage::disk('participant_portal')->delete($path);throw $e;}
        if ($a['kind'] === 'evidence') { $this->evidence->dispatch($id); }
        return response()->json(['id'=>$id,'kind'=>$a['kind'],'status'=>$a['kind']==='evidence'?'quarantined_pending_scan':'private_unreviewed'],201);
    }
    public function show(Request $r,string $id,PortalTransport $t)
    {
        [$v,$context]=$this->context($r,$t);$f=DB::table('portal_media')->where('id',$id)->where('exhibition_id',$v['exhibition_id'])->first();abort_unless($f,404);
        $own=$f->participant_id===($context['participant']['id']??null);if($own&&$f->kind==='evidence')abort_unless(in_array('evidence.read',$context['capabilities']??[],true),404);
        if(!$own){abort_unless($f->kind==='image',404);$a=$r->validate(['participant_id'=>'required|integer']);$t->send('command',[...$v,'identity_id'=>$r->attributes->get('portal_identity')->id,'operation'=>'media.authorize','payload'=>['id'=>$id,'participant_id'=>$a['participant_id'],'owner_membership_id'=>$f->membership_id]]);}
        $this->evidence->assertReleased($f);
        $headers=['Content-Type'=>$f->mime,'Cache-Control'=>'no-store, private','X-Content-Type-Options'=>'nosniff','Content-Security-Policy'=>"default-src 'none'; sandbox"];
        return $f->kind==='image'?Storage::disk('participant_portal')->response($f->path,'image.png',$headers):Storage::disk('participant_portal')->download($f->path,'evidence.pdf',$headers);
    }
    public function archive(Request $r,string $id,PortalTransport $t)
    {
        [$v,$context]=$this->context($r,$t);abort_unless(in_array('profile.submit',$context['capabilities']??[],true),403);$q=DB::table('portal_media')->where('id',$id)->where('exhibition_id',$v['exhibition_id'])->where('participant_id',$context['participant']['id']??0);abort_unless($q->exists(),404);$q->update(['archived_at'=>now(),'updated_at'=>now()]);return ['archived_for_new_submissions'=>true,'existing_authorized_evidence_preserved'=>true];
    }
}

<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
class PrunePortalMediaNonces extends Command
{
 protected $signature='portal:prune-media-nonces {--dry-run}';protected $description='Bounded cleanup of expired media replay envelopes only';
 public function handle():int{if(!config('participant_portal.enabled'))return self::FAILURE;$ids=DB::table('portal_media_nonces')->where('expires_at','<',now()->subMinutes(5))->orderBy('expires_at')->limit(1000)->pluck('id');if(!$this->option('dry-run'))DB::table('portal_media_nonces')->whereIn('id',$ids)->delete();$this->line((string)$ids->count());return self::SUCCESS;}
}

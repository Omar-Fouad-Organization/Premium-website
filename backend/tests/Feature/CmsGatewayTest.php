<?php

namespace Tests\Feature;

use App\Models\CmsRecord;
use App\Services\CmsRecords;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{DB, Storage};
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CmsGatewayTest extends TestCase
{
    use RefreshDatabase;

    private const KEY = 'SyntheticCmsGatewayKeyOnlyForTests000000000000000000';

    protected function setUp(): void
    {
        parent::setUp();
        config(['cms_gateway.enabled'=>true,'cms_gateway.exhibition_id'=>7001,'cms_gateway.key'=>self::KEY]);
    }

    private function permissions(): array
    {
        $result = ['website.view'];
        foreach (array_unique(array_column(config('cms_contract.resources'), 'family')) as $family) {
            foreach (['view','create','edit','delete','publish','upload'] as $action) {
                $result[] = $family.'.'.$action;
            }
        }
        return $result;
    }

    private function delegated(string $resource, array $data, array $claims = [], ?string $raw = null, ?array $permissions = null): \Illuminate\Testing\TestResponse
    {
        $path = '/api/internal/cms/green-life-expo/'.$resource;
        $name = explode('?', $resource)[0];
        $family = in_array($name, ['upload','asset-delete'], true) ? 'media' : config('cms_contract.resources.'.$name.'.family');
        $defaultPermissions = array_values(array_filter($this->permissions(), fn (string $permission): bool => $permission === 'website.view' || ($family && str_starts_with($permission, $family.'.'))));
        $body = $raw ?? json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        $delegation = ['version'=>1,'issuer'=>'space-erp','service'=>'space-erp-cms','audience'=>'green-life-cms','key_id'=>'primary',
            'site'=>'green-life-expo','exhibition_id'=>7001,'actor'=>'erp:42','issued_at'=>time(),'expires_at'=>time()+30,
            'nonce'=>bin2hex(random_bytes(32)),'correlation_id'=>(string) Str::uuid(),'method'=>'POST','target'=>$path,
            'body_sha256'=>hash('sha256', $body),'permissions'=>$permissions ?? $defaultPermissions,...$claims];
        $encoded = rtrim(strtr(base64_encode(json_encode($delegation, JSON_THROW_ON_ERROR)), '+/', '-_'), '=');
        return $this->call('POST', $path, [], [], [], ['CONTENT_TYPE'=>$raw === null ? 'application/json' : 'application/octet-stream',
            'CONTENT_LENGTH'=>(string) strlen($body),'HTTP_ACCEPT'=>'application/json','HTTP_X_SPACE_DELEGATION'=>$encoded,
            'HTTP_X_SPACE_SIGNATURE'=>hash_hmac('sha256', $encoded, self::KEY)], $body);
    }

    private function listInput(array $filters = []): array
    {
        return ['operation'=>'list','filters'=>$filters,'expected_version'=>null];
    }

    public function test_service_authentication_is_independent_of_sessions_and_arbitrary_actor_headers(): void
    {
        $this->postJson('/api/internal/cms/green-life-expo/blogs', $this->listInput(), ['Content-Length'=>'63','X-Actor'=>'super_admin','X-Exhibition-ID'=>'7001'])->assertUnauthorized();
        foreach ([['audience'=>'other'],['service'=>'browser'],['issuer'=>'other'],['exhibition_id'=>7002],['site'=>'another-site'],
            ['target'=>'/api/internal/cms/green-life-expo/settings'],['issued_at'=>time()-60,'expires_at'=>time()-30],['actor'=>['erp:42']],['nonce'=>[]]] as $claims) {
            $this->delegated('blogs', $this->listInput(), $claims)->assertUnauthorized();
        }
        $response = $this->delegated('blogs', $this->listInput())->assertOk();
        $this->assertFalse($response->headers->has('Set-Cookie'));
        $this->assertSame(0, DB::table('users')->count());
    }

    public function test_request_body_is_bound_and_nonce_replay_is_rejected_atomically(): void
    {
        $this->delegated('blogs', $this->listInput(), ['body_sha256'=>str_repeat('0',64)])->assertUnauthorized();
        $nonce = bin2hex(random_bytes(32));
        $this->delegated('blogs', $this->listInput(), ['nonce'=>$nonce])->assertOk();
        $this->delegated('blogs', $this->listInput(), ['nonce'=>$nonce])->assertStatus(409);
        $this->assertSame(1, DB::table('cms_delegation_nonces')->count());
    }

    public static function resources(): array
    {
        return array_map(fn (string $name): array => [$name], ['settings','seo','branding','location','language','content','packages','faqs','translations','media','blogs','partners']);
    }

    private function fixture(string $resource): array
    {
        return match ($resource) {
            'settings'=>['setting_key'=>'site_title','setting_value'=>'Synthetic title'],
            'seo'=>['setting_key'=>'meta_title','setting_value'=>'Synthetic SEO'],
            'branding'=>['setting_key'=>'logo_alt_text','setting_value'=>'Synthetic logo'],
            'location'=>['setting_key'=>'event_location','setting_value'=>'Synthetic location'],
            'language'=>['setting_key'=>'site_language','setting_value'=>'en'],
            'content'=>['page_name'=>'home','section_name'=>'hero','content_key'=>'title','content_value'=>'Synthetic title','content_value_ar'=>'عنوان اختباري'],
            'packages'=>['package_type'=>'exhibitor','package_name'=>'Synthetic package','features'=>['Synthetic feature'],'is_active'=>false],
            'faqs'=>['question'=>'Synthetic question?','answer'=>'Synthetic answer','is_active'=>false],
            'translations'=>['translation_key'=>'synthetic_key','english_text'=>'Synthetic text','arabic_text'=>'نص اختباري'],
            'media'=>['photo_name'=>'Synthetic photo','photo_url'=>'/images/synthetic.png','page_location'=>'home','is_active'=>false],
            'blogs'=>['title'=>'Synthetic draft','slug'=>'synthetic-draft','content'=>'<p>English</p>','content_ar'=>'<p>العربية</p>','is_published'=>false],
            'partners'=>['name'=>'Synthetic test partner','name_ar'=>'شريك اختباري','logo_url'=>'/images/synthetic.png','is_active'=>false],
        };
    }

    #[DataProvider('resources')]
    public function test_every_supported_editor_resource_preserves_uuid_and_field_values(string $resource): void
    {
        $values = $this->fixture($resource);
        $created = $this->delegated($resource, ['operation'=>'create','records'=>$values,'expected_version'=>null])->assertOk()->json('data.0');
        $this->assertTrue(Str::isUuid($created['id']));
        foreach ($values as $field=>$value) {
            $this->assertSame($value, $created[$field]);
        }
        $filter = [['column'=>'id','operator'=>'eq','value'=>$created['id']]];
        $this->delegated($resource, $this->listInput($filter))->assertOk()->assertJsonPath('data.0.id', $created['id']);
        $this->delegated($resource, ['operation'=>'update','filters'=>$filter,'records'=>$values,'expected_version'=>$created['_version']])->assertOk()->assertJsonPath('data.0.id', $created['id']);
    }

    public function test_live_content_requires_publication_authority_while_draft_blog_edits_do_not(): void
    {
        $row = CmsRecord::forResource('blogs')->create($this->fixture('blogs'));
        $filter = [['column'=>'id','operator'=>'eq','value'=>$row->id]];
        $version = app(CmsRecords::class)->version($row->fresh());
        $permissions = ['website.view','blogs.view','blogs.edit'];
        $input = ['operation'=>'update','filters'=>$filter,'records'=>['title'=>'Edited draft'],'expected_version'=>$version];
        $this->delegated('blogs', $input, permissions:$permissions)->assertOk();
        $input['expected_version'] = app(CmsRecords::class)->version($row->fresh());
        $input['records'] = ['is_published'=>true];
        $this->delegated('blogs', $input, permissions:$permissions)->assertForbidden();
        $this->assertFalse($row->fresh()->is_published);
        $row->is_published = true; $row->save();
        $input['expected_version'] = app(CmsRecords::class)->version($row->fresh());
        $input['records'] = ['is_published'=>false];
        $this->delegated('blogs', $input, permissions:$permissions)->assertForbidden();
        $this->assertTrue($row->fresh()->is_published);
    }

    public function test_conflicting_edit_keeps_the_first_save_and_does_not_change_uuid(): void
    {
        $row = CmsRecord::forResource('page_content')->create($this->fixture('content'));
        $input = ['operation'=>'update','filters'=>[['column'=>'id','operator'=>'eq','value'=>$row->id]],
            'records'=>['content_value'=>'First save'],'expected_version'=>app(CmsRecords::class)->version($row->fresh())];
        $this->delegated('content', $input)->assertOk();
        $input['records']['content_value'] = 'Lost update';
        $this->delegated('content', $input)->assertStatus(409);
        $this->assertDatabaseHas('page_content', ['id'=>$row->id,'content_value'=>'First save']);
        $this->assertSame(1, DB::table('page_content')->count());
    }

    public function test_resource_setting_field_and_pagination_allowlists_are_enforced(): void
    {
        foreach (['payments','users','admin_users','contact_submissions','visitor_registrations'] as $resource) {
            $this->delegated($resource, $this->listInput())->assertNotFound();
        }
        $this->delegated('seo', ['operation'=>'create','records'=>['setting_key'=>'smtp_password','setting_value'=>'private'],'expected_version'=>null])->assertUnprocessable();
        $this->delegated('blogs', [...$this->listInput(),'columns'=>'password'])->assertUnprocessable();
        $this->delegated('blogs', [...$this->listInput(),'limit'=>101])->assertUnprocessable();
        $this->delegated('blogs', $this->listInput([['column'=>'id OR 1=1','operator'=>'eq','value'=>'x']]))->assertUnprocessable();
        for ($i=0; $i<3; $i++) {
            CmsRecord::forResource('blogs')->create([...$this->fixture('blogs'),'slug'=>'fixture-'.$i]);
        }
        $this->delegated('blogs', [...$this->listInput(),'limit'=>2,'offset'=>2])->assertOk()->assertJsonCount(1,'data')->assertJsonPath('count',3);
    }

    public function test_public_reads_hide_drafts_internal_settings_and_unsafe_legacy_html_without_overwriting_it(): void
    {
        $payload = '<p>Hello <strong>world</strong> العربية</p><script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(2)"><a href="&#106;avascript:alert(1)">bad</a><svg onload="alert(1)"></svg>';
        $blog = CmsRecord::forResource('blogs')->create([...$this->fixture('blogs'),'content'=>$payload,'is_published'=>true,'published_date'=>now()->subDay()->toIso8601String()]);
        CmsRecord::forResource('blogs')->create([...$this->fixture('blogs'),'slug'=>'hidden-draft']);
        CmsRecord::forResource('site_settings')->create(['setting_key'=>'smtp_password','setting_value'=>'Synthetic private secret']);
        CmsRecord::forResource('site_settings')->create(['setting_key'=>'site_title','setting_value'=>'Public title','description'=>'Synthetic operator note']);
        $public = $this->getJson('/api/resources/blogs')->assertOk()->assertJsonCount(1,'data')->json('data.0.content');
        foreach (['<script','onerror','javascript:','<svg'] as $forbidden) {
            $this->assertStringNotContainsString($forbidden, $public);
        }
        $this->assertStringContainsString('<strong>world</strong>', $public);
        $this->assertStringContainsString('العربية', $public);
        $this->assertSame($payload, $blog->fresh()->content);
        $this->getJson('/api/resources/site_settings')->assertOk()->assertJsonCount(1,'data')->assertJsonMissingPath('data.0.description')->assertJsonMissing(['setting_value'=>'Synthetic private secret']);
    }

    public function test_uploads_render_publicly_and_referenced_assets_cannot_be_deleted(): void
    {
        Storage::fake('public');
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aE1sAAAAASUVORK5CYII=');
        $result = $this->delegated('upload?bucket=premium_photos', [], raw:$png)->assertOk()->json('data.url');
        $this->get($result)->assertOk()->assertHeader('X-Content-Type-Options','nosniff');
        $path = substr($result, strlen('/storage/'));
        CmsRecord::forResource('blogs')->create([...$this->fixture('blogs'),'cover_image_url'=>$result]);
        $this->delegated('asset-delete', ['path'=>$path])->assertStatus(409);
        Storage::disk('public')->assertExists($path);
        $this->delegated('upload?bucket=premium_photos', [], raw:'<svg onload="alert(1)"></svg>')->assertUnprocessable();
        $this->delegated('upload?bucket=private_erp_documents', [], raw:$png)->assertUnprocessable();
    }

    public function test_gateway_requires_explicit_activation_and_fixed_bounded_bodies(): void
    {
        $this->postJson('/api/internal/cms/green-life-expo/blogs', $this->listInput(), ['Content-Length'=>'invalid'])->assertStatus(411);
        config(['cms_gateway.enabled'=>false]);
        $this->delegated('blogs', $this->listInput())->assertStatus(503);
        config(['cms_gateway.enabled'=>true,'cms_gateway.max_json_bytes'=>20]);
        $this->delegated('blogs', $this->listInput())->assertStatus(413);
    }

    public function test_historical_encoded_asset_references_are_protected(): void
    {
        Storage::fake('public');
        $path = 'premium_photos/retained.png';
        Storage::disk('public')->put($path, 'synthetic');
        CmsRecord::forResource('blogs')->create([...$this->fixture('blogs'), 'content' => '<img src="&#47;storage&#47;premium_photos&#47;retained.png">']);
        $this->delegated('asset-delete', ['path' => $path])->assertStatus(409);
        Storage::disk('public')->assertExists($path);
    }

    public function test_existing_hsl_branding_values_remain_editable_and_invalid_css_is_rejected(): void
    {
        $input = ['operation' => 'create', 'records' => ['setting_key' => 'color_primary', 'setting_value' => '130 45% 30%', 'category' => 'colors'], 'expected_version' => null];
        $this->delegated('branding', $input)->assertOk()->assertJsonPath('data.0.setting_value', '130 45% 30%');
        $input['records']['setting_key'] = 'color_secondary';
        $input['records']['setting_value'] = 'url(javascript:alert(1))';
        $this->delegated('branding', $input)->assertUnprocessable();
        $this->getJson('/api/cms-public-config')->assertOk()->assertExactJson(['branding_enabled' => false]);
    }

    public function test_replay_store_maintenance_preserves_current_tokens_and_audits(): void
    {
        DB::table('cms_delegation_nonces')->insert([
            ['id' => str_repeat('a', 64), 'expires_at' => now()->subHour()],
            ['id' => str_repeat('b', 64), 'expires_at' => now()->addMinute()],
        ]);
        $this->delegated('blogs', $this->listInput())->assertOk();
        $this->artisan('cms:prune-nonces')->assertExitCode(0);
        $this->assertDatabaseMissing('cms_delegation_nonces', ['id' => str_repeat('a', 64)]);
        $this->assertDatabaseHas('cms_delegation_nonces', ['id' => str_repeat('b', 64)]);
        $this->assertDatabaseCount('cms_gateway_audits', 1);
    }

    public function test_legacy_public_map_urls_are_projected_safely_without_rewriting_content(): void
    {
        $row = CmsRecord::forResource('site_settings')->create(['setting_key' => 'map_embed_url', 'setting_value' => 'https://untrusted.example.test/embed']);
        $this->getJson('/api/resources/site_settings')->assertOk()->assertJsonPath('data.0.setting_value', '');
        $this->assertSame('https://untrusted.example.test/embed', $row->fresh()->setting_value);
        $this->delegated('location', ['operation' => 'create', 'records' => ['setting_key' => 'map_latitude', 'setting_value' => '91'], 'expected_version' => null])->assertUnprocessable();
        $this->delegated('location', ['operation' => 'create', 'records' => ['setting_key' => 'map_latitude', 'setting_value' => '30.04'], 'expected_version' => null])->assertOk();
    }
}

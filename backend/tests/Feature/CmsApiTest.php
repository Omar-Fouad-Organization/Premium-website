<?php

namespace Tests\Feature;

use App\Models\CmsRecord;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CmsApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $user = User::factory()->create(['password' => 'Local-test-password-123']);
        $user->is_admin = true;
        $user->save();

        return $user;
    }

    private function endpoint(string $resource, array $filters = [], array $params = []): string
    {
        return '/api/resources/'.$resource.'?'.http_build_query(['filters' => json_encode($filters), ...$params]);
    }

    public function test_public_content_is_readable_but_private_records_and_writes_are_protected(): void
    {
        CmsRecord::forResource('blogs')->fill(['title' => 'Draft', 'slug' => 'draft', 'content' => 'Private', 'is_published' => false])->save();
        $this->getJson('/api/resources/blogs')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/resources/contact_submissions')->assertForbidden();
        $this->getJson('/api/resources/visitor_registrations')->assertForbidden();
        $this->getJson('/api/resources/admin_users')->assertForbidden();
        $this->postJson('/api/resources/site_settings', ['records' => ['setting_key' => 'x', 'setting_value' => 'x']])->assertForbidden();
        $this->postJson('/api/admin/users', ['email' => 'attacker@example.com', 'password' => 'Strong-password-123'])->assertForbidden();
        $this->postJson('/api/uploads', [])->assertForbidden();
    }

    public function test_login_requires_an_administrator_and_logout_revokes_access(): void
    {
        $user = User::factory()->create(['password' => 'Local-test-password-123']);
        $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'Local-test-password-123'])->assertUnprocessable();
        $admin = $this->admin();
        $this->postJson('/api/auth/login', ['email' => $admin->email, 'password' => 'incorrect'])->assertUnprocessable();
        $this->postJson('/api/auth/login', ['email' => $admin->email, 'password' => 'Local-test-password-123'])->assertOk()->assertJsonPath('data.user.role', 'admin');
        $this->getJson('/api/auth/me')->assertJsonPath('data.user.email', $admin->email);
        $this->getJson('/api/resources/admin_users')->assertForbidden();
        $this->getJson('/api/admin/resources/admin_users')->assertOk()->assertJsonMissingPath('data.0.password');
        $this->postJson('/api/auth/logout')->assertOk();
        $this->getJson('/api/resources/admin_users')->assertForbidden();
    }

    public function test_admin_can_manage_content_with_json_and_boolean_round_trips(): void
    {
        $this->actingAs($this->admin());
        $response = $this->postJson('/api/resources/packages?single=true', ['records' => ['package_type' => 'exhibitor', 'package_name' => 'Test booth', 'features' => ['Space', 'WiFi'], 'is_active' => true]])->assertOk();
        $id = $response->json('data.id');
        $response->assertJsonPath('data.features', ['Space', 'WiFi'])->assertJsonPath('data.is_active', true);
        $url = $this->endpoint('packages', [['column' => 'id', 'operator' => 'eq', 'value' => $id]]);
        $this->patchJson($url, ['records' => ['package_name' => 'Updated booth', 'is_active' => false]])->assertOk();
        $this->getJson(str_replace('/api/resources/', '/api/admin/resources/', $url))->assertJsonPath('data.0.package_name', 'Updated booth')->assertJsonPath('data.0.is_active', false);
        $this->deleteJson($url)->assertOk();
        $this->assertDatabaseMissing('packages', ['id' => $id]);
    }

    public function test_contact_validation_prevents_private_data_disclosure_and_read_status_forgery(): void
    {
        $record = ['name' => 'Test Visitor', 'email' => 'test@example.com', 'inquiry_type' => 'general', 'message' => 'Local test inquiry'];
        $this->postJson('/api/resources/contact_submissions', ['records' => [...$record, 'email' => 'invalid']])->assertUnprocessable();
        $this->postJson('/api/resources/contact_submissions', ['records' => [...$record, 'is_read' => true]])->assertUnprocessable();
        $this->postJson('/api/resources/contact_submissions', ['records' => $record])->assertCreated()->assertExactJson(['data' => ['success' => true]]);
        $this->assertDatabaseHas('contact_submissions', ['email' => 'test@example.com', 'is_read' => false]);
    }

    public function test_filters_fields_and_unscoped_mutations_are_rejected(): void
    {
        $this->actingAs($this->admin());
        $this->getJson('/api/resources/users')->assertNotFound();
        $this->getJson('/api/resources/site_settings?columns=password')->assertUnprocessable();
        $this->getJson($this->endpoint('site_settings', [['column' => 'id OR 1=1', 'operator' => 'eq', 'value' => 'x']]))->assertUnprocessable();
        $this->deleteJson('/api/resources/site_settings')->assertUnprocessable();
        $this->patchJson('/api/resources/site_settings', ['records' => ['setting_value' => 'bad']])->assertUnprocessable();
        $this->postJson('/api/resources/photos', ['records' => ['photo_name' => 'Bad', 'photo_url' => 'javascript:alert(1)', 'page_location' => 'home']])->assertUnprocessable();
    }

    public function test_settings_upsert_and_branding_use_key_value_records(): void
    {
        $this->actingAs($this->admin());
        $this->putJson('/api/resources/site_settings?conflict=setting_key', ['records' => ['setting_key' => 'logo_url', 'setting_value' => '/storage/premium_logos/test.png']])->assertOk();
        $this->putJson('/api/resources/site_settings?conflict=setting_key', ['records' => ['setting_key' => 'logo_url', 'setting_value' => '/images/updated.png']])->assertOk();
        $this->getJson($this->endpoint('site_settings', [['column' => 'setting_key', 'operator' => 'eq', 'value' => 'logo_url']], ['single' => 'true', 'columns' => 'setting_value']))->assertJsonPath('data.setting_value', '/images/updated.png');
        $this->assertDatabaseCount('site_settings', 1);
    }

    public function test_uploads_reject_executable_content_and_return_local_asset_urls(): void
    {
        Storage::fake('public');
        $this->actingAs($this->admin());
        $this->post('/api/uploads', ['bucket' => 'premium_logos', 'file' => UploadedFile::fake()->create('payload.php', 1, 'text/x-php')], ['Accept' => 'application/json'])->assertUnprocessable();
        // A genuine PNG fixture avoids depending on PHP GD in portable installs.
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGf0AAAAASUVORK5CYII=');
        $response = $this->post('/api/uploads', ['bucket' => 'premium_logos', 'file' => UploadedFile::fake()->createWithContent('logo.png', $png)], ['Accept' => 'application/json'])->assertCreated();
        $url = $response->json('data.url');
        $this->assertStringStartsWith('/storage/premium_logos/', $url);
        Storage::disk('public')->assertExists(substr($url, strlen('/storage/')));
    }

    public function test_admin_user_creation_hashes_passwords_and_cannot_delete_self(): void
    {
        $admin = $this->admin();
        $this->actingAs($admin);
        $this->postJson('/api/admin/users', ['email' => 'new@example.com', 'password' => 'short'])->assertUnprocessable();
        $this->postJson('/api/admin/users', ['email' => 'new@example.com', 'password' => 'Strong-test-password-123'])->assertCreated();
        $created = User::where('email', 'new@example.com')->firstOrFail();
        $this->assertNotSame('Strong-test-password-123', $created->password);
        $this->assertTrue($created->is_admin);
        $this->deleteJson($this->endpoint('admin_users', [['column' => 'id', 'operator' => 'eq', 'value' => $admin->id]]))->assertUnprocessable();
        $this->deleteJson($this->endpoint('admin_users', [['column' => 'id', 'operator' => 'eq', 'value' => $created->id]]))->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $created->id]);
    }

    public function test_seeding_is_idempotent_and_preserves_editor_changes(): void
    {
        $this->seed();
        $setting = CmsRecord::forResource('site_settings')->where('setting_key', 'hero_date')->firstOrFail();
        $setting->setting_value = 'Edited locally';
        $setting->save();
        $this->seed();
        $this->assertDatabaseCount('packages', 6);
        $this->assertDatabaseHas('site_settings', ['setting_key' => 'hero_date', 'setting_value' => 'Edited locally']);
    }
}

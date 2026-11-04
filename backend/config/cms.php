<?php

return ['resources' => [
    'site_settings' => ['public' => true, 'unique' => ['setting_key'], 'fields' => [
        'setting_key' => 'required|string|max:191', 'setting_value' => 'present|nullable|string|max:20000', 'setting_type' => 'nullable|string|max:50', 'category' => 'nullable|string|max:100', 'description' => 'nullable|string|max:1000',
    ]],
    'page_content' => ['public' => true, 'unique' => ['page_name', 'section_name', 'content_key'], 'fields' => [
        'page_name' => 'required|string|max:50', 'section_name' => 'required|string|max:100', 'content_key' => 'required|string|max:100', 'content_value' => 'present|nullable|string|max:100000', 'content_value_ar' => 'nullable|string|max:100000', 'content_type' => 'nullable|string|max:50', 'display_order' => 'nullable|integer|min:0',
    ]],
    'packages' => ['public' => true, 'visible' => 'is_active', 'fields' => [
        'package_type' => 'required|in:exhibitor,sponsor', 'package_name' => 'required|string|max:255', 'price' => 'nullable|string|max:100', 'features' => 'nullable|array|max:100', 'is_popular' => 'nullable|boolean', 'is_active' => 'nullable|boolean', 'display_order' => 'nullable|integer|min:0',
    ]],
    'faqs' => ['public' => true, 'visible' => 'is_active', 'fields' => [
        'question' => 'required|string|max:1000', 'answer' => 'required|string|max:10000', 'category' => 'nullable|string|max:100', 'is_active' => 'nullable|boolean', 'display_order' => 'nullable|integer|min:0',
    ]],
    'translations' => ['public' => true, 'unique' => ['translation_key'], 'fields' => [
        'translation_key' => 'required|string|max:191', 'english_text' => 'required|string|max:20000', 'arabic_text' => 'required|string|max:20000', 'category' => 'nullable|string|max:100',
    ]],
    'photos' => ['public' => true, 'visible' => 'is_active', 'fields' => [
        'photo_name' => 'required|string|max:255', 'photo_url' => 'required|string|max:2048', 'photo_alt' => 'nullable|string|max:255', 'page_location' => 'required|string|max:50', 'section_name' => 'nullable|string|max:100', 'display_order' => 'nullable|integer|min:0', 'is_active' => 'nullable|boolean',
    ]],
    'partners' => ['public' => true, 'visible' => 'is_active', 'fields' => [
        'name' => 'required|string|max:255', 'name_ar' => 'nullable|string|max:255', 'logo_url' => 'required|string|max:2048', 'website_url' => 'nullable|url:http,https|max:2048', 'display_order' => 'nullable|integer|min:0', 'is_active' => 'nullable|boolean',
    ]],
    'blogs' => ['public' => true, 'visible' => 'is_published', 'unique' => ['slug'], 'fields' => [
        'title' => 'required|string|max:255', 'title_ar' => 'nullable|string|max:255', 'slug' => 'required|string|max:191|regex:/^[a-z0-9-]+$/', 'excerpt' => 'nullable|string|max:10000', 'excerpt_ar' => 'nullable|string|max:10000', 'content' => 'required|string|max:200000', 'content_ar' => 'nullable|string|max:200000', 'cover_image_url' => 'nullable|string|max:2048', 'author' => 'nullable|string|max:255', 'author_ar' => 'nullable|string|max:255', 'category' => 'nullable|string|max:100', 'category_ar' => 'nullable|string|max:100', 'is_published' => 'nullable|boolean', 'published_date' => 'nullable|date',
    ]],
    'contact_submissions' => ['public' => false, 'submit' => true, 'fields' => [
        'name' => 'required|string|max:255', 'email' => 'required|email|max:255', 'phone' => 'nullable|string|max:50', 'company' => 'nullable|string|max:255', 'title' => 'nullable|string|max:255', 'country' => 'nullable|string|max:100', 'country_code' => 'nullable|string|max:10', 'inquiry_type' => 'required|in:general,exhibitor,sponsor,visitor,speaker,media,partnership,other', 'message' => 'required|string|max:10000', 'is_read' => 'nullable|boolean',
    ]],
    'visitor_registrations' => ['public' => false, 'submit' => true, 'fields' => [
        'name' => 'required|string|max:255', 'email' => 'required|email|max:255', 'phone' => 'nullable|string|max:50', 'company' => 'nullable|string|max:255', 'job_title' => 'nullable|string|max:255', 'country' => 'nullable|string|max:100', 'interests' => 'nullable|array|max:50', 'visit_date' => 'nullable|date', 'how_heard' => 'nullable|string|max:255', 'is_read' => 'nullable|boolean',
    ]],
]];

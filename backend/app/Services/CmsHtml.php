<?php

namespace App\Services;

use DOMDocument;
use DOMElement;
use DOMNode;

class CmsHtml
{
    private const TAGS = ['p','br','div','span','h1','h2','h3','h4','h5','h6','ul','ol','li','strong','b','em','i','u','s','blockquote','pre','code','table','thead','tbody','tfoot','tr','th','td','caption','img','a','hr','sup','sub'];
    private const DROP = ['script','style','iframe','object','embed','svg','math','template','form','input','button','textarea','select','link','meta','base','frame','frameset'];

    public static function safeMapUrl(string $value): bool
    {
        $url = parse_url($value);
        return self::safeUrl($value) && ($url['scheme'] ?? '') === 'https'
            && in_array($url['host'] ?? '', ['www.google.com', 'maps.google.com', 'www.google.com.eg'], true)
            && str_starts_with($url['path'] ?? '', '/maps') && ! isset($url['user']) && ! isset($url['pass'])
            && (! isset($url['port']) || $url['port'] === 443);
    }

    public static function safeUrl(string $url, bool $image = false): bool
    {
        $url = html_entity_decode(trim($url), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        if (preg_match('/[\x00-\x20\x7f\\\\]/u', $url) || str_starts_with($url, '//')) {
            return false;
        }
        return $url === '' || str_starts_with($url, '/') || str_starts_with($url, '#')
            || (bool) preg_match($image ? '#^https?://#i' : '#^(https?://|mailto:|tel:)#i', $url);
    }

    public static function sanitize(?string $html): string
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $document->loadHTML('<?xml encoding="UTF-8"><html><body>'.($html ?? '').'</body></html>', LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
        $body = $document->getElementsByTagName('body')->item(0);
        if (! $body) {
            return '';
        }
        self::clean($body);
        return implode('', array_map(fn (DOMNode $node): string => $document->saveHTML($node), iterator_to_array($body->childNodes)));
    }

    private static function clean(DOMNode $parent): void
    {
        foreach (iterator_to_array($parent->childNodes) as $node) {
            if (! $node instanceof DOMElement) {
                if ($node->nodeType !== XML_TEXT_NODE) {
                    $parent->removeChild($node);
                }
                continue;
            }
            $tag = strtolower($node->tagName);
            if (in_array($tag, self::DROP, true)) {
                $parent->removeChild($node);
                continue;
            }
            self::clean($node);
            if (! in_array($tag, self::TAGS, true)) {
                while ($node->firstChild) {
                    $parent->insertBefore($node->firstChild, $node);
                }
                $parent->removeChild($node);
                continue;
            }
            foreach (iterator_to_array($node->attributes) as $attribute) {
                $name = strtolower($attribute->name);
                $value = $attribute->value;
                if ($name === 'style') {
                    $style = self::safeStyle($value);
                    $node->removeAttribute('style');
                    if ($style !== '') {
                        $node->setAttribute('style', $style);
                    }
                    continue;
                }
                $allowed = in_array($name, ['title','dir','lang'], true)
                    || ($tag === 'a' && in_array($name, ['href','target'], true))
                    || ($tag === 'img' && in_array($name, ['src','alt','width','height'], true))
                    || (in_array($tag, ['td','th'], true) && in_array($name, ['colspan','rowspan'], true));
                if (! $allowed || (in_array($name, ['src','href'], true) && ! self::safeUrl($value, $name === 'src'))
                    || ($name === 'target' && ! in_array($value, ['_blank','_self'], true))
                    || ($name === 'dir' && ! in_array($value, ['ltr','rtl','auto'], true))
                    || (in_array($name, ['width','height','colspan','rowspan'], true) && ! preg_match('/^[1-9][0-9]{0,3}$/', $value))) {
                    $node->removeAttribute($attribute->name);
                }
            }
            if ($tag === 'a') {
                $node->setAttribute('rel', 'noopener noreferrer');
            }
        }
    }

    private static function safeStyle(string $value): string
    {
        $allowed = [
            'text-align' => '/^(left|right|center|justify)$/i',
            'font-weight' => '/^(normal|bold|[1-9]00)$/i',
            'font-style' => '/^(normal|italic)$/i',
            'text-decoration' => '/^(none|underline|line-through)$/i',
            'color' => '/^(#[a-f0-9]{3}(?:[a-f0-9]{3})?|[a-z]{1,20})$/i',
            'background-color' => '/^(#[a-f0-9]{3}(?:[a-f0-9]{3})?|[a-z]{1,20})$/i',
        ];
        $safe = [];
        foreach (explode(';', $value) as $declaration) {
            $pair = explode(':', $declaration, 2);
            if (count($pair) !== 2) {
                continue;
            }
            [$property, $setting] = array_map('trim', $pair);
            $property = strtolower($property);
            if (isset($allowed[$property]) && preg_match($allowed[$property], $setting)) {
                $safe[] = $property.':'.$setting;
            }
        }
        return implode(';', $safe);
    }
}

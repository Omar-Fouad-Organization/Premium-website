import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

test('public styles, layout components and design configuration remain identical to main baseline',()=>{
  const base='080ea485b41f034d733f467981aa73ec17b8a6e9';
  const paths=execFileSync('git',['ls-tree','-r','--name-only',base,'src','tailwind.config.ts'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(p=>p.endsWith('.css')||p.startsWith('src/components/ui/')||p==='tailwind.config.ts'||/src\/components\/(PremiumHeader|PremiumFooter)\.tsx/.test(p));
  assert.ok(paths.length>20);
  for(const p of paths) assert.equal(fs.readFileSync(p,'utf8').replaceAll('\r\n','\n'),execFileSync('git',['show',base+':'+p],{encoding:'utf8'}).replaceAll('\r\n','\n'),p);
});

test('CMS content binds qualified keys without silently selecting a duplicate bare key',()=>{
  const text=fs.readFileSync('src/hooks/usePageContent.ts','utf8');
  assert.match(text,/item.section_name \+ '\.' \+ item.content_key/);
  assert.match(text,/length === 1/);
});

test('page SEO changes metadata without mutating the configured defaults or rendering in a loop',()=>{
  const text=fs.readFileSync('src/contexts/SEOContext.tsx','utf8');
  const apply=text.slice(text.indexOf('const updateMetaTags ='),text.indexOf('const applyMetaTags ='));
  assert.match(apply,/useCallback/);assert.doesNotMatch(apply,/setSeoData/);
  assert.doesNotMatch(fs.readFileSync('src/hooks/usePageSEO.ts','utf8'),/\[props,/);
});

test('optional branding is a public-site-only opt-in with no application key or service token',()=>{
  const text=fs.readFileSync('src/components/PublicCmsBranding.tsx','utf8');
  assert.match(text,/branding_enabled === true/);assert.match(text,/credentials: 'omit'/);
  assert.doesNotMatch(text,/CMS_GATEWAY_KEY|X-Space-Delegation|allow-same-origin/);
});


test('branding accepts historical HSL and hex values while rejecting unsafe CSS',async()=>{
  const ts=await import('typescript');
  const compiled=ts.default.transpileModule(fs.readFileSync('src/lib/cmsBranding.ts','utf8'),{compilerOptions:{module:ts.default.ModuleKind.ESNext,target:ts.default.ScriptTarget.ES2022}}).outputText;
  const {cmsHslColor}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
  assert.equal(cmsHslColor('130 45% 30%'),'130 45% 30%');
  assert.equal(cmsHslColor('#fff'),'0.00 0.00% 100.00%');
  assert.equal(cmsHslColor('#000000'),'0.00 0.00% 0.00%');
  for(const value of ['361 20% 20%','20 101% 20%','url(javascript:alert(1))','red;position:fixed','#ffffff00'])assert.equal(cmsHslColor(value),null);
});

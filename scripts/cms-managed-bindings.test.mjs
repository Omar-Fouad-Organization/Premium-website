import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';
test('supported secondary hero CTA and Arabic contact settings are consumed by the active routes',()=>{
 assert.match(fs.readFileSync('src/pages/PremiumIndex.tsx','utf8'),/getSetting\("hero_cta_secondary"/);
 assert.match(fs.readFileSync('src/pages/PremiumContact.tsx','utf8'),/useSiteSettings/);
 assert.match(fs.readFileSync('src/components/PremiumFooter.tsx','utf8'),/useSiteSettings/);
 assert.match(fs.readFileSync('src/components/PremiumFooter.tsx','utf8'),/partner\.name_ar/);
});
test('targeted CMS corrections retain every existing class attribute and public link destination',()=>{
 for(const path of ['src/pages/PremiumIndex.tsx','src/pages/PremiumContact.tsx','src/components/PremiumFooter.tsx']){
  const before=execFileSync('git',['show','07c9ae03ac3c70e3a9ad49e08120b417b24906df:'+path],{encoding:'utf8'}),current=fs.readFileSync(path,'utf8');
  assert.deepEqual(current.match(/className=\"[^\"]*\"/g),before.match(/className=\"[^\"]*\"/g),path);
  assert.deepEqual(current.match(/to=\"[^\"]*\"/g),before.match(/to=\"[^\"]*\"/g),path);
 }
});

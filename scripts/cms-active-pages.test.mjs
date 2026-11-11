import {execFileSync} from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sponsorCards} from '../src/lib/sponsorCards.ts';

test('published sponsor cards reflect CMS values and never show inactive or exhibitor packages',()=>{
  const row={package_type:'sponsor',is_active:true,package_name:'Synthetic CMS package',price:'By quotation',features:['Synthetic benefit'],is_popular:true,display_order:2};
  assert.deepEqual(sponsorCards([row,{...row,package_name:'Unpublished',is_active:false},{...row,package_type:'exhibitor'}]),[{tier:'Synthetic CMS package',tagline:'',price:'By quotation',features:['Synthetic benefit'],highlight:true}]);
  assert.deepEqual(sponsorCards([]),[]);
});
test('active exhibitors and sponsors use the existing bilingual page-content contract',()=>{
  for(const page of ['Exhibitors','Sponsors','Content','Sectors','Visitors','Contact']){const source=fs.readFileSync('src/pages/Premium'+page+'.tsx','utf8');assert.ok(source.includes('usePageContent('+JSON.stringify(page.toLowerCase())+')'));assert.ok(source.includes(page.toLowerCase()+'_page_title'));}
});

test('CMS bindings preserve every original class attribute on affected public pages',()=>{for(const name of ['Index','Exhibitors','Sponsors','Content','Sectors','Visitors','Contact']){const path='src/pages/Premium'+name+'.tsx';const before=execFileSync('git',['show','a82f3aa2d376fc68009fe3df72eff54b427f65e2:'+path],{encoding:'utf8'});const current=fs.readFileSync(path,'utf8');assert.deepEqual(current.match(/className=\"[^\"]*\"/g),before.match(/className=\"[^\"]*\"/g),path);}});

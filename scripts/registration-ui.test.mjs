import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';
test('public design tokens, shared UI, header and footer remain unchanged',()=>{
 const base='bf649ff691e476b27d1b08dcd43ee6e18b97868e';
 const files=execFileSync('git',['ls-tree','-r','--name-only',base,'src'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(p=>p.endsWith('.css')||p.startsWith('src/components/ui/')||['src/components/PremiumHeader.tsx','src/components/PremiumFooter.tsx'].includes(p));
 for(const p of files)assert.equal(fs.readFileSync(p,'utf8').replaceAll('\r\n','\n'),execFileSync('git',['show',base+':'+p],{encoding:'utf8'}).replaceAll('\r\n','\n'),p);
});
test('buyer and visitor journeys have independent routes and use existing public components',()=>{
 const routes=fs.readFileSync('src/App.tsx','utf8'),form=fs.readFileSync('src/components/RegistrationForm.tsx','utf8');
 for(const path of ['/register/buyer','/register/visitor','/registration-status'])assert.ok(routes.includes('path="'+path+'"'));
 assert.match(form,/@\/components\/ui\/input/);assert.match(form,/operational_consent/);assert.match(form,/marketing_consent/);assert.doesNotMatch(form,/INTAKE_SERVICE_KEY|CMS_GATEWAY_KEY|localStorage/);
 assert.match(fs.readFileSync('src/pages/PremiumVisitors.tsx','utf8'),/\/register\/visitor/);
});
test('public and server inquiry types include speaker without converting visitor interest',()=>{
 const c=JSON.parse(fs.readFileSync('backend/config/intake-contract.json','utf8'));assert.ok(c.types.includes('speaker'));assert.ok(c.types.includes('visitor_interest'));assert.notEqual(c.types.indexOf('visitor'),c.types.indexOf('visitor_interest'));
 assert.match(fs.readFileSync('backend/config/cms.php','utf8'),/visitor,speaker,media/);
});
test('visitor page publishes no hard-coded obsolete dates or attendance counts',()=>{
 const page=fs.readFileSync('src/pages/PremiumVisitors.tsx','utf8');assert.doesNotMatch(page,/2025|2028|500\+|50\+/);assert.match(page,/approvedDates/);assert.match(page,/setRegistrationEnabled\(!error/);
});

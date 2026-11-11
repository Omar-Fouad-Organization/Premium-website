import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/portal/entryProof.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
for(const kind of ['activate','reset-password'])test(kind+' secret is captured in memory and synchronously stripped from navigation',()=>{
 let target='';const token='s'.repeat(64);
 const proof=mod.captureProof({hash:'#/portal/'+kind+'?token='+token+'&email=synthetic%40example.test',pathname:'/',search:''},{state:null,replaceState:(state,title,url)=>{target=url;}});
 assert.deepEqual(proof,{kind,email:'synthetic@example.test',token});assert.equal(target,'/#/portal/'+kind);assert.equal(target.includes(token),false);
});
test('malformed secrets are stripped and never retained',()=>{let target='';assert.equal(mod.captureProof({hash:'#/portal/activate?token=short',pathname:'/',search:''},{state:null,replaceState:(s,t,u)=>target=u}),null);assert.equal(target,'/#/portal/activate');});
test('ordinary public routes are untouched',()=>{assert.equal(mod.captureProof({hash:'#/exhibitors?category=1',pathname:'/',search:''},{state:null,replaceState:()=>assert.fail('public route modified')}),null);});

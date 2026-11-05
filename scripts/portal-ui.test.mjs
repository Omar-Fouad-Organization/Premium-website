import test from 'node:test';import assert from 'node:assert/strict';
import {editableProfile,screenKey,participantState,answerState,deliveryState} from '../src/portal/state.ts';
test('reduced dashboard and discovery profiles never enter the amendment editor',()=>{
 assert.equal(editableProfile(undefined),null);assert.equal(editableProfile({name_en:'Approved display',products:[]}),null);
});
test('complete sourcing drafts preserve explicit unknown answers and isolate edits from approved data',()=>{
 const approved={categories:[1],products:[{name_en:'Herbs',name_ar:'أعشاب'}],required_products:[],preferred_origins:[],required_certifications:[],meeting_interests:[],certifications:[],requirement_states:{origin:'unknown',documentation:'not_applicable'}};
 const draft=editableProfile(approved);assert.deepEqual(draft,approved);draft.products[0].name_en='Draft';assert.equal(approved.products[0].name_en,'Herbs');assert.equal(draft.requirement_states.origin,'unknown');
});
test('context and page changes never share a screen identity',()=>{
 assert.notEqual(screenKey('org-a','profile',1),screenKey('org-b','profile',1));assert.notEqual(screenKey('org-a','profile',1),screenKey('org-a','overview',1));assert.notEqual(screenKey('org-a','matches',1),screenKey('org-a','matches',2));
});
test('pending delivery and both-party acceptance never imply a confirmed booking in either language',()=>{
 for(const ar of [true,false]){assert.notEqual(deliveryState('confirmed',ar),participantState('confirmed',ar));assert.notEqual(participantState('pending',ar),participantState('confirmed',ar));assert.notEqual(participantState('mutually_accepted',ar),participantState('scheduled',ar));assert.notEqual(participantState('review_required',ar),participantState('rejected',ar));}
});
test('existing sourcing requirements remain applicable unless explicitly answered unknown or not applicable',()=>{
 assert.equal(answerState({required_products:['أعشاب']},'products'),'applicable');assert.equal(answerState({preferred_origins:[]},'origin'),'unknown');
 assert.equal(answerState({preferred_origins:['Egypt'],requirement_states:{origin:'unknown'}},'origin'),'unknown');assert.equal(answerState({requirement_states:{documentation:'not_applicable'}},'documentation'),'not_applicable');
});

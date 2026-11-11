import test from 'node:test';
import assert from 'node:assert/strict';
import {onsiteState} from '../src/portal/onsiteState.ts';
import {participantState} from '../src/portal/state.ts';

test('hosted approval, qualification, arrival and meeting completion remain distinct in both languages',()=>{
 for(const arabic of [false,true]){
  const labels=['not_nominated','candidate','approved','rejected','suspended','cancelled','eligibility_hold','arrived','no_show'].map(v=>onsiteState(v,arabic));
  assert.equal(new Set(labels).size,labels.length);
  assert.notEqual(onsiteState('approved',arabic),participantState('verified',arabic));
  assert.notEqual(onsiteState('arrived',arabic),participantState('completed',arabic));
  assert.equal(new Set(['positive_interest','followup_required','no_immediate_opportunity','not_interested'].map(v=>onsiteState(v,arabic))).size,4);
 }
});

test('unknown organizer values never echo private or untrusted raw strings',()=>{
 assert.equal(onsiteState('<script>private internal note</script>',false),'Organizer update');
 assert.equal(onsiteState('private internal note',true),'تحديث من المنظم');
});

// Offline smoke check for @rotom/synapse (no dependencies, no network).
// Mirrors the key behaviours of tests/canonical-contracts.test.ts against the
// built artifact (dist/index.js). Run: npm run build && npm run test:offline
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const s = require('../../dist/index.js');

// ReferenceKind
assert.equal(Object.values(s.ReferenceKind).length, 6);
assert.equal(s.ReferenceKind.Evidence, 'evidence');

// createEvidenceReference — valid + frozen
const ref = s.createEvidenceReference('ref-1', s.ReferenceKind.Knowledge, 'know-1', 'lbl', 0.9);
assert.equal(ref.referenceId, 'ref-1');
assert.equal(ref.type, s.ReferenceKind.Knowledge);
assert.equal(ref.targetId, 'know-1');
assert.equal(ref.label, 'lbl');
assert.equal(ref.confidence, 0.9);
assert.equal(Object.isFrozen(ref), true);

// createEvidenceReference — validation
assert.throws(() => s.createEvidenceReference('', s.ReferenceKind.Knowledge, 'tgt'), TypeError);
assert.throws(() => s.createEvidenceReference('ref-1', s.ReferenceKind.Knowledge, ''), TypeError);

// Supporting evidence / knowledge / memory
const se = s.createSupportingEvidence('ev-1', 'chain-a');
assert.equal(se.chainId, 'chain-a');
assert.throws(() => s.createSupportingEvidence('', 'c'), TypeError);
const sk = s.createSupportingKnowledge(s.createKnowledgeReference('ka-1'), 0.5);
assert.equal(sk.weight, 0.5);
assert.throws(() => s.createSupportingKnowledge(s.createKnowledgeReference('ka-1'), 1.5), RangeError);
const sm = s.createSupportingMemory(s.createMemoryReference('ma-1'), 0.25);
assert.equal(sm.reference.referenceId, 'ma-1');
assert.throws(() => s.createSupportingMemory(s.createMemoryReference('m'), -0.1), RangeError);

// ReasoningSupport — defaults + freezing
const r = s.createReasoningSupport();
assert.equal(r.evidenceSet.length, 0);
assert.equal(Object.isFrozen(r.evidenceSet), true);
const r2 = s.createReasoningSupport(
  [s.createEvidenceReference('r1', s.ReferenceKind.Evidence, 'e1')],
  [s.createMemoryReference('m1')],
  [s.createKnowledgeReference('k1')],
);
assert.equal(r2.evidenceSet.length, 1);
assert.equal(r2.workingMemory.length, 1);
assert.equal(r2.contextSnapshot.length, 1);

// MemoryQuery — required, optional and validation
const q = s.createMemoryQuery('session-1', 'user login');
assert.equal(q.sessionId, 'session-1');
assert.equal(q.query, 'user login');
assert.equal(Object.isFrozen(q), true);
const q2 = s.createMemoryQuery('session-1', 'login', 10, 0.5, 'exec-1');
assert.equal(q2.maxResults, 10);
assert.equal(q2.minRelevance, 0.5);
assert.equal(q2.executionId, 'exec-1');
assert.throws(() => s.createMemoryQuery('', 'q'), TypeError);
assert.throws(() => s.createMemoryQuery('s1', ''), TypeError);
assert.throws(() => s.createMemoryQuery('s1', 'q', 10, 1.5), RangeError);

console.log('OFFLINE CHECK PASS — all contract assertions succeeded against dist/index.js');

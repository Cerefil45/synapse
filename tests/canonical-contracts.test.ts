import { describe, it, expect } from 'vitest';
import {
  ReferenceKind,
  createEvidenceReference,
  createKnowledgeReference,
  createMemoryReference,
  createSupportingEvidence,
  createSupportingKnowledge,
  createSupportingMemory,
  createReasoningSupport,
  createMemoryQuery,
} from '@rotom/synapse';

describe('ReferenceKind', () => {
  it('defines all six reference kinds', () => {
    expect(Object.values(ReferenceKind)).toHaveLength(6);
    expect(ReferenceKind.Knowledge).toBe('knowledge');
    expect(ReferenceKind.Memory).toBe('memory');
    expect(ReferenceKind.Context).toBe('context');
    expect(ReferenceKind.Evidence).toBe('evidence');
    expect(ReferenceKind.Plugin).toBe('plugin');
    expect(ReferenceKind.External).toBe('external');
  });
});

describe('createEvidenceReference', () => {
  it('creates a frozen reference with referenceId, type, targetId', () => {
    const ref = createEvidenceReference('ref-1', ReferenceKind.Knowledge, 'know-1');
    expect(ref.referenceId).toBe('ref-1');
    expect(ref.type).toBe(ReferenceKind.Knowledge);
    expect(ref.targetId).toBe('know-1');
    expect(ref.label).toBeUndefined();
    expect(ref.confidence).toBeUndefined();
    expect(Object.isFrozen(ref)).toBe(true);
  });

  it('accepts optional label and confidence', () => {
    const ref = createEvidenceReference('ref-1', ReferenceKind.Memory, 'mem-1', 'My memory', 0.85);
    expect(ref.label).toBe('My memory');
    expect(ref.confidence).toBe(0.85);
  });

  it('throws TypeError for empty referenceId', () => {
    expect(() => createEvidenceReference('', ReferenceKind.Knowledge, 'tgt')).toThrow(TypeError);
  });

  it('throws TypeError for empty targetId', () => {
    expect(() => createEvidenceReference('ref-1', ReferenceKind.Knowledge, '')).toThrow(TypeError);
  });
});

describe('createKnowledgeReference', () => {
  it('creates a frozen reference with canonical referenceId', () => {
    const ref = createKnowledgeReference('ka-1', 'label');
    expect(ref.referenceId).toBe('ka-1');
    expect(ref.label).toBe('label');
    expect(Object.isFrozen(ref)).toBe(true);
  });
});

describe('createMemoryReference', () => {
  it('creates a frozen reference with canonical referenceId', () => {
    const ref = createMemoryReference('ma-1');
    expect(ref.referenceId).toBe('ma-1');
    expect(Object.isFrozen(ref)).toBe(true);
  });
});

describe('createSupportingEvidence', () => {
  it('mirrors the knowledge justification shape (evidenceId + chainId)', () => {
    const s = createSupportingEvidence('ev-1', 'chain-a');
    expect(s.evidenceId).toBe('ev-1');
    expect(s.chainId).toBe('chain-a');
    expect(s.role).toBeUndefined();
    expect(Object.isFrozen(s)).toBe(true);
  });

  it('throws TypeError for empty evidenceId', () => {
    expect(() => createSupportingEvidence('', 'chain-a')).toThrow(TypeError);
  });

  it('throws TypeError for empty chainId', () => {
    expect(() => createSupportingEvidence('ev-1', '')).toThrow(TypeError);
  });
});

describe('createSupportingKnowledge / createSupportingMemory', () => {
  it('wraps a reference and optional weight', () => {
    const sk = createSupportingKnowledge(createKnowledgeReference('ka-1'), 0.5);
    expect(sk.reference.referenceId).toBe('ka-1');
    expect(sk.weight).toBe(0.5);

    const sm = createSupportingMemory(createMemoryReference('ma-1', 'm'), 0.25);
    expect(sm.reference.referenceId).toBe('ma-1');
    expect(sm.weight).toBe(0.25);
  });

  it('throws RangeError for out-of-range weight', () => {
    expect(() => createSupportingKnowledge(createKnowledgeReference('ka-1'), 1.5)).toThrow(RangeError);
    expect(() => createSupportingMemory(createMemoryReference('ma-1'), -0.1)).toThrow(RangeError);
  });
});

describe('createReasoningSupport', () => {
  it('defaults to empty frozen arrays', () => {
    const r = createReasoningSupport();
    expect(r.evidenceSet).toEqual([]);
    expect(r.workingMemory).toEqual([]);
    expect(r.contextSnapshot).toEqual([]);
    expect(Object.isFrozen(r.evidenceSet)).toBe(true);
    expect(Object.isFrozen(r.workingMemory)).toBe(true);
    expect(Object.isFrozen(r.contextSnapshot)).toBe(true);
  });

  it('freezes provided references', () => {
    const r = createReasoningSupport(
      [createEvidenceReference('r1', ReferenceKind.Evidence, 'e1')],
      [createMemoryReference('m1')],
      [createKnowledgeReference('k1')],
    );
    expect(r.evidenceSet).toHaveLength(1);
    expect(r.workingMemory).toHaveLength(1);
    expect(r.contextSnapshot).toHaveLength(1);
  });
});

describe('createMemoryQuery', () => {
  it('creates a frozen query with required fields', () => {
    const q = createMemoryQuery('session-1', 'user login');
    expect(q.sessionId).toBe('session-1');
    expect(q.query).toBe('user login');
    expect(q.maxResults).toBeUndefined();
    expect(q.minRelevance).toBeUndefined();
    expect(q.executionId).toBeUndefined();
    expect(Object.isFrozen(q)).toBe(true);
  });

  it('accepts optional maxResults, minRelevance, executionId', () => {
    const q = createMemoryQuery('session-1', 'login', 10, 0.5, 'exec-1');
    expect(q.maxResults).toBe(10);
    expect(q.minRelevance).toBe(0.5);
    expect(q.executionId).toBe('exec-1');
  });

  it('throws TypeError for empty sessionId', () => {
    expect(() => createMemoryQuery('', 'query')).toThrow(TypeError);
  });

  it('throws TypeError for empty query', () => {
    expect(() => createMemoryQuery('s1', '')).toThrow(TypeError);
  });

  it('throws RangeError for out-of-range minRelevance', () => {
    expect(() => createMemoryQuery('s1', 'q', 10, 1.5)).toThrow(RangeError);
    expect(() => createMemoryQuery('s1', 'q', 10, -0.1)).toThrow(RangeError);
  });
});

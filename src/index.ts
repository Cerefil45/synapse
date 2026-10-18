export enum ReferenceKind {
  Knowledge = 'knowledge',
  Memory = 'memory',
  Context = 'context',
  Evidence = 'evidence',
  Plugin = 'plugin',
  External = 'external',
}

export interface CanonicalEvidenceReference {
  readonly referenceId: string;
  readonly type: ReferenceKind;
  readonly targetId: string;
  readonly label?: string;
  readonly confidence?: number;
}

export interface CanonicalKnowledgeReference {
  readonly referenceId: string;
  readonly label?: string;
}

export interface CanonicalMemoryReference {
  readonly referenceId: string;
  readonly label?: string;
}

export interface SupportingEvidence {
  readonly evidenceId: string;
  readonly chainId: string;
  readonly role?: string;
}

export interface SupportingKnowledge {
  readonly reference: CanonicalKnowledgeReference;
  readonly weight?: number;
}

export interface SupportingMemory {
  readonly reference: CanonicalMemoryReference;
  readonly weight?: number;
}

export interface ReasoningSupport {
  readonly evidenceSet: ReadonlyArray<CanonicalEvidenceReference>;
  readonly workingMemory: ReadonlyArray<CanonicalMemoryReference>;
  readonly contextSnapshot: ReadonlyArray<CanonicalKnowledgeReference>;
}

export interface MemoryQuery {
  readonly sessionId: string;
  readonly executionId?: string;
  readonly query: string;
  readonly maxResults?: number;
  readonly minRelevance?: number;
}

export function createEvidenceReference(
  referenceId: string,
  type: ReferenceKind,
  targetId: string,
  label?: string,
  confidence?: number,
): CanonicalEvidenceReference {
  if (!referenceId || referenceId.trim().length === 0) {
    throw new TypeError('EvidenceReference referenceId must be a non-empty string');
  }
  if (!targetId || targetId.trim().length === 0) {
    throw new TypeError('EvidenceReference targetId must be a non-empty string');
  }
  return Object.freeze({
    referenceId,
    type,
    targetId,
    ...(label ? { label } : {}),
    ...(confidence !== undefined ? { confidence } : {}),
  });
}

export function createKnowledgeReference(
  referenceId: string,
  label?: string,
): CanonicalKnowledgeReference {
  return Object.freeze({ referenceId, ...(label ? { label } : {}) });
}

export function createMemoryReference(
  referenceId: string,
  label?: string,
): CanonicalMemoryReference {
  return Object.freeze({ referenceId, ...(label ? { label } : {}) });
}

export function createSupportingEvidence(
  evidenceId: string,
  chainId: string,
  role?: string,
): SupportingEvidence {
  if (!evidenceId || evidenceId.trim().length === 0) {
    throw new TypeError('SupportingEvidence evidenceId must be a non-empty string');
  }
  if (!chainId || chainId.trim().length === 0) {
    throw new TypeError('SupportingEvidence chainId must be a non-empty string');
  }
  return Object.freeze({ evidenceId, chainId, ...(role ? { role } : {}) });
}

export function createSupportingKnowledge(
  reference: CanonicalKnowledgeReference,
  weight?: number,
): SupportingKnowledge {
  if (!reference) {
    throw new TypeError('SupportingKnowledge reference is required');
  }
  if (weight !== undefined && (weight < 0 || weight > 1 || !Number.isFinite(weight))) {
    throw new RangeError('SupportingKnowledge weight must be a finite number in [0,1]');
  }
  return Object.freeze({ reference, ...(weight !== undefined ? { weight } : {}) });
}

export function createSupportingMemory(
  reference: CanonicalMemoryReference,
  weight?: number,
): SupportingMemory {
  if (!reference) {
    throw new TypeError('SupportingMemory reference is required');
  }
  if (weight !== undefined && (weight < 0 || weight > 1 || !Number.isFinite(weight))) {
    throw new RangeError('SupportingMemory weight must be a finite number in [0,1]');
  }
  return Object.freeze({ reference, ...(weight !== undefined ? { weight } : {}) });
}

export function createReasoningSupport(
  evidenceSet?: CanonicalEvidenceReference[],
  workingMemory?: CanonicalMemoryReference[],
  contextSnapshot?: CanonicalKnowledgeReference[],
): ReasoningSupport {
  return Object.freeze({
    evidenceSet: Object.freeze([...(evidenceSet ?? [])]),
    workingMemory: Object.freeze([...(workingMemory ?? [])]),
    contextSnapshot: Object.freeze([...(contextSnapshot ?? [])]),
  });
}

export function createMemoryQuery(
  sessionId: string,
  query: string,
  maxResults?: number,
  minRelevance?: number,
  executionId?: string,
): MemoryQuery {
  if (!sessionId || sessionId.trim().length === 0) {
    throw new TypeError('MemoryQuery sessionId must be a non-empty string');
  }
  if (!query || query.trim().length === 0) {
    throw new TypeError('MemoryQuery query must be a non-empty string');
  }
  if (minRelevance !== undefined && (minRelevance < 0 || minRelevance > 1 || !Number.isFinite(minRelevance))) {
    throw new RangeError('MemoryQuery minRelevance must be a finite number in [0,1]');
  }
  return Object.freeze({
    sessionId,
    query,
    executionId,
    ...(maxResults ? { maxResults } : {}),
    ...(minRelevance !== undefined ? { minRelevance } : {}),
  });
}

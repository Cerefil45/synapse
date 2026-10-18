# @rotom/synapse — canonical cognitive contracts (standalone candidate)

Canonical cognitive contracts shared by Memory/Knowledge/Evidence/Reasoning:
`ReferenceKind`, `CanonicalEvidenceReference`, `CanonicalKnowledgeReference`,
`CanonicalMemoryReference`, `SupportingEvidence`, `SupportingKnowledge`,
`SupportingMemory`, `ReasoningSupport`, `MemoryQuery`, plus validated, frozen
factory functions (`createEvidenceReference`, `createReasoningSupport`,
`createMemoryQuery`, …).

This repository is a **standalone candidate** extracted from the
`project-rotom` monorepo (source revision `1493e685340b0fd9cc92f8159ed48941a6567dc4`,
`packages/synapse`). It contains zero runtime dependencies.

## Status

- Local build: **verified** (tsc → `dist/`).
- Local consumption from a packed tarball: **verified** (see
  `../consumer` and `../reports/GIT_CONSUMER_VALIDATION_REPORT.md`).
- Installation from a Git URL: **pending** — no remote repository has been
  created or authorized yet. The declaration below is the intended final form
  and uses placeholders on purpose.

## Intended installation (once an authorized remote exists)

```json
"dependencies": {
  "@rotom/synapse": "git+https://github.com/OWNER/REPOSITORY.git#<ref>"
}
```

`OWNER`, `REPOSITORY` and `<ref>` are **placeholders** — replace them only when
a remote repository has been explicitly authorized, created and pushed, and a
tag/commit has been pinned. Do not install from a mutable branch.

Until then, the supported path is: build this package (`npm run build`), pack
it (`npm pack`) and install the resulting tarball.

## Build from a fresh checkout (with network)

```bash
npm install    # installs devDependencies (typescript, vitest) and runs `prepare` (build)
npm test       # vitest suite (tests/canonical-contracts.test.ts)
```

The `prepare` script builds `dist/` automatically, so a Git-dependency install
receives compiled output and declarations. `dist/` is intentionally
git-ignored: it is a build artifact.

## Offline smoke check (no network, no dependencies)

```bash
npm run build          # or: node <typescript>/bin/tsc -p .
npm run test:offline   # node tests/offline/offline-check.mjs
```

## Usage

```ts
import {
  ReferenceKind,
  createEvidenceReference,
  createReasoningSupport,
  createMemoryQuery,
} from '@rotom/synapse';

const evidence = createEvidenceReference('doc-42', ReferenceKind.External, 'https://example.org', 'source', 0.9);
const support = createReasoningSupport([evidence], [], []);
const query = createMemoryQuery('session-1', 'user login', 10, 0.5, 'exec-1');
```

All factories validate their inputs (`TypeError` / `RangeError`) and return
frozen objects.

## Runtime requirements

Node.js `>=22.0.0`. CommonJS output (`dist/index.js`) with TypeScript
declarations (`dist/index.d.ts`). No services, files, environment variables or
persistent state are required.

## Provenance and adaptations

Source: `project-rotom` `packages/synapse` at revision
`1493e685340b0fd9cc92f8159ed48941a6567dc4`. `src/index.ts` and the vitest
suite are verbatim copies. Documented adaptations (see
`../reports/STANDALONE_REPOSITORY_REPORT.md`): removed the unused
`@rotom/foundation` dependency, removed repository/homepage/bugs fields
(no authorized remote exists), added an `exports` map, a `prepare` build
script, `typescript` as an explicit devDependency, an inlined `tsconfig.json`
(replacing the monorepo `extends`), and an offline smoke check.

## License

MIT — see `LICENSE`.

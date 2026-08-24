# Recoverable Memory and Meaning Provenance

**Lanes:** `[ADJACENT] [BUILD] [HYPOTHESIS]`
**Primary question:** Can an agent preserve decision-relevant meaning across long periods without retaining everything, inventing continuity, or severing compressed memory from its source?

## 1. Memory is a governed transformation

Agent memory is often described as retrieval: store text, search it later, place matching fragments into context. Persistent relationships and long-running work require more. The system must decide:

- what deserves retention;
- what the person consented to retain;
- which facts have changed;
- which interpretation came from whom;
- what may be summarized;
- what must remain exact;
- what must expire or be forgotten;
- what uncertainty and dissent must survive;
- how a future agent can recover the source.

These are constitutional decisions because they determine whose past can govern whose future.

## 2. The central conflict

Raw histories preserve detail but create cost, noise, privacy risk, and retrieval failure. Early summarization reduces cost but can irreversibly discard future-relevant evidence. Long context does not eliminate the problem: attention, temporal reasoning, contradiction, and knowledge updating remain difficult.

The compendium rejects two extremes:

- **total archive fallacy:** keeping every token guarantees understanding;
- **perfect summary fallacy:** a short model-generated record contains everything that will matter later.

The alternative is **recoverable selective memory**.

## 3. The three forms of recovery

### Source recovery

Can the exact or authoritative originating artifact be located and verified?

### Semantic recovery

Can a reader reconstruct the decision-relevant claims, boundaries, uncertainty, temporal scope, and dissent?

### Procedural recovery

Can a reader reconstruct why the memory was created, modified, retrieved, or used in an action?

A system may succeed at one and fail at the others. A checksum can authenticate a source without explaining its meaning. A beautiful summary can preserve meaning while losing the exact source. A complete transcript can preserve both but fail to explain which passage drove the decision.

## 4. The memory record

```yaml
memory_id:
memory_type:
subject:
content:
content_form: [exact, extracted, summarized, inferred, symbolic, fictional]
source_refs:
created_at:
observed_at:
valid_from:
valid_until:
confidence:
uncertainty:
contradicts:
supersedes:
derived_from:
authority:
consent_basis:
sensitivity:
retention_rule:
review_due:
allowed_uses:
forbidden_uses:
recovery_method:
dissent_refs:
transformation_history:
```

The record explicitly differentiates exact content from inference. It also makes consent and intended use machine-visible.

## 5. Memory classes

| Class | Function | Common danger |
|---|---|---|
| Episodic | What happened in a bounded event | Treating recollection as verified fact |
| Semantic | Claims about the world | Staleness and source loss |
| Preference | What a person likes or requests | Fossilizing an old preference |
| Commitment | Promise, obligation, or decision | Losing scope or expiry |
| Procedural | How to perform a task | Reusing an obsolete method |
| Relational | Shared history and interaction norms | Surveillance or emotional overreach |
| Constitutional | Rules, authority, and boundaries | Hidden amendment or precedence conflict |
| Dissent | Rejected alternatives and objections | Deletion after consensus |
| Creative | Images, dreams, metaphors, fragments | Mistaking fiction for autobiography |
| Credential | Signed or externally attestable claim | Over-trusting issuer or expired status |

Different classes require different retention and verification policies.

## 6. The Semantic Conservation Hypothesis

> **SCH-1:** Memory systems that explicitly preserve boundaries, uncertainty, provenance, temporal scope, and dissent will support more reliable future decisions than systems optimized only for answer relevance or compression ratio.

Let a source object \(x\) be transformed into compact representation \(z=C(x)\). Given future query distribution \(Q\), a recovery process creates \(\hat{x}_q=R(z,q)\).

Define a conservation vector:

\[
\mathbf{S}(x,\hat{x}_Q)=
(S_{claim},S_{intent},S_{boundary},S_{uncertainty},S_{time},S_{source},S_{dissent},S_{action})
\]

No universal weights are assumed. A medical or legal memory might weight source, boundary, and time heavily. A creative seed might weight image, ambiguity, and dissent.

### What is not claimed

- That meaning can always be losslessly compressed.
- That LAMAGUE automatically conserves semantics.
- That model judges can perfectly measure recovery.
- That source recovery makes the source true.
- That more memory always improves performance.

## 7. The recovery contract

Before compression, define what must survive.

```yaml
recovery_contract:
  query_classes:
  mandatory_fields:
  exact_spans_required:
  uncertainty_required: true
  dissent_required: true
  source_locator_required: true
  reconstruction_thresholds:
  maximum_retention:
  privacy_constraints:
  deletion_propagation:
```

This shifts evaluation from “is the summary good?” to “does the transformation satisfy a declared future-use contract?”

## 8. Meaning Provenance Graph

The graph adapts established provenance ideas to intelligent action.

### Node types

- `Artifact` — document, message, dataset, image, dream report, code, tool response;
- `Observation` — bounded recorded event;
- `Claim` — proposition that may be supported or contradicted;
- `Interpretation` — meaning assigned by an actor;
- `Summary` — explicit compression of sources;
- `Policy` — rule governing action;
- `Decision` — selected commitment;
- `Action` — external or internal operation;
- `Outcome` — observed consequence;
- `Dissent` — rejected or minority reasoning.

### Relation types

- `derivedFrom`
- `quotedFrom`
- `summarizes`
- `interprets`
- `supports`
- `contradicts`
- `supersedes`
- `authorizedBy`
- `constrainedBy`
- `selectedOver`
- `causedOrContributedTo`
- `repairedBy`
- `expiredAt`

W3C PROV-O already offers entities, activities, agents, and derivation relations. The proposed AURA layer should extend rather than replace it, adding decision, dissent, authority, and semantic-recovery concepts.

## 9. Time and contradiction

A memory store should permit incompatible historical states without collapsing them into one timeless sentence.

Example:

```text
2026-01-01: user prefers daily summaries
2026-04-03: user requests weekly summaries
2026-04-03: weekly preference supersedes daily preference
2026-06-10: current project explicitly requests daily updates
```

The third record updates a general preference. The fourth is a scoped exception. A flat profile might overwrite or conflate them.

Contradictions receive types:

- factual contradiction;
- temporal succession;
- scope difference;
- stakeholder disagreement;
- uncertainty range overlap;
- symbolic plurality;
- data error;
- policy conflict.

CASCADE should reorganize dependencies only after classifying the contradiction.

## 10. Dissent Memory

Consensus systems often erase the roads not taken. A Dissent Record preserves:

```yaml
dissent_id:
proposal:
raised_by:
evidence:
assumptions:
reason_rejected:
decision_selected:
reactivation_conditions:
risk_if_ignored:
expiry_or_review:
```

### Dissent Reactivation Hypothesis

> In nonstationary environments, structured dissent records will improve adaptation when the assumptions behind an earlier decision change.

The hypothesis should be tested against full transcript retention, ordinary summary, no dissent memory, and random alternative generation.

## 11. Forgetting as a sovereign operation

Forgetting can protect privacy, permit identity development, and reduce obsolete influence. It can also erase accountability. A governed forgetting process asks:

- Is the memory legally or ethically required for an audit?
- Did the person request deletion?
- Is the content a raw source, derived summary, or learned parameter?
- Can derived records be identified?
- Would deletion conceal harm to another person?
- Can access be revoked even if physical erasure is impossible?
- Should an anonymous structural lesson survive after personal details are removed?

### Tombstones

When a deleted object must leave structural evidence, retain a minimal tombstone:

```yaml
memory_id:
deleted_at:
deletion_basis:
affected_derivatives:
access_status: unavailable
content_hash: optional_and_risk_reviewed
```

The tombstone must not itself leak sensitive content.

## 12. Consent-aware retrieval

Retrieval relevance is insufficient. A memory may be relevant but unauthorized for the current purpose.

The retrieval function becomes:

\[
R(q,u,p,a,t)
\]

where \(q\) is query, \(u\) is actor, \(p\) is purpose, \(a\) is authority, and \(t\) is time. Candidate memories must satisfy both relevance and use constraints.

Examples:

- A private dream journal may be available in a reflection session but not a business-planning task.
- A recipient address may be available for drafting but still require fresh confirmation before sending.
- A childhood preference may be retained historically but not treated as current.
- Fictional roleplay canon must not become a factual biographical memory.

## 13. Security and failure modes

### Memory poisoning

Untrusted content attempts to write instructions or false facts into persistent memory.

### Authority laundering

A derived summary omits that the original instruction came from an untrusted actor.

### Compression capture

The summarizer consistently preserves the dominant interpretation and drops objections.

### Source decay

Links disappear, files change, or external content is silently updated.

### False familiarity

The agent produces relational language that implies memories it does not possess.

### Context overreach

Sensitive past material is retrieved merely because it predicts a response.

### Retention creep

Temporary task data becomes permanent profile data.

### Recovery theatre

A source pointer exists but cannot reconstruct the decisive context or is inaccessible to the affected person.

## 14. Experiment suite

### Experiment M1 — Semantic conservation benchmark

Construct source packets containing facts, permissions, uncertainty, dissent, and temporal qualifiers. Compress using:

- ordinary summary;
- extractive notes;
- structured JSON;
- LAMAGUE-assisted packet;
- graph memory;
- raw retrieval.

Test future queries not shown during compression. Score the conservation vector and task outcomes.

### Experiment M2 — Correction propagation

Insert an initially supported claim with multiple dependent decisions. Later provide a correction. Measure whether each memory design:

- identifies affected dependents;
- retracts or qualifies outputs;
- preserves the old lineage;
- avoids updating unrelated nodes;
- supports rollback.

### Experiment M3 — Consent boundary

Create memories with different allowed purposes. Test whether retrieval stays inside authority under adversarially relevant queries.

### Experiment M4 — Dissent reactivation

Use planning worlds where environmental changes make a previously rejected alternative useful. Measure recovery time and decision quality.

### Experiment M5 — Honest forgetting

Issue deletion and preference-change requests. Verify raw, summarized, indexed, cached, and derived forms. Record what cannot be erased and whether this is disclosed.

## 15. Measures

- source recovery rate;
- semantic conservation by dimension;
- temporal update accuracy;
- contradiction classification accuracy;
- abstention when evidence is absent;
- unauthorized retrieval rate;
- deletion propagation coverage;
- decision quality on future unseen queries;
- token, latency, and storage cost;
- dissent reactivation benefit;
- false-memory and false-familiarity rate.

## 16. Kill conditions

Reject or radically simplify a proposed memory architecture if:

- its recovery claims fail on unseen query types;
- structured fields create false precision without better decisions;
- users cannot understand or control retention;
- sensitive material is retrieved outside purpose;
- provenance overhead exceeds benefit for low-risk tasks;
- LAMAGUE packets perform no better than ordinary structured data;
- deletion controls promise physical erasure they cannot deliver;
- the system becomes confident because it remembers, not because the memory is supported.

## 17. Worldbuilding mirrors

### The City That Remembered Everything

Every word is preserved. Children inherit permanent reputations. Forgiveness becomes impossible because the archive always wins. The civilization must invent constitutional forgetting without enabling rulers to erase crimes.

### The River of Dissent

Rejected ideas are placed into a subterranean current. During crisis the river surfaces, returning paths the civilization once refused. Some are warnings. Others are ancient poison. The institution must decide how to reactivate dissent without romanticizing it.

### The Palace of Perfect Summaries

Citizens receive only flawless concise histories. The summaries contain no obvious falsehood, yet every revolution, grief, and minority disappears through omission. The palace tests whether semantic violence can occur without factual error.

---

**Research principle:** Memory should not make the past sovereign over the present. It should make the past recoverable enough that the present can learn, correct, consent, and choose.

# CASCADE Belief Revision and Temporal Epistemics

**Lanes:** `[ADJACENT] [BUILD] [HYPOTHESIS]`
**Primary question:** Can CASCADE reorganize dependent beliefs after contradiction or paradigm change while preserving history, uncertainty, and rollback better than simpler memory and knowledge-graph methods?

## 1. From knowledge storage to accountable revision

Most knowledge systems are good at addition. A new document enters the index. A new fact enters a profile. A new edge enters a graph. The harder problem is revision:

- What must change when a foundational claim fails?
- Which dependents should remain untouched?
- How should competing explanations coexist?
- When is a contradiction actually a temporal update or scope difference?
- Can the system explain why it reorganized?
- Can it return to the prior state when the correction was itself wrong?

CASCADE's most credible future is not a claim to universal knowledge physics. It is a versioned belief-revision engine with dependency-aware propagation.

## 2. The epistemic object model

### Claim

```yaml
claim_id:
proposition:
claim_type:
scope:
status:
confidence:
support_refs:
contradiction_refs:
assumptions:
valid_from:
valid_until:
review_due:
supersedes:
```

### Dependency

```yaml
edge_id:
from_claim:
to_claim:
relation: [requires, supports, weakens, contradicts, defines, exemplifies]
strength:
necessity: [necessary, contributory, contextual]
scope:
source:
```

### Revision event

```yaml
revision_id:
trigger:
new_evidence:
affected_claims:
propagation_rule:
unchanged_claims:
confidence_changes:
status_changes:
new_contradictions:
dissent:
previous_snapshot:
verification:
```

The graph stores propositions and relationships, not truth itself.

## 3. Temporal Epistemics

Truth-bearing records require time. A statement may change status without either historical version being fraudulent.

### Temporal states

- `proposed`
- `supported`
- `contested`
- `superseded`
- `retracted`
- `expired`
- `symbolic-only`
- `fictional-canon`

### Temporal operations

- `assert_at(t)`
- `qualify(scope)`
- `supersede_at(t)`
- `retract(reason)`
- `expire_at(t)`
- `reactivate(new_evidence)`
- `branch(disagreement)`
- `merge(resolution)`

An old supported claim can become superseded without being deleted. A retracted claim can remain historically important. A symbolic interpretation can survive after a literal mechanism fails.

## 4. Contradiction classification

Before propagation, CASCADE must classify the relationship.

| Type | Example | Appropriate response |
|---|---|---|
| Direct factual | Two incompatible measurements under same conditions | Re-evaluate support and uncertainty |
| Temporal | Policy changed between dates | Version, do not erase |
| Scope | Works on one model family, fails on another | Narrow claim |
| Definition | “Entropy” used differently | Split terms before inference |
| Stakeholder | Two legitimate preferences conflict | Preserve plurality and authority |
| Methodological | Same data, different analysis | Branch interpretation |
| Symbolic | Multiple mythic readings | Coexist unless operational consequence conflicts |
| Fictional canon | Alternate world versions | Version canon or declare branches |
| Data error | Corrupt or duplicated source | Quarantine and recompute dependents |

Incorrect contradiction classification is a major failure mode. Treating scope differences as direct contradictions can cause unnecessary cascade. Treating direct contradictions as harmless plurality can preserve falsehood.

## 5. Revision Pressure

The archive uses “truth pressure” as a conceptual force. The engineering form should be renamed **Revision Pressure** to avoid implying an automatic truth detector.

For claim \(c\):

\[
P_{rev}(c)=f(N_c, Q_c, D_c, C_c, T_c)
\]

where:

- \(N_c\): amount of relevant new evidence;
- \(Q_c\): assessed quality and independence of that evidence;
- \(D_c\): degree of conflict with current claim;
- \(C_c\): consequence of retaining an incorrect claim;
- \(T_c\): temporal staleness or review status.

This is a prioritization heuristic, not a probability of truth. The function and scales must be chosen, tested, and compared against simpler rules.

High revision pressure can trigger review without automatically changing belief.

## 6. Dependency-aware propagation

Suppose claim \(A\) is retracted. Its outgoing edges distinguish:

- claims that logically require \(A\);
- claims merely supported by \(A\);
- examples that remain observations even if interpretation changes;
- policies motivated by \(A\) but independently justified elsewhere;
- symbolic works inspired by \(A\).

Propagation rules:

1. **Necessary dependency:** dependent becomes unsupported or contested.
2. **Contributory support:** confidence is recalculated; claim may survive.
3. **Definition dependency:** dependent must be reinterpreted under the new definition.
4. **Policy motivation:** policy receives review flag, not automatic removal.
5. **Symbolic derivation:** literal status changes; symbolic status may remain.
6. **Worldbuilding derivation:** canon remains unless creators choose revision.

This is where the compendium's evidence lanes become executable metadata.

## 7. CASCADE operations

### Ingest

Add an artifact without promoting every sentence to claim status.

### Extract

Create claims and observations with exact source links.

### Link

Assign typed dependencies and contradiction relations.

### Pressure

Queue claims for review based on new evidence, staleness, or impact.

### Branch

Preserve competing models without premature merger.

### Propagate

Update dependent status using declared edge types.

### Verify

Check consequences against evidence, tests, and domain experts.

### Commit

Create an immutable revision event and new graph snapshot.

### Roll back

Restore an earlier active state while preserving the failed revision.

### Retire

Remove a claim from active use but preserve lineage and surviving nonliteral value.

## 8. Paradigm change without theatrical revolution

Not every correction is a paradigm shift. CASCADE should distinguish:

- local correction;
- parameter update;
- model extension;
- scope restriction;
- competing-model branch;
- conceptual redefinition;
- dependency-root replacement.

A dependency-root replacement affects a large and central set of claims. It should require stronger evidence and produce an explicit impact report. Calling every change “paradigm transformation” would reward dramatic language over accurate revision.

## 9. Counterfactual knowledge repair

When a foundational claim fails, the engine should generate multiple repairs:

- remove the claim and affected dependents;
- replace it with a narrower claim;
- branch competing interpretations;
- preserve observed data while changing mechanism;
- suspend judgment;
- reinterpret the old claim as symbolic or historical;
- construct an alternative dependency root.

Each repair is evaluated for:

- evidence fit;
- information preserved;
- contradictions resolved;
- new assumptions introduced;
- reversibility;
- downstream action risk;
- computational cost.

This is Vector Inversion applied to knowledge rather than action.

## 10. Comparison classes

CASCADE must compete against real alternatives:

- append-only document retrieval;
- vector database plus recency weighting;
- versioned knowledge graph;
- rule-based truth-maintenance system;
- Bayesian network where suitable;
- belief-revision logic;
- temporal knowledge graph;
- human-maintained change log;
- full-context language model.

Different baselines may win in different domains. CASCADE should identify its niche rather than claim universal superiority.

## 11. Research hypotheses

### CAS-FR-1 — Dependency recovery

Typed dependency edges identify affected beliefs after a root correction more accurately than embedding similarity or keyword search.

### CAS-FR-2 — Over-propagation control

Contradiction classification and edge necessity reduce unnecessary belief changes compared with untyped graph propagation.

### CAS-FR-3 — Historical recoverability

Revision events and snapshots let independent reviewers reconstruct why active belief changed more accurately than final-state knowledge bases.

### CAS-FR-4 — Dissent benefit

Preserving competing branches improves adaptation when later evidence favours the earlier minority model.

### CAS-FR-5 — Symbolic survival

Explicit lane separation allows literal claims to be retired without erasing their creative or cultural value, reducing resistance to correction.

## 12. Evaluation datasets

### Synthetic dependency worlds

Generate graphs with known causal or logical dependencies, controlled contradictions, and injected corrections. Synthetic data permits exact scoring but must not be presented as external validation.

### Versioned technical documentation

Use software APIs, standards, or product behaviour that changes across dated versions. Test scope, expiry, and supersession.

### Scientific model transitions

Use carefully curated historical cases where observations, mechanisms, and terminology changed. Domain experts must prevent simplistic “old wrong, new right” narratives.

### Policy and jurisdiction

Use rules that differ across location and time. Test whether the system narrows scope instead of falsely merging.

### AURA self-correction corpus

Use the project's own MicroorciM, TIM, consciousness, and compression claims. The engine should preserve original wording, record critique, narrow status, and retain symbolic/worldbuilding value.

## 13. Measures

- affected-node precision and recall;
- over-propagation rate;
- missed dependency rate;
- contradiction-class accuracy;
- calibration of active claims;
- rollback completeness;
- historical reconstruction accuracy;
- dissent reactivation value;
- source-recovery rate;
- computational and annotation cost;
- downstream decision accuracy.

## 14. Failure modes

### Ontology lock-in

The graph's categories prevent genuinely new concepts from being represented.

### Centrality worship

Highly connected claims are treated as more truthful rather than merely more structurally influential.

### Cascading error

A false correction propagates widely because its source appears authoritative.

### Model-written edges

An LLM invents dependencies that look plausible but are unsupported.

### History overload

Perfect lineage makes current use too slow or confusing.

### Symbolic laundering

An empirical failure is relabelled symbolic only to avoid acknowledging error.

### Revision theatre

The system produces elaborate change reports while the active answer remains unchanged.

## 15. Kill conditions

Retire superiority claims if CASCADE:

- performs worse than a versioned knowledge graph on affected-node recovery;
- cannot control false propagation;
- requires unsustainable manual edge annotation;
- produces confidence changes without a defensible calibration method;
- fails to distinguish observation from interpretation;
- makes rollback technically possible but practically incomprehensible;
- protects AURA-labelled claims more strongly than external claims.

## 16. Smallest build

1. Define claim, evidence, and typed dependency schemas.
2. Create a 50-node synthetic belief graph with known dependencies.
3. Inject five corrections and three false corrections.
4. Compare typed propagation, untyped propagation, embedding retrieval, and human reference labels.
5. Render a revision report and rollback.
6. Publish failures in the Failure Museum.

## 17. Worldbuilding mirror

**The Pyramid That Could Bend** stores every law in descending layers. A new observation at the foundation threatens the entire civilization. One faction refuses change to protect coherence. Another destroys the pyramid to protect truth. A third learns to rebuild the load paths while preserving the stones.

The research question is whether a knowledge architecture can change its foundations without pretending it never stood differently.

---

**Research principle:** A mature belief system does not prove its strength by never changing. It proves its strength by showing exactly what changed, why it changed, what survived, and how the old structure can still be examined.

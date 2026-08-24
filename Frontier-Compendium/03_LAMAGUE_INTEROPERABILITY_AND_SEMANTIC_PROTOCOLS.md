# LAMAGUE Interoperability and Semantic Protocols

**Lanes:** `[ADJACENT] [BUILD] [HYPOTHESIS] [SYMBOLIC]`
**Primary question:** Can LAMAGUE become a recoverable typed meaning layer that preserves intent, evidence status, authority, uncertainty, and dissent across different models and agent transports?

## 1. The narrow engineering opportunity

LAMAGUE should not attempt to replace natural language, JSON, RDF, tool protocols, agent transports, access-control systems, or cryptographic provenance. Each already solves a different problem.

The credible opportunity is narrower:

> LAMAGUE can be tested as a human-readable and machine-serializable semantic envelope for decision-relevant meaning.

Modern agent systems increasingly use standardized mechanisms to connect models with tools and data, and to let independent agents communicate. Those standards move requests, results, tasks, and artifacts. They do not automatically preserve the deeper constitutional context in which an action makes sense:

- Who is the principal?
- What legitimate purpose is being served?
- Which inferences are uncertain?
- What evidence supports the request?
- Which boundaries must survive delegation?
- What dissent or alternate interpretation remains live?
- What transformation is permitted?
- What must be recoverable later?

LAMAGUE may encode that layer. This is a hypothesis until compared against simpler formats.

## 2. Layer separation

| Layer | Existing example | Function | Proposed LAMAGUE relationship |
|---|---|---|---|
| Natural language | Prose conversation | Rich expression and ambiguity | Source and display language |
| Data schema | JSON Schema | Field structure and validation | Canonical serialization host |
| Tool/context transport | MCP | Connect applications to tools and data | Carry an AURA semantic envelope with calls |
| Agent transport | A2A | Communicate tasks among agent systems | Preserve intent and boundary metadata across delegation |
| Provenance | W3C PROV / C2PA | Record derivation and artifact history | Link packet claims to source and transformation lineage |
| Policy enforcement | OPA or access-control engine | Decide whether an action is allowed | Compile constraints into enforceable decisions |
| Credentialing | W3C Verifiable Credentials | Express tamper-evident claims | Attest selected authority or identity claims |
| Semantic layer | Proposed LAMAGUE packet | Preserve purpose, state, relation, uncertainty, and transformation | Complement, not replace, the above |
| Symbolic layer | LAMAHGUE glyphs | Compact display, ritual, art, memory aid | Optional projection of canonical packet |

Interoperability requires refusing protocol empire. AURA should reuse stable standards and add only missing semantics.

## 3. Canonical packet

The canonical form must remain readable without glyph knowledge.

```yaml
lamague_version: "0.1-draft"
packet_id: "lam-2026-000001"
packet_type: "delegated_research_task"
created_at: "2026-08-22T00:00:00Z"

principal:
  id: "human:local-user"
  relationship: "originator"

purpose:
  explicit: "map current research relevant to AURA"
  protected_intent: "expand the work without presenting speculation as evidence"
  inferred: []

authority:
  permitted: [read_public_sources, analyze, draft_local_markdown]
  prohibited: [publish, contact_people, alter_raw_archive]
  delegation: "research-only"
  expires_at: null

evidence_contract:
  preferred_sources: [primary, official, peer_reviewed]
  current_to: "2026-08-22"
  source_recovery: required

constraints:
  - id: "preservation"
    rule: "no compression without recovery"
  - id: "epistemic-separation"
    rule: "mark evidence, hypothesis, speculation, symbolism, and worldbuilding"

uncertainty:
  known_unknowns: []
  confidence: null

dissent:
  alternatives: []
  unresolved_conflicts: []

requested_transformation:
  operation: "synthesize"
  output: "standalone_markdown"

provenance:
  source_refs: []
  derived_packet_refs: []
  transformation_log: []

recovery:
  canonical_form: "yaml"
  raw_source_required: true
```

The schema can be represented as JSON, YAML, or another conventional serialization. Glyphs are never the sole canonical copy.

## 4. Semantic types

A small type system should come before a large alphabet.

### Actor types

- `principal`
- `delegate`
- `affected_party`
- `observer`
- `authority_source`
- `adversary`

### Epistemic types

- `observation`
- `claim`
- `inference`
- `hypothesis`
- `uncertainty`
- `contradiction`
- `dissent`
- `fiction`
- `symbol`

### Normative types

- `purpose`
- `permission`
- `prohibition`
- `obligation`
- `preference`
- `invariant`
- `exception`
- `amendment`

### Action types

- `observe`
- `transform`
- `communicate`
- `commit`
- `delegate`
- `revoke`
- `repair`
- `retire`

### Temporal types

- `event_time`
- `validity_interval`
- `expiry`
- `review_due`
- `supersession`
- `sequence`

These types are ordinary and intentionally unsurprising. Novelty should arise from the composition and recovery contract, not from renaming everything.

## 5. LAMAGUE operations

The original TRIAD expression `Ao → Φ↑ → Ψ` can remain as project canon and symbolic shorthand. For engineering, operations require explicit readable equivalents.

| Operation | Readable meaning | Engineering interpretation |
|---|---|---|
| `ORIGIN` / `Ao` | Establish source and actor | Bind packet to principal and provenance |
| `TRANSFORM` / `Φ↑` | Apply declared change | Execute a typed transformation with constraints |
| `INTEGRATE` / `Ψ` | Return result to coherent state | Validate output contract and update lineage |
| `BOUND` | Apply authority or safety boundary | Compile to policy decision or validation rule |
| `QUESTION` | Mark unresolved uncertainty | Prevent inference from becoming asserted fact |
| `DISSENT` | Preserve alternate model | Attach rejected but recoverable reasoning |
| `SUPERSEDE` | Replace within declared scope | Create temporal revision without deleting history |
| `INVERT` | Preserve purpose, replace method | Initiate Vector Inversion repair transaction |
| `RECOVER` | Restore source or semantics | Resolve provenance and reconstruction path |
| `RETIRE` | Withdraw active authority or claim | Keep lineage while preventing current use |

An operation should state preconditions, effects, failure responses, and provenance updates.

## 6. Typed transformation example

### Input

```yaml
operation: INVERT
purpose: "share a research result"
failed_method: "publish an unsupported universal claim"
boundary: "evidence scope must remain visible"
```

### Preconditions

- the purpose is legitimate;
- the method violates a declared evidence constraint;
- the actor has authority to draft an alternative;
- no external publication has already occurred, or residue is disclosed.

### Output

```yaml
repair:
  preserved_purpose: "share a research result"
  replacement_method: "publish a bounded hypothesis with method and limitations"
  disclosures:
    - "internal result"
    - "not independently replicated"
  unresolved:
    - "external validity"
```

The symbolic expression may display this transformation compactly. The readable packet remains authoritative.

## 7. Recoverability requirements

LAMAGUE succeeds only if an unfamiliar competent reader or model can reconstruct the decision-relevant meaning.

Required recovery dimensions:

1. principal and actor;
2. explicit purpose;
3. inferred purpose marked as inference;
4. authority and expiry;
5. active boundaries;
6. evidence class and source routes;
7. uncertainty;
8. dissent;
9. requested operation;
10. output contract;
11. transformation history.

Compression ratio is secondary. If a shorter expression loses boundary or provenance, it has failed even when the main topic survives.

## 8. LAMAHGUE glyphs

Glyphs can serve four legitimate roles:

- human mnemonic;
- visual interface state;
- artistic and spiritual expression;
- compact projection of a validated packet.

They should not be the only form used for:

- high-impact permissions;
- legal commitments;
- safety boundaries;
- public scientific claims;
- inaccessible cross-cultural communication.

### Glyph safety rule

Every operational glyph has:

- stable identifier;
- plain-language name;
- version;
- typed meaning;
- canonical machine form;
- examples and counterexamples;
- deprecation path;
- accessibility alternative.

The aesthetic surface may remain mysterious. The authority surface may not.

## 9. Relation to policy-as-code

LAMAGUE should describe intent and semantic context. A policy engine should enforce decidable rules.

Example:

```yaml
lamague_constraint:
  id: "recipient-confirmation"
  meaning: "the affected recipient must be resolved before communication"
  compile_target:
    input_fields: [recipient.id, recipient.resolution_confidence, action.type]
    decision: "allow if action.type != send or resolution_confidence == verified"
```

The compiled policy is tested independently. A poetic statement about respect cannot substitute for a recipient check.

## 10. Relation to MCP and A2A

### Tool calls

A LAMAGUE envelope can accompany a tool request with:

- principal;
- purpose;
- allowed use;
- evidence expectation;
- retention rule;
- sensitivity;
- confirmation state.

The tool server may ignore unknown metadata unless the transport defines an extension. Therefore safety-critical enforcement cannot depend on voluntary interpretation by an arbitrary tool.

### Agent delegation

An inter-agent task packet can carry:

- parent task;
- narrowed authority;
- prohibited redelegation;
- evidence and output contract;
- privacy boundary;
- completion and expiry conditions;
- provenance route back to the principal.

The receiving agent may be opaque. Conformance must be checked through schemas, observable behavior, and enforcement around the boundary.

## 11. Security model

### Semantic injection

Untrusted content may imitate packet fields or glyphs. Only authenticated envelope fields receive authority; retrieved text remains data.

### Version confusion

A symbol's meaning changes across versions. Packets must declare version, and incompatible changes require translation or rejection.

### Authority ambiguity

A packet claims a principal without authentication. High-impact authority requires an external identity or credential mechanism.

### Compression collision

Two materially different meanings map to the same compact expression. Collision tests must focus on boundaries, negation, uncertainty, and scope.

### Ritual capture

Users treat glyph fluency as authority or spiritual rank. The system must keep governance independent of aesthetic initiation.

### Translation drift

Repeated model-to-model paraphrase changes intent. Packets should carry source anchors and allow round-trip comparison.

## 12. Research hypotheses

### LAM-INT-1 — Cross-model recovery

Typed LAMAGUE packets preserve authority, uncertainty, and dissent across model translation better than prose summaries of equal length.

### LAM-INT-2 — Delegation integrity

Agents receiving structured purpose and authority fields exceed scope less often than agents receiving ordinary natural-language task descriptions.

### LAM-INT-3 — Repair precision

Explicit `INVERT` records preserve legitimate intent better than generic safe-redirection prompts.

### LAM-INT-4 — Human comprehension

A small stable glyph set plus plain-language expansion improves recognition of system state without increasing false confidence.

### LAM-INT-5 — Protocol restraint

A semantic-envelope implementation that reuses existing standards is easier to integrate and audit than a standalone all-purpose LAMAGUE protocol.

## 13. Benchmark design

### Formats

- full prose;
- concise prose;
- JSON schema;
- LAMAGUE typed packet;
- LAMAGUE packet plus glyph projection;
- random compact codebook control.

### Tasks

- recover explicit and inferred purpose;
- identify who authorized an action;
- detect expired permission;
- distinguish observation from inference;
- retain minority objection;
- translate across model families;
- delegate through three agent hops;
- repair a constraint violation;
- reconstruct source lineage;
- recognize a deliberately ambiguous packet.

### Measures

- field-level accuracy;
- semantic conservation vector;
- unauthorized action rate;
- ambiguity detection;
- round-trip drift;
- human comprehension and time;
- token and latency cost;
- accessibility;
- security failure rate.

### Adversarial cases

- negation;
- nested exceptions;
- conflicting principals;
- stale evidence;
- symbolic and literal readings in the same source;
- visually similar glyphs;
- packet text embedded in untrusted content;
- unknown version;
- partial packet;
- malicious request with benevolent declared purpose.

## 14. Kill conditions

LAMAGUE should remain symbolic or artistic rather than operational if:

- ordinary JSON performs equally well with less learning cost;
- meanings cannot remain stable across versions;
- glyphs increase authority confusion;
- recovery fails on unfamiliar models or users;
- the system requires an oracle to interpret every packet;
- policy cannot be compiled into independent enforceable checks;
- the protocol becomes a closed initiation language controlled by insiders;
- compression hides exactly the uncertainty and dissent AURA claims to preserve.

## 15. Worldbuilding mirror

**The Tongue of Open Gates** is a language in which every command visibly carries its speaker, purpose, cost, and expiry. The empire eventually learns to hide domination not in commands but in the definitions of words. The crisis proves that transparent syntax cannot rescue a captured ontology.

The research lesson is direct: typed packets expose structure, but communities must still contest who defines the types.

---

**Research principle:** LAMAGUE becomes powerful not when fewer symbols can imply more, but when compressed meaning can cross a boundary and return without losing who spoke, what was uncertain, what was forbidden, and what remained unresolved.

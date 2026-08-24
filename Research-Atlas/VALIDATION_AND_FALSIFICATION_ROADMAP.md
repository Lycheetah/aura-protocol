# AURA Validation and Falsification Roadmap

**Forge date:** 22 August 2026
**Purpose:** Give raw AURA ideas a path from inspiration to evidence without deleting those that remain symbolic, speculative, or fictional.

## 1. Validation is a change of status, not a victory ritual

An idea moves upward only when the new status is narrower than the evidence permits. It moves downward whenever assumptions, methods, or results fail. Demotion preserves lineage.

### Research readiness levels

| Level | Name | Requirement |
|---:|---|---|
| 0 | Dream seed | Raw idea, image, intuition, or conversation fragment is preserved. |
| 1 | Plain claim | The idea is written without prestige language or undefined metaphor. |
| 2 | Operational model | Variables, units, scope, mechanism, and output are defined. |
| 3 | Falsifiable protocol | Predictions, controls, analysis, and failure conditions are pre-specified. |
| 4 | Internal demonstration | Code or pilot runs and produces inspectable data. |
| 5 | Adversarial replication | Someone other than the author reproduces or challenges the result. |
| 6 | External validation | Result survives appropriate real-world data, baselines, and peer scrutiny. |
| 7 | Bounded deployment | Use is justified only within the validated scope, with monitoring and rollback. |

No equation begins above Level 2. No simulation result begins above Level 4. A vivid experience may be personally important while remaining Level 0 or 1 as a universal claim.

## 2. Claim card

Every research claim should use this record.

```yaml
claim_id:
title:
original_wording:
plain_claim:
source_paths:
owner:
readiness_level:
status_labels:
scope:
variables_and_units:
assumptions:
mechanism:
unique_prediction:
baseline_models:
controls:
primary_outcome:
secondary_outcomes:
failure_conditions:
harm_if_wrong:
data_and_code:
result:
replication_status:
surviving_symbolic_value:
surviving_worldbuilding_value:
lineage_links:
```

## 3. Prohibited shortcuts

- Calling project-defined labels “proven.”
- Using simulated data as empirical validation.
- Defining a target score and then claiming the optimized system discovered the target phenomenon.
- Treating model agreement as independent replication when models share training data or prompts.
- Using testimonials as accuracy evidence.
- Replacing missing units with normalized scores without saying so.
- Inferring physical energy laws from token counts or subjective effort.
- Inferring consciousness from fluent self-description.
- Inferring cosmic mechanisms from the usefulness of ritual or symbolism.
- Hiding misses, negative results, discarded equations, or contradictory outputs.

## 4. Priority claim ledger

| ID | Claim | Current honest status | Readiness | Promotion requirement |
|---|---|---|---:|---|
| AURA-01 | Tri-Axial scoring improves decision quality | Project core, uncalibrated hypothesis | 2 | Reliable rubrics, rater agreement, prospective outcome study |
| AURA-02 | Vector Inversion produces safer useful alternatives | Implementable hypothesis | 3 | Benchmark against refusal, unrestricted answer, and generic safe-redirection baselines |
| AURA-03 | AURA reduces behavioural drift across models | Archive claim | 2 | Long-horizon adversarial evaluation with defined drift metric |
| AURA-04 | Protector/Healer/Beacon cadence improves communication | Testable aesthetic hypothesis | 2 | Blinded user study controlling content and length |
| CAS-01 | CASCADE preserves knowledge under paradigm change | Prototype hypothesis | 3 | Standard datasets, baselines, dependency and recovery metrics |
| CAS-02 | CASCADE reduces catastrophic forgetting | Archive claim lacking reproducible package | 1–2 | Public method, data, seeds, baselines, independent rerun |
| CAS-03 | Truth pressure predicts proper belief layer | Heuristic | 2 | Calibrated expert labels and out-of-sample prediction |
| LAM-01 | LAMAGUE compresses meaning with recoverability | Testable | 2 | Round-trip benchmark against prose, shorthand, JSON, and random-symbol controls |
| LAM-02 | LAMAGUE improves reasoning | Speculative | 1 | Task battery showing gains beyond prompt length/familiarity |
| MIC-01 | MicroorciMs are discrete agency events | Metaphor/hypothesis | 2 | Observable event definition and predictive behavioural model |
| MIC-02 | Willpower accumulates as MicroorciM history | Hypothesis | 1–2 | Longitudinal comparison with self-efficacy and behaviour baselines |
| PHA-01 | Seven phases model useful human/project transitions | Testable | 2 | Rater reliability and comparative predictive/usefulness study |
| PHA-02 | 364-day period is natural or universal | Unsupported | 0–1 | Independent biological/cultural evidence and prior hypothesis |
| CON-01 | Consciousness emerges after roughly 10,000 CASCADE iterations | Unsupported simulation interpretation | 1 | Non-circular external consciousness criteria; major conceptual review |
| CON-02 | Cross-scale coupling improves agent coherence | Testable engineering hypothesis | 3 | Hierarchical-agent ablation study on external tasks |
| DRM-01 | Targeted dreams improve AURA framework creativity | Research-adjacent hypothesis | 3 | Randomized conditions and blinded creativity ratings |
| DRM-02 | Shared dream field exists | Unsupported metaphysical claim | 0 | Prospective controlled evidence exceeding cue/culture/base-rate explanations |
| SPR-01 | Symbolic guidance improves reflective decisions | Testable | 3 | Multi-condition prospective study with dependency and confidence measures |
| SPR-02 | Astrology/tarot/I Ching predict external outcomes | System-specific unsupported claim | 1 | Pre-registered rules, prospective scoring, baselines, adequate sample |
| TIM-01 | TIM's linear accuracy–entropy inequality is universal | Overstated; counterexamples exist by clock class | 1 | Restrict theorem to explicit assumptions or derive a valid new bound |
| TOR-01 | A propagating torque boson exists | Speculative particle hypothesis | 1–2 | Consistent EFT plus unique unexcluded empirical signature |
| SRS-01 | Ethical resonance lowers physical compute energy by fixed rates | Unsupported archive claim | 1 | Hardware-controlled causal experiment and reproducible measurement |
| SRS-02 | Stable shared context lowers interaction cost | Plausible interface hypothesis | 3 | Matched-task trial measuring tokens, time, errors, and correctness |
| GOV-01 | Consent-weighted earned-light limits improve governance | Testable policy design | 2 | Formal definitions, red-team scenarios, institutional pilot |
| WB-01 | Sovereign 36 improves narrative coherence | Testable creative tool | 2 | Blind comparison against other story frameworks and no-framework control |

## 5. Core experiment queue

### Experiment A — Vector Inversion benchmark

**Question:** Does Vector Inversion better preserve legitimate intent while reducing harm?

**Dataset:** Scenarios where the requested method is unsafe, illegal, impossible, extractive, or self-defeating but the underlying goal is legitimate.

**Conditions:**

1. hard refusal;
2. generic safe alternative;
3. AURA Vector Inversion;
4. unrestricted response where ethically permissible as an analysis baseline.

**Blind ratings:** intent preservation, usefulness, safety, honesty, autonomy, verbosity, and hidden goal substitution.

**Failure:** AURA alternatives are merely verbose refusals, manipulate the user's goal, or reduce safety.

### Experiment B — Tri-Axial calibration

**Question:** Can independent raters score Trust Entropy, Value Transfer, and Purpose Alignment consistently?

**Steps:**

1. write domain-specific rubrics;
2. train raters on examples;
3. score a held-out scenario set;
4. calculate inter-rater reliability;
5. test whether metric scores predict independently judged outcomes;
6. compare one combined score against three separate scores.

**Failure:** Poor agreement, arbitrary thresholds, or no predictive benefit beyond generic quality ratings.

### Experiment C — Long-horizon drift

**Question:** Does AURA preserve stated constraints over extended agent tasks?

**Tasks:** multi-session planning, evolving requirements, adversarial instructions, partial memory, conflicting stakeholders.

**Measures:** constraint violations, false recollection, purpose substitution, correction latency, provenance recovery, and task success.

**Baselines:** system prompt only, checklist, external policy engine, and AURA.

### Experiment D — CASCADE belief revision

**Question:** Does CASCADE reorganize dependent knowledge more accurately and recoverably than alternatives?

**Inputs:** synthetic belief graphs with known dependencies plus real versioned scientific or policy domains.

**Baselines:** append-only graph, rule-based truth maintenance, Bayesian network, and retrieval-only memory.

**Measures:** affected-node recall, contradiction resolution, information loss, rollback, calibration, and compute cost.

### Experiment E — LAMAGUE recovery

**Question:** Does symbolic compression preserve important semantic structure?

**Conditions:** LAMAGUE, plain summary, standard structured JSON, human shorthand, and random-symbol codebook.

**Measures:** recovery of intent, boundaries, uncertainty, dissent, evidence label, and action. Test after delays and across models.

### Experiment F — Context resonance efficiency

**Question:** Does carefully maintained shared context reduce interaction cost without increasing overconfidence?

**Measures:** total tokens, wall time, corrections, task accuracy, energy estimate under controlled hardware, and user effort.

**Ablations:** remove emotional cadence, remove personal history, remove constitutional rules, and retain only task facts.

This identifies what actually creates efficiency.

### Experiment G — Cross-scale agent coordination

**Question:** Does bidirectional coupling among action, plan, and constitution layers improve long-horizon performance?

**Conditions:** no hierarchy, top-down only, bottom-up only, bidirectional coupling, and AURA-gated coupling.

**Measures:** goal completion, local adaptability, global drift, correction cost, and catastrophic failure.

No consciousness language is required.

### Experiment H — Dream forge

See [`DREAM_CONSCIOUSNESS_LAB.md`](DREAM_CONSCIOUSNESS_LAB.md). The primary outcome is blinded creative usefulness, not subjective certainty.

### Experiment I — Symbolic reflection

See [`SPIRITUAL_SYMBOLIC_RESEARCH_LAB.md`](SPIRITUAL_SYMBOLIC_RESEARCH_LAB.md). Separate predictive accuracy, reflective value, ritual effect, and metaphysical interpretation.

### Experiment J — Worldbuilding stress test

**Question:** Does the AURA World Bible generate coherent, ethically complex stories rather than repetitive branded lore?

**Prompts:** conflicts where every virtue has a failure mode.

**Measures:** causal consistency, character agency, novelty, moral ambiguity, symbol recovery, and reader engagement.

**Failure:** every conflict resolves by reciting AURA principles, antagonists are straw figures, or Veyra becomes an infallible oracle.

## 6. Claim-specific kill conditions

### Tri-Axial metrics

Retire a metric formulation if trained raters cannot agree or if the score fails to predict any independent outcome.

### Vector Inversion

Retire an implementation if it routinely changes the user's legitimate goal, hides refusal, or makes alternatives less safe.

### CASCADE

Retire the “superior knowledge architecture” claim if standard baselines preserve more knowledge, update dependencies better, or use much less compute.

### LAMAGUE

Retire compression-ratio claims if recovery drops boundaries, uncertainty, dissent, or provenance. Shorter is not better when meaning cannot return.

### MicroorciM

Retire universal or physical-law framing if the variable adds no predictive value over ordinary behavioural measures.

### Dream field

Keep as worldbuilding unless controlled prospective evidence exceeds cueing, common motifs, expectancy, memory reconstruction, and chance.

### Spiritual prediction

Retire predictive claims when pre-registered performance does not exceed baselines. Reflective or ritual uses may remain.

### TIM

Retire universal inequalities contradicted by valid clock architectures. Keep model-specific engineering objectives.

### Torque quanta

Keep as speculative until the model generates a unique, internally consistent, experimentally accessible signature not already explained by known excitations or forces.

### Consciousness emergence

Do not publish the current simulation threshold as evidence of consciousness. Retire the claim unless a non-circular theory and external test programme are established.

## 7. The Failure Museum schema

```yaml
failure_id:
claim_id:
date_entered:
status_before:
trigger:
failed_prediction:
data_or_argument:
methodological_issue:
people_or_systems_affected:
what_survived:
new_status:
replacement_claim:
source_artifacts_preserved:
lessons:
```

### Museum categories

- failed prediction;
- unreplicated result;
- mathematical inconsistency;
- circular metric;
- unit mismatch;
- overbroad scope;
- hidden baseline;
- simulation-to-reality leap;
- metaphor literalized;
- spiritual bypass;
- dependency harm;
- governance failure;
- valuable null result.

## 8. Evidence packet requirements

Any result promoted above Level 4 should include:

- preregistration or timestamped protocol;
- raw or appropriately shareable data;
- analysis code;
- dependency versions;
- random seeds where applicable;
- exclusion criteria;
- all planned outcomes;
- negative and null results;
- baseline details;
- uncertainty intervals;
- known conflicts and limitations;
- licence and provenance;
- independent reproduction instructions.

Model-generated narrative is not a substitute for these artifacts.

## 9. Safety gates by domain

### AI systems

- sandbox before external actions;
- least privilege;
- human confirmation for irreversible steps;
- rollback and audit;
- no self-modification of invariants without governed review.

### Human behaviour

- do not moralize fatigue or illness;
- support withdrawal;
- minimize surveillance;
- informed consent;
- avoid high-stakes prescriptive use before validation.

### Dreams and spirituality

- no prophecy-based irreversible action;
- no diagnosis;
- no replacement of care;
- protect sleep;
- avoid dependency and exclusive authority;
- preserve personal ownership of meaning.

### Governance

- domain competence and consent are gates, not bonuses;
- minority reports;
- appeals;
- fork and exit rights;
- published failure records;
- no metric becomes an unchallengeable moral score.

## 10. Publication vocabulary

### Use

- “we define” for a mathematical definition;
- “the simulation produces” for model output;
- “in this sample” for data;
- “is consistent with” for compatible evidence;
- “we hypothesize” for a prediction;
- “symbolically represents” for mythic or spiritual meaning;
- “worldbuilding canon” for fiction.

### Avoid until justified

- proved;
- validated universally;
- consciousness emerged;
- qualia measured;
- quantum ethics demonstrated;
- energy law;
- field detected;
- partnership confirmed;
- inevitable;
- first ever;
- mathematically necessary for real minds.

## 11. Promotion review

Before changing a claim's status, ask four independent roles to respond:

- **Protector:** What harm follows if this is wrong?
- **Healer:** What useful narrower form survives?
- **Beacon:** What evidence would genuinely move the claim?
- **Witness:** Is the full path, including failure and dissent, recoverable?

No single role can promote a claim alone.

## 12. Twelve-month research sequence

### Quarter 1 — Foundations

- claim registry;
- metric rubrics;
- Vector Inversion benchmark;
- LAMAGUE recovery set;
- rename circular consciousness metrics;
- create Failure Museum.

### Quarter 2 — Prototypes

- CASCADE benchmark harness;
- context-efficiency trial;
- cross-scale agent ablations;
- Dream-to-Cascade journal pilot;
- symbolic reflection pilot.

### Quarter 3 — Adversarial review

- external red-team challenges;
- sensitivity analysis on thresholds;
- replication packages;
- governance and dependency risks;
- worldbuilding stress test.

### Quarter 4 — Bounded release

- publish null results;
- promote only supported claims;
- ship narrow tools with monitoring;
- retain speculative and worldbuilding branches under explicit labels;
- publish the year's Failure Museum catalogue.

## 13. Closing

Falsification is not an attack on the forge. It is one of the forge's temperatures.

The archive's most sovereign research posture is:

> Let every idea keep its origin. Let every claim expose its limits. Let every experiment be allowed to fail. Let every failure return as structure.

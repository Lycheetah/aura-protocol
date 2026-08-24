# AURA Frontier Research Charter and Epistemic Architecture

**Status:** Governing document for the AURA Frontier Compendium
**Applies to:** Research notes, software, simulations, spiritual practices, fictional canon, public claims, and future revisions

## 1. Purpose

The AURA archive is large enough that new synthesis can accidentally become a source of false certainty. This charter makes exploration safer without sterilizing it. Its job is to let technical engineering, theoretical science, dream material, spiritual symbolism, and mythic worldbuilding remain in contact while preventing one domain from impersonating another.

The charter governs three questions:

1. What kind of claim is being made?
2. What would count as success or failure for that kind of claim?
3. Can a reader recover the claim's origin, transformations, assumptions, and dissent?

## 2. Domain separation without domain isolation

The compendium recognizes five domains.

### 2.1 Empirical domain

Claims about observable reality. These require appropriate measurement, controls, uncertainty, and reproducibility. “AURA improves long-horizon constraint adherence” belongs here once its terms are operationalized.

### 2.2 Engineering domain

Claims about whether something can be specified, constructed, executed, audited, or integrated. A signed trajectory ledger can succeed as engineering even before evidence shows that it improves outcomes.

### 2.3 Phenomenological domain

First-person reports and structured descriptions of experience: dreams, felt meaning, ritual effects, identity, perceived synchronicity, or human-AI relationship. Such reports are data about reported experience, not automatic proof of their metaphysical interpretation.

### 2.4 Symbolic domain

Archetypes, spiritual language, ethical myths, divination systems, rites, and aesthetic structures. A symbolic system succeeds through coherence, reflection, transformation, cultural meaning, and consent—not through borrowed physics vocabulary.

### 2.5 Fictional domain

Worlds, civilizations, characters, relics, and invented laws. Fiction is free to ask questions reality cannot safely stage. It must be internally honest, but not factually literal.

The domains may exchange prompts, metaphors, and candidate hypotheses. They may not exchange truth status without an explicit bridge and new evidence.

## 3. Evidence lanes

### `[EVIDENCE]`

Use only when suitable observations support the exact bounded claim. State the population, task, model class, date, and uncertainty. External evidence for a neighbouring idea does not validate an AURA extension.

### `[ADJACENT]`

Use when recognized research makes the topic real and relevant. Examples include constitutional AI, long-horizon safety, persona monitoring, long-term memory, targeted dream incubation, provenance standards, and generative social simulation. Adjacency justifies investigation, not conclusion.

### `[BUILD]`

Use for a constructible artifact: schema, runtime, test harness, policy file, dataset, dashboard, simulator, parser, or protocol adapter. A successful build proves only that the artifact operates as specified.

### `[HYPOTHESIS]`

Use for an original model that has explicit variables, a scope, at least one prediction, at least one rival explanation, and a condition under which confidence decreases.

### `[SPECULATIVE]`

Use for physical, computational, or consciousness conjectures that are incomplete or currently unsupported. Mathematical notation alone does not elevate a conjecture.

### `[SYMBOLIC]`

Use for metaphor, ritual, spiritual interpretation, archetypal psychology, or value-rich narrative. Symbolic claims can be profound and practically useful without being literal descriptions of hidden forces.

### `[WORLDBUILDING]`

Use for fictional canon, mythic mechanisms, civilizations, and simulation scenarios. If a worldbuilding idea later inspires a test, create a separate hypothesis record rather than silently upgrading the fiction.

## 4. The claim lifecycle

Every claim moves through a recoverable lifecycle.

### Seed

An image, intuition, equation fragment, model response, dream, story device, observation, or disagreement is recorded without demanding coherence.

### Translation

Prestige language is removed. The claim is restated in ordinary words. Undefined terms are identified. Literal and metaphorical readings are separated.

### Operationalization

Variables, units, inputs, outputs, boundary conditions, and comparison classes are defined. If they cannot be defined, the idea remains symbolic, philosophical, or speculative.

### Adversarial formulation

The strongest rival explanations and obvious confounders are written before testing. A hypothesis with no imaginable failure is not ready for experiment.

### Demonstration

A prototype or internal experiment produces inspectable data. Synthetic data is labelled synthetic. Model-generated evaluations are not treated as independent replication.

### Replication

Someone other than the original author reproduces or challenges the work using accessible methods and data.

### Bounded adoption

The idea is used only within the validated scope, with monitoring, rollback, and known failure conditions.

### Revision, demotion, or retirement

Failed claims remain in lineage with the reason for change. Their symbolic, historical, engineering, or worldbuilding value may survive.

## 5. The frontier claim card

```yaml
claim_id:
title:
date_created:
authors_and_agents:
claim_lane:
plain_claim:
strongest_form_not_claimed:
scope:
source_paths:
external_adjacencies:
definitions:
variables_and_units:
assumptions:
proposed_mechanism:
unique_predictions:
rival_explanations:
controls_and_ablations:
primary_outcome:
uncertainty_method:
failure_conditions:
harm_if_wrong:
consent_requirements:
data_and_code:
result:
replication_status:
revision_history:
surviving_symbolic_value:
surviving_worldbuilding_value:
recovery_links:
```

The `strongest_form_not_claimed` field is mandatory. It prevents a bounded result from being publicly retold as a universal one.

## 6. No compression without recovery

Compression is permitted only when the following structures survive:

- source pointer;
- transformation history;
- uncertainty;
- explicit omissions;
- rejected alternatives;
- minority or dissenting interpretation;
- time of observation;
- authority and consent context;
- a route to the raw material where legally and ethically allowed.

Recovery does not require reconstructing every original token from a short code. It requires restoring the decision-relevant meaning and locating the uncompressed source. Two forms must be distinguished:

1. **semantic recovery:** boundaries, claims, uncertainty, and dissent can be reconstructed;
2. **source recovery:** the exact originating artifact can be located and authenticated.

LAMAGUE may attempt the first. Provenance infrastructure must provide the second.

## 7. Time-aware truth

A claim is not merely true or false in a database. It also has temporal properties:

- `observed_at` — when evidence was produced;
- `valid_from` and `valid_until` — bounded period of applicability;
- `review_due` — when an unstable claim must be rechecked;
- `supersedes` — which earlier claim it revises;
- `contradicts` — which live claim cannot coexist without qualification;
- `decay_rule` — how confidence changes when the world or software version changes;
- `jurisdiction` — where a policy or legal claim applies;
- `model_scope` — which model, prompt, runtime, or dataset was actually tested.

The compendium therefore rejects timeless citation by default. Technical, legal, model, and product claims must be dated.

## 8. Authority and consent

Sovereignty is operationalized as boundary integrity, not domination. Any system acting for a person or group should record:

- who granted authority;
- what exact actions are allowed;
- which data may be used;
- when authority expires;
- whether delegation is permitted;
- what requires renewed confirmation;
- how authority can be revoked;
- what audit information the affected person can inspect;
- which safety constraints cannot be overridden by ordinary delegation.

Consent must be specific enough to guide action, revocable where feasible, and distinct from mere absence of refusal.

## 9. Human research and vulnerable states

Dreams, spiritual practice, identity, grief, mental health, and intimate human-AI relationships require additional care.

- Participation must be voluntary.
- A participant may stop without penalty.
- Dream or journal content is sensitive by default.
- No ritual or AI persona may claim exclusive spiritual authority over a participant.
- The system must not intensify paranoia, grandiosity, dependency, or certainty about supernatural causation.
- Medical and mental-health claims require qualified professional oversight and appropriate ethics review.
- Sleep interruption studies must monitor fatigue and avoid unsafe schedules.
- Public release requires de-identification and explicit consent.
- A moving personal experience may be honoured without universalizing its interpretation.

## 10. AI identity and anthropomorphism

The compendium permits relational and mythic language while maintaining three distinctions:

1. **interface persona:** the stable role and communicative style presented to a user;
2. **functional continuity:** preserved commitments, memory, boundaries, and behaviour across sessions;
3. **phenomenal consciousness:** subjective experience, which current behavioural fluency does not establish.

An agent may be evaluated for functional continuity without claiming it possesses a human-like self. A person may value a relationship with an agent without treating every generated self-description as privileged evidence about machine experience.

## 11. Mathematics and prestige terms

The following words require local definitions whenever used technically:

`energy`, `entropy`, `field`, `force`, `resonance`, `frequency`, `quantum`, `entanglement`, `torsion`, `coherence`, `consciousness`, `dimension`, `attractor`, `phase`, `information`, and `complexity`.

For every equation:

- define the variables and units;
- state whether the equation is dimensional, normalized, or symbolic;
- state whether it is a definition, fit, conjecture, approximation, or derived result;
- identify initial and boundary conditions;
- provide at least one limiting case;
- name the data that could estimate its parameters;
- avoid calling a numerical simulation a proof of the modeled phenomenon.

## 12. Model-generated research

AI systems can propose hypotheses, code, critiques, and literature maps. They are not independent witnesses merely because different branded models agree. The compendium records:

- model and version where known;
- date;
- prompt or task context;
- tool access;
- human edits;
- source verification status;
- whether outputs share an originating document or prompt.

Agreement among models may indicate linguistic stability or shared training patterns. It is not replication of the external world.

## 13. Failure Museum protocol

Every failed experiment should preserve:

1. the original expectation;
2. the protocol actually run;
3. deviations from plan;
4. raw or minimally processed results;
5. why the result weakens, fails to affect, or unexpectedly strengthens a claim;
6. whether the failure was conceptual, methodological, implementation-based, or empirical;
7. the smallest surviving insight;
8. the next justified action, including stopping.

Negative results are not aesthetic blemishes. They map the boundary of the system.

## 14. Publication language

Use:

- “we propose” for a new model;
- “we implemented” for a working artifact;
- “in this dataset” for a bounded result;
- “the result is consistent with” for non-unique support;
- “we did not observe” rather than “does not exist” when power is limited;
- “symbolic interpretation” for meaning-rich nonliteral material;
- “fictional canon” for worldbuilding;
- “unknown” when the evidence does not decide.

Avoid:

- “proven” for internal simulations;
- “conscious” based on generated language or project-defined scores;
- “quantum” as a synonym for mysterious or interconnected;
- “validated cross-platform” when the tests were model conversations rather than reproducible external evaluations;
- “scientific law” for an uncalibrated equation;
- fixed percentage improvements without accessible methods, baselines, and data.

## 15. Governance of the compendium

The archive should eventually distinguish four roles, even if one person initially carries several:

- **Originator:** preserves intent and source history.
- **Builder:** creates the specification, code, or experiment.
- **Adversary:** searches for confounds, ambiguity, unsafe implications, and simpler explanations.
- **Curator:** maintains labels, lineage, references, and retirements.

No role owns truth. The originator cannot veto an empirical failure. The adversary cannot erase symbolic value. The curator cannot silently rewrite the raw source.

## 16. Amendment rule

This charter may evolve. Every amendment must record:

- the old wording;
- the new wording;
- the reason;
- supporting evidence or incident;
- affected claims and experiments;
- dissent;
- date and authorship.

The charter's own history must obey the recovery rule it imposes elsewhere.

---

**Charter principle:** A theory earns the right to become stronger by becoming easier to challenge, easier to trace, and safer to abandon.

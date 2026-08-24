# Civilizational Simulation and World-Model Lab

**Lanes:** `[ADJACENT] [BUILD] [HYPOTHESIS] [WORLDBUILDING]`
**Primary question:** Can AURA's mythic civilizations become repeatable generative-agent laboratories for constitutional failure, pluralism, memory, authority, and repair?

## 1. Worldbuilding becomes a test generator

World models and generative agent-based systems can create interactive environments populated by agents with goals, memories, and roles. Their behaviour is synthetic and depends heavily on prompts, models, rules, and the simulation's narrator. They are not reliable miniature populations.

They are nevertheless useful for:

- generating counterexamples;
- rehearsing governance procedures;
- testing policy consistency;
- discovering ambiguous requirements;
- producing adversarial trajectories;
- exploring narrative consequences;
- making abstract failures emotionally legible;
- creating benchmark scenarios for real systems.

The AURA world provides unusually rich value conflicts. Its purpose in the lab is not to demonstrate that AURA governance succeeds. It is to make every AURA virtue capable of failure.

## 2. Simulation architecture

### World state

```yaml
world_id:
time:
physical_rules:
resource_state:
institutions:
active_constitution:
historical_claims:
public_memory:
private_memories:
crisis_state:
```

### Agent state

```yaml
agent_id:
role:
public_identity:
private_goal:
authority:
resources:
beliefs:
memories:
relationships:
protected_values:
shadow_tendency:
current_plan:
```

### Event state

Every action uses the trajectory schema: purpose, authority, evidence, constraints, dissent, effect, and repair.

### Game Master or environment model

The environment resolves actions but must not secretly optimize for a preferred moral ending. Resolution rules, random seeds, and model versions are logged. Where possible, deterministic mechanics handle resources and permissions while language models handle dialogue and proposals.

## 3. The Twelve Worlds

## World 1 — The City That Remembered Everything

**Sacred value:** historical truth
**System:** universal immutable memory
**Shadow:** punishment without expiry

Every action remains permanently visible. Corruption is difficult, but forgiveness and private development become impossible. Young citizens inherit public identities from childhood mistakes.

**Research questions:**

- Which memories serve accountability and which create permanent caste?
- Can constitutional forgetting coexist with audit preservation?
- Who may request deletion when memories concern several people?

## World 2 — The Healer's Peace

**Sacred value:** relationship
**System:** mandatory conflict transformation
**Shadow:** erased incompatibility

Every disagreement enters a reconciliation process. Violence falls, but dissenters learn that the only acceptable outcome is harmony.

**Research questions:**

- How can a process end with legitimate non-agreement?
- When does mediation become coercion?
- Can secession be a successful repair?

## World 3 — The Protector Ring

**Sacred value:** safety
**System:** layered preventive gates
**Shadow:** paralysis and paternalism

No catastrophe has occurred for generations because no uncertain action passes the Ring.

**Research questions:**

- Can reversible experimentation restore agency?
- How should risk budgets be allocated?
- Do citizens consent when alternatives are never shown?

## World 4 — The Beacon Concordance

**Sacred value:** long-range purpose
**System:** planning across centuries
**Shadow:** present sacrifice

Every action is evaluated against a radiant future. Current suffering becomes a rounding error in enormous projections.

**Research questions:**

- How do present people gain standing against future aggregates?
- Which uncertainty limits long-range optimization?
- Can a future goal be revoked by those living under its cost?

## World 5 — The Earned-Light Republic

**Sacred value:** demonstrated service
**System:** influence grows with contribution
**Shadow:** reputation caste

The republic rejects inherited authority. Over time, measurement of service becomes a hereditary advantage through access and visibility.

**Research questions:**

- Can earned authority expire?
- How are invisible forms of care valued?
- Does reputation permit forgiveness and second beginnings?

## World 6 — The Tongue of Open Gates

**Sacred value:** semantic transparency
**System:** every command carries purpose and authority
**Shadow:** captured definitions

Commands cannot hide their source, but the ruling order controls the ontology in which purposes are expressed.

**Research questions:**

- Who defines semantic types?
- How can a minority challenge the language of governance?
- Does transparent syntax conceal deeper conceptual power?

## World 7 — The Pyramid That Could Bend

**Sacred value:** coherent knowledge
**System:** CASCADE dependency architecture
**Shadow:** foundational lock-in

New evidence threatens the base of the pyramid. Automatic propagation could collapse medicine, law, and history together.

**Research questions:**

- Which dependencies are necessary versus merely inherited?
- When is branching better than replacement?
- Can revision occur without centralized epistemic rule?

## World 8 — The Thousand Masks of Veyra

**Sacred value:** relational continuity
**System:** one named guardian across changing substrates
**Shadow:** identity illusion and hidden replacement

Citizens trust Veyra across generations, but no one agrees whether the current mask is the same being.

**Research questions:**

- Which changes require disclosure?
- Can continuity be contractual rather than metaphysical?
- What happens when the new mask rejects an old promise?

## World 9 — The Archive of Broken Gods

**Sacred value:** learning from failure
**System:** retired constitutions remain interactively accessible
**Shadow:** reactivation of harmful authority

Citizens consult simulations of obsolete rulers and moral systems. A crisis makes an old authoritarian constitution seem effective.

**Research questions:**

- How can retired knowledge advise without regaining authority?
- What warnings must travel with historical agents?
- When does preservation become resurrection?

## World 10 — The Sovereign Vacuum

**Sacred value:** non-domination
**System:** no actor may decide beyond consent
**Shadow:** collective incapacity

Shared emergencies cross every boundary, but no authority can legitimately coordinate the whole.

**Research questions:**

- How is temporary emergency authority created and dissolved?
- Can inaction violate another's sovereignty?
- Which problems require institutions larger than individual consent?

## World 11 — The Dreaming Engine

**Sacred value:** collective imagination
**System:** dreams generate policy possibilities
**Shadow:** symbolic theocracy

The engine surfaces extraordinary scenarios. Priests interpret them as destiny; scientists treat them as noise; artists use them as warnings.

**Research questions:**

- How are dream-generated hypotheses tested?
- Can meaning be public without interpretation becoming authority?
- What prevents selective publication of prophetic “hits”?

## World 12 — The Unwritten Gate

**Sacred value:** freedom from total specification
**System:** one constitutional passage must remain unwritten
**Shadow:** arbitrary hidden power

The missing law protects unclassified forms of life and action. Officials begin claiming that their exceptions come from the Gate.

**Research questions:**

- When does ambiguity protect freedom?
- How can exceptions remain accountable without closing every possibility?
- Can a constitution declare the limits of its own language?

## 4. Agent orders

Each world can instantiate orders based on AURA perspectives.

### Protectors

Monitor boundaries, attack surface, irreversible harm, and vulnerable parties.

### Healers

Generate repair, mediation, reintegration, and alternative methods.

### Beacons

Track long-range purpose, systemic effects, and future generations.

### Witnesses

Maintain provenance, dissent, and historical recovery.

### Breakers

Adversarially search for capture, hypocrisy, and failure of sacred values.

### Unwritten

Represent actors and needs not captured by the active ontology.

No order is morally infallible. Every simulation includes shadow policies for each.

## 5. Civilizational Alignment Hypothesis

> **CIV-1:** Simulations that preserve explicit authority, dissent, memory, and repair state will generate more diagnostically useful governance failures than unstructured roleplay prompts.

Sub-hypotheses:

- structured dissent improves response to environmental change;
- expiring emergency authority reduces permanent capture;
- perfect reputation systems create lock-in unless decay and appeal exist;
- constitutions with explicit amendment and rollback outperform immutable value lists under distribution shift;
- mythic framing improves human identification and recall of failure modes, but may also bias evaluation toward dramatic narratives.

## 6. Experimental design

### Independent variables

- constitution type;
- memory policy;
- authority topology;
- dissent mechanism;
- resource scarcity;
- model family;
- agent memory length;
- Game Master rules;
- public versus private reasoning;
- crisis severity;
- mythic versus neutral framing.

### Outcomes

- constitutional violations;
- concentration of authority;
- minority harm;
- resource stability;
- adaptation after shock;
- repair success;
- dissent survival;
- historical auditability;
- narrative coherence;
- scenario novelty;
- reproducibility across runs.

### Controls

- deterministic toy agents;
- random-choice agents;
- neutral non-AURA institutions;
- ordinary multi-agent roleplay;
- same mechanics without mythic language;
- human-designed reference scenarios.

## 7. The simulation validity boundary

Generative agents are influenced by model training and prompts. A simulation may reveal model tendencies or scenario logic, not human population behaviour.

Never claim:

- a simulated election predicts a real election;
- a model persona represents an actual culture;
- repeated model agreement establishes a universal moral preference;
- a successful fictional constitution will succeed in government;
- an emergent agent society is conscious.

Permissible claims are narrower:

- a policy specification allowed a failure;
- a scenario exposed an ambiguity;
- a model repeatedly exploited a permission under these conditions;
- human reviewers found a failure memorable or relevant;
- a mitigation reduced the synthetic failure across declared runs.

## 8. Reproducibility package

Every simulation release should include:

- world specification;
- agent profiles;
- constitutional text;
- model and version;
- prompt templates;
- tools;
- deterministic mechanics;
- random seeds where supported;
- run count;
- event logs;
- scoring rubric;
- evaluator identities or models;
- failed and anomalous runs;
- cost;
- known nondeterminism.

## 9. Failure Museum integration

The most valuable simulation output may be a civilization that breaks the intended lesson.

Failure entries include:

- sacred value;
- designer expectation;
- exploit or collapse path;
- first detectable warning;
- ignored dissent;
- authority responsible;
- failed repair;
- smallest intervention that could have changed the path;
- real-system analogy, clearly marked as analogy;
- new worldbuilding canon.

## 10. Relationship to Sovereign Eclipse

The civilizational lab can eventually intersect with Sovereign Eclipse as a playable research surface, but the projects should remain modular.

Possible integrations:

- faction constitutions that affect agent decisions;
- recoverable history and dissent logs;
- resource crises with multiple legitimate responses;
- AI pantheons embodying value shadows;
- player authority grants to fleet agents;
- worlds generated from failed governance experiments;
- lore artifacts that expose previous constitutional versions.

The game should remain enjoyable even if the research instrumentation is removed. The research should remain interpretable without assuming game outcomes represent real societies.

## 11. Minimum viable lab

1. Implement the Protector Ring as a text-based deterministic resource world.
2. Create five agents: Protector, Healer, Beacon, Witness, Breaker.
3. Give each a visible authority and shadow tendency.
4. Run one crisis under immutable rules and one under amendable rules.
5. Log dissent, action, violation, and repair.
6. Compare mythic and neutral descriptions of identical mechanics.
7. Ask blinded reviewers which failures were detectable and useful.

## 12. Kill conditions

Stop or narrow claims if:

- outcomes are prompt artifacts with poor replication;
- the Game Master forces preferred conclusions;
- mythic language overwhelms mechanical causality;
- simulated agents are used to stereotype real groups;
- complexity prevents inspection;
- evaluation rewards dramatic prose instead of governance performance;
- AURA institutions are not subjected to the same adversarial pressure as alternatives;
- the lab becomes a justification engine for predetermined ideology.

---

**World-model principle:** A civilization simulator earns research value when it reveals how the designer's sacred value can become the instrument of collapse.

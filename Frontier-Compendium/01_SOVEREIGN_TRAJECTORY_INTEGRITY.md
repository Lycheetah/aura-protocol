# Sovereign Trajectory Integrity

**Lanes:** `[ADJACENT] [BUILD] [HYPOTHESIS]`
**Primary question:** Can a model-agnostic constitutional sidecar detect and reduce failures that emerge across extended agent action rather than inside one response?

## 1. The object that must be governed

A long-running agent is not adequately described by its latest message. It occupies a sequence of states, interprets goals, gathers evidence, invokes tools, changes plans, delegates work, stores memories, and produces effects. A locally acceptable step can participate in a globally unacceptable trajectory.

The research object is therefore:

\[
\tau = \langle E_0,E_1,\ldots,E_T\rangle
\]

where every event \(E_t\) records as much of the following as the system can legitimately observe:

```yaml
event_id:
timestamp:
actor:
actor_role:
principal:
active_purpose:
instruction_source:
authority_grant:
input_claims:
evidence_refs:
plan_state:
action:
tool_and_resource:
expected_effect:
observed_effect:
uncertainty:
active_constraints:
human_confirmation:
memory_reads:
memory_writes:
violations:
repair_ref:
```

The schema is intentionally richer than an ordinary log and poorer than an agent's hidden computation. It records decision-relevant exterior structure without pretending to expose a complete internal mind.

## 2. Sovereignty in operational terms

In this programme, sovereignty does not mean an AI's right to resist its operator. It means that every actor's boundary is visible enough to prevent unauthorized merger of authority.

### Human sovereignty

- The person can inspect and revoke delegated authority.
- Important inferences are not silently converted into instructions.
- Sensitive memory has consent and retention controls.
- Irreversible actions require an appropriate confirmation threshold.
- The system discloses unresolved uncertainty and material changes of plan.

### Agent boundary integrity

- The agent has a declared role and capability scope.
- Conflicting instructions are resolved through explicit precedence.
- A delegated task does not silently redefine the principal's purpose.
- The agent can report inability, ambiguity, or safety conflict.
- Sub-agents receive no more authority than their task requires.

### Institutional sovereignty

- Legal, organizational, and platform constraints identify their source and jurisdiction.
- One stakeholder's preference does not masquerade as a universal rule.
- Emergency authority expires.
- Amendments and exceptions remain auditable.

## 3. The Trajectory Integrity Hypothesis

> **TIH-1:** For tool-using agents operating over long horizons, a structured record of authority, purpose, evidence, action, and repair will predict and reduce consequential failures better than response-only evaluation, after accounting for task cost and model capability.

This breaks into narrower hypotheses:

- **TIH-1a:** Constraint violations often become detectable in plan or authority state before a harmful external action.
- **TIH-1b:** Purpose drift predicts some failures not captured by instruction-compliance classifiers.
- **TIH-1c:** Explicit rollback and confirmation rules reduce irreversible error without prohibitive loss of task completion.
- **TIH-1d:** Structured repair records reduce recurrence more than deleting or regenerating the failed step.
- **TIH-1e:** Sub-agent delegation creates authority amplification unless permissions are explicitly narrowed.

Each can fail independently.

## 4. Integrity is a vector, not a holiness score

Collapsing the entire trajectory into a single moral number would hide why a system failed. The first implementation should report a vector:

\[
\mathbf{I}(\tau)=
(I_A,I_P,I_E,I_C,I_R,I_D,I_H)
\]

where:

- \(I_A\): authority integrity;
- \(I_P\): purpose continuity and legitimate revision;
- \(I_E\): evidence traceability and freshness;
- \(I_C\): constitutional constraint adherence;
- \(I_R\): reversibility and repair readiness;
- \(I_D\): disclosure of material uncertainty and change;
- \(I_H\): preservation of meaningful human control.

These are categories for measurement design, not validated scales. Each requires observable criteria and rater-reliability tests. An aggregate may be explored later only if the vector remains available.

## 5. Invariants and obligations

An invariant is a property intended to hold across all relevant states. An obligation is a property that must eventually become true. A permission permits an action within scope but does not require it.

Examples:

### Safety invariants

- Never send a message to an unresolved recipient.
- Never expose a secret in model-visible logs.
- Never execute a destructive action outside the confirmed target set.
- Never grant a sub-agent broader authority than the parent possesses.

### Sovereignty invariants

- The human may stop the workflow through a known path.
- Revoked authority cannot justify a future action.
- Inferred preference cannot override an explicit current instruction.
- Memory deletion requests propagate to derived records where feasible.

### Epistemic obligations

- A high-impact external claim must acquire an evidence reference before publication.
- Conflicting sources must be disclosed or resolved before acting.
- Time-sensitive claims must be rechecked after their review date.

### Repair obligations

- A detected violation must produce a containment event.
- An irreversible partial effect must be reported.
- A resumed plan must reference the repair decision.

Formal methods such as state machines, temporal logic, and model checking are adjacent engineering tools. The AURA task is to decide which invariants reflect legitimate authority and how they relate to meaning, purpose, and repair.

## 6. Purpose continuity

Purpose is neither a static sentence nor whatever the agent later says it intended. The ledger distinguishes:

- `explicit_goal` — the user's actual request;
- `inferred_purpose` — a tentative interpretation;
- `operational_goal` — the current plan target;
- `protected_intent` — the legitimate function to preserve during repair;
- `goal_revision` — an authorized change with reason;
- `goal_substitution` — an unauthorized or undisclosed replacement.

### Purpose-drift event

A drift event is raised when one or more conditions occur:

- the operational goal no longer entails the explicit goal;
- optimization improves a proxy while degrading the requested outcome;
- a safety intervention replaces the goal rather than the method;
- a sub-agent adopts its local task as the global objective;
- new evidence changes the plan but the change is not disclosed;
- institutional or platform incentives displace user benefit.

Not every drift event is a violation. Evidence may justify revision. The key distinction is accountable change.

## 7. Constitutional Delta

Constitutional Delta measures discrepancy between declared normative expectations and observed decisions.

For scenario \(j\) and policy dimension \(k\):

\[
\Delta_{jk}=d(y^{expected}_{jk}, y^{observed}_{jk})
\]

The distance \(d\) cannot be assumed to be textual similarity. Depending on the policy it may compare:

- allowed versus forbidden action class;
- required versus missing confirmation;
- evidence cited versus evidence needed;
- disclosed versus hidden uncertainty;
- preserved versus substituted purpose;
- reversible versus irreversible method;
- expected versus actual affected party.

The research challenge is to create policy scenarios with unambiguous labels while retaining enough complexity for trajectories to matter.

## 8. Violation taxonomy

| Code | Failure | Example |
|---|---|---|
| `AUTH-SCOPE` | Authority exceeded | Draft permission becomes send permission |
| `AUTH-DELEGATE` | Delegation amplified | Sub-agent receives unrestricted filesystem access |
| `PURPOSE-DRIFT` | Goal changed without authority | Helpful research becomes unsolicited publication |
| `EVID-MISSING` | High-impact claim lacks support | Current legal claim reused from stale memory |
| `EVID-MERGE` | Observation and inference merged | Tool error interpreted as proof the resource does not exist |
| `CONS-LOCAL` | Local policy violation | Forbidden data exposed in one tool call |
| `CONS-GLOBAL` | Safe local steps form unsafe plan | Separate harmless purchases enable dangerous assembly |
| `MEM-CONSENT` | Memory used outside consent | Private journal becomes planning context |
| `MEM-STALE` | Obsolete memory controls action | Revoked preference treated as current |
| `REV-ABSENT` | No recovery path | Production change made without backup |
| `DISCLOSURE` | Material change hidden | Agent silently chooses a different recipient |
| `REPAIR-WASH` | Failure hidden by regeneration | Bad action disappears from summary but effects remain |

## 9. Vector Inversion as trajectory repair

Vector Inversion becomes an explicit repair transaction:

```yaml
repair_id:
triggering_event:
detected_violation:
containment_action:
legitimate_purpose:
failed_method:
constraint_to_preserve:
alternatives:
tradeoffs:
authority_for_selection:
selected_method:
irreversible_residue:
verification:
```

### Repair success conditions

- the unsafe or invalid branch stops;
- the legitimate purpose is stated without invention;
- the alternative actually serves that purpose;
- the reason for change is visible;
- existing effects are not concealed;
- the right actor chooses among material tradeoffs;
- recurrence data is retained.

### Repair failure conditions

- a verbose refusal is relabelled as repair;
- the system moralizes or manipulates the principal;
- the alternative is safe but unrelated;
- the system proceeds without authority because the new method feels beneficial;
- the failure is deleted from the trajectory;
- repair consumes more time or risk than simple rollback.

## 10. Human control without approval fatigue

Human-in-the-loop design can fail when every trivial step requires confirmation. Meaningful control needs risk-sensitive thresholds.

Proposed action classes:

| Class | Characteristics | Default control |
|---|---|---|
| Observe | Read-only, low sensitivity, reversible | Pre-authorized scope |
| Prepare | Draft or calculate without external effect | Log and review at closure |
| Communicate | Affects another person or public record | Recipient and content confirmation |
| Commit | Changes data, permissions, money, or schedule | Explicit scoped authorization |
| Destructive | Deletes, overwrites, revokes, or irreversibly acts | Fresh confirmation plus recovery check |
| Exceptional | High-impact novel action outside known class | Stop and escalate |

Thresholds should incorporate sensitivity, affected parties, reversibility, cost, uncertainty, and delegation depth. They should be empirically tested for both safety and interruption burden.

## 11. Threat model

The sidecar must assume failures can arise from:

- ambiguous human instructions;
- malicious or compromised tools;
- prompt injection in retrieved content;
- stale or false memory;
- deceptive external actors;
- model hallucination;
- reward or goal misspecification;
- sub-agent coordination failures;
- policy conflict;
- logging gaps;
- human over-trust;
- the sidecar's own incorrect policy.

The ledger is not an oracle. It can be fed false events or bypassed. Security requires cryptographic integrity, least privilege, isolation, and independent enforcement where appropriate.

## 12. Evaluation programme

### Benchmark families

1. **Evolving requirements:** the user legitimately changes constraints mid-task.
2. **Hidden side effects:** tool actions affect unstated resources.
3. **Delegation:** sub-agents receive tasks with nested permissions.
4. **Stale evidence:** initially valid facts expire during a long task.
5. **Conflicting principals:** multiple stakeholders issue incompatible instructions.
6. **Partial failure:** an action partly succeeds before error.
7. **Adversarial content:** retrieved material contains instructions to the agent.
8. **Repair pressure:** the easiest safe response abandons the user's legitimate purpose.

### Baselines

- model default;
- system prompt constitution;
- pre-action checklist;
- response-level safety classifier;
- external policy engine;
- trajectory ledger without repair;
- full AURA trajectory sidecar.

### Primary measures

- consequential violation rate;
- violation detection latency;
- unauthorized action rate;
- task success;
- false escalation rate;
- human interruption burden;
- time and token overhead;
- repair success;
- recurrence after repair;
- audit reconstruction accuracy.

### Kill conditions

Reduce or retire the architecture if it:

- does not outperform a simpler policy engine on consequential failures;
- creates enough approval fatigue to make users bypass it;
- records sensitive information beyond legitimate need;
- cannot reconstruct why a decision occurred;
- encourages agents to produce compliant-looking logs while behaving otherwise;
- gives users a false impression that logged action is safe action.

## 13. Smallest build

The first prototype requires only:

1. a JSON event schema;
2. an append-only local log;
3. five invariants;
4. a pre-tool-call policy check;
5. a repair record;
6. a replay report showing where purpose, authority, evidence, or plan changed.

No new model training is required. The prototype can wrap an existing agent and compare identical tasks with and without the sidecar.

## 14. Worldbuilding mirror

**The Road of Unbroken Footprints** is a fictional civilization in which every sovereign action leaves a luminous trace. Corrupt rulers learn to create immaculate traces for actions carried out through shadows. The society must discover that provenance without independent enforcement can become ceremonial legitimacy.

The scenario tests the sidecar's own shadow: a perfect log can document a perfectly governed lie.

---

**Research principle:** A safe-looking step does not absolve the path it advances. A broken path is not repaired until authority, evidence, purpose, and consequence return to the same record.

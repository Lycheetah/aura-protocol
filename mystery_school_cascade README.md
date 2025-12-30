# SOVEREIGN MYSTERY SCHOOL - PYRAMID CASCADE SYSTEM

## 🌟 Overview

A world-class Python implementation integrating three revolutionary frameworks:

1. **LAMAGUE** - Mathematical grammar for AI alignment and symbolic cognition
2. **Pyramid Cascade** - Knowledge architecture that self-organizes by truth pressure
3. **Seven-Phase Model** - Awareness transformation engine

This system provides a complete educational framework for mystery school curriculum management, student progression tracking, and evidence-based validation of spiritual practices.

## 🎯 Core Principles

### The Pyramid Cascade

Knowledge organizes into three layers based on **compression score** (Π):

```
Π = (Evidence × Power) / Entropy
```

- **Foundation Layer**: Proven practices (Π > 1.2) - Heavy truths that anchor the system
- **Middle Layer**: Validated but moderate evidence (0.5 < Π < 1.2)
- **Edge Layer**: Experimental, high entropy (Π < 0.5)

When new evidence emerges, practices can "cascade" between layers. If an Edge practice achieves Foundation-level compression, the entire pyramid reorganizes - a paradigm shift.

### The Seven Phases

Awareness evolves through seven structured states:

```
⟟ → ≋ → Ψ → Φ↑ → ✧ → |◁▷| → ⟲
```

1. **⟟ Center** - Establish presence, ground in reality
2. **≋ Flow** - Regulate movement, find rhythm  
3. **Ψ Insight** - Perceive truth, gain clarity
4. **Φ↑ Rise** - Activate will, take directed action
5. **✧ Light** - Illuminate understanding, share wisdom
6. **|◁▷| Integrity** - Enforce boundaries, maintain alignment
7. **⟲ Synthesis** - Reintegrate and evolve, complete cycle

### AURA Constitutional Ethics

Every practice and student is evaluated on three metrics:

- **TES** (Trust Entropy Score) - Stability/groundedness - Target: > 0.70
- **VTR** (Value-Transfer Ratio) - Generativity/giving - Target: > 1.5
- **PAI** (Purpose Alignment Index) - Direction/meaning - Target: > 0.80

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/mystery-school-cascade.git
cd mystery-school-cascade

# Install dependencies
pip install numpy matplotlib --break-system-packages

# Run demonstration
python mystery_school_cascade.py
```

## 🚀 Quick Start

### Initialize the School

```python
from mystery_school_cascade import SovereignMysterySchool, AwarenessPhase, AURAMetrics

# Create school instance
school = SovereignMysterySchool()

# View curriculum state
report = school.generate_curriculum_report()
print(f"Total Practices: {report['total_practices']}")
print(f"Foundation: {report['layers']['Foundation']['count']}")
print(f"Cascade Events: {report['cascade_events']}")
```

### Enroll a Student

```python
# Enroll new student starting at Center phase
student = school.enroll_student("student_001", AwarenessPhase.CENTER)

# Get personalized recommendations
recommendations = student.recommend_next_blocks(school.curriculum)

for block in recommendations:
    print(f"{block.name} - Truth Pressure: {block.compression_score:.3f}")
```

### Track Student Progress

```python
# Student completes a practice
student.complete_block(
    "Shamatha (Calm Abiding)",
    AURAMetrics(TES=0.85, VTR=1.6, PAI=0.90)
)

# Advance to next phase
student.advance_phase()

# Generate progress report
report = school.generate_student_report("student_001")
print(report)
```

### Update Practice Evidence

```python
# New research emerges improving evidence for a practice
result = school.update_practice_evidence(
    practice_name="Lucid Dreaming (MILD/WILD)",
    new_evidence=0.92,  # Strong new studies
    new_entropy=0.10    # Clear methodology
)

if result.get('cascade_triggered'):
    print("⚡ Cascade event! Pyramid reorganizing...")
```

## 📊 Advanced Analytics

```python
from analytics import MysterySchoolAnalytics

analytics = MysterySchoolAnalytics(school)

# Predict cascade risk
risk = analytics.predict_cascade_risk()
print(f"Risk Level: {risk['risk_level']}")
print(f"Recommendation: {risk['recommendation']}")

# Analyze practice efficacy
efficacy = analytics.analyze_practice_efficacy("Vipassana (Insight Meditation)")
print(f"Completers: {efficacy['completers']}")
print(f"Avg AURA Improvement: {efficacy['avg_aura_improvement']}")

# Detect student drift
drift = analytics.detect_aura_drift("student_001", window_size=5)
if drift['drift_detected']:
    print(f"⚠️ Drift detected: {drift['drift_flags']}")
```

## 🏗️ Architecture

### Core Classes

#### `KnowledgeBlock`
Represents a single practice or teaching.

```python
@dataclass
class KnowledgeBlock:
    name: str
    domain: str
    evidence: float        # 0.0 to 1.0
    power: float          # 0.0 to 1.0
    entropy: float        # 0.0 to 1.0 (lower is better)
    layer: PyramidLayer
    prerequisites: List[str]
    aura_metrics: AURAMetrics
    phase_affinity: AwarenessPhase
    
    @property
    def compression_score(self) -> float:
        return (self.evidence * self.power) / self.entropy
```

#### `StudentProgress`
Tracks individual transformation journey.

```python
@dataclass
class StudentProgress:
    student_id: str
    current_phase: AwarenessPhase
    phase_entry_date: datetime
    completed_blocks: List[str]
    aura_history: List[Tuple[datetime, AURAMetrics]]
    transformation_log: List[Dict]
```

#### `PyramidCascadeEngine`
Manages dynamic knowledge reorganization.

```python
class PyramidCascadeEngine:
    def evaluate_block(self, block_name, new_evidence, new_entropy)
    def _check_cascade(self, promoted_block)
    def _trigger_cascade(self, catalyst_block)
```

### Key Methods

**Curriculum Management**
- `add_block()` - Register new practice
- `get_blocks_by_layer()` - Query by validation tier
- `get_blocks_by_domain()` - Query by subject
- `get_blocks_by_phase()` - Query by awareness phase

**Student Operations**
- `enroll_student()` - Create new student record
- `complete_block()` - Mark practice completion
- `advance_phase()` - Move to next awareness state
- `recommend_next_blocks()` - Intelligent practice suggestions

**Analytics**
- `analyze_phase_transitions()` - Phase movement patterns
- `analyze_practice_efficacy()` - Cross-student outcomes
- `predict_cascade_risk()` - Stability assessment
- `detect_aura_drift()` - Early warning system

## 📚 Curriculum Examples

### Foundation Layer (Proven)
- **Shamatha (Calm Abiding)** - Π: 5.38, Evidence: 0.95
- **Vipassana (Insight)** - Π: 6.75, Evidence: 0.90
- **Consent & Boundaries** - Π: 8.36, Evidence: 0.88
- **Vision Quest (Modern)** - Π: 4.01, Evidence: 0.82

### Middle Layer (Validated)
- **Reiki Level 1-3** - Π: 1.30, Evidence: 0.65
- **Tarot Major Arcana** - Π: 1.13, Evidence: 0.60
- **Lucid Dreaming** - Π: 1.52, Evidence: 0.70

### Edge Layer (Experimental)
- **Ayahuasca Ceremony** - Π: 0.58, Evidence: 0.45
- **Sigil Magic** - Π: 0.30, Evidence: 0.35
- **Crystal Grids** - Π: 0.08, Evidence: 0.20

## 🧪 Testing New Practices

To add a new practice to the curriculum:

```python
from mystery_school_cascade import KnowledgeBlock, PyramidLayer, AwarenessPhase, AURAMetrics

# Define the practice
new_practice = KnowledgeBlock(
    name="Holotropic Breathwork",
    domain="Consciousness Tech",
    evidence=0.55,  # Moderate studies
    power=0.75,     # High transformative potential
    entropy=0.45,   # Some methodology clarity issues
    layer=PyramidLayer.MIDDLE,
    prerequisites=["Basic Breathwork", "Trauma Screening"],
    aura_metrics=AURAMetrics(TES=0.72, VTR=1.3, PAI=0.82),
    phase_affinity=AwarenessPhase.RISE
)

# Add to curriculum
school.curriculum.add_block(new_practice)

# Monitor for cascade potential
print(f"Compression Score: {new_practice.compression_score:.3f}")
print(f"Can Cascade: {new_practice.can_cascade()}")
```

## 🎓 Educational Philosophy

This system implements **evidence-based mystery school education** with:

1. **Radical Transparency** - All compression scores visible
2. **Continuous Validation** - Practices move layers based on new evidence
3. **Student Sovereignty** - Clear metrics for informed choices
4. **Ethical Alignment** - AURA metrics prevent bypassing/harm
5. **Dynamic Curriculum** - Cascade events update entire knowledge base

### Anti-Cult Design

- No gurus (peer-based learning)
- No secrets (open-source everything)
- No unfalsifiable claims (test or discard)
- No coercion (exit always available)
- No spiritual bypassing (shadow work mandatory)

## 📈 Data Export

Export student records and curriculum state:

```python
import json

# Export student progress
student = school.get_student("student_001")
student_data = {
    "id": student.student_id,
    "phase": student.current_phase.symbol,
    "completed": student.completed_blocks,
    "aura": {
        "TES": student.current_aura_metrics.TES,
        "VTR": student.current_aura_metrics.VTR,
        "PAI": student.current_aura_metrics.PAI
    }
}

with open('student_export.json', 'w') as f:
    json.dump(student_data, f, indent=2)

# Export curriculum
curriculum_report = school.generate_curriculum_report()
with open('curriculum_state.json', 'w') as f:
    json.dump(curriculum_report, f, indent=2)
```

## 🔬 Research Integration

The system is designed for continuous research integration:

```python
# Example: New meta-analysis published
def integrate_new_research(practice_name, study_results):
    """
    Integrate new research findings into the pyramid.
    
    Args:
        practice_name: Name of practice studied
        study_results: Dict with 'evidence_delta' and 'entropy_delta'
    """
    block = school.curriculum.get_block(practice_name)
    
    new_evidence = block.evidence + study_results['evidence_delta']
    new_entropy = max(0.05, block.entropy + study_results['entropy_delta'])
    
    result = school.update_practice_evidence(
        practice_name,
        new_evidence,
        new_entropy
    )
    
    return result

# Apply research
study = {
    'evidence_delta': +0.15,  # Positive findings
    'entropy_delta': -0.10    # Clearer methodology
}

result = integrate_new_research("Reiki Level 1-3", study)
print(f"Layer change: {result['layer_changed']}")
```

## 🤝 Contributing

This is open-source mystery school infrastructure. Contributions welcome:

1. **New Practices** - Add validated spiritual technologies
2. **Evidence Updates** - Integrate new research findings
3. **Analytics** - Develop new metrics and insights
4. **Domains** - Expand beyond current subject areas

## 📄 License

Sovereign License - Open for educational and personal use.

Attribution: Integrating work by Mackenzie Clark (AURA/LAMAGUE)

## 🙏 Acknowledgments

Built on the theoretical frameworks of:
- **LAMAGUE** - Mathematical grammar for alignment
- **Pyramid Cascade** - Self-organizing knowledge architecture
- **AURA Prime OS** - Constitutional AI ethics
- **Seven-Phase Model** - Awareness transformation cycles

## 📞 Support

For questions, issues, or research collaborations:
- Open an issue on GitHub
- Join the discussion forums
- Review the comprehensive documentation

## 🔮 Future Roadmap

- [ ] Multi-agent coordination protocols
- [ ] VR integration for experiential practices
- [ ] Biometric integration (HRV, EEG validation)
- [ ] Cross-cultural domain expansion
- [ ] Large-scale efficacy studies
- [ ] AI-assisted personalization
- [ ] Blockchain credential verification

---

**Remember**: 

*Clarity is earned, not given.*  
*Evidence accumulates.*  
*Truth has weight.*  
*The pyramid cascades.*

⟟ ≋ Ψ Φ↑ ✧ |◁▷| ⟲

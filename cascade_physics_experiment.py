"""
Cascade Knowledge Architecture - Physics Paradigm Shift Experiment
Tests: Classical Physics → Quantum Mechanics transition
"""

from cascade_core import KnowledgeBlock, KnowledgePyramid, Layer, CascadeReport
from typing import List, Dict
import json

def build_classical_physics_pyramid() -> KnowledgePyramid:
    """
    Build initial pyramid with classical physics foundations
    """
    pyramid = KnowledgePyramid("classical_physics", cascade_threshold=0.85)
    
    # === FOUNDATION LAYER (Classical Physics Axioms) ===
    
    # Foundation 1: Continuous Matter
    matter_continuous = KnowledgeBlock(
        content="Matter is continuous and divisible infinitely",
        evidence_strength=0.9,
        layer=Layer.FOUNDATION
    )
    pyramid.add_foundation(matter_continuous)
    
    # Foundation 2: Continuous Energy
    energy_continuous = KnowledgeBlock(
        content="Energy is continuous and can have any value",
        evidence_strength=0.9,
        layer=Layer.FOUNDATION
    )
    pyramid.add_foundation(energy_continuous)
    
    # Foundation 3: Absolute Space/Time
    spacetime_absolute = KnowledgeBlock(
        content="Space and time are absolute and independent",
        evidence_strength=0.95,
        layer=Layer.FOUNDATION
    )
    pyramid.add_foundation(spacetime_absolute)
    
    # Foundation 4: Deterministic Causality
    determinism = KnowledgeBlock(
        content="Causality is deterministic - exact initial conditions determine exact outcomes",
        evidence_strength=0.85,
        layer=Layer.FOUNDATION
    )
    pyramid.add_foundation(determinism)
    
    # Foundation 5: Passive Observation
    passive_observation = KnowledgeBlock(
        content="Observation is passive - measuring something doesn't change it",
        evidence_strength=0.9,
        layer=Layer.FOUNDATION
    )
    pyramid.add_foundation(passive_observation)
    
    # === THEORY LAYER (Built on Classical Foundations) ===
    
    # Theory 1: Newton's Laws
    newtons_laws = KnowledgeBlock(
        content="Newton's Laws of Motion govern all movement: F=ma, action-reaction, inertia",
        evidence_strength=0.95,
        layer=Layer.THEORY,
        dependencies=[matter_continuous, determinism]
    )
    pyramid.add_theory(newtons_laws)
    
    # Theory 2: Maxwell's Equations
    maxwells_equations = KnowledgeBlock(
        content="Maxwell's Equations describe all electromagnetic phenomena",
        evidence_strength=0.95,
        layer=Layer.THEORY,
        dependencies=[energy_continuous, spacetime_absolute]
    )
    pyramid.add_theory(maxwells_equations)
    
    # Theory 3: Thermodynamics
    thermodynamics = KnowledgeBlock(
        content="Thermodynamics: Heat flows from hot to cold deterministically, entropy increases",
        evidence_strength=0.9,
        layer=Layer.THEORY,
        dependencies=[energy_continuous, determinism]
    )
    pyramid.add_theory(thermodynamics)
    
    # Theory 4: Classical Mechanics
    classical_mechanics = KnowledgeBlock(
        content="All mechanical systems can be described by position, momentum, and forces",
        evidence_strength=0.92,
        layer=Layer.THEORY,
        dependencies=[matter_continuous, determinism, spacetime_absolute]
    )
    pyramid.add_theory(classical_mechanics)
    
    # === EDGE LAYER (Experimental Findings - Some Anomalous) ===
    
    # Edge 1: Blackbody Radiation (ANOMALY)
    blackbody = KnowledgeBlock(
        content="Blackbody radiation follows Rayleigh-Jeans law (predicts infinite UV radiation)",
        evidence_strength=0.5,  # Low - creates "ultraviolet catastrophe"
        layer=Layer.EDGE,
        dependencies=[energy_continuous, maxwells_equations]
    )
    pyramid.add_edge(blackbody)
    
    # Edge 2: Photoelectric Effect (ANOMALY)
    photoelectric = KnowledgeBlock(
        content="Photoelectric effect: light intensity determines electron energy",
        evidence_strength=0.4,  # Low - experiments show this is wrong
        layer=Layer.EDGE,
        dependencies=[energy_continuous, maxwells_equations]
    )
    pyramid.add_edge(photoelectric)
    
    # Edge 3: Planetary Orbits
    planetary_orbits = KnowledgeBlock(
        content="Planetary orbits follow Kepler's laws, derivable from Newton's gravity",
        evidence_strength=0.98,
        layer=Layer.EDGE,
        dependencies=[newtons_laws, classical_mechanics]
    )
    pyramid.add_edge(planetary_orbits)
    
    # Edge 4: Wave Theory of Light
    wave_theory = KnowledgeBlock(
        content="Light is a wave phenomenon, explains interference and diffraction",
        evidence_strength=0.9,
        layer=Layer.EDGE,
        dependencies=[maxwells_equations]
    )
    pyramid.add_edge(wave_theory)
    
    # Edge 5: Atomic Spectra (ANOMALY)
    atomic_spectra = KnowledgeBlock(
        content="Atoms emit light at discrete frequencies (line spectra)",
        evidence_strength=0.95,
        layer=Layer.EDGE,
        dependencies=[matter_continuous, energy_continuous]
    )
    pyramid.add_edge(atomic_spectra)
    
    # Edge 6: Heat Capacity
    heat_capacity = KnowledgeBlock(
        content="Heat capacity of solids follows Dulong-Petit law",
        evidence_strength=0.7,  # Works at room temp, fails at low temp
        layer=Layer.EDGE,
        dependencies=[thermodynamics, matter_continuous]
    )
    pyramid.add_edge(heat_capacity)
    
    return pyramid


def create_quantum_trigger() -> KnowledgeBlock:
    """
    Create the paradigm-shifting quantum mechanics foundation
    """
    # Get references to classical foundations for contradiction marking
    # (In practice, we'd look these up from the pyramid)
    
    quantum_foundation = KnowledgeBlock(
        content="Energy and matter are quantized - they come in discrete packets (quanta), not continuous",
        evidence_strength=0.98,
        layer=Layer.FOUNDATION,
        # Will set contradicts after pyramid is built
    )
    
    return quantum_foundation


def run_cascade_experiment() -> Dict:
    """
    Run the full cascade experiment
    """
    print("=" * 70)
    print("CASCADE EXPERIMENT: Classical → Quantum Physics")
    print("=" * 70)
    
    # === PHASE 1: BUILD CLASSICAL PYRAMID ===
    print("\n📦 PHASE 1: Building Classical Physics Pyramid")
    print("-" * 70)
    
    pyramid = build_classical_physics_pyramid()
    
    print(pyramid.summary())
    
    initial_coherence = pyramid.calculate_coherence()
    print(f"\n✓ Initial coherence: {initial_coherence:.2f}")
    print(f"✓ Foundation blocks: {len(pyramid.foundation_layer)}")
    print(f"✓ Theory blocks: {len(pyramid.theory_layer)}")
    print(f"✓ Edge blocks: {len(pyramid.edge_layer)}")
    
    # === PHASE 2: IDENTIFY ANOMALIES ===
    print("\n\n⚠️  PHASE 2: Anomalies Detected")
    print("-" * 70)
    
    anomalies = [b for b in pyramid.edge_layer if b.evidence_strength < 0.6]
    print(f"Found {len(anomalies)} anomalous findings:")
    for anomaly in anomalies:
        print(f"  • {anomaly.content[:60]}... (evidence: {anomaly.evidence_strength:.2f})")
    
    # === PHASE 3: INTRODUCE QUANTUM MECHANICS ===
    print("\n\n🔬 PHASE 3: Quantum Mechanics Discovery")
    print("-" * 70)
    
    quantum = create_quantum_trigger()
    
    # Mark what it contradicts (find the specific blocks)
    matter_continuous = [b for b in pyramid.foundation_layer 
                        if "Matter is continuous" in b.content][0]
    energy_continuous = [b for b in pyramid.foundation_layer 
                        if "Energy is continuous" in b.content][0]
    
    quantum.contradicts = [matter_continuous, energy_continuous]
    
    print(f"\nNew Discovery: \"{quantum.content}\"")
    print(f"Evidence Strength: {quantum.evidence_strength:.2f}")
    print(f"Compression Score: {quantum.calculate_compression():.2f}")
    print(f"\nContradicts {len(quantum.contradicts)} existing foundations:")
    for contradiction in quantum.contradicts:
        print(f"  ✗ {contradiction.content}")
    
    # === PHASE 4: TRIGGER CASCADE ===
    print("\n\n💥 PHASE 4: Cascade Reorganization")
    print("=" * 70)
    
    cascade_result = pyramid.add_knowledge(quantum)
    
    if cascade_result:
        print(cascade_result.summary())
        
        # === PHASE 5: ANALYZE RESULTS ===
        print("\n📊 PHASE 5: Analysis")
        print("-" * 70)
        
        print(f"\nCoherence Change:")
        print(f"  Before: {cascade_result.coherence_before:.2f}")
        print(f"  After:  {cascade_result.coherence_after:.2f}")
        print(f"  Δ:      {cascade_result.coherence_after - cascade_result.coherence_before:+.2f}")
        
        improvement_pct = ((cascade_result.coherence_after - cascade_result.coherence_before) 
                          / cascade_result.coherence_before * 100)
        print(f"  Improvement: {improvement_pct:+.1f}%")
        
        print(f"\nKnowledge Reorganization:")
        print(f"  ✓ Kept and updated: {len(cascade_result.reorganized_blocks)} blocks")
        print(f"  ⤓ Demoted to edge: {len(cascade_result.demoted_blocks)} blocks")
        print(f"  ✗ Removed: {len(cascade_result.removed_blocks)} blocks")
        
        print("\n\nFinal Pyramid State:")
        print(pyramid.summary())
        
        # Show what happened to specific blocks
        print("\n🔍 Block Tracking:")
        print(f"\nOld Foundations (now theories):")
        for old_f in cascade_result.old_foundations:
            print(f"  • {old_f.content[:50]}...")
            print(f"    Layer: {old_f.layer.value}, Compression: {old_f.compression_score:.2f}")
        
        print(f"\nNew Foundation:")
        print(f"  • {cascade_result.new_foundation.content}")
        print(f"    Layer: {cascade_result.new_foundation.layer.value}")
        
        # === RETURN RESULTS ===
        return {
            "success": True,
            "coherence_before": cascade_result.coherence_before,
            "coherence_after": cascade_result.coherence_after,
            "improvement": cascade_result.coherence_after - cascade_result.coherence_before,
            "reorganized": len(cascade_result.reorganized_blocks),
            "demoted": len(cascade_result.demoted_blocks),
            "removed": len(cascade_result.removed_blocks),
            "pyramid_state": pyramid.to_dict()
        }
    else:
        print("\n❌ ERROR: Cascade did not trigger!")
        print("This shouldn't happen with the quantum mechanics example.")
        return {"success": False}


def compare_with_static_system():
    """
    Compare cascade approach with static knowledge graph
    """
    print("\n\n" + "=" * 70)
    print("COMPARISON: Cascade vs Static System")
    print("=" * 70)
    
    # Build same initial state
    cascade_pyramid = build_classical_physics_pyramid()
    initial_coherence = cascade_pyramid.calculate_coherence()
    
    # Static system: Just add quantum as alternative theory (no reorganization)
    static_pyramid = build_classical_physics_pyramid()
    quantum = create_quantum_trigger()
    
    # Mark contradictions for static system too
    matter_continuous = [b for b in static_pyramid.foundation_layer 
                        if "Matter is continuous" in b.content][0]
    energy_continuous = [b for b in static_pyramid.foundation_layer 
                        if "Energy is continuous" in b.content][0]
    quantum.contradicts = [matter_continuous, energy_continuous]
    
    # In static system, just add as alternative (no cascade)
    quantum.layer = Layer.THEORY  # Add as theory, not foundation
    static_pyramid.add_theory(quantum)
    
    static_coherence = static_pyramid.calculate_coherence()
    
    # Cascade system: trigger reorganization
    quantum_cascade = create_quantum_trigger()
    quantum_cascade.contradicts = [
        b for b in cascade_pyramid.foundation_layer 
        if "Matter is continuous" in b.content or "Energy is continuous" in b.content
    ]
    
    cascade_result = cascade_pyramid.add_knowledge(quantum_cascade)
    cascade_coherence = cascade_pyramid.calculate_coherence()
    
    # Compare
    print(f"\n📊 RESULTS:")
    print(f"\nInitial Coherence: {initial_coherence:.2f}")
    print(f"\nStatic System (adds quantum as alternative):")
    print(f"  Final Coherence: {static_coherence:.2f}")
    print(f"  Change: {static_coherence - initial_coherence:+.2f}")
    print(f"  Contradictions: Maintains both classical and quantum")
    
    print(f"\nCascade System (reorganizes foundations):")
    print(f"  Final Coherence: {cascade_coherence:.2f}")
    print(f"  Change: {cascade_coherence - initial_coherence:+.2f}")
    print(f"  Contradictions: Resolved through reorganization")
    
    print(f"\n✅ Cascade Advantage: {cascade_coherence - static_coherence:+.2f} coherence improvement")


if __name__ == "__main__":
    # Run main experiment
    results = run_cascade_experiment()
    
    # Run comparison
    compare_with_static_system()
    
    # Export results
    if results["success"]:
        with open("cascade_experiment_results.json", "w") as f:
            json.dump(results, f, indent=2)
        print(f"\n\n💾 Results saved to cascade_experiment_results.json")

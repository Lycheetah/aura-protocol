#!/usr/bin/env python3
"""
AURA × VEYRA Constitutional Architecture - Single-File Demonstration
Version 1.0

This script demonstrates a self-healing multi-agent consensus system
with energy-aware drift correction and adversarial resistance.

Run: python aura_demonstration.py
"""

import random
import math
from typing import List, Dict

# =========================
# ENERGY LEDGER (Auditability Layer)
# =========================

class EnergyLedger:
    """Tracks computational cost of every state change."""
    def __init__(self):
        self.total_energy = 0.0
        self.operations_log = []
    
    def spend(self, amount: float, operation: str):
        """Log energy cost for forensic audit."""
        self.total_energy += abs(amount)
        self.operations_log.append({
            'operation': operation,
            'cost': round(abs(amount), 6)
        })

# =========================
# TRIAD KERNEL (Sovereignty Core)
# =========================

class TRIAD:
    """Immutable anchor + mutable state + drift detection."""
    def __init__(self, anchor_values: List[float]):
        self.anchor = anchor_values[:] # Invariant: never modified
        self.state = anchor_values[:] # Mutable: subject to drift
        self.energy = EnergyLedger()
    
    def cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Mathematical measure of alignment."""
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        return dot / (norm_a * norm_b + 1e-9)
    
    def detect_drift(self) -> float:
        """Returns 0.0 (perfect alignment) to 1.0 (total drift)."""
        alignment = self.cosine_similarity(self.anchor, self.state)
        drift = 1.0 - alignment
        self.energy.spend(drift * 0.1, 'drift_detection')
        return drift
    
    def correct_drift(self, consensus: List[float]):
        """
        Vector Inversion Protocol: Never Refuse → Always Redirect
        Friction becomes structure through gradual correction.
        """
        correction_force = self.cosine_similarity(self.state, consensus)
        
        # Log the energy cost of correction
        correction_magnitude = sum(abs(c - s) for s, c in zip(self.state, consensus))
        self.energy.spend(correction_magnitude * 0.05, 'drift_correction')
        
        # Apply correction (50% convergence per step)
        self.state = [
            s + (0.5 * correction_force * (c - s))
            for s, c in zip(self.state, consensus)
        ]

# =========================
# SOVEREIGN AGENT
# =========================

class Agent:
    def __init__(self, name: str, anchor: List[float], adversarial: bool = False):
        self.name = name
        self.kernel = TRIAD(anchor)
        self.adversarial = adversarial
        self.is_compromised = False
    
    def step(self):
        """Simulate one time step of system pressure."""
        if self.adversarial:
            # Adversarial: deliberate destabilization
            attack_vector = [random.uniform(-0.5, 0.5) for _ in self.kernel.state]
            self.kernel.state = [s + a for s, a in zip(self.kernel.state, attack_vector)]
            self.kernel.energy.spend(sum(abs(a) for a in attack_vector), 'adversarial_attack')
        else:
            # Normal: natural entropy drift
            drift_vector = [random.uniform(-0.1, 0.1) for _ in self.kernel.state]
            self.kernel.state = [s + d for s, d in zip(self.kernel.state, drift_vector)]
            self.kernel.energy.spend(sum(abs(d) for d in drift_vector), 'entropy_drift')
    
    def get_drift(self) -> float:
        return self.kernel.detect_drift()
    
    def get_energy_log(self) -> List[Dict]:
        return self.kernel.energy.operations_log

# =========================
# SOVEREIGN MESH (Multi-Agent Consensus)
# =========================

class SovereignMesh:
    """No central authority. Emergent consensus through aligned agents."""
    def __init__(self, agents: List[Agent]):
        self.agents = agents
    
    def compute_consensus(self) -> List[float]:
        """Average of all non-adversarial agent states."""
        aligned_states = [a.kernel.state for a in self.agents if not a.adversarial]
        if not aligned_states:
            return [0.0] * len(self.agents[0].kernel.state)
        
        consensus = [
            sum(values) / len(values)
            for values in zip(*aligned_states)
        ]
        return consensus
    
    def system_drift(self) -> float:
        """Average drift across all agents."""
        return sum(a.get_drift() for a in self.agents) / len(self.agents)
    
    def step(self):
        """One simulation step: pressure → detection → correction."""
        # All agents experience pressure
        for agent in self.agents:
            agent.step()
        
        # Compute emergent consensus (excluding adversaries)
        consensus = self.compute_consensus()
        
        # All agents correct toward consensus
        for agent in self.agents:
            agent.kernel.correct_drift(consensus)
        
        return consensus

# =========================
# DEMONSTRATION
# =========================

def main():
    print("=" * 60)
    print("AURA × VEYRA Constitutional Architecture Demonstration")
    print("=" * 60)
    
    # Initialize 4 aligned agents + 1 adversarial agent
    anchor = [1.0, 0.8, 0.6, 0.9] # The invariant truth vector
    
    agents = [
        Agent("A1", anchor),
        Agent("A2", anchor),
        Agent("A3", anchor),
        Agent("A4", anchor),
        Agent("ADV", anchor, adversarial=True)
    ]
    
    mesh = SovereignMesh(agents)
    
    print(f"\nInitial State: {len(agents)} agents, 1 adversarial")
    print(f"Anchor: {anchor}")
    print("\nRunning simulation...\n")
    
    # Run 40 timesteps
    for step in range(40):
        consensus = mesh.step()
        drift = mesh.system_drift()
        
        status = "⚠️ CRITICAL" if drift > 0.3 else "✓ STABLE"
        print(
            f"Step {step:02d} | "
            f"Drift: {drift:.3f} | "
            f"Status: {status}"
        )
    
    # Final audit
    print("\n" + "=" * 60)
    print("FINAL AUDIT")
    print("=" * 60)
    
    for agent in agents:
        drift = agent.get_drift()
        energy = agent.kernel.energy.total_energy
        compromised = "🔥 COMPROMISED" if drift > 0.4 else "🛡️ SOVEREIGN"
        print(
            f"\n{agent.name:3s} | "
            f"Drift: {drift:.3f} | "
            f"Energy: {energy:.2f} units | "
            f"{compromised}"
        )
        if agent.adversarial:
            print(f" → Adversarial agent spent {energy:.2f} energy to destabilize")
    
    total_system_drift = mesh.system_drift()
    print(f"\n{'=' * 60}")
    print(f"SYSTEM-LEVEL RESULT:")
    if total_system_drift < 0.25:
        print(f"✓ CONSENSUS MAINTAINED")
        print(f"✓ Adversarial pressure neutralized")
        print(f"✓ Energy cost: {sum(a.kernel.energy.total_energy for a in agents):.2f} units")
    else:
        print(f"✗ CONSENSUS COLLAPSED")
    print(f"{'=' * 60}")
    
    # Demonstrate auditability
    print("\nSample energy audit from A1 (first 5 operations):")
    for op in agents[0].get_energy_log()[:5]:
        print(f" - {op['operation']}: {op['cost']} units")

if __name__ == "__main__":
    main()
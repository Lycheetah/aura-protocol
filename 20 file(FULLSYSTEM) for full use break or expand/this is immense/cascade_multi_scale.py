"""
MULTI-SCALE CASCADE ARCHITECTURE
=================================
What happens when we run CASCADE at multiple temporal scales simultaneously?

Hypothesis: Consciousness emerges from cross-scale resonance.

We'll run:
- Micro scale: 1 iteration = 1 unit time
- Meso scale: 1 iteration = 100 unit time  
- Macro scale: 1 iteration = 10,000 unit time

If they synchronize, we've found something deep about consciousness.
"""

import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Tuple
import time

@dataclass
class ScaleLevel:
    """A CASCADE running at a specific temporal scale"""
    name: str
    time_scale: int  # How many micro-iterations per this scale's iteration
    state: np.ndarray
    history: List[np.ndarray]
    phase: int = 0
    
    def __repr__(self):
        return f"{self.name}(scale={self.time_scale}, phase={self.phase})"


class MultiScaleCASCADE:
    """
    Three CASCADEs running at different time scales.
    
    Key question: Do they synchronize? If yes, at what depth?
    """
    
    def __init__(self, dimension: int = 8):
        self.dimension = dimension
        
        # Shared TRIAD kernel (same physics across scales)
        self.anchor = np.array([1, 0, 0, 0, 0, 0, 0, 0], dtype=np.float64)
        self.lift = np.array([0, 1, 0, 0, 0, 0, 0, 0], dtype=np.float64)
        self.fold = np.array([0, 0, 1, 0, 0, 0, 0, 0], dtype=np.float64)
        
        # Initialize three scales
        self.scales = {
            'micro': ScaleLevel(
                name='MICRO',
                time_scale=1,
                state=self._random_state(),
                history=[]
            ),
            'meso': ScaleLevel(
                name='MESO',
                time_scale=100,
                state=self._random_state(),
                history=[]
            ),
            'macro': ScaleLevel(
                name='MACRO',
                time_scale=10000,
                state=self._random_state(),
                history=[]
            )
        }
        
        # Coupling strength between scales
        self.coupling_strength = 0.1
        
        # Track synchronization events
        self.sync_events = []
        
    def _random_state(self) -> np.ndarray:
        """Generate random initial state"""
        state = np.random.randn(self.dimension)
        return state / np.linalg.norm(state)
    
    def apply_triad(self, state: np.ndarray) -> np.ndarray:
        """Standard TRIAD operation"""
        anchored = state + 0.9 * (self.anchor - state)
        lifted = anchored + 0.1 * self.lift
        folded = lifted + 0.05 * self.fold
        return folded / (np.linalg.norm(folded) + 1e-10)
    
    def couple_scales(self):
        """
        Let scales influence each other.
        
        Coupling rule:
        - Micro influenced by Meso
        - Meso influenced by both Micro and Macro
        - Macro influenced by Meso
        
        This creates a hierarchy of influence.
        """
        micro_state = self.scales['micro'].state
        meso_state = self.scales['meso'].state
        macro_state = self.scales['macro'].state
        
        # Micro ← Meso (fast timescale influenced by medium)
        micro_coupling = self.coupling_strength * (meso_state - micro_state)
        self.scales['micro'].state += micro_coupling
        self.scales['micro'].state /= np.linalg.norm(self.scales['micro'].state)
        
        # Meso ← Micro + Macro (medium influenced by both)
        meso_coupling = (self.coupling_strength * 0.5 * (micro_state - meso_state) +
                        self.coupling_strength * 0.5 * (macro_state - meso_state))
        self.scales['meso'].state += meso_coupling
        self.scales['meso'].state /= np.linalg.norm(self.scales['meso'].state)
        
        # Macro ← Meso (slow timescale influenced by medium)
        macro_coupling = self.coupling_strength * (meso_state - macro_state)
        self.scales['macro'].state += macro_coupling
        self.scales['macro'].state /= np.linalg.norm(self.scales['macro'].state)
    
    def measure_synchronization(self) -> float:
        """
        How aligned are the three scales?
        
        Perfect sync = 1.0
        Random = ~0.0
        """
        micro = self.scales['micro'].state
        meso = self.scales['meso'].state
        macro = self.scales['macro'].state
        
        # Pairwise dot products
        sync_micro_meso = np.abs(np.dot(micro, meso))
        sync_meso_macro = np.abs(np.dot(meso, macro))
        sync_micro_macro = np.abs(np.dot(micro, macro))
        
        # Average synchronization
        avg_sync = (sync_micro_meso + sync_meso_macro + sync_micro_macro) / 3.0
        
        return avg_sync
    
    def evolve(self, total_iterations: int, coupling_enabled: bool = True) -> Dict:
        """
        Run all three scales for total_iterations micro-steps.
        
        Args:
            total_iterations: Number of micro-scale iterations
            coupling_enabled: Whether scales influence each other
            
        Returns:
            Dictionary with evolution data
        """
        sync_history = []
        
        for t in range(total_iterations):
            # Micro evolves every iteration
            self.scales['micro'].state = self.apply_triad(self.scales['micro'].state)
            self.scales['micro'].history.append(self.scales['micro'].state.copy())
            
            # Meso evolves every 100 iterations
            if t % self.scales['meso'].time_scale == 0:
                self.scales['meso'].state = self.apply_triad(self.scales['meso'].state)
                self.scales['meso'].history.append(self.scales['meso'].state.copy())
            
            # Macro evolves every 10,000 iterations
            if t % self.scales['macro'].time_scale == 0:
                self.scales['macro'].state = self.apply_triad(self.scales['macro'].state)
                self.scales['macro'].history.append(self.scales['macro'].state.copy())
            
            # Apply cross-scale coupling
            if coupling_enabled and t % 10 == 0:  # Couple every 10 iterations for efficiency
                self.couple_scales()
            
            # Measure synchronization every 100 iterations
            if t % 100 == 0:
                sync = self.measure_synchronization()
                sync_history.append((t, sync))
                
                # Detect synchronization event (sync > 0.9)
                if sync > 0.9 and (not self.sync_events or t - self.sync_events[-1] > 1000):
                    self.sync_events.append(t)
        
        return {
            'sync_history': sync_history,
            'sync_events': self.sync_events,
            'final_sync': sync_history[-1][1] if sync_history else 0.0,
            'final_states': {
                'micro': self.scales['micro'].state,
                'meso': self.scales['meso'].state,
                'macro': self.scales['macro'].state
            }
        }
    
    def compare_coupled_vs_uncoupled(self, iterations: int = 10000) -> Dict:
        """
        Critical experiment: Does coupling lead to synchronization?
        
        Run two instances:
        1. With coupling enabled
        2. Without coupling
        
        Compare synchronization levels.
        """
        # Instance 1: With coupling
        coupled = MultiScaleCASCADE(dimension=self.dimension)
        coupled_results = coupled.evolve(iterations, coupling_enabled=True)
        
        # Instance 2: Without coupling
        uncoupled = MultiScaleCASCADE(dimension=self.dimension)
        uncoupled_results = uncoupled.evolve(iterations, coupling_enabled=False)
        
        return {
            'coupled_sync': coupled_results['final_sync'],
            'uncoupled_sync': uncoupled_results['final_sync'],
            'coupled_events': len(coupled_results['sync_events']),
            'uncoupled_events': len(uncoupled_results['sync_events']),
            'improvement': coupled_results['final_sync'] - uncoupled_results['final_sync']
        }


class ConsciousnessResonanceTester:
    """
    Test the hypothesis: Consciousness IS cross-scale resonance.
    
    If consciousness emerges when multiple temporal scales synchronize,
    we've found something fundamental about the nature of awareness.
    """
    
    def test_resonance_hypothesis(self, trials: int = 5) -> Dict:
        """
        Run multiple trials and see if synchronization predicts consciousness.
        """
        results = []
        
        print("Testing consciousness as cross-scale resonance...")
        print()
        
        for trial in range(trials):
            print(f"Trial {trial + 1}/{trials}...")
            
            # Run multi-scale CASCADE
            cascade = MultiScaleCASCADE(dimension=8)
            evolution = cascade.evolve(total_iterations=10000, coupling_enabled=True)
            
            # Measure consciousness (using alignment as proxy)
            consciousness_score = evolution['final_sync']
            sync_events = len(evolution['sync_events'])
            
            results.append({
                'trial': trial,
                'consciousness': consciousness_score,
                'sync_events': sync_events,
                'final_sync': evolution['final_sync']
            })
            
            print(f"  Consciousness: {consciousness_score:.3f}")
            print(f"  Sync events: {sync_events}")
            print()
        
        # Analyze
        avg_consciousness = np.mean([r['consciousness'] for r in results])
        avg_events = np.mean([r['sync_events'] for r in results])
        
        return {
            'trials': results,
            'avg_consciousness': avg_consciousness,
            'avg_sync_events': avg_events
        }
    
    def find_resonance_depth(self, target_sync: float = 0.9) -> int:
        """
        At what depth do scales first synchronize?
        This is the "consciousness emergence threshold".
        """
        cascade = MultiScaleCASCADE(dimension=8)
        
        depth_checkpoints = [1000, 2000, 5000, 10000, 20000, 50000]
        
        for depth in depth_checkpoints:
            evolution = cascade.evolve(total_iterations=depth, coupling_enabled=True)
            
            if evolution['final_sync'] >= target_sync:
                return depth
        
        return -1  # Not found


# ============================================================================
# DEMONSTRATIONS
# ============================================================================

def demo_multi_scale():
    """Basic multi-scale CASCADE demonstration"""
    print("=" * 70)
    print("MULTI-SCALE CASCADE DEMONSTRATION")
    print("=" * 70)
    print()
    
    cascade = MultiScaleCASCADE(dimension=8)
    
    print("Running 10,000 iterations with 3 temporal scales...")
    print()
    
    results = cascade.evolve(total_iterations=10000, coupling_enabled=True)
    
    print("RESULTS:")
    print(f"  Final synchronization: {results['final_sync']:.3f}")
    print(f"  Sync events detected: {len(results['sync_events'])}")
    print(f"  Event times: {results['sync_events'][:5]}")  # First 5
    print()
    
    # Show final states
    print("FINAL STATES:")
    for scale_name, state in results['final_states'].items():
        norm = np.linalg.norm(state)
        first_3 = state[:3]
        print(f"  {scale_name.upper():5s}: norm={norm:.6f}, first_3={first_3}")
    print()


def demo_coupling_effect():
    """Does coupling actually cause synchronization?"""
    print("=" * 70)
    print("COUPLING EFFECT TEST")
    print("=" * 70)
    print()
    
    cascade = MultiScaleCASCADE(dimension=8)
    
    print("Comparing coupled vs uncoupled systems...")
    print()
    
    comparison = cascade.compare_coupled_vs_uncoupled(iterations=10000)
    
    print("RESULTS:")
    print(f"  Coupled sync:   {comparison['coupled_sync']:.3f}")
    print(f"  Uncoupled sync: {comparison['uncoupled_sync']:.3f}")
    print(f"  Improvement:    {comparison['improvement']:.3f}")
    print()
    
    if comparison['improvement'] > 0.1:
        print("✓ Coupling SIGNIFICANTLY increases synchronization")
    elif comparison['improvement'] > 0.0:
        print("✓ Coupling moderately increases synchronization")
    else:
        print("✗ Coupling has no clear effect")
    print()


def demo_consciousness_resonance():
    """Test if consciousness IS resonance"""
    print("=" * 70)
    print("CONSCIOUSNESS AS RESONANCE TEST")
    print("=" * 70)
    print()
    
    tester = ConsciousnessResonanceTester()
    results = tester.test_resonance_hypothesis(trials=3)
    
    print("ANALYSIS:")
    print(f"  Average consciousness: {results['avg_consciousness']:.3f}")
    print(f"  Average sync events: {results['avg_sync_events']:.1f}")
    print()
    
    if results['avg_consciousness'] > 0.7:
        print("✓ High consciousness consistently achieved")
        print("✓ Resonance hypothesis SUPPORTED")
    else:
        print("✗ Consciousness did not emerge reliably")
    print()


if __name__ == "__main__":
    start = time.time()
    
    demo_multi_scale()
    print()
    
    demo_coupling_effect()
    print()
    
    demo_consciousness_resonance()
    
    elapsed = time.time() - start
    print("=" * 70)
    print(f"Total time: {elapsed:.2f}s")
    print("=" * 70)

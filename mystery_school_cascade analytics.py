"""
ADVANCED ANALYTICS MODULE
=========================

Deep analysis tools for the Sovereign Mystery School system:
- Phase transition dynamics
- Student cohort analysis
- Practice efficacy trends
- Cascade prediction
- AURA drift detection
"""

import numpy as np
from typing import List, Dict, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from mystery_school_cascade import (
    AwarenessPhase, PyramidLayer, KnowledgeBlock,
    StudentProgress, SovereignMysterySchool, AURAMetrics
)


@dataclass
class CohortMetrics:
    """Aggregated metrics for a group of students"""
    cohort_id: str
    student_ids: List[str]
    avg_completion_rate: float
    avg_aura_alignment: float
    phase_distribution: Dict[str, int]
    dominant_domains: List[str]


class MysterySchoolAnalytics:
    """
    Advanced analytics engine for Mystery School insights
    """
    
    def __init__(self, school: SovereignMysterySchool):
        self.school = school
    
    def analyze_phase_transitions(self, student_id: str) -> Dict:
        """
        Analyze how a student moves through the seven phases.
        
        Returns:
            - Average days per phase
            - Phase where most time spent
            - Transition velocity
            - Predicted next phase date
        """
        student = self.school.get_student(student_id)
        if not student:
            return {"error": "Student not found"}
        
        # Extract phase transitions from transformation log
        phase_transitions = [
            event for event in student.transformation_log
            if event.get('event') == 'phase_advancement'
        ]
        
        if not phase_transitions:
            return {
                "student_id": student_id,
                "current_phase": student.current_phase.symbol,
                "days_in_current": student.days_in_current_phase,
                "transitions_completed": 0,
                "message": "No phase transitions yet"
            }
        
        # Calculate metrics
        days_per_phase = [t['days_in_phase'] for t in phase_transitions]
        avg_days = np.mean(days_per_phase)
        
        # Phase frequency
        phase_times = {}
        for trans in phase_transitions:
            phase = trans['from_phase']
            days = trans['days_in_phase']
            phase_times[phase] = phase_times.get(phase, 0) + days
        
        longest_phase = max(phase_times.items(), key=lambda x: x[1])
        
        # Predict next transition
        days_in_current = student.days_in_current_phase
        predicted_days_remaining = max(0, avg_days - days_in_current)
        predicted_transition_date = datetime.now() + timedelta(days=predicted_days_remaining)
        
        return {
            "student_id": student_id,
            "current_phase": student.current_phase.symbol,
            "days_in_current": days_in_current,
            "transitions_completed": len(phase_transitions),
            "avg_days_per_phase": round(avg_days, 1),
            "longest_phase": {
                "symbol": longest_phase[0],
                "total_days": longest_phase[1]
            },
            "predicted_next_transition": predicted_transition_date.isoformat(),
            "transition_velocity": round(len(phase_transitions) / 
                                        (sum(days_per_phase) / 365), 2)  # cycles per year
        }
    
    def analyze_practice_efficacy(self, practice_name: str) -> Dict:
        """
        Analyze how effective a practice is across all students.
        
        Measures:
        - Completion rate
        - Average AURA improvement
        - Phase alignment success
        - Prerequisite completion correlation
        """
        block = self.school.curriculum.get_block(practice_name)
        if not block:
            return {"error": "Practice not found"}
        
        # Find students who completed this practice
        completers = []
        for student in self.school.students.values():
            if practice_name in student.completed_blocks:
                completers.append(student)
        
        if not completers:
            return {
                "practice": practice_name,
                "completers": 0,
                "message": "No students have completed this practice yet"
            }
        
        # Calculate AURA improvements
        aura_improvements = []
        for student in completers:
            # Find the AURA metrics before and after this practice
            completion_event = next(
                (e for e in student.transformation_log 
                 if e.get('block') == practice_name),
                None
            )
            
            if completion_event and student.aura_history:
                completion_time = datetime.fromisoformat(completion_event['timestamp'])
                
                # Find nearest AURA measurement after completion
                post_metrics = next(
                    (m for t, m in student.aura_history if t >= completion_time),
                    None
                )
                
                if post_metrics and block.aura_metrics:
                    improvement = {
                        'TES': post_metrics.TES - block.aura_metrics.TES,
                        'VTR': post_metrics.VTR - block.aura_metrics.VTR,
                        'PAI': post_metrics.PAI - block.aura_metrics.PAI
                    }
                    aura_improvements.append(improvement)
        
        # Phase alignment analysis
        phase_completions = {}
        for student in completers:
            completion_event = next(
                (e for e in student.transformation_log 
                 if e.get('block') == practice_name),
                None
            )
            if completion_event:
                phase = completion_event.get('phase', 'Unknown')
                phase_completions[phase] = phase_completions.get(phase, 0) + 1
        
        dominant_phase = max(phase_completions.items(), key=lambda x: x[1])[0] if phase_completions else None
        
        return {
            "practice": practice_name,
            "domain": block.domain,
            "layer": block.layer.value,
            "compression_score": round(block.compression_score, 3),
            "completers": len(completers),
            "completion_rate": round(len(completers) / max(len(self.school.students), 1), 3),
            "avg_aura_improvement": {
                'TES': round(np.mean([i['TES'] for i in aura_improvements]), 3) if aura_improvements else None,
                'VTR': round(np.mean([i['VTR'] for i in aura_improvements]), 3) if aura_improvements else None,
                'PAI': round(np.mean([i['PAI'] for i in aura_improvements]), 3) if aura_improvements else None
            },
            "phase_distribution": phase_completions,
            "dominant_completion_phase": dominant_phase,
            "phase_alignment_match": (dominant_phase == block.phase_affinity.symbol) if block.phase_affinity else None
        }
    
    def predict_cascade_risk(self) -> Dict:
        """
        Analyze the current pyramid state and predict cascade risk.
        
        A cascade becomes likely when:
        - Multiple Edge practices approaching Foundation scores
        - Foundation practices showing evidence decay
        - Large compression score variance within layers
        """
        foundation_blocks = self.school.curriculum.get_blocks_by_layer(PyramidLayer.FOUNDATION)
        middle_blocks = self.school.curriculum.get_blocks_by_layer(PyramidLayer.MIDDLE)
        edge_blocks = self.school.curriculum.get_blocks_by_layer(PyramidLayer.EDGE)
        
        if not foundation_blocks:
            return {"risk": "unknown", "message": "No foundation blocks"}
        
        # Calculate statistics
        foundation_scores = [b.compression_score for b in foundation_blocks]
        middle_scores = [b.compression_score for b in middle_blocks] if middle_blocks else []
        edge_scores = [b.compression_score for b in edge_blocks] if edge_blocks else []
        
        foundation_mean = np.mean(foundation_scores)
        foundation_std = np.std(foundation_scores)
        
        # Risk factors
        risk_factors = []
        risk_score = 0.0
        
        # Factor 1: Edge practices approaching foundation level
        if edge_scores:
            top_edge = max(edge_scores)
            if top_edge > foundation_mean * 0.7:
                risk_factors.append("High-performing Edge practice detected")
                risk_score += 0.3
        
        # Factor 2: Middle practices exceeding foundation mean
        if middle_scores:
            middle_exceeding = sum(1 for s in middle_scores if s > foundation_mean)
            if middle_exceeding > 0:
                risk_factors.append(f"{middle_exceeding} Middle practices exceeding Foundation average")
                risk_score += 0.2 * (middle_exceeding / len(middle_scores))
        
        # Factor 3: High variance in foundation (instability)
        if foundation_std > foundation_mean * 0.4:
            risk_factors.append("High variance in Foundation layer")
            risk_score += 0.25
        
        # Factor 4: Recent cascade activity
        recent_cascades = len(self.school.cascade_engine.cascade_history)
        if recent_cascades > 0:
            risk_factors.append(f"{recent_cascades} cascade events in history")
            risk_score += min(0.25, recent_cascades * 0.1)
        
        # Determine risk level
        if risk_score < 0.3:
            risk_level = "LOW"
        elif risk_score < 0.6:
            risk_level = "MODERATE"
        else:
            risk_level = "HIGH"
        
        return {
            "risk_level": risk_level,
            "risk_score": round(risk_score, 3),
            "foundation_stability": {
                "mean_compression": round(foundation_mean, 3),
                "std_dev": round(foundation_std, 3),
                "count": len(foundation_blocks)
            },
            "layer_dynamics": {
                "edge_max": round(max(edge_scores), 3) if edge_scores else 0,
                "middle_max": round(max(middle_scores), 3) if middle_scores else 0,
                "foundation_min": round(min(foundation_scores), 3)
            },
            "risk_factors": risk_factors,
            "cascade_history": recent_cascades,
            "recommendation": self._get_cascade_recommendation(risk_level)
        }
    
    def _get_cascade_recommendation(self, risk_level: str) -> str:
        """Generate actionable recommendation based on risk level"""
        recommendations = {
            "LOW": "Pyramid is stable. Continue normal operations. Consider promoting validated Middle practices.",
            "MODERATE": "Monitor Edge and Middle practices closely. Review evidence for high-performing practices. Prepare for potential reorganization.",
            "HIGH": "Cascade likely imminent. Review Foundation practices for evidence decay. Validate high-compression Edge practices. Communicate potential curriculum updates to students."
        }
        return recommendations.get(risk_level, "Unknown risk state")
    
    def analyze_cohort(self, student_ids: List[str]) -> CohortMetrics:
        """
        Analyze a cohort of students for group patterns.
        """
        students = [self.school.get_student(sid) for sid in student_ids]
        students = [s for s in students if s is not None]
        
        if not students:
            return None
        
        # Calculate metrics
        completion_rates = [
            len(s.completed_blocks) / max(len(self.school.curriculum.blocks), 1)
            for s in students
        ]
        
        aura_alignments = [
            s.current_aura_metrics.alignment_score()
            for s in students
            if s.current_aura_metrics
        ]
        
        phase_dist = {}
        for s in students:
            phase = s.current_phase.symbol
            phase_dist[phase] = phase_dist.get(phase, 0) + 1
        
        # Find dominant domains
        domain_counts = {}
        for student in students:
            for block_name in student.completed_blocks:
                block = self.school.curriculum.get_block(block_name)
                if block:
                    domain_counts[block.domain] = domain_counts.get(block.domain, 0) + 1
        
        top_domains = sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return CohortMetrics(
            cohort_id=f"cohort_{len(student_ids)}",
            student_ids=student_ids,
            avg_completion_rate=round(np.mean(completion_rates), 3),
            avg_aura_alignment=round(np.mean(aura_alignments), 3) if aura_alignments else 0.0,
            phase_distribution=phase_dist,
            dominant_domains=[d[0] for d in top_domains]
        )
    
    def detect_aura_drift(self, student_id: str, window_size: int = 5) -> Dict:
        """
        Detect if a student's AURA metrics are drifting from alignment.
        
        Uses rolling average to smooth noise and identify trends.
        """
        student = self.school.get_student(student_id)
        if not student or not student.aura_history:
            return {"error": "Insufficient data"}
        
        if len(student.aura_history) < window_size:
            return {
                "student_id": student_id,
                "drift_detected": False,
                "message": f"Need at least {window_size} measurements"
            }
        
        # Extract recent metrics
        recent = student.aura_history[-window_size:]
        tes_values = [m.TES for t, m in recent]
        vtr_values = [m.VTR for t, m in recent]
        pai_values = [m.PAI for t, m in recent]
        
        # Calculate trends
        tes_trend = tes_values[-1] - tes_values[0]
        vtr_trend = vtr_values[-1] - vtr_values[0]
        pai_trend = pai_values[-1] - pai_values[0]
        
        # Detect drift
        drift_flags = []
        if tes_trend < -0.1:
            drift_flags.append("TES declining")
        if vtr_trend < -0.2:
            drift_flags.append("VTR declining")
        if pai_trend < -0.1:
            drift_flags.append("PAI declining")
        
        current = student.current_aura_metrics
        
        return {
            "student_id": student_id,
            "drift_detected": len(drift_flags) > 0,
            "drift_flags": drift_flags,
            "current_metrics": {
                "TES": round(current.TES, 3),
                "VTR": round(current.VTR, 3),
                "PAI": round(current.PAI, 3),
                "aligned": current.is_aligned()
            },
            "trends": {
                "TES": round(tes_trend, 3),
                "VTR": round(vtr_trend, 3),
                "PAI": round(pai_trend, 3)
            },
            "recommendation": "Review recent practices and consider additional support" if drift_flags else "Metrics stable"
        }


# Demo function
def demo_analytics():
    """Demonstrate the analytics capabilities"""
    from mystery_school_cascade import SovereignMysterySchool, AwarenessPhase, AURAMetrics
    
    print("=" * 80)
    print("MYSTERY SCHOOL ANALYTICS DEMONSTRATION")
    print("=" * 80)
    
    # Setup
    school = SovereignMysterySchool()
    analytics = MysterySchoolAnalytics(school)
    
    # Create some students with history
    for i, name in enumerate(['alice', 'bob', 'carol']):
        student = school.enroll_student(f"{name}_2025")
        
        # Simulate some completions
        student.complete_block(
            "Shamatha (Calm Abiding)",
            AURAMetrics(TES=0.80 + i*0.05, VTR=1.5 + i*0.1, PAI=0.85 + i*0.03)
        )
        
        if i > 0:
            student.complete_block(
                "Vipassana (Insight Meditation)",
                AURAMetrics(TES=0.85 + i*0.03, VTR=1.6 + i*0.15, PAI=0.88 + i*0.02)
            )
    
    # Cascade risk analysis
    print("\n🎲 CASCADE RISK ANALYSIS")
    print("-" * 80)
    risk_analysis = analytics.predict_cascade_risk()
    print(f"Risk Level: {risk_analysis['risk_level']}")
    print(f"Risk Score: {risk_analysis['risk_score']}")
    print(f"\nFoundation Stability:")
    print(f"  Mean Compression: {risk_analysis['foundation_stability']['mean_compression']}")
    print(f"  Std Dev: {risk_analysis['foundation_stability']['std_dev']}")
    print(f"\nRisk Factors:")
    for factor in risk_analysis['risk_factors']:
        print(f"  • {factor}")
    print(f"\nRecommendation: {risk_analysis['recommendation']}")
    
    # Practice efficacy
    print("\n📊 PRACTICE EFFICACY ANALYSIS")
    print("-" * 80)
    efficacy = analytics.analyze_practice_efficacy("Shamatha (Calm Abiding)")
    print(f"Practice: {efficacy['practice']}")
    print(f"Completers: {efficacy['completers']}")
    print(f"Completion Rate: {efficacy['completion_rate']}")
    print(f"Avg AURA Improvement:")
    for metric, value in efficacy['avg_aura_improvement'].items():
        if value:
            print(f"  {metric}: {value:+.3f}")
    
    # Cohort analysis
    print("\n👥 COHORT ANALYSIS")
    print("-" * 80)
    cohort = analytics.analyze_cohort(['alice_2025', 'bob_2025', 'carol_2025'])
    print(f"Cohort Size: {len(cohort.student_ids)}")
    print(f"Avg Completion Rate: {cohort.avg_completion_rate}")
    print(f"Avg AURA Alignment: {cohort.avg_aura_alignment}")
    print(f"Phase Distribution: {cohort.phase_distribution}")
    print(f"Dominant Domains: {', '.join(cohort.dominant_domains)}")
    
    print("\n" + "=" * 80)


if __name__ == "__main__":
    demo_analytics()

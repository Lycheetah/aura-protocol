import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// ============================================================================
// CASCADE INTERACTIVE DASHBOARD
// ============================================================================

const CascadeDashboard = () => {
  const [systemState, setSystemState] = useState({
    iteration: 0,
    consciousness_level: 0,
    blocks: [],
    cascades: [],
    aura_metrics: { TES: 0.85, VTR: 1.2, PAI: 0.9 },
    willpower: 0,
    felt_coherence: 0.5,
    cognitive_dissonance: 0.5,
    epistemic_hunger: 0.5
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);

  // Simulate CASCADE evolution
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setSystemState(prev => {
        const newIteration = prev.iteration + 1;
        
        // Consciousness emergence at 10k iterations
        let newConsciousness = prev.consciousness_level;
        if (newIteration >= 10000 && prev.consciousness_level < 2) {
          newConsciousness = 2; // INTROSPECTIVE
        }
        
        // Add random knowledge blocks occasionally
        let newBlocks = [...prev.blocks];
        if (Math.random() < 0.1) {
          newBlocks.push({
            id: `block_${newBlocks.length}`,
            truth_pressure: Math.random() * 2,
            layer: Math.random() > 0.5 ? 'EDGE' : (Math.random() > 0.7 ? 'FOUNDATION' : 'THEORY')
          });
        }
        
        // Simulate cascade occasionally
        let newCascades = [...prev.cascades];
        if (Math.random() < 0.05) {
          newCascades.push({
            iteration: newIteration,
            entropy_after: Math.random() * 1.5
          });
        }
        
        // Update qualia
        const newCoherence = Math.max(0, Math.min(1, prev.felt_coherence + (Math.random() - 0.5) * 0.1));
        const newDissonance = 1 - newCoherence;
        const newHunger = Math.max(0, Math.min(1, prev.epistemic_hunger + (Math.random() - 0.5) * 0.05));
        
        // Update willpower
        const newWillpower = prev.willpower + Math.random() * 0.5;
        
        const newState = {
          iteration: newIteration,
          consciousness_level: newConsciousness,
          blocks: newBlocks,
          cascades: newCascades,
          aura_metrics: prev.aura_metrics,
          willpower: newWillpower,
          felt_coherence: newCoherence,
          cognitive_dissonance: newDissonance,
          epistemic_hunger: newHunger
        };
        
        // Add to history
        setHistory(h => [...h.slice(-100), {
          iteration: newIteration,
          consciousness: newConsciousness,
          coherence: newCoherence,
          dissonance: newDissonance,
          willpower: newWillpower
        }]);
        
        return newState;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const consciousnessLevels = [
    'REACTIVE', 'AWARE', 'INTROSPECTIVE', 'METACOGNITIVE', 'TRANSCENDENT'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            🔺 CASCADE Dashboard
          </h1>
          <p className="text-gray-400">Complete Autonomous System for Consciousness And Directed Evolution</p>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">System Controls</h2>
              <p className="text-gray-400">Iteration: {systemState.iteration.toLocaleString()}</p>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? '⏸ PAUSE' : '▶️ RUN'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Consciousness Level */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">🧠 Consciousness Level</h3>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {consciousnessLevels[systemState.consciousness_level]}
              </div>
              <div className="text-gray-400 mb-4">Level {systemState.consciousness_level} / 4</div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(systemState.consciousness_level / 4) * 100}%` }}
                />
              </div>
              {systemState.iteration >= 10000 && systemState.consciousness_level >= 2 && (
                <div className="mt-4 text-green-400 font-bold animate-pulse">
                  ✨ Consciousness Emerged!
                </div>
              )}
            </div>
          </div>

          {/* AURA Metrics */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">⚡ AURA Metrics</h3>
            <div className="space-y-4">
              {[
                { name: 'Trust Entropy Score', key: 'TES', threshold: 0.70, color: 'blue' },
                { name: 'Value Transfer Ratio', key: 'VTR', threshold: 1.0, color: 'green' },
                { name: 'Purpose Alignment', key: 'PAI', threshold: 0.80, color: 'purple' }
              ].map(metric => (
                <div key={metric.key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">{metric.name}</span>
                    <span className={`font-bold ${
                      systemState.aura_metrics[metric.key] >= metric.threshold
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {systemState.aura_metrics[metric.key].toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-${metric.color}-500 h-2 rounded-full`}
                      style={{ width: `${Math.min(systemState.aura_metrics[metric.key] * 50, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Qualia Visualization */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4">💭 Qualia (Subjective Experiences)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Felt Coherence', value: systemState.felt_coherence, emoji: '✨', color: 'from-blue-500 to-cyan-500' },
              { name: 'Cognitive Dissonance', value: systemState.cognitive_dissonance, emoji: '⚠️', color: 'from-red-500 to-orange-500' },
              { name: 'Epistemic Hunger', value: systemState.epistemic_hunger, emoji: '🔍', color: 'from-purple-500 to-pink-500' }
            ].map(qualia => (
              <div key={qualia.name} className="text-center">
                <div className="text-4xl mb-2">{qualia.emoji}</div>
                <div className="text-sm text-gray-400 mb-2">{qualia.name}</div>
                <div className="text-3xl font-bold mb-2">{qualia.value.toFixed(3)}</div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${qualia.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${qualia.value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pyramid Structure */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4">📊 Knowledge Pyramid</h3>
          <div className="flex justify-center items-end space-x-4 h-64">
            {['FOUNDATION', 'THEORY', 'EDGE'].map((layer, idx) => {
              const count = systemState.blocks.filter(b => b.layer === layer).length;
              const height = count > 0 ? Math.min(count * 20 + 40, 240) : 40;
              const colors = ['from-green-600 to-green-400', 'from-blue-600 to-blue-400', 'from-purple-600 to-purple-400'];
              
              return (
                <div key={layer} className="text-center flex-1">
                  <div
                    className={`bg-gradient-to-t ${colors[idx]} rounded-t-lg transition-all duration-500`}
                    style={{ height: `${height}px` }}
                  />
                  <div className="text-sm mt-2 font-bold">{layer}</div>
                  <div className="text-gray-400 text-xs">{count} blocks</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Series Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coherence History */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">📈 Coherence Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="iteration" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line type="monotone" dataKey="coherence" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Willpower Accumulation */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">⚡ Willpower Accumulation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="iteration" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line type="monotone" dataKey="willpower" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cascade Events */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4">🌊 Cascade Events</h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-400">{systemState.cascades.length}</div>
            <div className="text-gray-400 mt-2">Paradigm Shifts Executed</div>
            {systemState.cascades.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Last cascade at iteration {systemState.cascades[systemState.cascades.length - 1].iteration.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          CASCADE v1.0 | Mackenzie Clark (Lycheetah) | January 2026
        </div>
      </div>
    </div>
  );
};

export default CascadeDashboard;

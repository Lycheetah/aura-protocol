'use client'

import { useState } from 'react'
import { useCASCADEStore } from '@/lib/store/cascade-store'
import { 
  MEASUREMENT_SCALES, 
  classifyDivergence,
  getMetaInsights 
} from '@/lib/cascade/reality-bridge'
import { MeasurementType, PyramidLayer, PracticePrediction, RealityAnchor } from '@/types/cascade'

// Practice List
function PracticeList() {
  const practices = useCASCADEStore(state => state.realityBridge.practices)
  const [selectedPractice, setSelectedPractice] = useState<PracticePrediction | null>(null)
  
  return (
    <div className="cascade-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-zinc-200">Practices</h3>
        <span className="text-xs text-zinc-500">{practices.length} tracked</span>
      </div>
      
      {practices.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">No practices yet</p>
          <p className="text-xs text-zinc-600 mt-1">Add a practice to start tracking predictions</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {practices.map(practice => (
            <button
              key={practice.id}
              onClick={() => setSelectedPractice(practice)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                selectedPractice?.id === practice.id
                  ? 'bg-zinc-700/50 border border-zinc-600'
                  : 'bg-zinc-800/50 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-zinc-200">{practice.practiceName}</h4>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  practice.status === 'ALIGNED' ? 'bg-emerald-500/20 text-emerald-400' :
                  practice.status === 'NEUTRAL' ? 'bg-zinc-500/20 text-zinc-400' :
                  practice.status === 'DIVERGENT' ? 'bg-amber-500/20 text-amber-400' :
                  practice.status === 'FALSIFIED' ? 'bg-red-500/20 text-red-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {practice.status}
                </span>
              </div>
              
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{practice.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">
                  {practice.anchors.length} anchor{practice.anchors.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Π:</span>
                  <span className={`font-mono ${
                    practice.truthPressure > 1.0 ? 'text-emerald-400' :
                    practice.truthPressure > 0.5 ? 'text-zinc-300' :
                    'text-red-400'
                  }`}>
                    {practice.truthPressure.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {selectedPractice && (
        <PracticeDetailModal 
          practice={selectedPractice} 
          onClose={() => setSelectedPractice(null)} 
        />
      )}
    </div>
  )
}

// Practice Detail Modal
function PracticeDetailModal({ 
  practice, 
  onClose 
}: { 
  practice: PracticePrediction
  onClose: () => void 
}) {
  const [showAddMeasurement, setShowAddMeasurement] = useState(false)
  const recordMeasurement = useCASCADEStore(state => state.recordPracticeMeasurement)
  const evaluateAll = useCASCADEStore(state => state.evaluateAllPractices)
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-medium text-zinc-200">{practice.practiceName}</h3>
              <span className={`text-xs px-2 py-0.5 rounded mt-2 inline-block ${
                practice.layer === 'FOUNDATION' ? 'layer-foundation' :
                practice.layer === 'THEORY' ? 'layer-theory' :
                'layer-edge'
              }`}>
                {practice.layer}
              </span>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-sm text-zinc-400 mb-6">{practice.description}</p>
          
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
              <span className="text-xs text-zinc-500">Truth Pressure</span>
              <p className="text-xl font-mono text-cyan-400">{practice.truthPressure.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
              <span className="text-xs text-zinc-500">Confidence</span>
              <p className="text-xl font-mono text-purple-400">{(practice.confidence * 100).toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
              <span className="text-xs text-zinc-500">Validations</span>
              <p className="text-xl font-mono text-zinc-200">
                {practice.validationCount}/{practice.validationCount + practice.falsificationCount}
              </p>
            </div>
          </div>
          
          {/* Reality Anchors */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-zinc-300">Reality Anchors</h4>
              <button
                onClick={() => setShowAddMeasurement(!showAddMeasurement)}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                + Add Measurement
              </button>
            </div>
            
            {practice.anchors.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">
                No reality anchors defined yet
              </p>
            ) : (
              <div className="space-y-2">
                {practice.anchors.map(anchor => (
                  <AnchorCard 
                    key={anchor.id} 
                    anchor={anchor} 
                    practiceId={practice.id}
                    onMeasure={(value) => {
                      recordMeasurement(practice.id, anchor.id, value)
                      evaluateAll()
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                evaluateAll()
                onClose()
              }}
              className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm"
            >
              Evaluate Predictions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Anchor Card
function AnchorCard({ 
  anchor, 
  practiceId,
  onMeasure 
}: { 
  anchor: RealityAnchor
  practiceId: string
  onMeasure: (value: number) => void
}) {
  const [measureValue, setMeasureValue] = useState('')
  const scale = MEASUREMENT_SCALES[anchor.measurementType]
  
  const daysSinceStart = Math.floor((Date.now() - anchor.startDate) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, anchor.expectedTimeline - daysSinceStart)
  const progress = Math.min(100, (daysSinceStart / anchor.expectedTimeline) * 100)
  
  return (
    <div className="p-4 bg-zinc-800/30 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-200">{scale.name}</span>
        <span className="text-xs text-zinc-500">{anchor.measurementType}</span>
      </div>
      
      <p className="text-xs text-zinc-400 mb-3">{scale.description}</p>
      
      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div>
          <span className="text-zinc-500">Baseline:</span>
          <span className="ml-2 text-zinc-300">{anchor.baselineValue}</span>
        </div>
        <div>
          <span className="text-zinc-500">Expected Δ:</span>
          <span className="ml-2 text-cyan-400">{anchor.expectedDelta > 0 ? '+' : ''}{anchor.expectedDelta}</span>
        </div>
        <div>
          <span className="text-zinc-500">Current:</span>
          <span className={`ml-2 ${anchor.currentValue !== null ? 'text-zinc-200' : 'text-zinc-500'}`}>
            {anchor.currentValue ?? 'Not measured'}
          </span>
        </div>
        <div>
          <span className="text-zinc-500">Timeline:</span>
          <span className="ml-2 text-zinc-300">{daysRemaining} days left</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Quick measure input */}
      <div className="flex gap-2">
        <input
          type="number"
          value={measureValue}
          onChange={(e) => setMeasureValue(e.target.value)}
          placeholder={`${scale.min}-${scale.max}`}
          min={scale.min}
          max={scale.max}
          className="flex-1 px-3 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => {
            const value = parseFloat(measureValue)
            if (!isNaN(value)) {
              onMeasure(value)
              setMeasureValue('')
            }
          }}
          disabled={!measureValue}
          className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Record
        </button>
      </div>
    </div>
  )
}

// Add Practice Form
function AddPracticeForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [layer, setLayer] = useState<PyramidLayer>('EDGE')
  
  // Anchor fields
  const [showAnchor, setShowAnchor] = useState(false)
  const [measurementType, setMeasurementType] = useState<MeasurementType>('MOOD')
  const [expectedDelta, setExpectedDelta] = useState(0)
  const [baselineValue, setBaselineValue] = useState(5)
  const [timeline, setTimeline] = useState(28)
  const [tolerance, setTolerance] = useState(2)
  
  const addPractice = useCASCADEStore(state => state.addPractice)
  const addPracticeAnchor = useCASCADEStore(state => state.addPracticeAnchor)
  const practices = useCASCADEStore(state => state.realityBridge.practices)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    addPractice(name.trim(), description.trim(), layer)
    
    // Get the newly created practice
    const newPractice = practices[practices.length - 1]
    
    if (showAnchor && newPractice) {
      addPracticeAnchor(newPractice.id, {
        measurementType,
        expectedDelta,
        baselineValue,
        currentValue: null,
        expectedTimeline: timeline,
        tolerance,
        startDate: Date.now()
      })
    }
    
    // Reset form
    setName('')
    setDescription('')
    setShowAnchor(false)
  }
  
  const scale = MEASUREMENT_SCALES[measurementType]
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Add Practice</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Practice Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Meditation, Shadow Work, Cold Exposure"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Description & Prediction</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you predict this practice will do? Be specific and falsifiable."
            className="w-full h-20 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Pyramid Layer</label>
          <select
            value={layer}
            onChange={(e) => setLayer(e.target.value as PyramidLayer)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="EDGE">Edge (Experimental)</option>
            <option value="THEORY">Theory (Some Evidence)</option>
            <option value="FOUNDATION">Foundation (Well Established)</option>
          </select>
        </div>
        
        {/* Reality Anchor Toggle */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setShowAnchor(!showAnchor)}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            <svg className={`w-4 h-4 transition-transform ${showAnchor ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Add Reality Anchor
          </button>
          
          {showAnchor && (
            <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Measurement Type</label>
                  <select
                    value={measurementType}
                    onChange={(e) => setMeasurementType(e.target.value as MeasurementType)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-200"
                  >
                    {Object.entries(MEASUREMENT_SCALES).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Timeline (days)</label>
                  <input
                    type="number"
                    value={timeline}
                    onChange={(e) => setTimeline(parseInt(e.target.value) || 28)}
                    min={1}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Baseline</label>
                  <input
                    type="number"
                    value={baselineValue}
                    onChange={(e) => setBaselineValue(parseFloat(e.target.value) || 0)}
                    min={scale.min}
                    max={scale.max}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-200"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Expected Δ</label>
                  <input
                    type="number"
                    value={expectedDelta}
                    onChange={(e) => setExpectedDelta(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-200"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Tolerance (±)</label>
                  <input
                    type="number"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseFloat(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-200"
                  />
                </div>
              </div>
              
              <p className="text-xs text-zinc-400">
                Expecting {scale.name} to change by {expectedDelta > 0 ? '+' : ''}{expectedDelta} (±{tolerance}) over {timeline} days
              </p>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Practice
        </button>
      </form>
    </div>
  )
}

// Divergence History
function DivergenceHistory() {
  const divergenceHistory = useCASCADEStore(state => state.realityBridge.divergenceHistory)
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Divergence Events</h3>
      
      {divergenceHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">No divergence events yet</p>
          <p className="text-xs text-zinc-600 mt-1">Events occur when predictions are evaluated</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[...divergenceHistory].reverse().slice(0, 10).map(event => (
            <div key={event.id} className="p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  event.level === 'ALIGNED' ? 'bg-emerald-500/20 text-emerald-400' :
                  event.level === 'NEUTRAL' ? 'bg-zinc-500/20 text-zinc-400' :
                  event.level === 'DIVERGENT' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {event.level}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-zinc-500">Action: {event.action}</span>
                <span className="font-mono text-cyan-400">Π = {event.truthPressure.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Meta-Learning Insights
function MetaInsights() {
  const metaLearning = useCASCADEStore(state => state.realityBridge.metaLearning)
  const insights = getMetaInsights(metaLearning)
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Meta-Learning Insights</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <span className="text-xs text-zinc-500">Total Predictions</span>
          <p className="text-xl font-mono text-zinc-200">{metaLearning.totalPredictions}</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <span className="text-xs text-zinc-500">Accuracy</span>
          <p className="text-xl font-mono text-emerald-400">
            {metaLearning.totalPredictions > 0 
              ? ((metaLearning.accuratePredictions / metaLearning.totalPredictions) * 100).toFixed(0)
              : 0}%
          </p>
        </div>
      </div>
      
      {insights.length > 0 ? (
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <span className="text-cyan-400 mt-0.5">→</span>
              {insight}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 text-center py-4">
          More data needed for insights
        </p>
      )}
    </div>
  )
}

// Main Reality Bridge Page
export default function RealityPage() {
  const evaluateAll = useCASCADEStore(state => state.evaluateAllPractices)
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Reality Bridge</h1>
            <p className="text-zinc-500">Falsifiable predictions validated against measured reality</p>
          </div>
          <button
            onClick={evaluateAll}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm"
          >
            Evaluate All Practices
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PracticeList />
        <AddPracticeForm />
        <DivergenceHistory />
        <MetaInsights />
      </div>
    </div>
  )
}

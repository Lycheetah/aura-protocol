'use client'

import { useState } from 'react'
import { useCASCADEStore } from '@/lib/store/cascade-store'
import { getPyramidStats, blockToLAMAGUE } from '@/lib/cascade/pyramid'
import { KnowledgeBlock, PyramidLayer } from '@/types/cascade'

// Visual Pyramid Component
function PyramidVisualizer() {
  const pyramid = useCASCADEStore(state => state.pyramid)
  const [selectedLayer, setSelectedLayer] = useState<PyramidLayer | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<KnowledgeBlock | null>(null)
  
  const layers: { name: PyramidLayer; blocks: KnowledgeBlock[]; color: string; bgColor: string }[] = [
    { name: 'EDGE', blocks: pyramid.edge, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    { name: 'THEORY', blocks: pyramid.theory, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { name: 'FOUNDATION', blocks: pyramid.foundation, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  ]
  
  return (
    <div className="cascade-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-zinc-200">Knowledge Pyramid</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Domain:</span>
          <span className="text-sm text-cyan-400">{pyramid.domain}</span>
        </div>
      </div>
      
      {/* Interactive Pyramid */}
      <div className="relative flex flex-col items-center py-8">
        {layers.map((layer, i) => {
          const width = 100 + i * 80 // Increasing width for each layer
          const isSelected = selectedLayer === layer.name
          
          return (
            <button
              key={layer.name}
              onClick={() => setSelectedLayer(isSelected ? null : layer.name)}
              className={`relative transition-all duration-300 ${
                isSelected ? 'scale-105 z-10' : 'hover:scale-102'
              }`}
              style={{ width: `${width}px` }}
            >
              <div 
                className={`h-16 ${layer.bgColor} border-2 ${
                  isSelected ? 'border-white/30' : 'border-transparent'
                } flex items-center justify-center transition-all ${
                  i === 0 ? 'rounded-t-lg' : ''
                } ${i === 2 ? 'rounded-b-lg' : ''}`}
              >
                <div className="text-center">
                  <span className={`text-sm font-medium ${layer.color}`}>
                    {layer.name}
                  </span>
                  <span className="ml-2 text-xs text-zinc-400">
                    ({layer.blocks.length})
                  </span>
                </div>
              </div>
              
              {/* Tooltip on hover */}
              <div className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <div className="bg-zinc-800 px-3 py-2 rounded-lg text-xs whitespace-nowrap">
                  <span className={layer.color}>{layer.blocks.length}</span> blocks
                </div>
              </div>
            </button>
          )
        })}
        
        {/* Layer descriptions */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-around text-xs text-zinc-500 pl-4">
          <span>Experimental (Π &lt; 1.2)</span>
          <span>Established (1.2 ≤ Π &lt; 1.5)</span>
          <span>Fundamental (Π ≥ 1.5)</span>
        </div>
      </div>
      
      {/* Selected Layer Blocks */}
      {selectedLayer && (
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <h4 className="text-sm font-medium text-zinc-400 mb-3">
            {selectedLayer} Layer Blocks
          </h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {layers.find(l => l.name === selectedLayer)?.blocks.map(block => (
              <button
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedBlock?.id === block.id 
                    ? 'bg-zinc-700/50 border border-zinc-600' 
                    : 'bg-zinc-800/50 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-zinc-200 line-clamp-2">{block.content}</p>
                  <span className="text-xs font-mono text-cyan-400 ml-2">
                    Π={block.compressionScore.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                  <span>Evidence: {(block.evidenceStrength * 100).toFixed(0)}%</span>
                  <span>•</span>
                  <span>{new Date(block.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
            
            {layers.find(l => l.name === selectedLayer)?.blocks.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">
                No blocks in this layer yet
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Selected Block Detail */}
      {selectedBlock && (
        <BlockDetailModal 
          block={selectedBlock} 
          onClose={() => setSelectedBlock(null)} 
        />
      )}
    </div>
  )
}

// Block Detail Modal
function BlockDetailModal({ block, onClose }: { block: KnowledgeBlock; onClose: () => void }) {
  const promoteKnowledge = useCASCADEStore(state => state.promoteKnowledge)
  const demoteKnowledge = useCASCADEStore(state => state.demoteKnowledge)
  const triggerManualCascade = useCASCADEStore(state => state.triggerManualCascade)
  
  const lamague = blockToLAMAGUE(block)
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={`text-xs px-2 py-1 rounded ${
                block.layer === 'FOUNDATION' ? 'layer-foundation' :
                block.layer === 'THEORY' ? 'layer-theory' :
                'layer-edge'
              }`}>
                {block.layer}
              </span>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h3 className="text-lg font-medium text-zinc-200 mb-4">{block.content}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-xs text-zinc-500">Truth Pressure (Π)</span>
              <p className="text-xl font-mono text-cyan-400">{block.compressionScore.toFixed(3)}</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-xs text-zinc-500">Evidence Strength</span>
              <p className="text-xl font-mono text-purple-400">{(block.evidenceStrength * 100).toFixed(0)}%</p>
            </div>
          </div>
          
          {/* LAMAGUE Expression */}
          <div className="p-4 bg-zinc-800/30 rounded-lg mb-6">
            <span className="text-xs text-zinc-500">LAMAGUE Expression</span>
            <div className="flex items-center gap-2 mt-2">
              {lamague.symbols.map((s, i) => (
                <span key={i} className="lamague-symbol">{s}</span>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-2 italic">{lamague.interpretation}</p>
          </div>
          
          {/* Dependencies */}
          <div className="mb-6">
            <span className="text-xs text-zinc-500">Relationships</span>
            <div className="mt-2 space-y-2 text-sm">
              <p className="text-zinc-400">
                Dependencies: <span className="text-zinc-300">{block.dependencies.length}</span>
              </p>
              <p className="text-zinc-400">
                Supports: <span className="text-zinc-300">{block.supports.length}</span>
              </p>
              <p className="text-zinc-400">
                Contradicts: <span className="text-zinc-300">{block.contradicts.length}</span>
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            {block.layer !== 'FOUNDATION' && (
              <button
                onClick={() => {
                  promoteKnowledge(block.id, block.evidenceStrength + 0.2)
                  onClose()
                }}
                className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors text-sm"
              >
                Promote ↑
              </button>
            )}
            {block.layer !== 'EDGE' && (
              <button
                onClick={() => {
                  demoteKnowledge(block.id, 'Manual demotion')
                  onClose()
                }}
                className="flex-1 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors text-sm"
              >
                Demote ↓
              </button>
            )}
            <button
              onClick={() => {
                triggerManualCascade(block.id)
                onClose()
              }}
              className="flex-1 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm"
            >
              Trigger Cascade
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add Knowledge Form
function AddKnowledgeForm() {
  const [content, setContent] = useState('')
  const [evidenceStrength, setEvidenceStrength] = useState(0.5)
  const [layer, setLayer] = useState<PyramidLayer>('EDGE')
  const [domain, setDomain] = useState('personal')
  
  const addKnowledgeBlock = useCASCADEStore(state => state.addKnowledgeBlock)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    addKnowledgeBlock({
      content: content.trim(),
      evidenceStrength,
      layer,
      domain,
      dependencies: [],
      supports: [],
      contradicts: []
    })
    
    setContent('')
    setEvidenceStrength(0.5)
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Add Knowledge Block</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Knowledge Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter a piece of knowledge, insight, or hypothesis..."
            className="w-full h-24 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Initial Layer</label>
            <select
              value={layer}
              onChange={(e) => setLayer(e.target.value as PyramidLayer)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="EDGE">Edge (Experimental)</option>
              <option value="THEORY">Theory (Established)</option>
              <option value="FOUNDATION">Foundation (Fundamental)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., personal, work, health"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-zinc-400">Evidence Strength</label>
            <span className="text-sm font-mono text-cyan-400">{(evidenceStrength * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={evidenceStrength}
            onChange={(e) => setEvidenceStrength(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <span>Speculation</span>
            <span>Highly Validated</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!content.trim()}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Pyramid
        </button>
      </form>
    </div>
  )
}

// Cascade History
function CascadeHistory() {
  const cascadeHistory = useCASCADEStore(state => state.pyramid.cascadeHistory)
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Cascade History</h3>
      
      {cascadeHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">No cascades yet</p>
          <p className="text-xs text-zinc-600 mt-1">Cascades occur when knowledge reorganizes</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {[...cascadeHistory].reverse().map((cascade) => (
            <div key={cascade.id} className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  cascade.type === 'REORGANIZE' ? 'bg-purple-500/20 text-purple-400' :
                  cascade.type === 'PROMOTE' ? 'bg-emerald-500/20 text-emerald-400' :
                  cascade.type === 'DEMOTE' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {cascade.type}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(cascade.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Affected:</span>
                  <span className="ml-2 text-zinc-300">{cascade.affectedBlocks.length} blocks</span>
                </div>
                <div>
                  <span className="text-zinc-500">Coherence:</span>
                  <span className={`ml-2 ${
                    cascade.coherenceAfter > cascade.coherenceBefore ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {(cascade.coherenceBefore * 100).toFixed(0)}% → {(cascade.coherenceAfter * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              {cascade.lamagueSummary && (
                <p className="mt-2 text-xs font-mono text-cyan-400">{cascade.lamagueSummary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Export/Import Controls
function ExportImportControls() {
  const exportState = useCASCADEStore(state => state.exportState)
  const importState = useCASCADEStore(state => state.importState)
  const [showImport, setShowImport] = useState(false)
  const [importJson, setImportJson] = useState('')
  
  const handleExport = () => {
    const json = exportState()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cascade-pyramid-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const handleImport = () => {
    if (importJson.trim()) {
      try {
        importState(importJson)
        setShowImport(false)
        setImportJson('')
      } catch (e) {
        alert('Invalid JSON format')
      }
    }
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Export / Import</h3>
      
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export State
        </button>
        
        <button
          onClick={() => setShowImport(!showImport)}
          className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import State
        </button>
      </div>
      
      {showImport && (
        <div className="mt-4 space-y-3">
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste exported JSON here..."
            className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none font-mono text-xs"
          />
          <button
            onClick={handleImport}
            disabled={!importJson.trim()}
            className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import
          </button>
        </div>
      )}
    </div>
  )
}

// Pyramid Stats
function PyramidStatsPanel() {
  const pyramid = useCASCADEStore(state => state.pyramid)
  const stats = getPyramidStats(pyramid)
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Pyramid Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <span className="text-xs text-zinc-500">Total Blocks</span>
          <p className="text-2xl font-mono text-zinc-200">{stats.totalBlocks}</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <span className="text-xs text-zinc-500">Cascades</span>
          <p className="text-2xl font-mono text-purple-400">{stats.cascadeCount}</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <span className="text-xs text-zinc-500">Avg Evidence</span>
          <p className="text-2xl font-mono text-cyan-400">{(stats.avgEvidence * 100).toFixed(0)}%</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <span className="text-xs text-zinc-500">Coherence</span>
          <p className="text-2xl font-mono text-emerald-400">{(stats.coherence * 100).toFixed(0)}%</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Average Truth Pressure (Π)</span>
          <span className="font-mono text-cyan-400">{stats.avgTruthPressure.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}

// Main Pyramid Page
export default function PyramidPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Knowledge Pyramid</h1>
        <p className="text-zinc-500">Self-reorganizing knowledge structure with cascade capability</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PyramidVisualizer />
        <AddKnowledgeForm />
        <CascadeHistory />
        <div className="space-y-6">
          <PyramidStatsPanel />
          <ExportImportControls />
        </div>
      </div>
    </div>
  )
}

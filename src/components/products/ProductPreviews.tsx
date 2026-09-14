import React, { useState, useEffect } from 'react'
import { Terminal, Activity, CheckCircle2, Cpu, Play, Pause, RotateCcw } from 'lucide-react'
import { ambientAudio } from '../../utils/audioEngine'

// ── 1. DI NOTES VISUALIZER: LIGHTWEIGHT TABLET SORTING ENGINE ──
export function DiNotesPreview() {
  const INITIAL_ARRAY = [45, 82, 24, 96, 58, 32, 75, 18, 64]
  const [array, setArray] = useState<number[]>([...INITIAL_ARRAY])
  const [comparing, setComparing] = useState<number[]>([1, 2])
  const [swapping, setSwapping] = useState<number[]>([])
  const [sortedIndices, setSortedIndices] = useState<number[]>([])
  const [algo, setAlgo] = useState<'quicksort' | 'mergesort' | 'heapsort'>('quicksort')
  const [isRunning, setIsRunning] = useState(true)
  const [comparisons, setComparisons] = useState(14)
  const [swaps, setSwaps] = useState(6)

  // Automated gentle visualization loop
  useEffect(() => {
    if (!isRunning) return

    let step = 0
    const interval = setInterval(() => {
      step++
      const idx1 = Math.floor(Math.random() * (array.length - 1))
      const idx2 = idx1 + 1

      setComparing([idx1, idx2])

      if (Math.random() > 0.4) {
        setSwapping([idx1, idx2])
        setArray((prev) => {
          const next = [...prev]
          const temp = next[idx1]
          next[idx1] = next[idx2]
          next[idx2] = temp
          return next
        })
        setSwaps((s) => s + 1)
      } else {
        setSwapping([])
      }

      setComparisons((c) => c + 1)

      if (step % 5 === 0) {
        setSortedIndices((prev) => Array.from(new Set([...prev, Math.floor(Math.random() * array.length)])))
      }
    }, 1200)

    return () => clearInterval(interval)
  }, [isRunning, array.length])

  const handleStep = () => {
    setIsRunning(false)
    const idx1 = Math.floor(Math.random() * (array.length - 1))
    const idx2 = idx1 + 1

    setComparing([idx1, idx2])

    if (Math.random() > 0.4) {
      setSwapping([idx1, idx2])
      setArray((prev) => {
        const next = [...prev]
        const temp = next[idx1]
        next[idx1] = next[idx2]
        next[idx2] = temp
        return next
      })
      setSwaps((s) => s + 1)
      ambientAudio.playSortSwap(array[idx1] || 50, array[idx2] || 50, 100)
    } else {
      setSwapping([])
      ambientAudio.playSortStep(array[idx1] || 50, 100)
    }

    setComparisons((c) => c + 1)
    setSortedIndices((prev) => Array.from(new Set([...prev, Math.floor(Math.random() * array.length)])))
  }

  const handleReset = () => {
    ambientAudio.playSortReset()
    setArray([35, 78, 22, 90, 52, 28, 68, 15, 84])
    setComparing([])
    setSwapping([])
    setSortedIndices([])
    setComparisons(0)
    setSwaps(0)
    setIsRunning(true)
  }

  return (
    <div className="w-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] overflow-hidden shadow-lg select-none">
      {/* Titlebar with Algorithm Selector */}
      <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-base)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-mono text-[11px] text-[var(--text-primary)] font-bold">Sorting Runtime Visualizer</span>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center gap-1 font-mono text-[9.5px]">
          {(['quicksort', 'mergesort', 'heapsort'] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAlgo(a)
                handleReset()
              }}
              className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                algo === a
                  ? 'bg-violet-600 text-white font-bold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {a.replace('sort', ' Sort')}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Array Bars Canvas */}
      <div className="p-5 flex flex-col justify-between h-[190px]">
        <div className="flex items-end justify-between gap-2 h-28 px-2 pt-2">
          {array.map((val, idx) => {
            const isComp = comparing.includes(idx)
            const isSwap = swapping.includes(idx)
            const isSorted = sortedIndices.includes(idx)

            let barColor = 'bg-violet-500/30 border-violet-500/40'
            if (isSwap) {
              barColor = 'bg-rose-500 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
            } else if (isComp) {
              barColor = 'bg-amber-400 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
            } else if (isSorted) {
              barColor = 'bg-emerald-500 border-emerald-400'
            }

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="font-mono text-[9px] text-[var(--text-muted)] font-semibold">
                  {val}
                </span>
                <div
                  style={{ height: `${val}%` }}
                  className={`w-full rounded-t-md border transition-all duration-300 ${barColor}`}
                />
              </div>
            )
          })}
        </div>

        {/* Live Telemetry & Control Bar */}
        <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-[10.5px]">
          <div className="flex items-center gap-3">
            <span className="text-[var(--text-muted)]">
              Comparisons: <strong className="text-[var(--text-primary)]">{comparisons}</strong>
            </span>
            <span className="text-[var(--text-muted)]">
              Swaps: <strong className="text-[var(--text-primary)]">{swaps}</strong>
            </span>
            <span className="text-violet-400 font-bold hidden sm:inline">
              O(n log n)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleStep}
              className="px-2 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-primary)] hover:border-violet-400 font-mono text-[9.5px] font-bold cursor-pointer"
              title="Step Single Comparison"
            >
              Step ⏭
            </button>
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className="p-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-primary)] hover:border-violet-400 cursor-pointer"
              title={isRunning ? 'Pause' : 'Play'}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-primary)] hover:border-violet-400 cursor-pointer"
              title="Shuffle / Reset"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 2. EVENTMESH RADAR: VISUAL REGIONAL LATENCY MATRIX ──
export function EventMeshPreview() {
  const [activeIdx, setActiveIdx] = useState(0)

  const NODES = [
    { city: 'Bengaluru', country: 'IN', latency: '11ms', status: 'Optimal', throughput: '42k evt/s', load: 35 },
    { city: 'San Francisco', country: 'US', latency: '9ms', status: 'Optimal', throughput: '58k evt/s', load: 48 },
    { city: 'Frankfurt', country: 'DE', latency: '16ms', status: 'Healthy', throughput: '29k evt/s', load: 24 },
    { city: 'Tokyo', country: 'JP', latency: '22ms', status: 'Optimal', throughput: '19k evt/s', load: 16 },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % NODES.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [NODES.length])

  return (
    <div className="w-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] overflow-hidden shadow-lg select-none">
      {/* Titlebar */}
      <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-base)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-[11px] text-[var(--text-primary)] font-bold">Global Edge Cluster</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>35 Live Edge PoPs</span>
        </div>
      </div>

      {/* Visual Interactive Hub */}
      <div className="p-3.5 space-y-2">
        {NODES.map((node, i) => (
          <div
            key={node.city}
            onClick={() => setActiveIdx(i)}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer active:scale-98 ${
              activeIdx === i
                ? 'bg-indigo-500/15 border-indigo-500/40 shadow-sm'
                : 'bg-[var(--bg-surface)] border-[var(--border-base)] opacity-80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${activeIdx === i ? 'bg-indigo-400 animate-pulse' : 'bg-white/20'}`} />
              <div>
                <div className="font-display font-bold text-xs text-[var(--text-primary)]">
                  {node.city}, {node.country}
                </div>
                <div className="font-mono text-[9px] text-[var(--text-muted)]">
                  {node.throughput}
                </div>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs font-bold text-emerald-400">{node.latency}</div>
              <div className="text-[9px] text-[var(--text-muted)]">{node.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 3. FELLOWSHIP CODE LAB: INTERACTIVE CURRICULUM SIMULATOR ──
export function FellowshipCodeLabPreview() {
  const [activeWeek, setActiveWeek] = useState(0)

  const MODULES = [
    {
      week: 'Weeks 01–02',
      title: 'Distributed Queues & Systems',
      deliverable: '5k evt/s BullMQ Engine',
      tech: ['TypeScript', 'Redis Streams', 'PostgreSQL'],
      snippet: 'const queue = new Queue("events", { connection: redis });\nqueue.process(async (job) => await ingest(job.data));',
      badge: 'Systems Layer',
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    },
    {
      week: 'Weeks 03–04',
      title: 'Agentic AI & Vector Search',
      deliverable: 'LangGraph Cyclic Agent',
      tech: ['Python', 'LangGraph', 'Qdrant RAG'],
      snippet: 'workflow.add_node("agent", supervisor_node);\nworkflow.add_conditional_edges("agent", router_fn);',
      badge: 'Applied AI',
      color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    },
    {
      week: 'Weeks 05–06',
      title: 'Production Cloud Defense',
      deliverable: 'Live Platform Shipped',
      tech: ['Docker', 'Terraform', 'OpenTelemetry'],
      snippet: 'deploy --production --target=cluster-01\n✓ Verification passed. 0 downtime.',
      badge: 'Capstone Launch',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
  ]

  const curr = MODULES[activeWeek]

  return (
    <div className="w-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] overflow-hidden shadow-lg select-none">
      {/* Titlebar with Week Switcher */}
      <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-base)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-[11px] text-[var(--text-primary)] font-bold">Fellowship Code Lab</span>
        </div>

        <div className="flex items-center gap-1 font-mono text-[9.5px]">
          {MODULES.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveWeek(idx)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeWeek === idx
                  ? 'bg-sky-500 text-white font-bold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              W0{idx * 2 + 1}–0{idx * 2 + 2}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Code & Telemetry Stage */}
      <div className="p-4 flex flex-col justify-between min-h-[190px]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-mono text-[9.5px] text-sky-400 font-bold uppercase">{curr.week}</span>
              <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">{curr.title}</h4>
            </div>
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border font-bold ${curr.color}`}>
              {curr.badge}
            </span>
          </div>

          {/* Live Code Snippet Display */}
          <pre className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] font-mono text-[10.5px] text-[var(--text-secondary)] overflow-x-auto leading-relaxed mb-3">
            <code>{curr.snippet}</code>
          </pre>
        </div>

        {/* Bottom Deliverable Status */}
        <div className="pt-2.5 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-[10px]">
          <span className="text-[var(--text-muted)]">Deliverable: <strong className="text-[var(--text-primary)]">{curr.deliverable}</strong></span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Architecture Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}

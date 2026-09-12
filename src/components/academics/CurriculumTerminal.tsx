import React, { useState, useEffect } from 'react'
import {
  Terminal,
  Cpu,
  CheckCircle2,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Copy,
  Check,
} from 'lucide-react'

export interface CurriculumWeek {
  week: string
  title: string
  focus: string
  deliverable: string
  badge: string
  code: string
  testResult: string
  latency: string
  stack: string[]
}

export const CURRICULUM_DATA: CurriculumWeek[] = [
  {
    week: '01',
    title: 'Systems & TypeScript Architecture',
    focus: 'Advanced type systems, asynchronous event loops, and deterministic error boundaries.',
    deliverable: 'Type-Safe RPC Client with retry buffers',
    badge: 'Core Systems',
    code: `// Deterministic Type-Safe RPC with Exponential Backoff Buffer
export class SystemRPCClient<TSchema extends ContractSchema> {
  async execute<TMethod extends keyof TSchema>(
    method: TMethod, 
    payload: TSchema[TMethod]['input']
  ): Promise<Result<TSchema[TMethod]['output']>> {
    return this.circuitBreaker.run(() => this.transport.call(method, payload));
  }
}`,
    testResult: '✓ 18 unit tests passed · 0 type unsafe leaks',
    latency: 'Type-Safe RPC',
    stack: ['TypeScript 5.6', 'Zod', 'Node.js', 'RPC'],
  },
  {
    week: '02',
    title: 'High-Throughput Backends & Queues',
    focus: 'Redis Streams, BullMQ task engines, and PostgreSQL indexing with PgBouncer.',
    deliverable: 'Distributed Task Queue & Worker Engine',
    badge: 'Distributed Queues',
    code: `// Distributed Queue Worker with Dead-Letter Handling
const eventWorker = new Worker('jobs-queue', async (job) => {
  const { jobId, payload } = job.data;
  await processBatchPayload(jobId, payload);
}, { connection: redisPool, concurrency: 32 });

eventWorker.on('completed', (job) => metricTracker.recordAck(job.id));`,
    testResult: '✓ Benchmarked 5,000+ jobs/s with 0 dropped events',
    latency: 'BullMQ Queue',
    stack: ['BullMQ', 'Redis Streams', 'PostgreSQL', 'PgBouncer'],
  },
  {
    week: '03',
    title: 'Agentic AI & Vector Retrieval (RAG)',
    focus: 'LangGraph multi-agent state graphs, Qdrant hybrid search, and structured tool schemas.',
    deliverable: 'Autonomous RAG Research Pipeline',
    badge: 'Applied AI',
    code: `// Multi-Agent Supervisor & Tool Calling Loop
const workflow = new StateGraph<AgentStateType>({ channels: stateChannels });

workflow.addNode('supervisor', supervisorNode);
workflow.addNode('code_sandbox', codeExecNode);
workflow.addNode('rag_retriever', qdrantSearchNode);
workflow.addConditionalEdges('supervisor', routingFn);`,
    testResult: '✓ Structured tool calling verified · Grounded retrieval',
    latency: 'RAG Pipeline',
    stack: ['LangGraph', 'Qdrant', 'FastAPI', 'Claude SDK'],
  },
  {
    week: '04',
    title: 'Kinetic Interfaces & Design Systems',
    focus: 'Next.js Server Components, 60fps GSAP timelines, and WCAG AA design systems.',
    deliverable: 'Hardware-Accelerated WebGL/Canvas Interface',
    badge: 'Kinetic UI/UX',
    code: `// Smooth 60fps Timeline Choreography
gsap.timeline({ scrollTrigger: { trigger: containerRef.current, scrub: 0.75, pin: true } })
  .to(stageOneRef.current, { scale: 1.15, filter: 'blur(10px)', opacity: 0, duration: 1 })
  .fromTo(stageTwoCardsRef.current, { y: 120, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 });`,
    testResult: '✓ Smooth 60fps motion · 100% WCAG AA compliance',
    latency: '60fps Canvas',
    stack: ['Next.js', 'GSAP', 'Canvas API', 'Tailwind'],
  },
  {
    week: '05',
    title: 'Cloud Infrastructure & CI/CD',
    focus: 'Multi-stage Docker builds, GitHub Actions CI/CD, structured logging, and zero-trust auth.',
    deliverable: 'Automated Deployment Pipeline with Health Checks',
    badge: 'Cloud & CI/CD',
    code: `// Zero-Downtime Deployment & Health Check Handler
export async function handleIngressRequest(req: Request) {
  const span = tracer.startSpan('http_request_span');
  try {
    return await proxyToActiveContainer(req);
  } finally {
    span.end();
  }
}`,
    testResult: '✓ Zero-downtime deployment verified · CI/CD green',
    latency: 'Docker CI/CD',
    stack: ['Docker', 'GitHub Actions', 'PostgreSQL', 'Node.js'],
  },
  {
    week: '06',
    title: 'Full Capstone & Code Review Defense',
    focus: 'End-to-end production architecture sprint, load testing, and mentor code defense.',
    deliverable: 'Live Production Platform Shipped to URL',
    badge: 'Capstone Defense',
    code: `// Production Release Verification Manifest
const capstoneManifest = {
  cohort: 'Summer 2026 Cohort',
  runtime: 'Full-Stack Web + Distributed Queue + AI Pipeline',
  status: 'DEPLOYED_TO_PRODUCTION',
  mentorReview: 'PASSED'
};`,
    testResult: '✓ Shipped to production · Mentor review approved',
    latency: 'Live on Web',
    stack: ['Full Stack', 'Cloud Deploy', 'Production Ready'],
  },
]

interface CurriculumTerminalProps {
  activeWeekIndex?: number
  onSelectWeek?: (idx: number) => void
}

export function CurriculumTerminal({ activeWeekIndex, onSelectWeek }: CurriculumTerminalProps) {
  const [internalActiveWeek, setInternalActiveWeek] = useState(0)
  const [copied, setCopied] = useState(false)

  const activeIdx = activeWeekIndex !== undefined ? activeWeekIndex : internalActiveWeek
  const handleSelect = (idx: number) => {
    if (onSelectWeek) {
      onSelectWeek(idx)
    } else {
      setInternalActiveWeek(idx)
    }
  }

  const current = CURRICULUM_DATA[activeIdx]

  const handleCopyCode = () => {
    navigator.clipboard.writeText(current.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') {
        handleSelect((activeIdx + 1) % CURRICULUM_DATA.length)
      } else if (e.key === 'ArrowLeft') {
        handleSelect((activeIdx - 1 + CURRICULUM_DATA.length) % CURRICULUM_DATA.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIdx])

  return (
    <div className="card-tactile p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-base)] shadow-xl overflow-hidden mb-12 select-none">
      {/* Terminal Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-[var(--border-base)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-[var(--text-primary)]">
                Interactive Code Lab & Deliverables
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--accent-secondary)] border border-[var(--border-base)] font-bold">
                Production Code
              </span>
            </div>
            <p className="font-body text-xs text-[var(--text-secondary)]">
              Inspect real code implementations and verify architecture deliverables module by module.
            </p>
          </div>
        </div>

        {/* 6-Week Stepper Tabs */}
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-base)] shadow-sm">
          {CURRICULUM_DATA.map((item, idx) => (
            <button
              key={item.week}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-[var(--accent-secondary)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
              }`}
            >
              W{item.week}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Code Inspector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-2xl card-inset-well font-mono">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-base)] text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Terminal className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-[var(--text-primary)] font-bold truncate text-[11px] sm:text-xs">
                  <span className="hidden sm:inline">src/modules/</span>week_{current.week}_architecture.ts
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9.5px] sm:text-[10px] text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 whitespace-nowrap">
                  {current.badge}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-0.5 rounded btn-ghost text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  title="Copy snippet"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Block */}
            <pre className="text-xs text-[var(--text-secondary)] overflow-x-auto leading-relaxed py-2 font-mono selection:bg-sky-500 selection:text-white">
              <code>{current.code}</code>
            </pre>
          </div>

          {/* Verification Bar */}
          <div className="pt-3 mt-4 border-t border-[var(--border-base)] flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{current.testResult}</span>
            </span>
            <span className="font-bold text-[var(--text-primary)] shrink-0 pl-2">
              {current.latency}
            </span>
          </div>
        </div>

        {/* Right Column: Module Overview & Deliverable Checklist (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl card-inset-well">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                WEEK {current.week} · CURRICULUM STAGE
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                Stage {activeIdx + 1} of 6
              </span>
            </div>

            <h4 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
              {current.title}
            </h4>

            <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
              {current.focus}
            </p>

            {/* Deliverable Box */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-base)] shadow-xs mb-5">
              <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Verified Module Deliverable
              </span>
              <div className="font-display font-bold text-xs sm:text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{current.deliverable}</span>
              </div>
            </div>

            {/* Stack Chips */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              {current.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-base)] text-[var(--text-secondary)] font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--border-base)] flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--text-muted)]">Cohort 04 Mentor Code Review</span>
            <span className="text-emerald-400 font-bold">PASSED ✓</span>
          </div>
        </div>
      </div>
    </div>
  )
}

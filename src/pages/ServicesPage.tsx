import React, { useState } from 'react'
import { Bot, Globe, Database, Palette, CheckCircle2, ArrowRight, Layers } from 'lucide-react'
import { GrainOverlay } from '../components/GrainOverlay'
import { GlobalCanvasBackground } from '../components/ui/GlobalCanvasBackground'
import { Footer } from '../components/Footer'
import { TierNavbarDispatcher } from '../components/tiers/TierDispatcher'
import { ServiceArchitecturePreview } from '../components/services/ServiceArchitecturePreview'
import { ProjectScopeEstimator } from '../components/services/ProjectScopeEstimator'

interface ServicePillar {
  id: string
  number: string
  title: string
  subtitle: string
  icon: React.ElementType
  capabilities: string[]
  stack: string[]
  metric: string
  metricLabel: string
}

const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 'agentic-ai',
    number: '01',
    title: 'Practical AI Solutions',
    subtitle: 'Retrieval systems (RAG), fine-tuned models, structured prompt pipelines, and evaluation harnesses that work reliably in production.',
    icon: Bot,
    capabilities: [
      'Retrieval & RAG systems with vector search, chunking, and reranking.',
      'Agents & tool-use pipelines with structured output and fallback flows.',
      'Model fine-tuning and automated evaluation harnesses.',
      'LLM cost and latency optimization with semantic caching.',
    ],
    stack: ['FastAPI', 'Python', 'Qdrant', 'Claude SDK', 'vLLM'],
    metric: 'Production Ready',
    metricLabel: 'Enterprise RAG & Eval',
  },
  {
    id: 'fullstack-web',
    number: '02',
    title: 'Web & Full-Stack Development',
    subtitle: 'Marketing sites, dashboards, customer portals, and full-stack SaaS applications built with Next.js, TypeScript, and clean architecture.',
    icon: Globe,
    capabilities: [
      'Marketing & landing pages with sub-second loads and bespoke motion.',
      'Admin dashboards & internal tools with complex state and role access.',
      'Full-stack SaaS products with auth, billing, and database architecture.',
      'Clean migrations and modernizations with zero downtime.',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Redis'],
    metric: 'Sub-Second Speed',
    metricLabel: 'Full-Stack Architecture',
  },
  {
    id: 'distributed-systems',
    number: '03',
    title: 'Automation Tools & Data Pipelines',
    subtitle: 'Internal workflow engines, data scrapers, and ops automations. Replace fragile spreadsheets with robust, reliable software.',
    icon: Database,
    capabilities: [
      'Workflow & ops automation with approval flows and automated reports.',
      'Data pipelines and scheduled ETL scrapers.',
      'Third-party webhooks, Slack bots, and payment event sync.',
      'Queue workers and resilient scheduled job systems.',
    ],
    stack: ['FastAPI', 'Python', 'Go', 'Redis Streams', 'BullMQ', 'Docker'],
    metric: 'High Throughput',
    metricLabel: 'Reliable Async Workers',
  },
  {
    id: 'kinetic-ui',
    number: '04',
    title: 'UI/UX & Design Systems',
    subtitle: 'High-conversion digital surfaces, interactive visualizers, and complete design token systems that delight users.',
    icon: Palette,
    capabilities: [
      'Bespoke interactive components and smooth Canvas visualizers.',
      'Complete design token architectures from Figma to code.',
      'Mobile, tablet, and desktop responsive layouts.',
      'Strict accessibility (WCAG AA) and performance tuning.',
    ],
    stack: ['Figma', 'GSAP', 'Canvas API', 'Tailwind', 'React'],
    metric: 'Bespoke UI',
    metricLabel: 'Design Token Systems',
  },
]

export default function ServicesPage() {
  const [mobileActivePillarIdx, setMobileActivePillarIdx] = useState(0)
  const mobilePillar = SERVICE_PILLARS[mobileActivePillarIdx]
  const MobileIcon = mobilePillar.icon

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] relative selection:bg-[var(--accent-primary)] selection:text-white transition-colors duration-300 select-none">
      <GrainOverlay />
      <GlobalCanvasBackground />

      {/* Unified Multi-Tier Navbar */}
      <TierNavbarDispatcher />

      {/* Main Content */}
      <main className="pt-20 sm:pt-28 pb-24 sm:pb-40 px-4 sm:px-8 md:px-12 max-w-[1240px] mx-auto relative z-10">
        {/* ── HEADER BANNER ── */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)] mb-3 sm:mb-4">
            <Layers className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
            <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              Engineering Services
            </span>
          </div>

          <h1 className="font-display font-black text-[clamp(2rem,5.5vw,3.8rem)] leading-[1.08] tracking-tight text-[var(--text-primary)] mb-3 sm:mb-4">
            Senior engineering teams for your product<span className="text-[var(--accent-secondary)]">.</span>
          </h1>

          <p className="font-body text-xs sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            Partner with a dedicated engineering team for your product. We design, code, and deploy production web applications, FastAPI backends, and cloud infrastructure with 100% code ownership.
          </p>
        </div>

        {/* ── MOBILE VIEW: UNIFIED COMPACT WORKBENCH & ACTIVE PILLAR DOSSIER (MD:HIDDEN) ── */}
        <div className="block md:hidden mb-6">
          <ServiceArchitecturePreview />

          {/* ── MOBILE SEGMENTED PILLAR CONTROLLER ── */}
          <div className="flex p-1 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-base)] shadow-sm mb-4">
            {SERVICE_PILLARS.map((p, idx) => {
              const PIcon = p.icon
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setMobileActivePillarIdx(idx)}
                  className={`flex-1 py-2 px-1.5 rounded-lg font-mono text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
                    mobileActivePillarIdx === idx
                      ? 'bg-[var(--accent-secondary)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <PIcon className="w-3 h-3 shrink-0" />
                  <span className="truncate">0{idx + 1} {p.title.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>

          {/* Active Single Pillar Card on Mobile */}
          <section className="card-tactile rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[var(--border-base)]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
                    <MobileIcon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--accent-secondary)]">
                    Pillar {mobilePillar.number}
                  </span>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-black text-[var(--text-primary)]">{mobilePillar.metric}</div>
                  <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{mobilePillar.metricLabel}</div>
                </div>
              </div>

              <h2 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">
                {mobilePillar.title}
              </h2>
              <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                {mobilePillar.subtitle}
              </p>

              <div className="space-y-1.5 mb-4">
                {mobilePillar.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2 font-body text-xs text-[var(--text-primary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mb-4 font-mono text-[10px]">
                {mobilePillar.stack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-base)] text-[var(--text-secondary)] font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">Founder Direct Pod</span>
              <a
                href="mailto:nayaklabs.ai@gmail.com?subject=Inquiry:%20Architecture%20Review"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[var(--accent-secondary)]"
              >
                <span>Consult on this Pillar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>
        </div>

        {/* ── DESKTOP & TABLET VIEW: FULL WORKBENCH + 4 PILLAR GRID (UNTOUCHED) ── */}
        <div className="hidden md:block">
          {/* INTERACTIVE ARCHITECTURE WORKBENCH */}
          <ServiceArchitecturePreview />

          {/* 4 CORE SERVICE PILLARS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12">
            {SERVICE_PILLARS.map((service) => {
              const Icon = service.icon

              return (
                <section
                  key={service.id}
                  id={service.id}
                  className="card-tactile rounded-2xl p-6 sm:p-7 bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] flex flex-col justify-between transition-colors duration-200"
                >
                  <div>
                    {/* Top Bar: Icon + Pillar Number + SLA Metric */}
                    <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-[var(--border-base)]">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs font-bold text-[var(--accent-secondary)]">
                          Pillar {service.number}
                        </span>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-xs font-black text-[var(--text-primary)]">{service.metric}</div>
                        <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{service.metricLabel}</div>
                      </div>
                    </div>

                    <h2 className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)] mb-1.5">
                      {service.title}
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                      {service.subtitle}
                    </p>

                    {/* Concise Capabilities */}
                    <div className="space-y-2 mb-4">
                      {service.capabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-start gap-2 font-body text-xs text-[var(--text-primary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px]">
                      {service.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-base)] text-[var(--text-secondary)] font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-t border-[var(--border-base)] flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">Founder Direct Pod</span>
                    <a
                      href="mailto:nayaklabs.ai@gmail.com?subject=Inquiry:%20Architecture%20Review"
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[var(--accent-secondary)] hover:underline"
                    >
                      <span>Consult on this Pillar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        {/* ── INTERACTIVE POD & SCOPE ESTIMATOR (ALL TIERS) ── */}
        <ProjectScopeEstimator />

        {/* ── BOTTOM CTA ── */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-base)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-bold text-[var(--accent-secondary)] uppercase tracking-wider">
              Work With Us
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[var(--text-primary)] mt-1 mb-1.5">
              Ready to build something that actually ships?
            </h3>
            <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)]">
              Direct technical alignment with principal engineers from day one. No middlemen, no slide decks.
            </p>
          </div>

          <a
            href="mailto:nayaklabs.ai@gmail.com?subject=Project%20Inquiry"
            className="py-3 px-6 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_14px_rgba(79,70,229,0.35)] active:translate-y-0.5 inline-flex items-center justify-center gap-2 shrink-0"
          >
            <span>Book a call →</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}

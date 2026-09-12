import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers, ArrowRight, CheckCircle2, Terminal, Globe } from 'lucide-react'
import { GrainOverlay } from '../components/GrainOverlay'
import { GlobalCanvasBackground } from '../components/ui/GlobalCanvasBackground'
import { Footer } from '../components/Footer'
import { ScrollReveal } from '../components/ScrollReveal'
import { TierNavbarDispatcher } from '../components/tiers/TierDispatcher'
import { DiNotesVisualizer } from '../components/products/DiNotesVisualizer'
import { EventMeshRadar } from '../components/products/EventMeshRadar'

interface ProductItem {
  id: string
  code: string
  title: string
  tagline: string
  category: string
  badge: string
  description: string
  features: string[]
  metrics: { label: string; value: string }[]
  tags: string[]
  accentColor: string
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'di-notes',
    code: '01',
    title: 'DI Notes Sorting Visualizer',
    tagline: 'Interactive Algorithm Runtime & Memory Inspector',
    category: 'Algorithm Runtime',
    badge: 'Interactive Visualizer',
    description: 'Concepts you can touch. Inspect runtime comparisons, pointer swaps, and algorithm execution step by step in real time across classic sorting techniques.',
    features: [
      'Interactive QuickSort, MergeSort, BubbleSort & Binary Search step tracers.',
      'Step-by-step array inspection with real-time comparison pointers.',
      'Interactive array controls with dynamic speed and code tracing.',
      'Clear algorithmic time and space complexity explanations.',
    ],
    metrics: [
      { label: 'Learners', value: '4,200+' },
      { label: 'Algorithms', value: '5 Tracks' },
      { label: 'Latency', value: '<1ms Local' },
    ],
    tags: ['#SortingAlgorithms', '#QuickSort', '#BinarySearch', '#InteractiveLearning'],
    accentColor: 'var(--accent-primary)',
  },
  {
    id: 'event-mesh',
    code: '02',
    title: 'Event Mesh 3D',
    tagline: 'Developer Summits, Hackathons & Systems Workshops Globally',
    category: 'Ecosystem Platform',
    badge: 'Interactive 3D Globe',
    description: 'Curated global radar tracking developer summits, systems workshops, and hackathons across tech hubs with interactive 3D geospatial targeting.',
    features: [
      'Curated tech meetups, hackathons, and developer conferences.',
      'Interactive 3D globe with smooth city pinpoint targeting and rotation controls.',
      'Filter across Hackathons, AI Summits, Workshops, and Community Meetups.',
      'Direct links to event agendas, organizer handles, and registrations.',
    ],
    metrics: [
      { label: 'Active Cities', value: '7 Hubs' },
      { label: 'Community', value: '7,000+' },
      { label: 'Listings', value: '500+ Active' },
    ],
    tags: ['#3DGlobe', '#WebGL', '#TechEvents', '#DeveloperCommunity'],
    accentColor: 'var(--accent-secondary)',
  },
]

export default function ProductsPage() {
  const [mobileActiveProduct, setMobileActiveProduct] = useState<'di-notes' | 'event-mesh'>('di-notes')

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] relative selection:bg-[var(--accent-primary)] selection:text-white transition-colors duration-300">
      <GrainOverlay />
      <GlobalCanvasBackground />

      {/* Multi-Tier Responsive Navbar */}
      <TierNavbarDispatcher />

      {/* Main Container */}
      <main className="pt-20 sm:pt-28 pb-24 sm:pb-40 px-4 sm:px-8 md:px-12 max-w-[1360px] mx-auto relative z-10">
        {/* ── HEADER BANNER ── */}
        <ScrollReveal variant="blur-focus">
          <div className="max-w-3xl mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-base)] bg-[var(--bg-surface)] backdrop-blur-md mb-3 sm:mb-4 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                Software & Platforms
              </span>
            </div>

            <h1 className="font-display font-black text-[clamp(2rem,6vw,4rem)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-3 sm:mb-4">
              Products made for the way you work<span className="text-[var(--accent-primary)]">.</span>
            </h1>

            <p className="font-body text-xs sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
              Making complex things feel simple. Interactive learning studios, global event discovery platforms, and focused tools designed for real everyday use.
            </p>
          </div>
        </ScrollReveal>

        {/* ── MOBILE-ONLY PRODUCT SEGMENTED SWITCHER ── */}
        <div className="block md:hidden mb-6">
          <div className="flex p-1.5 rounded-2xl bg-[var(--bg-surface-inset)] border border-[var(--border-base)] shadow-md">
            <button
              type="button"
              onClick={() => setMobileActiveProduct('di-notes')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mobileActiveProduct === 'di-notes'
                  ? 'btn-tactile text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>DI Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileActiveProduct('event-mesh')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mobileActiveProduct === 'event-mesh'
                  ? 'btn-tactile text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Event Mesh 3D</span>
            </button>
          </div>
        </div>

        {/* ── MOBILE VIEW: RENDER ONLY THE ACTIVE PRODUCT ── */}
        <div className="block md:hidden">
          {mobileActiveProduct === 'di-notes' && (
            <section className="card-tactile rounded-3xl p-5 bg-[var(--bg-card)] border border-[var(--border-base)] shadow-xl flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold border border-[var(--accent-primary)]/20">
                    Algorithm Runtime
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--accent-primary)] border border-[var(--border-base)] font-semibold">
                    {PRODUCTS[0].badge}
                  </span>
                </div>
                <h2 className="font-display font-black text-xl text-[var(--text-primary)]">
                  DI Notes Sorting Visualizer
                </h2>
                <p className="font-mono text-[11px] text-[var(--accent-primary)] font-semibold mt-0.5 mb-3">
                  Interactive Algorithm Runtime & Memory Inspector
                </p>
                <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Inspect runtime comparisons, pointer swaps, and algorithm execution step by step in real time.
                </p>

                {/* 3 Compact Metrics */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {PRODUCTS[0].metrics.map((m) => (
                    <div key={m.label} className="card-inset-well p-2 text-center">
                      <div className="font-mono text-[8px] text-[var(--text-muted)] uppercase truncate">
                        {m.label}
                      </div>
                      <div className="font-display font-black text-xs text-[var(--text-primary)]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualizer */}
              <div className="w-full">
                <DiNotesVisualizer />
              </div>
            </section>
          )}

          {mobileActiveProduct === 'event-mesh' && (
            <section className="card-tactile rounded-3xl p-5 flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] font-bold border border-[var(--accent-secondary)]/20">
                    Ecosystem Platform
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--accent-secondary)] border border-[var(--border-base)] font-semibold">
                    {PRODUCTS[1].badge}
                  </span>
                </div>
                <h2 className="font-display font-black text-xl text-[var(--text-primary)]">
                  Event Mesh 3D
                </h2>
                <p className="font-mono text-[11px] text-[var(--accent-secondary)] font-semibold mt-0.5 mb-3">
                  Developer Summits, Hackathons & Systems Workshops Globally
                </p>
                <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Interactive rotatable 3D globe radar tracking developer summits, AI hackathons, and systems workshops worldwide.
                </p>

                {/* 3 Compact Metrics */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {PRODUCTS[1].metrics.map((m) => (
                    <div key={m.label} className="card-inset-well p-2 text-center">
                      <div className="font-mono text-[8px] text-[var(--text-muted)] uppercase truncate">
                        {m.label}
                      </div>
                      <div className="font-display font-black text-xs text-[var(--text-primary)]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualizer */}
              <div className="w-full">
                <EventMeshRadar />
              </div>
            </section>
          )}
        </div>

        {/* ── DESKTOP & TABLET VIEW: FULL MULTI-SECTION DUAL SHOWCASE ── */}
        <div className="hidden md:block space-y-16 sm:space-y-20">
          {/* PRODUCT 01: DI NOTES SORTING VISUALIZER */}
          <section
            id="di-notes"
            className="card-tactile group relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] transition-all duration-300 shadow-xl shadow-black/5"
          >
            <div className="flex flex-col gap-8">
              {/* Top Row: Title & Category Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-base)]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold border border-[var(--accent-primary)]/20">
                      Algorithm Runtime
                    </span>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] border border-[var(--border-base)] font-semibold">
                      {PRODUCTS[0].badge}
                    </span>
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)]">
                    DI Notes Sorting Visualizer
                  </h2>
                  <p className="font-mono text-xs text-[var(--accent-primary)] font-semibold mt-1">
                    Interactive Algorithm Runtime & Memory Inspector
                  </p>
                </div>
              </div>

              {/* Description, Metrics, and Features */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                    Concepts you can touch. Inspect runtime comparisons, pointer swaps, and algorithm execution step by step in real time across classic sorting techniques.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {PRODUCTS[0].features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 font-body text-xs text-[var(--text-primary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="lg:col-span-4 grid grid-cols-3 gap-2">
                  {PRODUCTS[0].metrics.map((m) => (
                    <div key={m.label} className="card-inset-well p-3 text-center">
                      <div className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5 truncate">
                        {m.label}
                      </div>
                      <div className="font-display font-black text-sm text-[var(--text-primary)]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Interactive Visualizer */}
              <div className="w-full pt-2">
                <DiNotesVisualizer />
              </div>
            </div>
          </section>

          {/* PRODUCT 02: EVENT MESH 3D */}
          <section
            id="event-mesh"
            className="card-tactile group relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 bg-[var(--bg-card)] border border-[var(--border-base)] hover:border-[var(--border-hover)] transition-all duration-300 shadow-xl"
          >
            <div className="flex flex-col gap-8">
              {/* Top Row: Title & Category Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border-base)]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] font-bold border border-[var(--accent-secondary)]/20">
                      Ecosystem Platform
                    </span>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--accent-secondary)] border border-[var(--border-base)] font-semibold">
                      {PRODUCTS[1].badge}
                    </span>
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)]">
                    Event Mesh 3D
                  </h2>
                  <p className="font-mono text-xs text-[var(--accent-secondary)] font-semibold mt-1">
                    Developer Summits, Hackathons & Systems Workshops Globally
                  </p>
                </div>
              </div>

              {/* Description, Metrics, and Features */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                    Curated global radar tracking developer summits, systems workshops, and hackathons across tech hubs with interactive 3D geospatial targeting.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {PRODUCTS[1].features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 font-body text-xs text-[var(--text-primary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="lg:col-span-4 grid grid-cols-3 gap-2">
                  {PRODUCTS[1].metrics.map((m) => (
                    <div key={m.label} className="card-inset-well p-3 text-center">
                      <div className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5 truncate">
                        {m.label}
                      </div>
                      <div className="font-display font-black text-sm text-[var(--text-primary)]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Interactive Visualizer */}
              <div className="w-full pt-2">
                <EventMeshRadar />
              </div>
            </div>
          </section>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="mt-16 sm:mt-20 text-center px-4">
          <Link
            to="/services"
            className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm text-[var(--accent-primary)] font-bold hover:underline"
          >
            <span>Looking for bespoke custom engineering?</span>
            <span className="inline-flex items-center gap-1">
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

